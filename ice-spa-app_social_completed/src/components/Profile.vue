<template>
  <div class="col-sm-6 col-sm-offset-3">
    <h1>My Profile</h1>
    <p><strong>ID Token:</strong> {{ idToken }}</p>
    <p><strong>Access Token:</strong> {{ accessToken }}</p>
    <h2>Profile details:</h2>
    <ul>
      <li><strong>Name: </strong> {{ claims.name }}</li>
      <li><strong>Email: </strong> {{ claims.email }}</li>
      <li><strong>SSO provided by: </strong> {{ claims.iss }}</li>
      <li><strong>Session Start: </strong> {{ tokenStarted }}</li>
      <li><strong>Session Timeout: </strong> {{ tokenTimeout }}</li>
    </ul>
  </div>
</template>

<script>
import { getIdToken, getAccessToken } from '../auth'
export default {
  data() {
    return {
      accessToken: '',
      idToken: '',
      claims: '',
      tokenStarted: '',
      tokenTimeout: ''
    }
  },
  mounted() {
    this.accessToken = getAccessToken().accessToken;
    this.idToken = getIdToken().idToken;
    this.claims = getIdToken().claims;
    this.tokenStarted = new Date(this.claims.iat * 1000).toString();
    this.tokenTimeout = new Date(this.claims.exp * 1000).toString();
  }
}
</script>
