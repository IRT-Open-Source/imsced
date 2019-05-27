<!-- component for draggable and resizable div element -->
<template>
  <div id="featureContainer" :style="compContainerStyle">
    <div
      id="item"
      :style="compItemStyle"
      :class="{ resizable: resizingActive }"
      @mouseup="resize"
    ></div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";

export default {
  computed: {
    ...mapState(["resizingActive", "styleData", "playTime"]),
    ...mapGetters(["regionStylesActiveP", "renderDivDom", "getRegionValue"]),

    // get attributes from renderDiv
    videoHeight() {
      return this.renderDivDom.offsetHeight;
    },
    videoWidth() {
      return this.renderDivDom.offsetWidth;
    },
    // div element that mimics the subtitle
    dragItem: function() {
      return this.$el.querySelector("#item");
    },

    // computed css classes and styles
    compContainerStyle() {
      return { width: this.videoWidth + "px", height: this.videoHeight + "px" };
    },
    compItemStyle() {
      return {
        width: this.getRegionValue("extent$w") + "%",
        height: this.getRegionValue("extent$h") + "%",
        left: this.getRegionValue("origin$w") + "%",
        top: this.getRegionValue("origin$h") + "%"
      };
    }
  },
  methods: {
    ...mapActions(["updateSubtitlePlane"]),
    resize(e) {
      if (this.resizingActive) {
        var newW = Math.round(
          this.dragItem.offsetWidth / (this.videoWidth / 100)
        );
        var newH = Math.round(
          this.dragItem.offsetHeight / (this.videoHeight / 100)
        );
        this.styleData.setAttr(
          "extent$w",
          this.regionStylesActiveP,
          String(newW)
        );
        this.styleData.setAttr(
          "extent$h",
          this.regionStylesActiveP,
          String(newH)
        );
        this.updateSubtitlePlane({ time: this.playTime });
      }
    }
  }
};
</script>

<style scoped>
.resizable {
  overflow: hidden;
  resize: both;
}

#featureContainer {
  position: absolute;
}

#item {
  z-index: 9;
  position: relative;
  border: 1px solid greenyellow;
}
</style>