<template>
  <span>
    <InputGeneric
      :elementId="`input_${element.editorId}`"
      :value="getValue()"
      :labelName="''"
      @valueChanged="changedValue"
      @gotFocus="focusBubble"
    />
  </span>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import InputGeneric from "./InputGeneric.vue";

export default {
  components: { InputGeneric },
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      charsOk: true
    };
  },
  computed: {
    ...mapState(["playTime", "playTimeChangedByUser", "debug"])
  },
  methods: {
    changedValue(val) {
      if (val == "") {
        this.element.text = "Placeholder";
      } else {
        this.element.text = val;
      }
      this.$emit("textChanged");
      this.updateSubtitlePlane({ time: this.playTime });
    },
    focusBubble() {
      if (this.debug) console.log("got focus");
      if (this.playTimeChangedByUser) {
        this.setPlayTimeChangedByUser(false);
        this.$emit("gotFocusByApp");
      } else {
        this.$emit("gotFocus");
      }
    },
    getValue() {
      if (this.element.text != "") {
        return this.element.text.trim();
      } else {
        return this.element.text;
      }
    },
    ...mapActions(["updateSubtitlePlane", "changeText"]),
    ...mapMutations(["setPlayTimeChangedByUser"])
  }
};
</script>

<style scoped>
input {
  background-color: transparent;
  border-color: transparent;
}
</style>
