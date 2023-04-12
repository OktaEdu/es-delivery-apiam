<template>
  <div class="col-sm-6 col-sm-offset-3">
    <h1>My Profile</h1>
    <p><strong>ID Token:</strong> {{ idToken }}</p>
    <p><strong>Access Token:</strong> {{ accessToken }}</p>
    <h2>Profile details:</h2>
    <ul>
      <li><strong>Name: </strong> </li>
      <li><strong>App Username: </strong> </li>
      <li><strong>App ID: </strong> </li>
      <li><strong>SSO provided by: </strong> </li>
      <li><strong>Session Start: </strong> </li>
      <li><strong>Session Timeout: </strong> </li>
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
    });
  }
}
</script>
