<!-- Simple UI component for text values -->
<template>
  <div :class="[className]">
    <b>{{ labelName }}</b>
    <!-- TODO set type dynamically (with config file) to get e.g. color picker  -->
    <b-form-input
      class="mt-1"
      size="300"
      :value="value"
      type="text"
      @keyup.native="changedValue"
      @change.native="changedValue"
      @focus.native="focusBubble"
    ></b-form-input>
  </div>
</template>

<script>
export default {
  props: {
    labelName: {
      type: String | Number,
      required: true
    },
    size: {
      type: Number,
      required: false
    },
    value: {
      required: true
    }
  },
  computed: {
    className: function() {
      var name = this.labelName.replace(" ", "");
      return name;
    }
  },
  methods: {
    changedValue: function(e) {
      this.$emit("valueChanged", e.target.value);
      //console.log("changed");
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