<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-md-10 offset-md-1 align-text-top" id="footer">
          <div class="divider mb-4"></div>
          Copyright Okta Ice <span id="year"></span>
          <div class="divider mb-4"></div>
        </div>
      </div>
    </div>
  </footer>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#footer {
  background-color: #0e2d5b;
  font-size: small;
  border-color: #c7e5f5;
  color: #c7e5f5;
  font-weight: bolder;
  border-top-width: 0px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>

<script>
window.addEventListener("DOMContentLoaded", () => {
  let thisDate = new Date();
  let thisYear = thisDate.getFullYear();
  document.getElementById("year").innerHTML = thisYear;
});
</script>
