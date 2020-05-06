<!-- Simple UI component for radio buttons  -->
<template>
  <b-form-group>
    <p :class="[labelWeightClass]">{{ labelName }}</p>
    <b-form-radio-group
      class="mt-1"
      :checked="selected"
      :options="options"
      :name="nameOfSet"
      @change.native="changedValue"
      @focus.native="focusBubble"
      stacked
    ></b-form-radio-group>
  </b-form-group>
</template>

<script>
import helperGeneric from "../../modules/helperGeneric.js";
import { mapState } from "vuex";

export default {
  props: {
    labelName: {
      type: String,
      required: true
    },

    labelWeight: {
      type: String,
      default: "bold"
    },

    options: {
      type: Array,
      required: true
    },

    selected: {
      required: true
    }
  },
  computed: {
    labelWeightClass: function() {
      return "font-weight-" + this.labelWeight;
    },
    //unique name for group of radio buttons
    nameOfSet: function() {
      var helper = new helperGeneric();
      return helper.uuidv4();
    },
    ...mapState(["uiLayout"])
  },
  methods: {
    changedValue: function(e) {
      this.$emit("valueChanged", e.target.value);
    },
    focusBubble() {
      this.$emit("gotFocus");
    }
  }
};
</script>

<style lang="scss" scoped>
* /deep/ {
  @import "~bootstrap/dist/css/bootstrap.min";
}
</style>
