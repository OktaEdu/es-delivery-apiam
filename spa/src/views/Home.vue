<template>
  <div class="container h-100">
    <div class="row h-100">
      <div class="col-md-10 offset-md-1" id="content-container">
        <h1>Alglens Scoop Shop</h1>
        The future of ice cream 🍦
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
// @ is an alias to /src
import Footer from '@/components/Footer.vue';

export default {
  name: 'Home',
  components: {
    Footer,
  },
};
</script>
