<template>
  <div>
    <!-- Add on change event and trigger update in parent component? -->
    <label>
      <input
        type="text"
        size="50"
        :value="element.text"
        @keyup="changedValue"
        @focus="focusBubble"
      />
    </label>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(["playTime", "debug"])
  },
  methods: {
    changedValue(e) {
      this.element.text = e.target.value;
      this.updateSubtitlePlane({ time: this.playTime });
    },
    focusBubble() {
      if (this.debug) console.log("got focus");
      this.$emit("gotFocus");
    },
    ...mapActions(["updateSubtitlePlane", "changeText"])
  }
};
</script>

<style scoped>
input {
  background-color: transparent;
  border-color: transparent;
}
</style>
