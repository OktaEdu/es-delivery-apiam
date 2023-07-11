<template>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx"
    crossorigin="anonymous"
  />
  <div id="header">
    <div class="row">
      <div class="col-md-2" id="logo">
        <img
          alt="Okta Ice logo"
          src="./assets/ice-logo.png"
          class="img-fluid"
        />
      </div>
      <div class="col-md-6 offset-md-1" id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/profile">Profile</router-link>
        <router-link to="/promos">Promos </router-link>
        <Login msg="Welcome to Okta Ice" />
      </div>
    </div>
  </div>
  <router-view />
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";

export default {
  name: "Home",
  components: {
    Login,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #222;
  height: 100%;
}

body {
  background-image: url(./assets/ice-cream-bg.png);
}

body,
html {
  height: 100%;
  background-image: url(./assets/ice-cream-bg.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

#nav {
  padding: 30px;
  display: inline;
}

#nav a {
  font-weight: bold;
  color: #5ab9f2;

  text-decoration: none;
}

#nav a:not(:first-of-type)::before,
#nav .login::before {
  content: " ● ";
  color: #c7e5f5;
  margin-left: 15px;
  margin-right: 15px;
}

#nav a.router-link-exact-active {
  color: #fff;
}

#nav a:hover {
  color: #c7e5f5;
}

#content-container {
  text-align: left;
  background-color: #f0f0f0;
  padding: 3em 5em 3em 5em;
  margin-top: 5em;
  border-radius: 5px;
  border-style: double;
  border-bottom-width: 0px;
  border-color: #c7e5f5;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

#header {
  background-color: #0e2d5b;
  border-bottom-color: #c7e5f5;
  padding: 30px;
}
</style>
