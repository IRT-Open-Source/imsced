<!-- Simple UI component for text values -->
<template>
  <label>
    {{ labelName }}
    <input
      :type="type"
      :value="value"
      :size="size"
      :step="step"
      :min="min"
      @input="changedValue"
      @focus="focusBubble"
    />
  </label>
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
    },
    type: {
      type: String,
      default: "text"
    },
    size: {
      type: Number,
      required: false
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
