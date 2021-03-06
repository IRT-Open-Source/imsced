<template>
  <div class="top-bar">
    <div class="custom-navbar">
      <!-- Select video file  -->
      <CustomFileChooser
        class="menu-element"
        :name="'choosevideo1'"
        :id="'vc1'"
        :labelText="getLabelText('video')"
        @filechange="changevideofile"
      />
      <CustomFileChooser
        class="menu-element"
        :loader="true"
        :name="'chooseSubtitle1'"
        :id="'sc1'"
        :labelText="getLabelText('load') + ' (IMSC)'"
        :getText="true"
        @filechange="changeSubs"
        @textSent="newSubs"
      />
      <ScfService
        class="menu-element"
        v-if="showScfService == 'show'"
        :id="'importStlMenuBar'"
        :labelText="getLabelText('importStl')"
        :importFormatProp="'stl'"
        @textSent="newSubs"
      />
      <ScfService
        class="menu-element"
        v-if="showScfService == 'show'"
        :id="'importSrtMenuBar'"
        :labelText="getLabelText('importSrt')"
        :importFormatProp="'srt'"
        :exportFormatProp="'ttml'"
        @textSent="newSubs"
      />
      <button @click="saveXml" class="menu-element">
        {{ getLabelText("saveXml") }}
      </button>
      <button
        v-if="activateBurnIn"
        @click="toggleShowBurnIn"
        class="menu-element"
      >
        {{ getLabelText("burnInService") }}
      </button>
      <button @click="toggleShowConfigUi" class="menu-element right">
        {{ configUiButtonName }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import CustomFileChooser from "./../CustomFileChooser.vue";
import ImscData from "./../../modules/imscdata.js";
import IsdExport from "../../modules/isdExport.js";
import ScfService from "../../editorComponents/ScfService.vue";
import { saveAs } from "file-saver";

export default {
  components: {
    CustomFileChooser,
    ScfService
  },
  computed: {
    configUiButtonName() {
      var name = this.showConfigUi ? "hideConfigUi" : "showConfigUi";
      return this.getLabelText(name);
    },
    ...mapState([
      "activateBurnIn",
      "config",
      "currentSubtitleData",
      "debug",
      "lang",
      "showConfigUi",
      "showScfService",
      "subsFileName",
      "uiData"
    ])
  },
  methods: {
    changeSubs: function(file) {
      this.setSubsFileName(file.obj.name);
    },
    changevideofile: function(file) {
      this.changeVideo(file);
      //equivalent to
      //this.$store.commit('changeVideo', file.URL);
    },
    getLabelText(name) {
      return this.uiData.getLabel(name, this.lang);
    },
    initSubs: function(subtitleText) {
      var dataItem = new ImscData(subtitleText);
      dataItem.initData();
      dataItem.initRegionHash();
      this.addSubtitleData({ imscData: dataItem }); //add to list
      this.setSubtitleData({ imscData: dataItem }); //set current
      this.setLoadingST(false);
    },
    newSubs: function(subtitleText) {
      this.initSubs(subtitleText);
      this.resetTextTrack();
      this.updateSubtitlePlanePlayTime();
      this.resetFocusContent();
      if (this.debug) {
        window.imscdata = this.currentSubtitleData;
      }
    },
    saveIsdAsPng: function() {
      let isdExport = new IsdExport(this.currentSubtitleData.tt);
      isdExport
        .saveAsPng(this.config.defaultImageExportSize)
        .then((content) => {
          let fname = `${this.subsFileName}.zip`;
          saveAs(content, fname);
        })
        .catch((reason) => {
          console.log(
            "an error occured while saving subtitles as png:",
            reason
          );
        });
    },
    saveXml: function() {
      this.saveAsXml().then((v) => saveAs(v, "imsc2.xml"));
    },
    ...mapMutations([
      "addSubtitleData",
      "changeVideo",
      "resetTextTrack",
      "setLoadingST",
      "setSubsFileName",
      "setSubtitleData",
      "toggleShowBurnIn",
      "toggleShowConfigUi"
    ]),
    ...mapActions([
      "resetFocusContent",
      "saveAsXml",
      "updateSubtitlePlanePlayTime"
    ])
  }
};
</script>

<style scoped>
.menu-element {
  color: white;
  margin-right: 1rem;
  background-color: #00519e;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: inherit;
}
.menu-element.file-select {
  width: auto !important;
}
.custom-navbar {
  margin: 0 5vw;
  padding: 0.5rem 0;
}
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.25rem 0;
  height: 3rem;
  background-color: #00519e;
}
.right {
  float: right;
}
</style>
