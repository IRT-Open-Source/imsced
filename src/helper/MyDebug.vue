<!-- Debug Components to log or test abritary methods -->
<template>
  <div id="testingComponent">
    <h2>Testing</h2>
    <ButtonGeneric :buttonName="name1" @click.native="test1" />

    <ButtonGeneric :buttonName="name2" @click.native="test2" />

    <ButtonGeneric :buttonName="name3" @click.native="test3" />
  </div>
</template>

<script>
import ButtonGeneric from "../editorComponents/ButtonGeneric.vue";

export default {
  components: {
    ButtonGeneric
  },
  props: {
    name1: {
      type: String,
      required: false,
      default: "Button 1"
    },

    name2: {
      type: String,
      required: false,
      default: "Button 2"
    },

    name3: {
      type: String,
      required: false,
      default: "Button 3"
    }
  },
  methods: {
    test1() {
      this.$emit("clickOnButton1");
    },
    test2() {
      this.$emit("clickOnButton2");
    },
    test3() {
      this.$emit("clickOnButton3");
    }
  }
};
</script>
