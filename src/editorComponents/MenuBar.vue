<template>
  <div>
    <!-- Bootstrap layout  -->
    <MenuBarBS v-if="uiLayout == 'bootstrap'" />

    <!-- Plain layout  -->
    <MenuBarPlain v-if="uiLayout == 'plain'" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import MenuBarBS from "./bootstrapComponents/MenuBarBS.vue";
import MenuBarPlain from "./plainComponents/MenuBarPlain.vue";

export default {
  components: { MenuBarBS, MenuBarPlain },
  props: {},
  computed: {
    ...mapState(["uiLayout"])
  },
  methods: {}
};
</script>
