import { createApp } from "vue";
import { OktaAuth } from "@okta/okta-auth-js";
import OktaVue from "@okta/okta-vue";
import App from "./App.vue";
import router from "./router";

import myConfig from "@/config";

// instantiate an OktaAuth object with the settings in config.js
const oktaAuth = new OktaAuth(myConfig.oidc);

createApp(App)
  .directive("focus", {
    // When the bound element is inserted into the DOM...
    mounted: function (el) {
      // Focus the element
      el.focus();
    },
  })
  .use(router)
  .use(OktaVue, {
    oktaAuth,
    onAuthRequired: () => {
      router.push("/login");
    },
    onAuthResume: () => {
      router.push("/login");
    },
  })
  .mount("#app");
