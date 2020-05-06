import Vue from "vue";

// --- font awesome-----
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowsAlt,
  faArrowsAltH,
  faClosedCaptioning,
  faCog,
  faExpand,
  faExpandAlt,
  faFileVideo,
  faPhotoVideo,
  faPlus,
  faPlusCircle,
  faSave,
  faToolbox,
  faSmile
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faArrowsAlt,
  faArrowsAltH,
  faClosedCaptioning,
  faCog,
  faExpand,
  faExpandAlt,
  faFileVideo,
  faPhotoVideo,
  faPlus,
  faPlusCircle,
  faSave,
  faSmile,
  faToolbox
);

Vue.component("font-awesome-icon", FontAwesomeIcon);
// -----------------------

import BootstrapVue from "bootstrap-vue";

Vue.use(BootstrapVue);

import App from "./AppEditor.vue";

import { store } from "./store/index";

new Vue({
  el: "#app",
  store,
  render: (h) => h(App)
});
