<template>
  <div class="marketplace">
    <Navbar active-index="0"/>
    <div>
      <div id="sidebar" style="width: 25%">
        <b-card no-body style="max-width: 20rem">
          <template #header>
            <h4 class="mb-0">
              <b-icon icon="filter-circle"></b-icon>&nbsp;Filter
            </h4>
          </template>
          <b-list-group flush>
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-1
                variant="outline-secondary"
                class="category-button"
                >Status</b-button
              >
              <b-collapse id="collapse-1" class="mt-2">
                <b-card>
                  <b-form-group v-slot="{ ariaDescribedby }">
                    <b-form-checkbox-group
                      id="checkbox-group-1"
                      v-model="statusSelected"
                      :options="statusOptions"
                      :aria-describedby="ariaDescribedby"
                      name="flavour-1"
                    ></b-form-checkbox-group>
                  </b-form-group>
                </b-card>
              </b-collapse>
            </b-list-group-item>
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-2
                variant="outline-secondary"
                class="category-button"
                >Price</b-button
              >
              <b-collapse id="collapse-2" class="mt-2">
                <b-card>
                  <b-form-select
                    v-model="priceTypeSelected"
                    :options="priceTypeOptions"
                  ></b-form-select>
                  <b-form-input
                    v-model="text"
                    placeholder="Min"
                    class="price-range"
                  ></b-form-input>
                  <span>to</span>
                  <b-form-input
                    v-model="text"
                    placeholder="Max"
                    class="price-range"
                  ></b-form-input>
                  <b-button id="price-apply-btn" variant="outline-primary"
                    >Apply</b-button
                  >
                </b-card>
              </b-collapse>
            </b-list-group-item>
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-3
                variant="outline-secondary"
                class="category-button"
                >Collections</b-button
              >
              <b-collapse id="collapse-3" class="mt-2">
                <b-card>
                  <b-input-group size="sm" class="mb-2">
                    <b-input-group-prepend is-text>
                      <b-icon icon="search"></b-icon> </b-input-group-prepend
                    ><b-form-input placeholder="Filter"></b-form-input>
                  </b-input-group>

                  <b-list-group id="collections-group">
                    <b-list-group-item>Bored Ape Yacht Club</b-list-group-item>
                    <b-list-group-item>CrptoPunks</b-list-group-item>
                    <b-list-group-item>Art Blocks Curated</b-list-group-item>
                    <b-list-group-item>Bored Ape Kennel Club</b-list-group-item>
                    <b-list-group-item>SupDucks</b-list-group-item>
                    <b-list-group-item>Cool Cat</b-list-group-item>
                    <b-list-group-item>ZED RUN</b-list-group-item>
                    <b-list-group-item>Famelady</b-list-group-item>
                  </b-list-group>
                </b-card>
              </b-collapse>
            </b-list-group-item>
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-4
                variant="outline-secondary"
                class="category-button"
                >Chains</b-button
              >
              <b-collapse id="collapse-4" class="mt-2">
                <b-card>
                  <b-list-group>
                    <b-list-group-item>Ethereum</b-list-group-item>
                    <b-list-group-item>Polygon</b-list-group-item>
                    <b-list-group-item>Klaytn</b-list-group-item>
                  </b-list-group>
                </b-card>
              </b-collapse>
            </b-list-group-item>
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-5
                variant="outline-secondary"
                class="category-button"
                >Categories</b-button
              >
              <b-collapse id="collapse-5" class="mt-2">
                <b-card>
                  <b-list-group>
                    <b-list-group-item>Art</b-list-group-item>
                    <b-list-group-item>Music</b-list-group-item>
                    <b-list-group-item>Domain Names</b-list-group-item>
                    <b-list-group-item>Virtual Worlds</b-list-group-item>
                    <b-list-group-item>Trading Cards</b-list-group-item>
                    <b-list-group-item>Collectibles</b-list-group-item>
                  </b-list-group>
                </b-card>
              </b-collapse>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </div>

      <div class="content">
        <div id="search-bar">
          <b-input-group size="lg" class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon icon="search"></b-icon>
            </b-input-group-prepend>
            <b-form-input type="search" placeholder="Search..."></b-form-input>
          </b-input-group>
        </div>
        <b-card-group columns>
          <Card v-for="card in usersCards" :card="card" :key="card.url" />
        </b-card-group>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import Card from "../components/Card.vue";
export default {
  name: "Marketplace",
  components: {
    Navbar,
    Footer,
    Card,
  },
  mounted() {},
  data() {
    return {
      statusSelected: [],
      statusOptions: [
        { text: "Buy Now", value: "buyNow" },
        { text: "On Auction", value: "onAuction" },
        { text: "New", value: "new" },
        { text: "Has Offers", value: "hasOffers" },
      ],
      priceTypeSelected: "usd",
      priceTypeOptions: [
        { value: "usd", text: "United States Dollar(USD)" },
        { value: "eth", text: "Ether(ETH)" },
      ],
      usersCards: [
        {
          id: 1,
          collection: "SupDucks",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          id: 2,
          collection: "Art Blocks Curated",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          id: 3,
          collection: "Bored Ape Kennel Club",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          id: 4,
          collection: "Cool Cats",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          id: 5,
          collection: "ZED RUN",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          id: 6,
          collection: "FameLadySquad",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          id: 7,
          collection: "Sorare",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          id: 8,
          collection: "Meebits",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          id: 9,
          collection: "Ape Gang",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
      ],
    };
  },
  methods() {
    // sidebarHeight(){
    // }
  },
};
</script>

<style scoped>
.marketplace {
  text-align: left;
  /* height: 100vh; */
}
.category-button {
  width: 100%;
}
#sidebar {
  margin-top: 2em;
  display: inline-block;
  /* height: 100%; */
  text-align: left;
  vertical-align: top;
  /* border: 1px solid #f00; */
}
.price-range {
  width: 40%;
  display: inline-block;
  margin-top: 1em;
  margin-right: 3%;
  margin-left: 2%;
}
#price-apply-btn {
  margin-top: 1em;
  width: 40%;
  margin-right: 30%;
  margin-left: 30%;
}
#collections-group {
  margin-top: 1em;
}
.content {
  width: 60%;
  margin-left: 5%;
  /* float: left; */
  /* margin-top: 0; */
  display: inline-block;
  /* top: 0%; */
  /* left: 0; */
  vertical-align: top;
}

#search-bar {
  width: 800px;
  display: inline-block;
  margin-top: 2em;
}
</style>
