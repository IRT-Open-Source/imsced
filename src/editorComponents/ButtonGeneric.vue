<!-- Very simple button component -->
<template>
  <buttonGenericPlain v-if="uiLayout == 'plain'" :buttonName="buttonName" />
  <buttonGenericBS v-else class="mt-1" :buttonName="buttonName" />
</template>

<script>
import { mapState } from "vuex";
import ButtonGenericBS from "./bootstrapComponents/ButtonGenericBS.vue";
import ButtonGenericPlain from "./plainComponents/ButtonGenericPlain.vue";
export default {
  components: { ButtonGenericBS, ButtonGenericPlain },
  props: {
    buttonName: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(["uiLayout"])
  }
};
</script>