<!-- Simple select form element  -->
<template>
  <div>
    <div class="attr-label">
      <b>{{ labelName }}</b>
    </div>
    <b-form-select
      class="mt-1"
      v-model="selected"
      :options="options"
      @change.native="changedValue"
      @focus.native="focusBubble"
    ></b-form-select>
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

