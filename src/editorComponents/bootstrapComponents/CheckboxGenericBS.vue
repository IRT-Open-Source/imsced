<!-- simple checkbox component -->
<template>
  <b-form-checkbox :id="id" :checked="value" @change.native="changedValue">
    {{ name }}
  </b-form-checkbox>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    changedValue: function(e) {
      this.$emit("valueChanged", e.target.checked);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  @import "~bootstrap/dist/css/bootstrap.min";
}
</style>
