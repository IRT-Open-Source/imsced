<template>
<div>
    <h1 class="display-3">{{ text }}</h1>
</div>
</template>

<script>

export default {
    props: {
        text: {
            type: String,
            required:true
        }
    }
}
</script>

<style lang="scss" scoped>
* /deep/ {
  @import "~bootstrap/dist/css/bootstrap.min";
  font-weight: 300;
  font-family: 'Segoe UI', Roboto;
}
</style>