// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './components/App'
import router from './router'
import VueResource from 'vue-resource'
Vue.use(VueResource);

Vue.config.productionTip = false;

// Check the users auth status when the app starts
//import { isLoggedIn } from './auth'
//isLoggedIn();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
