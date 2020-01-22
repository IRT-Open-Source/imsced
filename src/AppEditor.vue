<template>
  <div id="app">
    <!-- Navbar/Header -->
    <MenuBar />

    <Config v-if="showConfigUi" />

    <BurnIn v-if="showBurnIn" />

    <!-- Debug button set to test abritary methods  -->
    <MyDebug
      v-if="debug"
      :name1="'Test &  Log'"
      :name2="'Remove Subtitle from Display'"
      :name3="'This is a test button'"
      @clickOnButton1="testLog"
      @clickOnButton2="removeSub"
      @clickOnButton3="saveXml"
    />

    <!-- All styles that apply to <body> -->
    <div
      v-if="
        uiLayout == 'plain' &&
          body &&
          showBodyMenu === 'show' &&
          helper.objectHasEntries(body.styleAttrs)
      "
    >
      <h3 class="styleMenuHeading">BODY Styles</h3>
      <MenuStyle
        :styles="body.styleAttrs"
        :contentKind="'body'"
        class="bodyMenu"
      />
    </div>

    <!-- All Styles that apply to <div> -->
    <div
      v-if="
        uiLayout == 'plain' &&
          activeDiv &&
          showDivMenu === 'show' &&
          helper.objectHasEntries(activeDiv.styleAttrs)
      "
    >
      <h3 class="styleMenuHeading">DIV Styles</h3>
      <MenuStyle
        :styles="activeDiv.styleAttrs"
        :contentKind="'p'"
        class="divMenu"
      />
    </div>

    <!-- 
      Styles from region that are referenced by current subtitle
      and otpions to create new region/reference another region 
    -->
    <div
      class="regionMenu"
      v-if="
        uiLayout == 'plain' &&
          showRegionSelect === 'show' &&
          activeP &&
          activeP.regionID
      "
    >
      <h3 class="styleMenuHeading">REGION Styles</h3>
      <DropDownGeneric
        :options="myRegionIds"
        :selected="activeRegionId"
        :labelName="getLabelText('selectRegion')"
        :dropKey="myDropKey"
        @valueChanged="setNewRegion"
        class="regionMenu"
      />
      <ButtonGeneric
        :buttonName="getLabelText('addRegion')"
        @click.native="addNewRegion"
      />
      <div
        v-if="
          showRegionMenu === 'show' && helper.objectHasEntries(regionStyles)
        "
      >
        <MenuStyle
          :styles="regionStyles"
          :contentKind="'region'"
          class="regionMenu"
        />
      </div>
    </div>
    <!-- Styles for <p>  -->
    <div v-if="uiLayout == 'plain' && activeP && showPMenu === 'show'">
      <h3 class="styleMenuHeading">P Styles</h3>
      <MenuStyle
        :styles="activeP.styleAttrs"
        :contentKind="'p'"
        class="pMenu"
      />
    </div>
    <!-- Styles for <span> -->
    <div v-if="uiLayout == 'plain' && activeSpan && showSpanMenu === 'show'">
      <h3 class="styleMenuHeading">SPAN Styles</h3>
      <MenuStyle
        :styles="activeSpan.styleAttrs"
        :contentKind="'span'"
        class="spanMenu"
      />
    </div>

    <!-- Show menu depending on menustyle -->
    <!-- <MenuGeneric v-if="uiLayout == 'bootstrap' && showMenu" class="mt-2" /> -->

    <!-- Loader in case ST take some time to load -->
    <div v-if="loadingST">
      <div class="loader"></div>
      <div class="loaderText">
        <p>{{ getLabelText("loaderText") }}</p>
      </div>
    </div>

    <div v-if="debug">
      <p>ID of active p element</p>
      <p v-if="activeP">{{ activeP.editorId }}</p>
    </div>

    <div id="workview">
      <div id="subtitleListView" :style="subtitleListViewStyle">
        <ContentImsc :content="body" v-if="body" />
      </div>

      <div class="captionWithButtons videoCol">
        <div>
          <font-awesome-icon icon="photo-video" :style="{ color: 'grey' }">
          </font-awesome-icon>
          {{ getMovieName }}
        </div>
        <div>
          <ButtonGeneric
            :buttonName="fullScreenButtonName"
            icon="expand"
            :iconStyle="{ color: 'grey' }"
            @click.native="toggleFullScreenMode"
          />
        </div>
      </div>
      <div class="captionWithButtons">
        <div>
          <font-awesome-icon
            icon="closed-captioning"
            :style="{ color: 'grey' }"
            size="lg"
          >
          </font-awesome-icon>
          {{ getLabelText("noFileLoaded") }}
        </div>
        <div v-if="showMenu">
          <ButtonGeneric
            :buttonName="getLabelText('style')"
            :variant="getEditorToggleStyle('style')"
            @click.native="setEditorState('style')"
          >
          </ButtonGeneric>
          <ButtonGeneric
            :buttonName="getLabelText('position')"
            :variant="getEditorToggleStyle('position')"
            @click.native="setEditorState('position')"
          >
          </ButtonGeneric>
        </div>
      </div>
      <div id="editArea" ref="editArea">
        <!-- Video to be displayed -->
        <div
          id="fullScreenContainer"
          @fullscreenchange="handleFullscreenChange"
        >
          <!-- <LiveActionsMenu /> -->
          <VideoGeneric
            :containerid="config.defaultVideo.containerId"
            :id="config.defaultVideo.videoId"
            :src="movieSrc"
            :autobuffer="config.defaultVideo.autobuffer"
            :controls="config.defaultVideo.videoControls"
            @videoLoaded="processAfterVideoLoaded"
            @videoPlays="processWhenVideoPlays"
          />
          <!-- Container where imscjs render subtitles -->
          <div id="renderDiv"></div>
          <DragFeature v-if="dragFeatureActive" />
          <ResizeFeature v-if="resizeFeatureActive" />
        </div>
        <div>
          <!-- Playtime in 00:00:00.000 format -->
          <p>Playtime: {{ getPlaytimeAsVttTime() }}</p>
        </div>
        <div>
          <!-- Show menu depending on menustyle -->
          <MenuGeneric
            v-if="uiLayout == 'bootstrap' && showMenu"
            class="mt-2"
            :state="editorState"
          />
        </div>
      </div>
    </div>

    <br />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import BurnIn from "./editorComponents/BurnIn.vue";
import ButtonGeneric from "./editorComponents/ButtonGeneric.vue";
import Config from "./editorComponents/Config.vue";
import DragFeature from "./editorComponents/DragFeature.vue";
import ContentImsc from "./editorComponents/ContentImsc.vue";
import DropDownGeneric from "./editorComponents/DropDownGeneric.vue";
import h1Generic from "./editorComponents/h1Generic.vue";
import ImscData from "./modules/imscdata.js";
import ImscExport from "./modules/imscExport.js";
import LiveActionsMenu from "./editorComponents/LiveActionsMenu.vue";
import MenuBar from "./editorComponents/MenuBar.vue";
import MenuGeneric from "./editorComponents/MenuGeneric.vue";
import MenuStyle from "./editorComponents/MenuStyle.vue";
import MyRegion from "./modules/myRegion.js";
import MyDebug from "./helper/MyDebug.vue";
import RadioGeneric from "./editorComponents/RadioGeneric.vue";
import ResizeFeature from "./editorComponents/ResizeFeature.vue";
import VideoGeneric from "./mediaComponents/VideoGeneric.vue";
import { saveAs } from "file-saver";

export default {
  name: "app",
  components: {
    BurnIn,
    ButtonGeneric,
    Config,
    ContentImsc,
    DragFeature,
    DropDownGeneric,
    h1Generic,
    LiveActionsMenu,
    MenuGeneric,
    MenuStyle,
    MyDebug,
    MenuBar,
    RadioGeneric,
    ResizeFeature,
    VideoGeneric
  },
  data() {
    return {
      maxHeight: 0,
      movieName: "",
      editorState: "style",
      myDropKey: 0,
      videoIsLoaded: false
    };
  },
  updated: function() {
    this.$nextTick(function() {
      if (this.$refs.editArea.clientHeight > this.maxHeight) {
        this.maxHeight = this.$refs.editArea.clientHeight;
      }
    });
  },
  computed: {
    configUiButtonName() {
      var name = this.showConfigUi ? "hideConfigUi" : "showConfigUi";
      return this.getLabelText(name);
    },
    editorToggle() {
      return [
        { caption: this.getLabelText("style") },
        { caption: this.getLabelText("position") }
      ];
    },
    fullScreenButtonName() {
      var name = this.fullScreenActive
        ? "disableFullScreen"
        : "enableFullScreen";
      return this.uiData.getLabel(name, this.lang);
    },
    getMovieName() {
      var name = this.movieName;
      if (name == "") {
        name = this.movieSrc.split("/").pop();
      }
      return name;
    },
    uiLayout: {
      get() {
        return this.$store.state.uiLayout;
      },
      set(val) {
        this.$store.commit("setuiLayout", val);
      }
    },
    myRegionIds: {
      cache: false,
      get: function() {
        return Object.keys(this.currentSubtitleData.regionHash);
      }
    },
    dragFeatureActive() {
      return this.activeP && this.draggingActive;
    },
    resizeFeatureActive() {
      return this.activeP && this.resizingActive;
    },
    subtitleListViewStyle() {
      return { maxHeight: this.maxHeight + "px" };
    },
    showMenu() {
      return (
        this.activeP || this.activeSpan || this.activeDiv
        //|| (this.body && this.helper.objectHasEntries(this.body.styleAttrs)) // TODO
      );
    },
    ...mapState([
      "activateBurnIn",
      "activeP",
      "activeSpan",
      "config",
      "custom",
      "currentSubtitleData",
      "debug",
      "draggingActive",
      "forcedOnly",
      "helper",
      "menuStyleConfig",
      "menuStyle",
      "lang",
      "loadingST",
      "movieSrc",
      "playTime",
      "resizingActive",
      "showRegionMenu",
      "showBurnIn",
      "showBodyMenu",
      "showConfigUi",
      "showDivMenu",
      "showPMenu",
      "showRegionSelect",
      "showSpanMenu",
      "subsFileName",
      "uiData",
      "uiLayout"
    ]),
    ...mapGetters([
      "activeDiv",
      "activeRegionId",
      "body",
      "regionStyles",
      "renderDivDom",
      "subsDivDom",
      "videoDom"
    ])
  },
  //Init Dummy subs on first load
  created: function() {
    this.initSubs(
      "<tt\
        xmlns='http://www.w3.org/ns/ttml' \
        xml:lang='en' \
        xmlns:tts='http://www.w3.org/ns/ttml#styling'\
        xmlns:itts='http://www.w3.org/ns/ttml/profile/imsc1#styling'>\
         <head>\
           <layout>\
              <region xml:id='r1'\
               tts:origin='10% 10%'\
               tts:extent='80% 40%'\
               tts:displayAlign='before' \
               tts:writingMode='lrtb'\
               tts:showBackground='whenActive'\
               tts:backgroundColor='transparent'\
               tts:opacity='1'/>\
              <region xml:id='r2'\
               tts:origin='10% 50%'\
               tts:extent='80% 40%'\
               tts:displayAlign='before' \
               tts:writingMode='lrtb'\
               tts:showBackground='whenActive'\
               tts:backgroundColor='transparent'\
               tts:opacity='1'\
               itts:forcedDisplay='true'/>\
           </layout>\
          </head>\
         <body\
         tts:backgroundColor='black'\
         tts:lineHeight='200%'\
         >\
           <div tts:fontWeight='normal'>\
            <p  \
              region='r1'\
              begin='2s'\
              end='10s' \
              tts:color='yellow'\
              tts:fontSize='90%'\
              tts:fontFamily='Courier New'\
              itts:fillLineGap='true'\
              tts:textAlign='start'\
              ebutts:multiRowAlign='auto'\
              xmlns:ebutts='urn:ebu:tt:style'\
              xmlns:itts='http://www.w3.org/ns/ttml/profile/imsc1#styling'>\
              <span\
               tts:fontStyle='italic'\
               tts:backgroundColor='green'\
               tts:display='auto'>\
                Hello, I am Mork from Ork!\
              </span>\
              <br/>\
              <span\
               tts:direction='ltr'\
               tts:wrapOption='noWrap'\
               tts:textShadow='10% 20% 5% white'\
               tts:unicodeBidi='normal'>\
                Hi, Mork from Ork!\
              </span>\
              <span\
               tts:visibility='visible'>\
                I'm visible...\
              </span>\
            </p>\
            <p begin='2s'\
              end='10s' \
              region='r2'\
              tts:fontSize='80%'>\
              This text should be displayed in all circumstances.\
            </p>\
          </div>\
         </body>\
        </tt>"
    );
  },
  mounted: function() {
    this.addVideoTextTrack();
  },
  methods: {
    addNewRegion() {
      this.myDropKey++; //needed to display gets refresh
      this.addRegion();
    },
    editAreaDivDom() {
      return document.getElementById("editArea");
    },
    fullScreenDivDom() {
      return document.getElementById("fullScreenContainer");
    },
    getEditorToggleStyle(buttonName) {
      var style = buttonName == this.editorState ? "secondary" : "light";
      return style;
    },
    getLabelText(name) {
      return this.uiData.getLabel(name, this.lang);
    },
    getPlaytimeAsVttTime() {
      return this.helper.vttTimestamp(this.playTime);
    },
    handleFullscreenChange(event) {
      this.setFullScreenActive(!!document.fullscreenElement);
      this.updateSubtitlePlanePlayTime();
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
    processAfterVideoLoaded() {
      this.videoIsLoaded = true;
      if (this.custom.video.width && this.custom.video.widthMetric) {
        var calculatedHeight =
          this.custom.video.width *
          (this.videoDom.videoHeight / this.videoDom.videoWidth);
        this.setVideoDomWidth({
          width: String(this.custom.video.width) + this.custom.video.widthMetric
        });
        this.setVideoDomHeight({
          height: String(calculatedHeight) + this.custom.video.widthMetric
        });
      } else {
        this.setVideoDomWidth({
          width: String(this.videoDom.videoWith) + "px"
        });
        this.setVideoDomHeight({
          width: String(this.videoDom.videoHeight + "px")
        });
      }
      this.renderDivDom.style.width = this.videoDom.style.width;
      this.renderDivDom.style.height = this.videoDom.style.height;
      // this.subsDivDom.style.height = this.videoDom.style.height;
      this.fullScreenDivDom().style.height = this.renderDivDom.style.height;
      this.editAreaDivDom().style.width = this.renderDivDom.style.width;
      this.triggerTimeUpdate();
    },
    processWhenVideoPlays() {
      if (this.debug) console.log("videoplays");
      this.resetFocusContent();
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
    setEditorState: function(buttonName) {
      this.editorState = buttonName;
    },
    testLog() {
      window.subs = this.currentSubtitleData;
    },
    ...mapMutations([
      "addRegion",
      "addSubtitleData",
      "setFullScreenActive",
      "setLoadingST",
      "setSubtitleData",
      "setVideoDomHeight",
      "setVideoDomWidth",
      "toggleFullScreenMode",
      "setUiLayout"
    ]),
    ...mapActions([
      "addVideoTextTrack",
      "removeSub",
      "resetFocusContent",
      "setNewRegion",
      "triggerTimeUpdate",
      "updateSubtitlePlane",
      "updateSubtitlePlanePlayTime"
    ])
  }
};
</script>

<style>
body {
  margin-left: 5vw;
  margin-right: 5vw;
  margin-top: 5rem;
  font-size: 100%;
}

h1 {
  font-size: 6vh;
}

h2 {
  font-size: 3.7vh;
}

h3 {
  font-size: 2.29vh;
}

label {
  color: black;
  font-size: 100%;
}

input {
  background-color: white;
}
input:focus {
  background-color: #fff5dd;
}

#app {
  font-family: "segoe ui", "Avenir next", Arial, "Avenir", Helvetica, sans-serif;
}

#videoContainer {
  position: absolute;
}

#workview {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#editArea {
  display: grid;
}

.videoCol {
  width: 42vw;
}

#config {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  width: 60%;
}

#renderDiv {
  display: flex;
  position: absolute;
  pointer-events: none;
  width: 1280px;
  height: 724px;
}

#vc1 {
  margin: 0px;
  padding: 0px;
}

#sc1 {
  margin: 0px;
  padding: 0px;
}

#subtitleListView {
  /* height: 75vh; */
  grid-row: 2 / 5;
  grid-column: 2 / 3;
  overflow-y: auto;
  /* margin-right: 5%; */
}

.captionWithButtons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin: 3px 0;
  padding: 1px 0px;
  background-color: rgba(0, 0, 0, 0.05) !important;
}

div.captionWithButtons button,
div.captionWithButtons > * {
  margin: 1px 2px !important;
}

.regionMenu {
  background-color: #f6f8fa;
}

.regionSelect {
  background-color: lightpink;
  padding: 20px;
}

.bodyMenu {
  background-color: #ebdef0;
}

.divMenu {
  background-color: khaki;
  padding: 20px;
}

.pMenu {
  background-color: orange;
}

.loaderText {
  padding-left: 0.5em;
  color: red;
  display: inline-block;
}

.loader {
  display: inline-block;
  border: 5px solid whitesmoke;
  border-top: 5px solid grey;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.spanMenu {
  background-color: lightcyan;
}

.styleMenuHeading {
  background-color: dimgray;
  color: white;
  margin: 0px;
  text-align: center;
}

#fullScreenContainer:fullscreen #renderDiv {
  width: 100% !important;
  height: 100% !important;
  z-index: 2;
}

#fullScreenContainer:fullscreen video {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  transform: translateX(calc((100% - 100vw) / 2));
  z-index: 1;
}
video::-webkit-media-controls-fullscreen-button {
  display: none;
}
.hidden-col {
  display: none !important;
}
</style>
