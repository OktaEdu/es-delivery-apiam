<template>
  <div class="container h-100">
    <div class="row h-100">
      <div class="col-md-10 offset-md-1" id="content-container">
        <h1>Promos</h1>
        <div v-if="promos.length">
          <div v-if="idToken">
            <button
              class="btn btn-primary"
              id="premiumPromos"
              v-on:click="getPromos()"
            >
              Premium Promos
            </button>
            <button
              class="btn btn-primary"
              id="publicPromos"
              v-on:click="getPublicPromos()"
            >
              Public Promos
            </button>
          </div>
          <table class="table table-striped" id="promos">
            <thead>
              <tr>
                <th>Code</th>
                <th>Target</th>
                <th>Description</th>
                <th>Validity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="promo in promos" :key="promo">
                <td>{{ promo.code }}</td>
                <td>{{ promo.target }}</td>
                <td>{{ promo.description }}</td>
                <td>{{ promo.endDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          No promos found. Check if API resource server is running.
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
// @ is an alias to /src
import Footer from "@/components/Footer.vue";
// import {getAuthHeader} from "@/main.js"
const API_URL = "http://localhost:8081";

export default {
  name: "Promos",
  components: {
    Footer,
  },
  data() {
    return {
      promos: [],
      idToken: Boolean,
    };
  },
  methods: {
    async getPromos() {
      const res = await fetch(API_URL + "/promos/PREMIUM");
      this.promos = await res.json();
      document.getElementById("premiumPromos").style.display = "none";
      document.getElementById("publicPromos").style.display = "inline";
    },
    async getPublicPromos() {
      const res = await fetch(API_URL + "/publicpromos");
      this.promos = await res.json();
      this.idToken = await this.$auth.tokenManager.get("idToken");
      this.idToken = this.idToken ? true : false;

      if (this.idToken) {
        document.getElementById("publicPromos").style.display = "none";
        document.getElementById("premiumPromos").style.display = "inline";
      }
    },
  },
  mounted() {
    this.getPublicPromos();
  },
};
</script>
