<!-- menu for additional features directly on the subtitle like dragging and resizing -->
<template>
  <div>
    <div class="live-actions">
      <ButtonGeneric
        :class="{ dragButton: dragFeatureActive }"
        :buttonName="dragButtonName"
        @click.native="toggleDraggingActive"
        :disabled="activeP == undefined"
      />
      <DragFeature v-if="dragFeatureActive" />

      <ButtonGeneric
        :class="{ resizeButton: resizeFeatureActive }"
        :buttonName="resizeButtonName"
        @click.native="toggleResizingActive"
        :disabled="activeP == undefined"
      />

      <ButtonGeneric
        :buttonName="fullScreenButtonName"
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
    },

    fullScreenButtonName() {
      var name = this.fullScreenActive
        ? "disableFullScreen"
        : "enableFullScreen";
      return this.uiData.getLabel(name, this.lang);
    }
  },
  methods: {
    ...mapMutations([
      "toggleDraggingActive",
      "toggleFullScreenMode",
      "toggleResizingActive"
    ])
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