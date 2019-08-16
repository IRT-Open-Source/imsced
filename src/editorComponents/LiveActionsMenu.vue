<!-- menu for additional features directly on the subtitle like dragging and resizing -->
<template>
  <div>
    <div class="live-actions">
      <ButtonGeneric
        :class="{ dragButton: dragFeatureActive }"
        :buttonName="draggingActive ? 'Disable dragging' : 'Enable dragging'"
        @click.native="toggleDraggingActive"
        :disabled="activeP == undefined"
      />
      <DragFeature v-if="dragFeatureActive" />

      <ButtonGeneric
        :class="{ resizeButton: resizeFeatureActive }"
        :buttonName="resizingActive ? 'Disable resizing' : 'Enable resizing'"
        @click.native="toggleResizingActive"
        :disabled="activeP == undefined"
      />

      <ButtonGeneric
        :buttonName="fullScreenActive ? 'Disable full-screen' : 'Enable full-screen'"
        @click.native="toggleFullScreenMode"
      />
    </div>
    <ResizeFeature v-if="resizeFeatureActive" />
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
      "fullScreenActive", 
      "resizingActive"]),

    dragFeatureActive() {
      return this.activeP && this.draggingActive;
    },

    resizeFeatureActive() {
      return this.activeP && this.resizingActive;
    }
  },
  methods: {
    ...mapMutations([
      "toggleDraggingActive", 
      "toggleFullScreenMode",
      "toggleResizingActive"])
  }
};
</script>

<style scoped>
.live-actions {
  /* margin-bottom: 5px; TODO margin here moves the subtitle feature div! */
}
.resizeButton {
  background-color: greenyellow;
}

.dragButton {
  background-color: salmon;
}

#fullScreenContainer:fullscreen .live-actions input[disabled] {
  display: none;
}
#fullScreenContainer:fullscreen .live-actions {
  position: absolute;
  z-index: 10;
}

</style>