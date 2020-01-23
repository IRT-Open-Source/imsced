<!-- menu for additional features directly on the subtitle like dragging and resizing -->
<template>
  <div class="live-actions">
    <ButtonGeneric
      :class="{ activeButton: dragFeatureActive }"
      :buttonName="dragButtonName"
      icon="arrows-alt"
      :iconStyle="{ color: 'grey' }"
      @click.native="toggleDraggingActive"
      :disabled="activeP == undefined"
    />

    <ButtonGeneric
      :class="{ activeButton: resizeFeatureActive }"
      :buttonName="resizeButtonName"
      icon="arrows-alt-h"
      :iconStyle="{ color: 'grey' }"
      @click.native="toggleResizingActive"
      :disabled="activeP == undefined"
    />

    <!-- <ButtonGeneric
      :buttonName="fullScreenButtonName"
      @click.native="toggleFullScreenMode"
    /> -->
  </div>
</template>

<script>
import ButtonGeneric from "./ButtonGeneric.vue";
import DragFeature from "./DragFeature.vue";
import ResizeFeature from "./ResizeFeature.vue";

import { mapState, mapMutations } from "vuex";

export default {
  components: {
    ButtonGeneric,
    DragFeature,
    ResizeFeature
  },

  computed: {
    ...mapState([
      "activeP",
      "draggingActive",
      "lang",
      "fullScreenActive",
      "resizingActive",
      "uiData"
    ]),

    dragButtonName() {
      var name = this.draggingActive ? "disableDragging" : "enableDragging";
      return this.uiData.getLabel(name, this.lang);
    },

    dragFeatureActive() {
      return this.activeP && this.draggingActive;
    },

    resizeButtonName() {
      var name = this.resizingActive ? "disableResizing" : "enableResizing";
      return this.uiData.getLabel(name, this.lang);
    },

    resizeFeatureActive() {
      return this.activeP && this.resizingActive;
    }

    // fullScreenButtonName() {
    //   var name = this.fullScreenActive
    //     ? "disableFullScreen"
    //     : "enableFullScreen";
    //   return this.uiData.getLabel(name, this.lang);
    // }
  },
  methods: {
    ...mapMutations([
      "toggleDraggingActive",
      // "toggleFullScreenMode",
      "toggleResizingActive"
    ])
  }
};
</script>

<style scoped>
.live-actions button {
  margin: 0 1px;
}
.activeButton {
  background-color: lightgrey;
  padding: 0.25em;
  margin: 0.25em;
}

.live-actions > * {
  margin: 0.25em;
  padding: 0.25em;
  margin-top: 0.5em;
}

#fullScreenContainer:fullscreen .live-actions input[disabled] {
  display: none;
}
#fullScreenContainer:fullscreen .live-actions {
  position: absolute;
  z-index: 10;
}
</style>
