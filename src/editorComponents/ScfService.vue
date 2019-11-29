<template>
  <div>
    <FileChooserGenericPlain
      v-if="uiLayout == 'plain'"
      :name="name"
      :id="id"
      :labelText="labelText"
      @valueChanged="fileChanged"
    />

    <FileChooserGenericBS
      v-else
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

    name: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(["scfData", "scfExportFormat", "scfImportFormat", "uiLayout"])
  },
  methods: {
    fileChanged: function(e) {
      this.setLoadingST(true);
      var files = e.target.files;
      var fileObj = files[0];
      var thisContext = this;
      const formData = new FormData();
      formData.append("input", fileObj);
      formData.append("format_source", this.scfImportFormat);
      formData.append("format_target", this.scfExportFormat);
      fetch(this.scfData.url, {
        method: "POST",
        body: formData
      })
        .then(function(response) {
          if (!response.ok) {
            throw new Error(
              "Couldn't import file! Please check if 'Original format' is set correctly and you chose a valid file."
            );
          }
          return response.text();
        })
        .then(data => {
          thisContext.$emit("textSent", data);
        })
        .catch(error => {
          this.setLoadingST(false);
          alert(
            "Something went wrong while communicating with the conversion service. " +
              error
          );
        });
    },
    ...mapMutations(["setLoadingST"])
  }
};
</script>