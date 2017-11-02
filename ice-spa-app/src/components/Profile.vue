<template>
  <div class="col-sm-6 col-sm-offset-3">
    <h1>My Profile</h1>
    <p><strong>ID Token:</strong> {{ idToken }}</p>
    <p><strong>Access Token:</strong> {{ accessToken }}</p>
    <h2>Profile details:</h2>
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
  mounted(){
    this.accessToken = getAccessToken().accessToken;
    this.idToken = getIdToken().idToken;
  }
}
</script>
