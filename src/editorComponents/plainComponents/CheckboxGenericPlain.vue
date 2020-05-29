<!-- Simple checkbox component  -->
<template>
  <div>
    <input type="checkbox" :id="id" :checked="value" @change="changedValue"/>
    <label :for="id">{{ name }}</label>
  </div>
</template>

<script>
import { mapState } from "vuex";

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
  computed: {
    ...mapState(["uiLayout"])
  },
  methods: {
    changedValue: function(e) {
      this.$emit("valueChanged", e.target.checked);
    }
  }
};
</script>
