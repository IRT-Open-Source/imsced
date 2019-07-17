<!-- 
  UI to read and write a style attribute of an IMSC document
  Currently two different types of menues are supported: 
    * "genericMenu": a configurable menu using bootstrap
    * a default menu using the plain HTML input types with
      mininmal CSS styling
-->
<template>
  <div v-if="genericMenu">
    <DropDownGenericBS
      v-if="type == 'drop'"
      :options="filteredOptions"
      :selected="currentValue"
      :labelName="getLabelText(name)"
      @valueChanged="setNewValue"
      @gotFocus="focusBubble"
    />

    <RadioGenericBS
      v-else-if="type == 'radio'"
      :options="filteredOptions"
      :selected="currentValue"
      :labelName="getLabelText(name)"
      @valueChanged="setNewValue"
      @gotFocus="focusBubble"
    />

    <InputGenericBS
      v-else-if="type == 'simple'"
      :value="currentValue"
      :labelName="getLabelText(name)"
      @valueChanged="setNewValue"
      @gotFocus="focusBubble"
    />
  </div>
  <div v-else>
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
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import DropDownGeneric from "./DropDownGeneric.vue";
import DropDownGenericBS from "./bootstrapComponents/DropDownGenericBS.vue";
import InputGeneric from "./InputGeneric.vue";
import InputGenericBS from "./bootstrapComponents/InputGenericBS.vue";
import RadioGeneric from "./RadioGeneric.vue";
import RadioGenericBS from "./bootstrapComponents/RadioGenericBS.vue";

export default {
  components: {
    DropDownGeneric,
    DropDownGenericBS,
    InputGeneric,
    InputGenericBS,
    RadioGeneric,
    RadioGenericBS
  },
  props: {
    getter: {
      type: String | Function, // TODO check if there is a better way than using strings in config or convert to function before
      required: false
    },

    name: {
      type: String,
      required: true
    },

    setter: {
      type: String | Function, // TODO check if there is a better way than using strings in config or convert to function before
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
      var value;
      var valueEntry = this.styleData.getValueEntry(this.name, this.styles);
      if (!valueEntry.value) {
        value = valueEntry;
      } else {
        value = valueEntry.value;
      }
      if (this.getter) {
        if (typeof this.getter === "function") {
          value = this.getter(value);
        } else if (typeof this.getter === "string") {
          value = this.helper[this.getter](value);
        }
      }
      if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
        value = value[0];
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
    ...mapState([
      "custom",
      "genericMenu",
      "helper",
      "styleData",
      "playTime",
      "lang",
      "uiData"
    ])
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
        if (typeof this.getter === "function") {
          newValue = this.setter(newValue);
        } else if (typeof this.getter === "string") {
          newValue = this.helper[this.setter](newValue);
        }
      }
      this.styleData.setAttr(this.name, this.styles, newValue);
      this.updateSubtitlePlane({ time: this.playTime });
    },
    ...mapActions(["updateSubtitlePlane"])
  }
};
</script>
