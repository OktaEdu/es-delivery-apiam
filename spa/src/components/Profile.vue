<template>
  <div class="container h-100">
    <div class="row h-100">
      <div
        class="col-md-10 offset-md-1 table-responsive"
        id="content-container"
      >
        <h1>Profile</h1>
        <div v-if="claims[0]">
          <div class="container" v-if="accessClaims[0]">
            <!-- Stack the columns on mobile by making one full-width and the other half-width -->
            <div class="row">
              <div class="col-md-8"></div>
              <div class="col-6 col-md-4">
                <button
                  style="display: none"
                  id="idTokenButton"
                  class="btn btn-primary"
                  v-on:click="showIdTokenButton()"
                >
                  View ID Token
                </button>

                <button
                  id="accessTokenButton"
                  class="btn btn-primary"
                  v-on:click="($event) => showAccessTokenButton()"
                >
                  View Access Token
                </button>
              </div>
            </div>
          </div>

          <div id="idTokenTable">
            <table class="table table-striped">
              <caption style="caption-side: top">
                ID Token
              </caption>
              <thead>
                <tr>
                  <th>Claim</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(claim, index) in claims" :key="index">
                  <td>{{ claim.claim }}</td>
                  <td :id="'claim-' + claim.claim">{{ claim.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            v-if="accessClaims[0]"
            id="accessTokenTable"
            style="display: none"
          >
            <table class="table table-striped hidden" v-if="accessClaims[0]">
              <caption style="caption-side: top">
                Access Token
              </caption>
              <thead>
                <tr>
                  <th>Claim</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(claim, index) in accessClaims" :key="index">
                  <td>{{ claim.claim }}</td>
                  <td :id="'claim-' + claim.claim">{{ claim.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else>User not logged in.</div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script>
// @ is an alias to /src
import Footer from "@/components/Footer.vue";

export default {
  name: "Profile",
  components: {
    Footer,
  },
  data() {
    return {
      claims: [],
      accessClaims: [],
    };
  },

  methods: {
    showAccessTokenButton() {
      document.getElementById("accessTokenButton").style.display = "none";
      document.getElementById("accessTokenTable").style.display = "flex";
      document.getElementById("idTokenButton").style.display = "flex";
      document.getElementById("idTokenTable").style.display = "none";
    },
    showIdTokenButton() {
      document.getElementById("accessTokenButton").style.display = "flex";
      document.getElementById("accessTokenTable").style.display = "none";
      document.getElementById("idTokenButton").style.display = "none";
      document.getElementById("idTokenTable").style.display = "flex";
    },
  },
  async created() {
    const idToken = await this.$auth.tokenManager.get("idToken");
    const accessToken = await this.$auth.tokenManager.get("accessToken");
    console.log(accessToken);
    this.claims = await Object.entries(idToken.claims).map((entry) => ({
      claim: entry[0],
      value: entry[1],
    }));
    this.accessClaims = await Object.entries(accessToken.claims).map(
      (entry) => ({
        claim: entry[0],
        value: entry[1],
      })
    );
  },
};
</script>
