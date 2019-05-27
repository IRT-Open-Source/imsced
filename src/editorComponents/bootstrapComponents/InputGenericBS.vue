<!-- Simple UI component for text values -->
<template>
  <div :class="[className]">
    <b>{{ labelName }}</b>
    <!-- TODO set type dynamically (with config file) to get e.g. color picker  -->
    <b-form-input
      class="mt-1"
      size="sm"
      :value="value"
      type="text"
      @change.native="changedValue"
      @focus.native="focusBubble"
    ></b-form-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true
    },
    labelName: {
      type: String | Number,
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
    },
    focusBubble() {
      this.$emit("gotFocus");
    }
  }
};
</script>
