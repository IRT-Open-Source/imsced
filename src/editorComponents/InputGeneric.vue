<!-- Simple UI component for text values -->
<template>
  <div>
    <InputGenericPlain
      v-if="uiLayout == 'plain'"
      :labelName="labelName"
      :size="size"
      :value="value"
      @valueChanged="changedValue"
      @gotFocus="focusBubble"
    />
    <InputGenericBS
      v-else
      :labelName="labelName"
      :size="size"
      :value="value"
      @valueChanged="changedValue"
      @gotFocus="focusBubble"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import InputGenericBS from "./bootstrapComponents/InputGenericBS.vue";
import InputGenericPlain from "./plainComponents/InputGenericPlain.vue";

export default {
  components: {
    InputGenericBS,
    InputGenericPlain
  },
  props: {
    labelName: {
      type: String | Number,
      required: true
    },
    size: {
      type: Number,
      required: false
    },
    value: {
      required: true
    },

  },
  computed: {
    className: function() {
      var name = this.labelName.replace(" ", "");
      return name;
    },
    ...mapState(["uiLayout"])
  },
  methods: {
    changedValue: function(val) {
      this.$emit("valueChanged", val);
      //console.log(val);
    },
    focusBubble() {
      this.$emit("gotFocus");
    }
  }
};
</script>
