<template>
  <div class="container h-100">
    <div class="row h-100">
      <div class="col-md-10 offset-md-1" id="content-container">
        <div class="login">
          <h1>Sign in</h1>
          <p v-if="$route.query.redirect">You need to sign in first.</p>
          <form @submit.prevent="signIn" autocomplete="off">
            Email:
            <label><input v-model="email" placeholder="email" v-focus /></label
            ><br /><br />
            Password:
            <label
              ><input
                v-model="pass"
                placeholder="password"
                type="password" /></label
            ><br />
            <br />
            <button type="submit">Continue</button>
            <p v-if="error" class="error">{{ msg }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Footer from "@/components/Footer.vue";

export default {
  data() {
    return {
      email: "",
      pass: "",
      msg: "",
      error: false,
    };
  },
  name: "Apps",
  components: {
    Footer,
  },
  methods: {
    signIn() {
      console.log("Auth");
      this.$auth.idx
        .authenticate({
          username: this.email,
          password: this.pass,
        })
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
