<!-- Select file and pass on fileObj and (if needed) parsed text -->
<template>
  <label class="file-select">
    <span v-if="icon" :title="labelText"
      ><font-awesome-icon
        v-b-tooltip.hover
        :icon="icon"
        :size="size"
        :style="iconStyle"
      >
      </font-awesome-icon
    ></span>
    <span v-else>{{ labelText }}</span>
    <input
      type="file"
      :name="name"
      :id="id"
      :accept="accept"
      @change="fileChanged"
    />
  </label>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  components: {},
  props: {
    getText: {
      type: Boolean,
      required: false
    },
    iconStyle: {
      type: Object,
      default: () => ({ color: "rgba(255, 255, 255, 0.75)" })
    },
    id: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: "lg"
    },
    labelText: {
      type: String,
      required: true
    },
    loader: {
      type: Boolean,
      default: false,
      required: false
    },
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false
    },
    accept: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState(["uiLayout"])
  },
  methods: {
    fileChanged: function(e) {
      if (this.loader) {
        this.setLoadingST(true);
      }
      var files = e.target.files;
      var fileObj = files[0];
      //URL is often need for src attribute
      var fileURL = URL.createObjectURL(fileObj);
      var file = {
        obj: fileObj,
        URL: fileURL
      };
      this.$emit("filechange", file);
      //Sometimes text of file need to be sent
      if (this.getText === true) {
        this.sendText(fileObj);
      }
      e.target.value = "";
    },
    sendText: function(fileObj) {
      //Using standard file reader API
      var reader = new FileReader();
      reader.onload = (e) => {
        var text = e.target.result;
        this.$emit("textSent", text);
      };
      reader.readAsText(fileObj);
    },
    ...mapMutations(["setLoadingST"])
  }
};
</script>

<style scoped>
.file-select {
  width: 100%;
  cursor: pointer;
  margin: 0;
  padding: 0.25rem 0;
  color: inherit;
}

.file-select input[type="file"] {
  display: none !important;
}
</style>
