<!-- component for draggable and resizable div element -->
<template>
  <div
    id="featureContainer"
    :style="compContainerStyle"
    @mousedown.prevent="startDragging"
  >
    <div
      id="item"
      :style="compItemStyle"
      :class="{ resizable: resizingActive }"
    >
      <div data-resizer="topLeft" class="resizer top-left"></div>
      <div data-resizer="top" class="resizer top"></div>
      <div data-resizer="topRight" class="resizer top-right"></div>
      <div data-resizer="right" class="resizer right"></div>
      <div data-resizer="bottomRight" class="resizer bottom-right"></div>
      <div data-resizer="bottom" class="resizer bottom"></div>
      <div data-resizer="bottomLeft" class="resizer bottom-left"></div>
      <div data-resizer="left" class="resizer left"></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { MouseUpEvent, MouseMoveEvent } from "../modules/appEvents.js";
import EventBus from "../modules/eventBus.js";

export default {
  data() {
    return {
      resizer: null, // resizer is the moved at the moment
      topLeft: [this.decWidth, this.decHeight, this.incLeft, this.incTop],
      top: [this.decHeight, this.incTop],
      topRight: [this.incWidth, this.decHeight, this.incTop],
      right: [this.incWidth],
      bottomRight: [this.incWidth, this.incHeight],
      bottom: [this.incHeight],
      bottomLeft: [this.decWidth, this.incHeight, this.incLeft],
      left: [this.decWidth, this.incLeft]
    };
  },
  computed: {
    ...mapState(["resizingActive", "styleData", "playTime"]),
    ...mapGetters(["regionStyles", "renderDivDom", "getRegionValue"]),
    scalingFactorX() {
      return this.videoWidth / 100;
    },
    scalingFactorY() {
      return this.videoHeight / 100;
    },
    maxX() {
      return this.renderDivDom.offsetLeft + this.videoWidth;
    },
    minX() {
      return this.renderDivDom.offsetLeft;
    },
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
  created() {
    EventBus.listen(MouseUpEvent, () => {
      this.stopDragging();
    });
    EventBus.listen(MouseMoveEvent, (e) => {
      this.drag(e.event);
    });
  },
  methods: {
    ...mapActions(["updateSubtitlePlane"]),
    changeLeft(value) {
      let newX = this.originLeft + value;
      newX = Math.round(newX / this.scalingFactorX);
      this.styleData.setAttr("origin$w", this.regionStyles, String(newX));
    },
    changeTop(value) {
      let newY = this.originTop + value;
      newY = Math.round(newY / this.scalingFactorY);
      this.styleData.setAttr("origin$h", this.regionStyles, String(newY));
    },
    changeHeight(value) {
      let newH = this.originHeight + value;
      newH = Math.round(newH / this.scalingFactorY);
      this.styleData.setAttr("extent$h", this.regionStyles, String(newH));
    },
    changeWidth(value) {
      let newW = this.originWidth + value;
      newW = Math.round(newW / this.scalingFactorX);
      this.styleData.setAttr("extent$w", this.regionStyles, String(newW));
    },
    decLeft(e) {
      this.changeLeft(-this.dX(e));
    },
    decTop(e) {
      this.changeTop(-this.dY(e));
    },
    decHeight(e) {
      this.changeHeight(-this.dY(e));
    },
    decWidth(e) {
      this.changeWidth(-this.dX(e));
    },
    incLeft(e) {
      this.changeLeft(this.dX(e));
    },
    incTop(e) {
      this.changeTop(this.dY(e));
    },
    incHeight(e) {
      this.changeHeight(this.dY(e));
    },
    incWidth(e) {
      this.changeWidth(this.dX(e));
    },
    dX(e) {
      return e.clientX - this.originX;
    },
    dY(e) {
      return e.clientY - this.originY;
    },
    startDragging(e) {
      if (e.target.dataset.resizer) {
        this.originTop = this.dragItem.offsetTop;
        this.originLeft = this.dragItem.offsetLeft;
        this.originWidth = this.dragItem.offsetWidth;
        this.originHeight = this.dragItem.offsetHeight;

        this.originX = e.clientX;
        this.originY = e.clientY;

        this.resizer = e.target;
      }
    },
    drag(e) {
      if (this.resizer) {
        let funcSet = this.resizer.dataset.resizer;
        this[funcSet].forEach((funcItem) => {
          funcItem(e);
        });
        this.updateSubtitlePlane({ time: this.playTime });
      }
    },
    stopDragging() {
      this.resizer = null;
    }
  }
};
</script>

<style scoped>
.resizable {
  overflow: hidden;
}

#featureContainer {
  position: absolute;
}

#item {
  z-index: 9;
  position: absolute;
  border: 1px solid greenyellow;
  box-sizing: border-box;
  overflow: visible;
}

.resizable .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: greenyellow;
  border: 2px solid black;
  position: absolute;
  box-sizing: border-box;
}

.resizable .resizer.top {
  left: calc(50% - 5px);
  top: -5px;
  cursor: ns-resize;
}
.resizable .resizer.right {
  right: -5px;
  top: calc(50% - 5px);
  cursor: ew-resize;
}
.resizable .resizer.bottom {
  left: calc(50% - 5px);
  bottom: -5px;
  cursor: ns-resize;
}
.resizable .resizer.left {
  left: -5px;
  top: calc(50% - 5px);
  cursor: ew-resize;
}
.resizable .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}
.resizable .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.resizable .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.resizable .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
