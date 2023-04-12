<template>

<div class="container h-100">
  <div class="row h-100">
   <div class="col-md-10 offset-md-1 table-responsive" id="content-container">
      <h1>Profile</h1>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Claim</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(claim, index) in claims"
            :key="index"
          >
            <td>{{claim.claim}}</td>
            <td :id="'claim-' + claim.claim">{{claim.value}}</td>
          </tr>
        </tbody>
    </table>
    </div>
  </div>
</div>
<Footer/>
</template>

<script>
// @ is an alias to /src
import Footer from '@/components/Footer.vue'


export default {
  name: 'Profile',
  components: {
    Footer
  },
  data () {
    return {
      claims: []
    }
  },
  async created () {
    const idToken = await this.$auth.tokenManager.get('idToken')
    this.claims = await Object.entries(idToken.claims).map(entry => ({ claim: entry[0], value: entry[1] }))
  }
}
</script>

