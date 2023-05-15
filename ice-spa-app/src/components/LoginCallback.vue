/*! * Copyright (c) 2017-Present, Okta, Inc. and/or its affiliates. All
rightsreserved. * The Okta software accompanied by this notice is provided
pursuant tothe Apache License, Version 2.0 (the "License.") * * You may obtain a
copy ofthe License at http://www.apache.org/licenses/LICENSE-2.0. * Unless
required byapplicable law or agreed to in writing, software * distributed under
the Licenseis distributed on an "AS IS" BASIS, WITHOUT * WARRANTIES OR
CONDITIONS OF ANYKIND, either express or implied. * * See the License for the
specific languagegoverning permissions and limitations under the License. */
<script>
import { defineComponent, h } from "vue";
//import { adaptScopes } from "@/main.js";
export default defineComponent({
  name: "LoginCallback",
  data() {
    return { error: null };
  },
  async beforeMount() {
    try {
      await this.$auth.handleLoginRedirect();
    } catch (e) {
      const isInteractionRequiredError =
        this.$auth.isInteractionRequiredError ||
        this.$auth.idx.isInteractionRequiredError;
      if (isInteractionRequiredError(e)) {
        const { onAuthResume, onAuthRequired } = this.$auth.options;
        const callbackFn = onAuthResume || onAuthRequired;
        if (callbackFn) {
          callbackFn(this.$auth);
          return;
        }
      }
      this.error = e.toString();
    }
    //await adaptScopes();
  },
  render() {
    if (this.$slots.error) {
      return h("div", this.$slots.error({ error: this.error }));
    }
    return this.error;
  },
});
</script>
