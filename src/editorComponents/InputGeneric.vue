<!-- Simple UI component for text values -->
<template>
  <span>
    <InputGenericPlain
      v-if="uiLayout == 'plain'"
      :elementId="elementId"
      :labelName="labelName"
      :size="size"
      :value="value"
      :step="step"
      :min="min"
      @valueChanged="changedValue"
      @gotFocus="focusBubble"
    />
    <InputGenericBS
      v-else
      :elementId="elementId"
      :labelName="labelName"
      :labelWeight="labelWeight"
      :size="size"
      :value="value"
      :type="type"
      :step="step"
      :min="min"
      @valueChanged="changedValue"
      @gotFocus="focusBubble"
    />
  </span>
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
    elementId: {
      type: String,
      required: false
    },
    labelName: {
      type: String | Number,
      required: true
    },
    labelWeight: {
      type: String,
      default: "bold"
    },
    size: {
      type: Number,
      required: false
    },
    type: {
      type: String,
      default: "text"
    },
    value: {
      required: true
    },
    step: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 0
    }
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
    },
    focusBubble() {
      this.$emit("gotFocus");
    }
  }
};
</script>
