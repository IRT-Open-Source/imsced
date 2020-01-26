<!-- Simple select form element  -->
<template>
  <DropDownGenericPlain
    v-if="uiLayout == 'plain'"
    :dropKey="dropKey"
    :labelName="labelName"
    :options="options"
    :selected="selected"
    @gotFocus="focusBubble"
    @valueChanged="changedValue"
  />
  <DropDownGenericBS
    v-else
    :dropKey="dropKey"
    :labelName="labelName"
    :labelWeight="labelWeight"
    :options="options"
    :selected="selected"
    @gotFocus="focusBubble"
    @valueChanged="changedValue"
  />
  <!--<div>
    <label
      >{{ labelName }}
      <select @change="changedValue" @focus="focusBubble">
        <option
          v-for="option in options"
          :key="option"
          :selected="option == selected ? true : false"
        >
          {{ option }}
        </option>
      </select>
    </label>
  </div>-->
</template>

<script>
import DropDownGenericPlain from "./plainComponents/DropDownGenericPlain.vue";
import DropDownGenericBS from "./bootstrapComponents/DropDownGenericBS.vue";
import { mapState } from "vuex";
export default {
  components: {
    DropDownGenericPlain,
    DropDownGenericBS
  },
  props: {
    //Sometimes needed for reactivly
    //updating the list of selection options
    dropKey: {
      type: Number,
      required: false
    },
    labelName: {
      type: String,
      required: true
    },
    labelWeight: {
      type: String,
      default: 'bold'
    },    
    options: {
      type: Array,
      required: true
    },
    selected: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(["uiLayout"])
  },
  methods: {
    changedValue(val) {
      this.$emit("valueChanged", val);
    },
    focusBubble() {
      this.$emit("gotFocus");
    }
  }
};
</script>