<!-- Simple UI component for text values -->
<template>
  <span>
    <p v-if="labelName != ''" :class="[labelWeightClass]">{{ labelName }}</p>
    <!-- TODO set type dynamically (with config file) to get e.g. color picker  -->
    <b-form-input
      class="mt-1"
      size="300"
      autocomplete="off"
      :value="getValue()"
      :type="type"
      :step="step"
      :min="min"
      @input.native="changedValue"
      @focus.native="focusBubble"
    ></b-form-input>
  </span>
</template>

<script>
export default {
  data() {
    return {
      opacity: "ff"
    };
  },
  props: {
    labelName: {
      type: String | Number,
      required: true
    },
    labelWeight: {
      type: String,
      default: "bold"
    },
    size: {
      type: Number,
      required: false
    },
    type: {
      type: String,
      default: "text"
    },
    value: {
      required: true
    },
    step: {
      type: Number
    },
    min: {
      type: Number
    }
  },
  computed: {
    className: function() {
      var name = this.labelName.replace(" ", "");
      return name;
    },
    labelWeightClass: function() {
      return "font-weight-" + this.labelWeight;
    }
  },
  methods: {
    changedValue: function(e) {
      var newValue =
        this.type == "color"
          ? this.getRgbaColorValue(e.target.value)
          : e.target.value;
      this.$emit("valueChanged", newValue);
    },
    focusBubble() {
      this.$emit("gotFocus");
    },
    // temporarily solution to add opacity
    // and remove #-character at begin.
    // hex color value, e.g. #00ff00
    getRgbaColorValue(value) {
      return value.substring(1, 7) + this.opacity;
    },
    getValue() {
      switch (this.type) {
        case "color":
          return this.getHexRGBValue();
        default:
          return this.value;
      }
    },
    getHexRGBValue() {
      this.opacity = this.value.length == 8 ? this.value.substring(6) : "ff";
      return "#" + this.value.substring(0, 6);
    }
  }
};
</script>

<style lang="scss" scoped>
* /deep/ {
  @import "~bootstrap/dist/css/bootstrap.min";
}
</style>
