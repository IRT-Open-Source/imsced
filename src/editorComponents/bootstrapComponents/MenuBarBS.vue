<template>
  <div id="menu-bar" class="top-bar">
    <b-navbar type="dark" variant="faded" class="custom-navbar">
      <b-navbar-brand class="custom-brand">imscED</b-navbar-brand>
      <b-navbar-nav class="mr-2 ml-4 first-element">
        <b-nav-item-dropdown
          class="custom-item"
          :text="getLabelText('video')"
          left
        >
          <template slot="button-content">
            <font-awesome-icon
              v-b-tooltip.hover
              :title="getLabelText('video')"
              icon="photo-video"
              size="lg"
              :style="{ color: 'rgba(255, 255, 255, 0.75)' }"
            >
            </font-awesome-icon>
          </template>

          <b-dropdown-item-button>
            <!-- Select video file  -->
            <CustomFileChooser
              name="choosevideo1"
              id="vc1"
              :labelText="getLabelText('loadVideo')"
              @filechange="changevideofile"
            />
          </b-dropdown-item-button>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="mr-2">
        <b-nav-item-dropdown
          class="custom-item"
          :text="getLabelText('subtitles')"
          left
        >
          <template slot="button-content">
            <font-awesome-icon
              v-b-tooltip.hover
              :title="getLabelText('subtitles')"
              icon="closed-captioning"
              size="lg"
              :style="{ color: 'rgba(255, 255, 255, 0.75)' }"
            >
            </font-awesome-icon>
          </template>

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
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item-button :disabled="showScfService == 'hide'">
            <!-- Select subtitle file with imsc format-->
            <ScfService
              :id="'importSTLMenuBS'"
              :labelText="getLabelText('importStl')"
              :importFormatProp="'stl'"
              @textSent="newSubs"
            />
          </b-dropdown-item-button>
          <b-dropdown-item-button :disabled="showScfService == 'hide'">
            <!-- Select subtitle file with imsc format-->
            <ScfService
              :id="'importSRTMenuBS'"
              :labelText="getLabelText('importSrt')"
              :importFormatProp="'srt'"
              :exportFormatProp="'ttml'"
              @textSent="newSubs"
            />
          </b-dropdown-item-button>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav>
        <b-nav-item-dropdown left class="custom-item" text="serives">
          <template slot="button-content">
            <font-awesome-icon
              v-b-tooltip.hover
              title="Services"
              icon="toolbox"
              size="lg"
              :style="{ color: 'rgba(255, 255, 255, 0.75)' }"
            >
            </font-awesome-icon>
          </template>
          <span id="burnin-tooltip" class="d-inline-block" tabindex="0">
            <b-tooltip
              target="burnin-tooltip"
              triggers="hover"
              container="menu-bar"
            >
              {{ burnInTooltipText }}
            </b-tooltip>
            <b-dropdown-item-button
              :disabled="!activateBurnIn"
              @click="toggleShowBurnIn"
            >
              {{ getLabelText("burnInService") }}
            </b-dropdown-item-button>
          </span>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto mr-2">
        <b-nav-item-dropdown text="Save/Export" right class="custom-item">
          <template slot="button-content">
            <font-awesome-icon
              v-b-tooltip.hover
              title="Save/Export"
              icon="save"
              size="lg"
              :style="{ color: 'rgba(255, 255, 255, 0.75)' }"
            >
            </font-awesome-icon>
          </template>
          <!-- Export IMSC as XML  -->
          <b-dropdown-item-button @click.native="saveXml">
            {{ getLabelText("saveXml") }}
          </b-dropdown-item-button>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav>
        <b-nav-form class="custom-form">
          <ButtonGeneric
            :buttonName="configUiButtonName"
            :icon="'cog'"
            @click.native="toggleShowConfigUi"
          >
          </ButtonGeneric>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import ButtonGeneric from "../ButtonGeneric.vue";
import CustomFileChooser from "./../CustomFileChooser.vue";
import ImscData from "./../../modules/imscdata.js";
import IsdExport from "../../modules/isdExport.js";
import ScfService from "../../editorComponents/ScfService.vue";
import { saveAs } from "file-saver";

export default {
  components: {
    ButtonGeneric,
    CustomFileChooser,
    ScfService
  },
  computed: {
    burnInTooltipText() {
      if (!this.activateBurnIn) {
        return "Burn-in Service is deactivated. You can activate the Service in Settings > Services > Burn-In Service if you are sure you can access the service.";
      }
      return "";
    },
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
      "setLoadingST",
      "setSubsFileName",
      "setSubtitleData",
      "toggleShowBurnIn",
      "toggleShowConfigUi"
    ]),
    ...mapActions([
      "addVideoTextTrack",
      "resetFocusContent",
      "saveAsXml",
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
* /deep/.custom-item .nav-link:hover,
*/deep/.custom-item .nav-link:hover > * {
  color: rgba(255, 255, 255, 1) !important;
}
.custom-form label {
  color: rgba(255, 255, 255, 0.75) !important;
}
.custom-form label:hover,
*/deep/.custom-form label:hover span > *,
*/deep/.custom-form span:hover > * {
  color: rgba(255, 255, 255, 1) !important;
}
.custom-navbar {
  margin: 0 5vw;
  padding: 0.5rem 0;
}
.custom-brand {
  background-color: rgb(130, 147, 165);
  position: absolute;
  padding-top: 0.6em;
  padding-left: 0.5em;
  padding-right: 0.5em;
  top: 0;
  bottom: 0;
}
.first-element {
  margin-left: 6.5em !important;
}

.my-tooltip-class {
  color: green;
}

.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: lightslategray;
}
</style>
