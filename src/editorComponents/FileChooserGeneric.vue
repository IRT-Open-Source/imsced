<!-- Select file and pass on fileObj and (if needed) parsed text -->
<template>
  <div>
    <FileChooserGenericPlain
      v-if="uiLayout == 'plain'"
      :accept="accept"
      :name="name"
      :id="id"
      :labelText="labelText"
      @valueChanged="fileChanged"
    />

    <FileChooserGenericBS
      v-else
      :accept="accept"
      :id="id"
      :name="name"
      :labelText="labelText"
      @valueChanged="fileChanged"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import FileChooserGenericBS from "./bootstrapComponents/FileChooserGenericBS.vue";
import FileChooserGenericPlain from "./plainComponents/FileChooserGenericPlain.vue";

export default {
  components: { FileChooserGenericBS, FileChooserGenericPlain },
  props: {
    getText: {
      type: Boolean,
      required: false
    },

    id: {
      type: String,
      required: true
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
    },
    sendText: function(fileObj) {
      //Using standard file reader API
      var reader = new FileReader();
      reader.onload = e => {
        var text = e.target.result;
        this.$emit("textSent", text);
      };
      reader.readAsText(fileObj);
    },
    ...mapMutations(["setLoadingST"])
  }
};
</script>