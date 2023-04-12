<template>
  <div class="container h-100">
    <div class="row h-100">
      <div class="col-md-10 offset-md-1" id="content-container">
        <h1>Promos</h1>
        Promos to be rendered here on login.
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
// @ is an alias to /src
import Footer from "@/components/Footer.vue";

export default {
  name: "Promos",
  components: {
    Footer,
  },
};
</script>
