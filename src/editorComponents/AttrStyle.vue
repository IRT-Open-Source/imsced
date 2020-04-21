<!-- 
  UI to read and write a style attribute of an IMSC document
-->
<template>
  <div>
    <DropDownGeneric
      v-if="type == 'drop'"
      :options="filteredOptions"
      :selected="currentValue"
      :labelName="getLabelText(name)"
      :labelWeight="labelWeight"
      @valueChanged="setNewValue"
      @gotFocus="focusBubble"
    />

    <RadioGeneric
      v-else-if="type == 'radio'"
      :options="filteredOptions"
      :selected="currentValue"
      :labelName="getLabelText(name)"
      :labelWeight="labelWeight"
      @valueChanged="setNewValue"
      @gotFocus="focusBubble"
    />

    <InputGeneric
      v-else-if="isInput()"
      :value="currentValue"
      :labelName="getLabelText(name)"
      :labelWeight="labelWeight"
      :type="getInputType()"
      @valueChanged="setNewValue"
      @gotFocus="focusBubble"
    />
  </div>
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
      type: String | Function, 
      required: false
    },

    name: {
      type: String,
      required: true
    },

    labelWeight: {
      type: String,
      default: "normal"
    },

    setter: {
      type: String | Function,
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
      if (!valueEntry) {
        console.log("no value for " + this.name);
        return;
      }
      if (!valueEntry.hasOwnProperty("value")) {
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
      if (
        typeof value !== "string" &&
        typeof value !== "number" &&
        typeof value !== "boolean"
      ) {
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
      "uiLayout",
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
    // expected values of this.type: 'simple' or 'simple-type'
    // where 'type' is html input type (e.g. color, button, date etc.)
    // e.g. 'simple-color' for color picker
    getInputType() {
      let type = this.type.split("-").pop();
      if (type == "simple") {
        type = "text";
      }
      return type;
    },
    getLabelText(name) {
      return this.uiData.getLabel(name, this.lang);
    },
    isInput() {
      return this.type.substring(0, 6) == "simple";
    },
    setNewValue(newValue) {
      try {
        if (this.setter) {
          if (typeof this.getter === "function") {
            newValue = this.setter(newValue);
          } else if (typeof this.getter === "string") {
            newValue = this.helper[this.setter](newValue);
          }
        }
        if (newValue) {
          this.styleData.setAttr(this.name, this.styles, newValue);
          this.updateSubtitlePlane({ time: this.playTime });
        }
      } catch (e) {
        // TODO: highlight inputs with invalid values
      }
    },
    ...mapActions(["updateSubtitlePlane"])
  }
};
</script>
