<!-- Simple select form element  -->
<template>
  <div>
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
  </div>
</template>

<script>
export default {
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
    options: {
      type: Array,
      required: true
    },
    selected: {
      type: String,
      required: true
    }
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
