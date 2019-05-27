import Vue from "vue";
import App from "./AppEditor.vue";

import { store } from "./store/index";

new Vue({
  el: "#app",
  store,
  render: h => h(App)
});
