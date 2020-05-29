<template>
  <h1>{{ text }}</h1>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    }
  }
};
</script>
