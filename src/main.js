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
  faToolbox
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
<<<<<<< HEAD
<<<<<<< HEAD
  faSmile,
=======
  faTimes,
>>>>>>> 310e74d... improve add region
=======
>>>>>>> f9832b6... remove possibility to name new region, shorten generated region id
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
  render: h => h(App)
});
