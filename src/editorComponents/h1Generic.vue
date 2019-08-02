<template>
  <h1GenericPlain v-if="uiLayout == 'plain'" :text="text"/>
  <h1GenericBS v-else :text="text"/>
</template>

<script>
import { mapState } from "vuex";
import h1GenericPlain from "./plainComponents/h1GenericPlain.vue";
import h1GenericBS from "./bootstrapComponents/h1GenericPlainBS.vue";

export default {
    components: {
        h1GenericBS,
        h1GenericPlain
    },
    props: {
        text: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapState(["uiLayout"])
    }
}
</script>