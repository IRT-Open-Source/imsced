<template>
  <div class="top-bar">
    <b-navbar type="dark" variant="faded" class="custom-navbar">
      <b-navbar-brand>imscED</b-navbar-brand>
      <b-navbar-nav class="mr-2 ml-4">
        <b-nav-form class="custom-form">
          <!-- Select video file  -->
          <CustomFileChooser
            :name="'choosevideo1'"
            :id="'vc1'"
            :labelText="getLabelText('video')"
            @filechange="changevideofile"
          />
        </b-nav-form>
      </b-navbar-nav>

      <b-navbar-nav>
        <b-nav-item-dropdown
          class="custom-item"
          :text="getLabelText('subtitles')"
          left
        >
          <b-dropdown-item-button>
            <!-- Select subtitle file with imsc format-->
            <CustomFileChooser
              :loader="true"
              :name="'chooseSubtitle1'"
              :id="'sc1'"
              :labelText="getLabelText('load') + ' (IMSC)'"
              :getText="true"
              @filechange="changeSubs"
              @textSent="newSubs"
            />
          </b-dropdown-item-button>
          <b-dropdown-item-button v-if="showScfService == 'show'">
            <!-- Select subtitle file with imsc format-->
            <ScfService
              :name="'importSubtitle1'"
              :id="'is1'"
              :labelText="getLabelText('importStl')"
              :getText="true"
              @textSent="newSubs"
            />
          </b-dropdown-item-button>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav v-if="activateBurnIn">
        <b-nav-item-dropdown text="Services" left class="custom-item">
          <b-dropdown-item-button @click="toggleShowBurnIn">
            {{ getLabelText("burnInService") }}</b-dropdown-item-button
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown text="Save" left class="custom-item">
          <!-- Export IMSC as XML  -->
          <b-dropdown-item-button @click.native="saveXml">
            {{ getLabelText("saveXml") }}
          </b-dropdown-item-button>
          <!-- Export ISD as PNG  -->
          <b-dropdown-item-button @click.native="saveIsdAsPng">
            {{ getLabelText("saveIsdAsPng") }}
          </b-dropdown-item-button>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="">
        <b-nav-form>
          <ButtonGeneric
            :buttonName="configUiButtonName"
            @click.native="toggleShowConfigUi"
          />
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import ButtonGeneric from "../ButtonGeneric.vue";
import CustomFileChooser from "./../CustomFileChooser.vue";
import FileChooserGeneric from "./../FileChooserGeneric.vue";
import ImscData from "./../../modules/imscdata.js";
import ImscExport from "../../modules/imscExport.js";
import IsdExport from "../../modules/isdExport.js";
import ScfService from "../../editorComponents/ScfService.vue";
import { saveAs } from "file-saver";

export default {
  components: {
    ButtonGeneric,
    CustomFileChooser,
    FileChooserGeneric,
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
      this.changeVideo({ fileUrl: file.URL });
      //equivalent to
      //this.$store.commit('changeVideo', file.URL);
    },
    getLabelText(name) {
      return this.uiData.getLabel(name, this.lang);
    },
    initSubs: function(subtitleText) {
      var dataItem = new ImscData(subtitleText);
      //dataItem.initParaHash();
      dataItem.initData();
      dataItem.initRegionHash();
      this.addSubtitleData({ imscData: dataItem }); //add to list
      this.setSubtitleData({ imscData: dataItem }); //set current
      this.setLoadingST(false);
    },
    newSubs: function(subtitleText) {
      this.initSubs(subtitleText);
      this.addVideoTextTrack(); //generatate track
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
        .then(content => {
          let fname = `${this.subsFileName}.zip`;
          saveAs(content, fname);
        })
        .catch(reason => {
          console.log(
            "an error occured while saving subtitles as png:",
            reason
          );
        });
    },
    saveXml: function() {
      let p1 = new Promise(r => {
        let imscXml = new ImscExport(this.currentSubtitleData.tt);
        imscXml.iterateData();
        let serializer = new XMLSerializer();
        let xmlString = serializer.serializeToString(imscXml.doc);
        r(
          new Blob([xmlString], {
            type: "text/xml"
          })
        );
      });
      p1.then(v => saveAs(v, "imsc2.xml"));
    },
    ...mapMutations([
      "addSubtitleData",
      "changeVideo",
      "setLoadingST",
      "setSubsFileName",
      "setSubtitleData",
      "toggleShowBurnIn",
      "toggleShowConfigUi"
    ]),
    ...mapActions([
      "addVideoTextTrack",
      "resetFocusContent",
      "updateSubtitlePlanePlayTime"
    ])
  }
};
</script>

<style lang="scss" scoped>
* /deep/ {
  @import "~bootstrap/dist/css/bootstrap.min";
}
* /deep/.custom-item .nav-link {
  color: rgba(255, 255, 255, 0.75) !important;
}
* /deep/.custom-item .nav-link:hover {
  color: rgba(255, 255, 255, 1) !important;
}
.custom-form label {
  color: rgba(255, 255, 255, 0.75) !important;
}
.custom-form label:hover {
  color: rgba(255, 255, 255, 1) !important;
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
  background-color: lightslategray;
  //background-color: #00519e;
}
</style>
