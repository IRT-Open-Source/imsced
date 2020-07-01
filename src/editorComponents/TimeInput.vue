<!-- Simple UI component for text values -->
<template>
  <span>
    <input
      class="timeInput"
      type="number"
      title="Hours"
      :value="hours"
      min="0"
      max="23"
      step="1"
      @focus="focusBubble"
      @change="changeHours"
    />
    <span>:</span>
    <input
      class="timeInput"
      type="number"
      title="Minutes"
      :value="minutes"
      min="0"
      max="59"
      step="1"
      @focus="focusBubble"
      @change="changeMinutes"
    />
    <span>:</span>
    <input
      class="timeInput"
      type="number"
      title="Seconds"
      :value="seconds"
      min="0"
      max="59"
      step="1"
      @focus="focusBubble"
      @change="changeSeconds"
    />
    <span>.</span>
    <input
      class="timeInput inputMs"
      type="number"
      title="Milliseconds (25fps)"
      min="0"
      max="999"
      step="40"
      :value="milliseconds"
      @focus="focusBubble"
      @change="changeMilliSeconds"
    />
  </span>
</template>

<script>
export default {
  props: {
    time: {
      required: true
    }
  },
  computed: {
    hours() {
      return this.time.substr(0, 2);
    },
    minutes() {
      return this.time.substr(3, 2);
    },
    seconds() {
      return this.time.substr(6, 2);
    },
    milliseconds() {
      return this.time.substr(9, 3);
    }
  },
  methods: {
    changeHours(e) {
      let newVal = e.target.value.toString();
      newVal.replace(/[^0-9]/g, "");
      while (newVal.length < 3) {
        newVal = "0" + newVal;
      }
      if (parseInt(newVal) < 0) {
        newVal = "00";
      }
      if (newVal.length > 2) {
        newVal = newVal.substr(newVal.length - 2, 2);
      }
      if (parseInt(newVal) > 23) {
        newVal = "23";
      }
      let fullTime = `${newVal}:${this.minutes}:${this.seconds}.${this.milliseconds}`;
      this.$emit("timeChanged", fullTime);
      this.$forceUpdate();
    },
    changeMinutes(e) {
      let newVal = e.target.value.toString();

      while (newVal.length < 2) {
        newVal = "0" + newVal;
      }
      if (newVal.length > 2) {
        newVal = newVal.substr(newVal.length - 2, 2);
      }
      if (parseInt(newVal) < 0) {
        newVal = "00";
      }
      if (parseInt(newVal) > 59) {
        newVal = "59";
      }
      let fullTime = `${this.hours}:${newVal}:${this.seconds}.${this.milliseconds}`;
      this.$emit("timeChanged", fullTime);
      this.$forceUpdate();
    },
    changeSeconds(e) {
      let newVal = e.target.value.toString();
      newVal = newVal.replace(/[-+]/g, "");
      while (newVal.length < 2) {
        newVal = "0" + newVal;
      }
      if (newVal.length > 2) {
        newVal = newVal.substr(newVal.length - 2, 2);
      }
      if (parseInt(newVal) < 0) {
        newVal = "00";
      }
      if (parseInt(newVal) > 59) {
        newVal = "59";
      }
      let fullTime = `${this.hours}:${this.minutes}:${newVal}.${this.milliseconds}`;
      this.$emit("timeChanged", fullTime);
      this.$forceUpdate();
    },
    changeMilliSeconds(e) {
      let newVal = e.target.value.toString();
      newVal = newVal.replace(/[-+]/g, "");
      while (newVal.length < 3) {
        newVal = "0" + newVal;
      }
      if (newVal.length > 3) {
        newVal = newVal.substr(newVal.length - 3, 3);
      }
      if (parseInt(newVal) < 0) {
        newVal = "00";
      }
      let fullTime = `${this.hours}:${this.minutes}:${this.seconds}.${newVal}`;
      this.$emit("timeChanged", fullTime);
      this.$forceUpdate();
    },
    focusBubble() {
      this.$emit("gotFocus");
    }
  }
};
</script>

<style>
.inputMs,
.inputMs:focus {
  width: 3em !important;
}
.timeInput,
.timeInput:focus {
  border: none;
  width: 2.5em;
  color: rgba(0, 0, 0, 0.85);
  outline: none;
}
input:invalid {
  box-shadow: none;
}
</style>
