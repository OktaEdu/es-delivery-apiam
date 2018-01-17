<template>
  <div class="col-sm-6 col-sm-offset-3">
    <h1>Get Promos!</h1>
    <button class="btn btn-primary" v-on:click="getPublicPromos()">Get public Promos</button>
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
        <tr v-for="promo in promos">
          <td>{{ promo.code }}</td>
          <td>{{ promo.target }}</td>
          <td>{{ promo.description }}</td>
          <td>{{ promo.endDate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      promos: ''
    }
  },
  methods: {
    getPublicPromos() {
      this.$http.get('http://localhost:5000/publicpromos').then(
        response => {
          this.promos = response.body;
        }, 
        error => {
          console.log(error);
        }
      );
    }
  }
}
</script>
