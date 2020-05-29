<!-- simple checkbox component -->
<template>
  <div>
    <CheckboxGenericPlain v-if="uiLayout == 'plain'" :id="id" :name="name" :value="value" @valueChanged="changedValue"/>
    <CheckboxGenericBS v-else :id="id" :name="name" :value="value" @valueChanged="changedValue"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CheckboxGenericBS from "./bootstrapComponents/CheckboxGenericBS.vue";
import CheckboxGenericPlain from "./plainComponents/CheckboxGenericPlain.vue";
export default {
  components: { CheckboxGenericBS, CheckboxGenericPlain },
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
  computed: {
    ...mapState(["uiLayout"])
  },
  methods: {
    changedValue: function(val) {
      this.$emit("valueChanged", val);
    },
  }
};
</script>