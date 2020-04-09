<template>
  <label class="file-select">
    <span>{{ labelText }}</span>
    <input type="file" :id="id" @change="fileChanged" />
  </label>
</template>

<script>
import { mapState, mapMutations } from "vuex";

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
    importFormatProp: {
      type: String
    },
    exportFormatProp: {
      type: String
    }
  },
  computed: {
    importFormat() {
      return this.importFormatProp
        ? this.importFormatProp
        : this.scfImportFormat;
    },
    exportFormat() {
      return this.exportFormatProp
        ? this.exportFormatProp
        : this.scfExportFormat;
    },
    ...mapState([
      "config",
      "scfData",
      "scfExportFormat",
      "scfImportFormat",
      "srtImportLang",
      "srtImportTemplate",
      "uiLayout"
    ])
  },
  methods: {
    fileChanged: function(e) {
      this.setLoadingST(true);
      var files = e.target.files;
      var fileObj = files[0];
      var thisContext = this;
      const formData = new FormData();
      formData.append("input", fileObj);
      formData.append("format_source", this.importFormat);
      formData.append("format_target", this.exportFormat);
      // ---------- STL specific parameters------
      if (this.importFormat == "stl") {
        formData.append("offset_frames", this.config.defaultOffsetFrames);
        formData.append("ignore_manual_offset_for_tcp", "1");
        // ---------- SRT specific parameters------
      } else if (this.importFormat == "srt") {
        formData.append("template", this.srtImportTemplate);
        if (this.srtImportLang != "original (template)") {
          formData.append("lang", this.srtImportLang);
        }
      }
      fetch(this.scfData.endpoints.convert, {
        method: "POST",
        body: formData
      })
        .then(function(response) {
          if (!response.ok) {
            console.log(response);
            throw new Error(
              "Couldn't import file! Please check if 'Original format' is set correctly and you chose a valid file."
            );
          }
          return response.text();
        })
        .then((data) => {
          thisContext.$emit("textSent", data);
          this.setSubsFileName(fileObj.name);
        })
        .catch((error) => {
          this.setLoadingST(false);
          alert(
            "Something went wrong while communicating with the conversion service. " +
              error
          );
        });
    },
    ...mapMutations(["setLoadingST", "setSubsFileName"])
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
