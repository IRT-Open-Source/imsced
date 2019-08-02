<!-- Very simple button component -->
<template>
  <b-button size="sm" :variant="variant">{{ buttonName }}</b-button>
</template>

<script>
export default {
  props: {
    buttonName: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      required: false
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  @import "~bootstrap/dist/css/bootstrap.min";
}
</style>