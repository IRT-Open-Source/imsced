<template>
  <div>
    <!-- Add on change event and trigger update in parent component? -->
    <InputGeneric
      :value="getValue()"
      :labelName="''"
      @valueChanged="changedValue"
      @gotFocus="focusBubble"
    />
    <!--    <label>
      <input
        type="text"
        size="100"
        :value="element.text"
        @keyup="changedValue"
        @focus="focusBubble"
      />
    </label>-->
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
      this.element.text = val;
      //console.log("change:" + this.element.text);
      this.updateSubtitlePlane({ time: this.playTime });
    },
    focusBubble() {
      if (this.debug) console.log("got focus");
      this.$emit("gotFocus");
    },
    getValue() {
      return this.element.text.trim();
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
