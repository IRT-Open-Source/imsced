<!-- Select file and pass on fileObj and (if needed) parsed text -->
<template>
  <div>
    <b>{{ labelText }}</b>
    <b-form-file
      class="mt-1"
      :accept="accept"
      size="sm"
      @change.native="changedValue"
    />
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },

    labelText: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    accept: {
      type: String,
      default: ""
    }
  },
  methods: {
    changedValue(e) {
      this.$emit("valueChanged", e);
    }
  }
};
</script>

<style lang="scss" scoped>
* /deep/ {
  @import "~bootstrap/dist/css/bootstrap.min";
}
</style>
