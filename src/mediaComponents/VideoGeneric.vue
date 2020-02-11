<!-- Simple wrapper component for the video element -->
<template>
  <div :id="containerid">
    <video
      :autobuffer="autobuffer"
      :controls="controls"
      :id="id"
      :src="src"
      @loadeddata="videoLoaded"
      @play="changedToPlay"
    ></video>
  </div>
</template>

<script>
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
  methods: {
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