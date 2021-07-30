const Nft = require("../models/nft");
const Album = require("../models/album")
const Transaction = require("../models/transaction");
const User = require("../models/user");


function save(doc) {
    return new Promise((resolve, reject) => {
        doc.save((err, saved) => {
            if (err) {
                reject(err);
            }
            resolve(saved);
        });
    });
}

async function saveAll(schedules) {
    const promises = schedules.map(schedule => save(schedule));
    return Promise.all(promises)
        .then((responses) => {
            return;
        }).catch((error) => { throw error; })
}

async function mock() {
    const seller = new User({
        first_name: 'seller',
        address: 'seller_address1',
        nft_ids: ['nft_id1']
    });

    const buyer = new User({
        first_name: 'buyer1',
        address: 'buyer_address1',
    });

    const nft = new Nft({
        title: 'nft1',
        nft_id: 'nft_id1',
        status: 'for sale',
        file: 'file1',
        price: 100,
        currency: 'cfx',
        owner: [{ address: 'seller_address1', percentage: 1 }]
    })

    await saveAll([nft, buyer, seller])
}


async function transferOwnership(transactionDetails, recordTransaction = true) {
    // get buyer/seller 
    let buyer = await User.findOne({ address: transactionDetails.buyer });
    let seller = await User.findOne({ address: transactionDetails.seller });

    if (!buyer || !seller) {
        return res.status(404).json({ error: "user not found" });
    }

    let collectionType = '';
    if (transactionDetails.transaction_type === 'purchase-album') {
        collectionType = 'album'
    }
    else if (transaction.transaction_type === 'purchase-nft') {
        collectionType = 'nft'
    }

    // add/remove album from buyer/seller's prfoile
    buyer[`${collectionType}_ids`].push(transactionDetails.collection_id);
    const index = seller[`${collectionType}_ids`].indexOf(transactionDetails.collection_id);
    if (index !== -1) {
        seller[`${collectionType}_ids`].splice(index, 1);
    }

    // get collection and update collection's owner
    let collection = null;
    if (collectionType === 'album') {
        collection = await Album.findOne({ album_id: transactionDetails.collection_id });
        collection.owner = transactionDetails.buyer
    }
    else if (collectionType === 'nft') {
        collection = await Bft.findOne({ nft_id: transactionDetails.collection_id });
        collection.owner = [{ "address": transactionDetails.buyer, "percentage": 1 }];
    }

    // update collection's status
    collection.status = "private";

    // save document changes
    let documents = [collection, buyer, seller];
    if (recordTransaction) {
        const transaction = new Transaction(transactionDetails);
        documents.push(transaction)
    }
    await saveAll(documents)
        .then(() => {
            return;
        })
        .catch((error) => {
            return res.status(422).json({ error: error.message });
        });
}

async function purchaseNtf(req, res) {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    let nft = await Nft.findOne({ nft_id: body.nft_id });

    if (!nft) {
        return res.status(404).json({ error: "nft not found" });
    }
    if (nft.status !== "for sale") {
        return res.status(400).json({ error: "ntf is not for sale" });
    }

    const owners = nft.owner.map((element) => { return element.address; });
    if (owners.length !== 1) {
        return res.status(400).json({ error: "nft is not owned by a single owner" });
    }
    if (owners.includes(body.buyer)) {
        return res.status(400).json({ error: "buyer is owner" });
    }

    // create a transaction record
    let transactionDetails = {
        buyer: body.buyer,
        seller: nft.owner[0].address,
        transaction_type: 'purchase-nft',
        price: nft.price,
        currency: nft.currency,
        commission: body.commission,
        commission_currency: body.commission_currency,
        collection_id: nft.nft_id
    };
    transferOwnership(transactionDetails);

    //check if this nft fullfills a album
    if (nft.album_id && nft.album_id !== '') {
        let album = await Album.findOne({ album_id: nft.album_id });
        const nft_owners = [];
        await album.nft_ids.forEach(async (nft_d) => {
            const nft = await Nft.findOne({ nft_id: body.nft_id });
            const curr_nft_owners = nft.owner.map((element) => { return element.address; });
            nft_owners = [...nft_owners, ...curr_nft_owners]
        })
        if (nft_owners.length === album.nft_ids.length && Set(nft_owners).size === 1) {
            const albumTransactionDetails = {
                buyer: body.buyer,
                seller: album.owner,
                transaction_type: 'purchase-album',
                collection_id: album.album_id
            }
            transferOwnership(albumTransactionDetails, false);
        }
    }
    return res.status(200).send();
};


async function purchaseAlbum(req, res) {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    let album = await Album.findOne({ album_id: body.album_id });

    if (!album) {
        return res.status(404).json({ error: "album not found" });
    }
    if (album.status !== "for sale") {
        return res.status(400).json({ error: "album is not for sale" });
    }
    if (album.owner === body.buyer) {
        return res.status(400).json({ error: "buyer is owner" });
    }

    // check if any associated nft is funded or if any associated nft is not owned by album owner
    const nft_ids = album.nft_ids;
    const nfts = [];
    const nft_owners = [];
    await nft_ids.forEach(async (nft_d) => {
        const nft = await Nft.findOne({ nft_id: body.nft_id });
        const curr_nft_owners = nft.owner.map((element) => { return element.address; });
        nfts.push(nft);
        nft_owners = [...nft_owners, ...curr_nft_owners]
    })
    if (nft_owners.length !== nft_ids.length || Set(nft_owners).size !== 1) {
        return res.status(400).json({ error: "album is not owned by a single owner" });
    }

    // create a transaction record
    const transactionDetails = {
        buyer: body.buyer,
        seller: album.owner,
        transaction_type: 'purchase-album',
        price: album.price,
        currency: album.currency,
        commission: body.commission,
        commission_currency: body.commission_currency,
        collection_id: album.album_id
    };
    transferOwnership(transactionDetails);

    //update associated nft's information
    nfts.forEach((nft) => {
        const nftTransactionDetails = {
            buyer: body.buyer,
            seller: album.owner,
            transaction_type: 'purchase-nft',
            collection_id: nft.nft_id
        }
        transferOwnership(nftTransactionDetails, false);
    })

    return res.status(200).send();
};


module.exports = {
    purchaseNtf, purchaseAlbum
};