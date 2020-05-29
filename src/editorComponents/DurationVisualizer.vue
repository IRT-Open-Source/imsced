<template>
  <div class="durationBar positioning" title="Duration of the current subtitle">
    <div
      class="fixedMinDuration"
      :style="{ width: fixedMinDurationPercent + '%' }"
      title="fixed minimum duration for all subtitles"
    ></div>
    <div
      class="minDuration"
      :style="{ width: minDurationPercent + '%' }"
      title="minimum duration (depending on reading speed)"
    ></div>
    <div
      class="idealDuration"
      :style="{ width: overtime + '%' }"
      title="ideal duration"
    ></div>
    <span
      class="currentTime"
      :style="{ left: currentTimePercent + '%' }"
    ></span>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      overtime: 25 // green bar in percent (of whole bar)
    };
  },
  computed: {
    ...mapState(["minStDuration", "readingSpeed"]),
    // the minimum time dependent on the reading speed and the absolute minimum time
    idealDurationSeconds() {
      let allText = this.activeText;
      allText = allText.trim().replace(/\s+/g, " ");
      let x = allText.length / this.readingSpeed;
      if (x < this.minStDuration) x = this.minStDuration;
      if (x == 0) x = 0.01; // ensures there is no deviation through zero
      return x;
    },
    fullBarLengthSeconds() {
      let onePercent = this.idealDurationSeconds / (100 - this.overtime);
      let y = this.idealDurationSeconds + onePercent * this.overtime;
      return y;
    },
    fixedMinDurationPercent() {
      let x = (this.minStDuration / this.fullBarLengthSeconds) * 100;
      x = Math.floor(x * 100) / 100;
      return x;
    },
    minDurationPercent() {
      // ideal subtitle duration
      let x =
        ((this.idealDurationSeconds - this.minStDuration) /
          this.fullBarLengthSeconds) *
        100;
      if (x < 0) x = 0;
      return x;
    },
    currentTimePercent() {
      let x = (this.activeSubtitleDuration / this.fullBarLengthSeconds) * 100;
      if (x > 100) {
        x = 100;
      }
      return x - 0.25; // -0.25 to adjust marker position
    },
    ...mapGetters(["activeSubtitleDuration", "activeText"])
  },
  methods: {}
};
</script>

<style scoped>
.durationBar {
  position: relative;
  vertical-align: top;
  width: 100%;
  height: 10px;
  /* border: 1px solid rgb(0, 0, 0); */
}

.positioning {
  margin: 5px 0;
}

.fixedMinDuration {
  float: left;
  height: inherit;
  background: rgb(190, 54, 54);
}
.minDuration {
  float: left;
  height: inherit;
  background: rgb(241, 72, 72);
}

.idealDuration {
  float: left;
  height: inherit;
  background: rgb(35, 190, 35);
}
.currentTime {
  position: absolute;
  width: 5px;
  height: 16px;
  bottom: -3px;
  background: rgb(0, 0, 0);
}
</style>
