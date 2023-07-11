<template>
  <div class="container h-100">
    <div class="row h-100">
      <div class="col-md-10 offset-md-1" id="content-container">
        <h1>Log in</h1>
        <p v-if="$route.query.redirect">You need to sign in first.</p>
        <form @submit.prevent="signIn" autocomplete="off">
          <div class="mb-3">
            <label for="email" class="form-label"
              >Email<input
                v-model="email"
                id="email"
                class="form-control"
                v-focus
            /></label>
          </div>
          <div class="mb-3">
            <label for="pass" class="form-label"
              >Password<input
                v-model="pass"
                id="pass"
                type="password"
                class="form-control"
            /></label>
          </div>
          <button type="submit" class="btn btn-primary">Log In</button>
          <p v-if="error" class="error">{{ msg }}</p>
        </form>
      </div>
    </div>
  </div>
  <Footer />
</template>
<script>
import Footer from "@/components/Footer.vue";
export default {
  data() {
    return { email: "", pass: "", msg: "", error: false };
  },
  name: "Apps",
  components: { Footer },
  methods: {
    signIn() {
      console.log("Auth");
      this.$auth.idx
        .authenticate({ username: this.email, password: this.pass })
        .then((transaction) => {
          switch (transaction.status) {
            case "SUCCESS":
              this.$auth.tokenManager.setTokens(transaction.tokens);
              this.$router.replace(this.$route.query.redirect || "/");
              break;
            case "PENDING":
              // next IDX step not handled in this app yet
              this.error = true;
              this.msg = transaction.messages[0].message;
              console.log(
                "TODO: add handling for status: ",
                transaction.status,
                "message: ",
                transaction.messages,
                "next step: ",
                transaction.nextStep
              );
              break;
            case "FAILURE":
              // failure from idx.authenticate
              this.error = true;
              this.msg = transaction.messages[0].message;
              console.log(
                "Failure: ",
                transaction.status,
                transaction.messages
              );
              break;
            default:
              this.error = true;
              this.msg = transaction.messages[0].message;
              console.error(
                "What happened?: ",
                transaction.status,
                transaction.messages
              );
          }
        })
        .catch((err) => {
          this.error = true;
          this.msg = err.message;
          console.error(err.message);
        });
    },
  },
};
</script>
<style>
.error {
  color: red;
}
</style>
