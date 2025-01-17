const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    // timestamp: { type: Date, default: Date.now },
    buyer: { type: String, required: true },
    seller: { type: String, required: true },

    transaction_type: { type: String, required: true },
    price: { type: Number, required: true },
    percentage: { type: Number, default: 1 },
    quantity: { type: Number, default: 1 },
    currency: { type: String, required: true },

    commission: { type: Number, required: true },
    commission_currency: { type: String, required: true },

    collection_id: { type: String, required: true },
}, {
    timestamps: {
        currentTime: () => Math.floor(Date.now() / 1000),
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Transaction = mongoose.model("Transaction", transactionSchema, "transactions");

module.exports = Transaction;