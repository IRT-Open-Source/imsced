<!-- Simple wrapper component for the video element -->
<template>
  <div :id="containerid">
    <video
      :autobuffer="autobuffer"
      :controls="controls"
      :id="id"
      :src="src"
      @loadeddata="videoLoaded"
      @pause="changedToPause"
      @play="changedToPlay"
    ></video>
  </div>
</template>

<script>
import EventBus from "../modules/eventBus.js";
import { VideoPausedEvent } from "../modules/appEvents.js";
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    autobuffer: {
      type: Boolean,
      required: true
    },
    containerid: {
      type: String,
      required: true
    },
    controls: {
      type: Boolean,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    src: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      videoPausedEvent: VideoPausedEvent
    };
  },
  computed: {
    ...mapState(["playTimeChangedByApp"])
  },
  created() {
    this.videoPausedEvent = new VideoPausedEvent();
  },
  methods: {
    changedToPause() {
      EventBus.publish(this.videoPausedEvent);
    },
    changedToPlay() {
      this.$emit("videoPlays");
    },
    videoLoaded() {
      this.$emit("videoLoaded");
    }
  }
};
</script>

<style scoped>
div video {
  width: 0px;
  height: 0px;
}
</style>
