<!-- Simple select form element  -->
<template>
  <div>
    <div class="attr-label">
      <p :class="[labelClass]">{{ labelName }}</p>
    </div>
    <b-form-select
      class="mt-1"
      v-model="selected"
      :options="options"
      @change.native="changedValue"
      @focus.native="focusBubble"
    ></b-form-select>
  </div>
</template>

<script>
export default {
  props: {
    //Sometimes needed for reactivly
    //updating the list of selection options
    dropKey: {
      type: Number,
      required: false
    },
    displayEmptyLabel: {
      type: Boolean,
      default: false
    },
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
      type: String,
      required: true
    }
  },
  computed: {
    labelClass: function() {
      var lc =
        this.labelName == "" && !this.displayEmptyLabel
          ? "d-none"
          : this.labelWeightClass();
      return lc;
    }
  },
  methods: {
    changedValue: function(e) {
      this.$emit("valueChanged", e.target.value);
    },
    focusBubble() {
      this.$emit("gotFocus");
    },
    labelWeightClass: function() {
      return "font-weight-" + this.labelWeight;
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  @import "~bootstrap/dist/css/bootstrap.min";
}
</style>
