<template>
<div class="container h-100">
  <div class="row h-100">
    <div class="col-md-10 offset-md-1" id="content-container">
      <h1>About</h1>
      Founded in 3028, Okta Ice prides itself in providing its 21st century customers with ice cream flavors that transcend time and space.
    </div>
  </div>
</div>

<Footer/>


</template>

<script>
// @ is an alias to /src
import Footer from '@/components/Footer.vue'

export default {
  name: 'About',
  components: {
    Footer
  }
}

</script>
