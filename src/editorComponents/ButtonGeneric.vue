<!-- Very simple button component -->
<template>
  <span>
    <font-awesome-icon
      v-if="icon"
      :title="buttonName"
      v-b-tooltip.hover
      :icon="icon"
      :size="iconSize"
      :style="iconStyle"
    >
    </font-awesome-icon>
    <buttonGenericPlain
      v-else-if="!icon && uiLayout == 'plain'"
      :buttonName="buttonName"
    />
    <buttonGenericBS
      v-else
      class="mt-1"
      :buttonName="buttonName"
      :variant="variant"
    />
  </span>
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
    },
    variant: {
      type: String,
      required: false
    },
    icon: {
      type: String,
      required: false
    },
    iconStyle: {
      type: Object,
      required: false,
      default: function() {
        return {
          color: "rgba(255, 255, 255, 0.75)"
        };
      }
    },
    iconSize: {
      type: String,
      default: "lg"
    }
  },
  computed: {
    ...mapState(["uiLayout"])
  }
};
</script>

<style scoped>
*:hover {
  cursor: pointer !important;
}
.customized-icon {
  margin: 0.3em;
}
</style>
