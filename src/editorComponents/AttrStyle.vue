<!-- UI to read and write a style attribute of an IMSC document -->
<template>
  <DropDownGeneric
    v-if="type == 'drop'"
    :options="filteredOptions"
    :selected="currentValue"
    :labelName="getLabelText(name)"
    @valueChanged="setNewValue"
    @gotFocus="focusBubble"
  />

  <RadioGeneric
    v-else-if="type == 'radio'"
    :options="filteredOptions"
    :selected="currentValue"
    :labelName="getLabelText(name)"
    @valueChanged="setNewValue"
    @gotFocus="focusBubble"
  />

  <InputGeneric
    v-else-if="type == 'simple'"
    :value="currentValue"
    :labelName="getLabelText(name)"
    @valueChanged="setNewValue"
    @gotFocus="focusBubble"
  />
</template>

<script>
import { mapState, mapActions } from "vuex";
import DropDownGeneric from "./DropDownGeneric.vue";
import InputGeneric from "./InputGeneric.vue";
import RadioGeneric from "./RadioGeneric.vue";

export default {
  components: {
    DropDownGeneric,
    InputGeneric,
    RadioGeneric
  },
  props: {
    getter: {
      type: Function,
      required: false
    },

    name: {
      type: String,
      required: true
    },

    setter: {
      type: Function,
      required: false
    },

    styles: {
      type: Object,
      required: true
    },

    type: {
      type: String,
      required: true
    }
  },
  computed: {
    currentValue() {
      var namespace = this.styleData.attrs[this.name].ns;
      var valueEntry;
      var value;
      //composed values e.g. extent or origin
      if (this.name.includes("$")) {
        var composition = this.name.split("$");
        var wrapperName = composition[0];
        var propertyName = composition[1];
        valueEntry = this.styles[namespace + " " + wrapperName][propertyName];
      } else {
        valueEntry = this.styles[namespace + " " + this.name];
      }
      if (!valueEntry.value) {
        value = valueEntry;
      } else {
        value = valueEntry.value;
      }
      if (this.getter) {
        value = this.getter(value);
      }
      return value;
    },
    filteredOptions() {
      var excludes =
        this.custom.style.attrs[this.name] &&
        this.custom.style.attrs[this.name].excludeValues
          ? this.custom.style.attrs[this.name].excludeValues
          : [];
      var possibleValues = this.styleData.attrs[this.name].allowedValues;
      function filterOptions(element) {
        return !excludes.includes(element);
      }
      return possibleValues.filter(filterOptions);
    },
    ...mapState(["custom", "styleData", "playTime", "lang", "uiData"])
  },
  methods: {
    focusBubble() {
      this.$emit("gotFocus");
    },
    getLabelText(name) {
      return this.uiData.getLabel(name, this.lang);
    },
    setNewValue(newValue) {
      if (this.setter) {
        newValue = this.setter(newValue);
      }
      this.styleData.setAttr(this.name, this.styles, newValue);
      this.updateSubtitlePlane({ time: this.playTime });
    },
    ...mapActions(["updateSubtitlePlane"])
  }
};
</script>