<template>
  <div class="col-sm-6 col-sm-offset-3">
    <h1>My Profile</h1>
    <p><strong>ID Token:</strong> {{ idToken }}</p>
    <p><strong>Access Token:</strong> {{ accessToken }}</p>
    <h2>Profile details:</h2>
    <ul>
      <li><strong>Name: </strong> {{ claims.name }} </li>
      <li><strong>App Username: </strong>
                       {{ claims.preferred_username }} </li>
      <li><strong>App ID: </strong> {{ claims.aud }} </li>
      <li><strong>SSO provided by: </strong> {{ claims.iss }} </li>
      <li><strong>Session Start: </strong> {{ tokenIssued }} </li>
      <li><strong>Session Timeout: </strong> {{ tokenExpiry }} </li>
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
      tokenIssued: '',
      tokenExpiry: ''
    }
  },
  mounted() {
    getAccessToken().then(token => this.accessToken = token.accessToken);
    getIdToken().then(token => {
      this.idToken = token.idToken;
      this.claims = token.claims;
      this.tokenIssued = new Date(this.claims.iat * 1000).toString();
      this.tokenExpiry = new Date(this.claims.exp * 1000).toString();
    });
  }
}
</script>
