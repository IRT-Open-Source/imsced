<!-- component for draggable and resizable div element -->
<template>
  <div
    id="featureContainer"
    :style="compContainerStyle"
    @mousedown="startDragging"
    @mouseup="stopDragging"
    @mousemove="drag"
  >
    <div
      id="item"
      :style="compItemStyle"
      :class="{ draggable: draggingActive }"
    ></div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      active: false // subtitle is moved at the moment
    };
  },

  computed: {
    ...mapState(["draggingActive", "styleData", "playTime"]),
    ...mapGetters(["regionStyles", "renderDivDom", "getRegionValue"]),

    // get attributes from renderDiv
    videoHeight() {
      return this.renderDivDom.offsetHeight;
    },
    videoWidth() {
      return this.renderDivDom.offsetWidth;
    },
    subPosX() {
      return this.getRegionValue("origin$w");
    },
    subPosY() {
      return this.getRegionValue("origin$h");
    },
    // div element that mimics the subtitle
    dragItem() {
      return this.$el.querySelector("#item");
    },

    scalingFactorX() {
      return this.videoWidth / 100;
    },
    scalingFactorY() {
      return this.videoHeight / 100;
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

    startDragging(e) {
      if (!this.draggingActive) {
        return;
      }
      this.xOffset = this.subPosX * this.scalingFactorX; // subtitle position in px
      this.yOffset = this.subPosY * this.scalingFactorY; // subtitle position in px
      this.originX = e.clientX - this.xOffset;
      this.originY = e.clientY - this.yOffset;
      if (e.target === this.dragItem) {
        this.active = true;
      }
    },
    drag(e) {
      if (this.active) {
        this.currentX = e.clientX - this.originX;
        this.currentY = e.clientY - this.originY;
        var newX = Math.round(this.currentX / this.scalingFactorX);
        var newY = Math.round(this.currentY / this.scalingFactorY);

        this.styleData.setAttr("origin$w", this.regionStyles, String(newX));
        this.styleData.setAttr("origin$h", this.regionStyles, String(newY));
        this.updateSubtitlePlane({ time: this.playTime });
      }
    },
    stopDragging() {
      this.originX = this.currentX;
      this.originY = this.currentY;
      this.active = false;
    }
  }
};
</script>

<style scoped>
.draggable {
  cursor: move;
}

#featureContainer {
  position: absolute;
}

#item {
  z-index: 9;
  position: relative;
  border: 1px solid red;
  box-sizing: border-box;
}
</style>
