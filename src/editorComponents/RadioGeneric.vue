<!-- Simple UI component for radio buttons  -->
<template>
  <RadioGenericPlain
    v-if="uiLayout == 'plain'"
    :options="options"
    :selected="selected"
    :labelName="labelName"
    @valueChanged="changedValue"
  />
  <RadioGenericBS
    v-else
    :options="options"
    :selected="selected"
    :labelName="labelName"
    @valueChanged="changedValue"
  />
</template>

<script>
import helperGeneric from "../modules/helperGeneric.js";
import { mapState } from "vuex";
import RadioGenericBS from "./bootstrapComponents/RadioGenericBS.vue";
import RadioGenericPlain from "./plainComponents/RadioGenericPlain.vue";

export default {
  components: { RadioGenericPlain, RadioGenericBS },
  props: {
    labelName: {
      type: String,
      required: true
    },

    options: {
      type: Array,
      required: true
    },

    selected: {
      required: true
    },

    translateOptions: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    //unique name for group of radio buttons
    nameOfSet: function() {
      var helper = new helperGeneric();
      return helper.uuidv4();
    },
    ...mapState(["genericMenu", "lang", "uiData", "uiLayout"])
  },
  methods: {
    changedValue: function(val) {
      this.$emit("valueChanged", val);
    },
    focusBubble() {
      this.$emit("gotFocus");
    },
    getLabelText(name) {
      name = this.translateOptions
        ? this.uiData.getLabel(name, this.lang)
        : name;
      return name;
    }
  }
};
</script>