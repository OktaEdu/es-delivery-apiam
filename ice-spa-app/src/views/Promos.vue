<template>
  <div class="container h-100">
    <div class="row h-100">
      <div class="col-md-10 offset-md-1" id="content-container">
        <h1>Promos</h1>
        <button class="btn btn-primary" v-on:click="getPromos()">
          Get our Premium Promos
        </button>
        <p>Only for users with our premium account</p>
        <table class="table table-striped" v-if="promos">
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
    </div>
  </div>
  <Footer />
</template>

<script>
// @ is an alias to /src
import Footer from "@/components/Footer.vue";
const PUBLIC_URL = "http://localhost:8081/publicpromos";
const PREMIUM_URL = "http://localhost:8081/promos/PREMIUM";

export default {
  name: "Promos",
  components: {
    Footer,
  },
  data() {
    return {
      promos: [],
    };
  },
  methods: {
    async getPromos() {
      const res = await fetch(PREMIUM_URL);
      const finalRes = await res.json();
      this.promos = finalRes;
      console.log(this.promos);
    },
    async getPublicPromos() {
      const res = await fetch(PUBLIC_URL);
      const finalRes = await res.json();
      this.promos = finalRes;
      console.log(this.promos);
    },
  },
  mounted() {
    this.getPublicPromos();
  },
};
</script>
