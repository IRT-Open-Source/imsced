<!-- Select file and pass on fileObj and (if needed) parsed text -->
<template>
  <div>
    <label :for="id">
      {{ labelText }}
      <input
        type="file"
        :id="id"
        :name="name"
        :accept="accept"
        @change="changedValue($event)"
      />
    </label>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },

    labelText: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    accept: {
      type: String,
      default: ""
    }
  },
  methods: {
    changedValue(e) {
      this.$emit("valueChanged", e);
    }
  }
};
</script>
