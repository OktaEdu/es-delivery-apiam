<template>
  <div id="app">
    <img src="../assets/ice-logo.png">
    <!-- Menu -->
    <nav class="navbar navbar-default" v-bind:class="{ 'nav-purple': showNavPurple }">
      <div class="container">
        <ul class="nav navbar-nav">
          <li><router-link to="/home">Home</router-link></li>
          <li><router-link to="/profile">My Profile</router-link></li>
          <li><router-link to="/premium-promos">Premium Promos</router-link></li>
          <li><router-link to="/logoutLocal">Logout of App</router-link></li>
          <li><router-link to="/logoutOkta">Logout of Okta</router-link></li>
        </ul>
      </div>
    </nav>
    <!-- End of Menu -->
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      showNavPurple: nav.purple
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background-color: #FFFFEE;
}
.nav-purple {
  background-color: purple;
}
</style>
