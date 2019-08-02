<!-- Simple UI component for radio buttons  -->
<template>
  <fieldset>
    <legend>{{ labelName }}</legend>
    <span v-for="option in options" :key="option">
      <input
        type="radio"
        :value="option"
        :checked="option == selected ? true : false"
        :name="nameOfSet"
        @change="changedValue"
        @focus="focusBubble"
      />
      <label for="option">{{ option }}</label>
    </span>
  </fieldset>
</template>

<script>
import helperGeneric from "../../modules/helperGeneric.js";
import { mapState } from "vuex";

export default {
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
    }
  },
  computed: {
    //unique name for group of radio buttons
    nameOfSet: function() {
      var helper = new helperGeneric();
      return helper.uuidv4();
    },
    ...mapState(["uiLayout"])
  },
  methods: {
    changedValue: function(e) {
      this.$emit("valueChanged", e.target.value);
    },
    focusBubble() {
      this.$emit("gotFocus");
    }
  }
};
</script>