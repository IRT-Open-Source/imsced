<!-- Very simple button component -->
<template>
  <input type="button" :value="buttonName" />
</template>

<script>
export default {
  props: {
    buttonName: {
      type: String,
      required: true
    }
  }
};
</script>