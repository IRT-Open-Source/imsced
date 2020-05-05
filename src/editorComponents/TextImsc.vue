<template>
  <div>
    <!-- Add on change event and trigger update in parent component? -->
    <InputGeneric
      :value="getValue()"
      :labelName="''"
      @valueChanged="changedValue"
      @gotFocus="focusBubble"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import InputGeneric from "./InputGeneric.vue";

export default {
  components: { InputGeneric },
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
    changedValue(val) {
      if (val == "") {
        this.element.text = "Placeholder";
      } else {
        this.element.text = val;
      }
      this.updateSubtitlePlane({ time: this.playTime });
    },
    focusBubble() {
      if (this.debug) console.log("got focus");
      this.$emit("gotFocus");
    },
    getValue() {
      if (this.element.text != "") {
        return this.element.text.trim();
      } else {
        return this.element.text;
      }
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
