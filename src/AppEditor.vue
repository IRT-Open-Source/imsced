<template>
  <div id="app">
    <h1Generic :text="'imscEd'" />

    <!-- Choose menu style  -->

    <DropDownGeneric
      class="floatRightBox"
      :options="['bootstrap', 'plain']"
      :selected="uiLayout"
      :labelName="'UI Layout:'"
      @valueChanged="setUiLayout"
    />

    <DropDownGeneric
      v-if="uiLayout == 'bootstrap'"
      class="floatRightBox"
      :options="menuStyleOptions"
      :selected="menuStyle"
      :labelName="`${getLabelText('genericMenuType')}:`"
      @valueChanged="setMenuStyle"
    />

    <!-- Select language for User Interface  -->
    <DropDownGeneric
      id="selectLang"
      :options="getAvailableLanguages()"
      :selected="lang"
      :labelName="getLabelText('Language')"
      @valueChanged="setLang"
    />

    <div id="saveConfig">
      <!-- Export IMSC as XML  -->
      <ButtonGeneric
        :buttonName="getLabelText('saveFile')"
        @click.native="saveXml"
      />

      <!-- UI to customize display-->
      <ButtonGeneric
        :buttonName="configUiButtonName"
        @click.native="toggleShowConfigUi"
      />
      <br />&nbsp;
      <transition name="fade">
        <div v-if="showConfigUi" id="config">
          <RadioGeneric
            :options="['show', 'hide']"
            :translateOptions="true"
            :selected="showBodyMenu"
            :labelName="`${getLabelText('elementMenu')} <Body>`"
            @valueChanged="setShowBodyMenu"
          />

          <RadioGeneric
            :options="['show', 'hide']"
            :translateOptions="true"
            :selected="showDivMenu"
            :labelName="`${getLabelText('elementMenu')} <div>`"
            @valueChanged="setShowDivMenu"
          />

          <RadioGeneric
            :options="['show', 'hide']"
            :translateOptions="true"
            :selected="showPMenu"
            :labelName="`${getLabelText('elementMenu')} <p>`"
            @valueChanged="setShowPMenu"
          />

          <RadioGeneric
            :options="['show', 'hide']"
            :translateOptions="true"
            :selected="showSpanMenu"
            :labelName="`${getLabelText('elementMenu')} <span>`"
            @valueChanged="setShowSpanMenu"
          />

          <RadioGeneric
            :options="['show', 'hide']"
            :translateOptions="true"
            :selected="showRegionSelect"
            :labelName="'Regions'"
            @valueChanged="setShowRegionSelect"
          />

          <RadioGeneric
            :options="['on', 'off']"
            :translateOptions="true"
            :selected="debug ? 'on' : 'off'"
            :labelName="'Debug info'"
            @valueChanged="setDebug"
          />

          <RadioGeneric
            :options="['on', 'off']"
            :translateOptions="true"
            :selected="forcedOnly ? 'on' : 'off'"
            :labelName="'Display forced only mode'"
            @valueChanged="setForcedOnlyMode"
          />
        </div>
      </transition>
    </div>
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
    <MenuGeneric v-if="uiLayout == 'bootstrap' && showMenu" class="mt-2" />
    <br />&nbsp;
    <!-- Select video file  -->
    <FileChooserGeneric
      :name="'choosevideo1'"
      :id="'vc1'"
      :labelText="getLabelText('video')"
      @filechange="changevideofile"
    />

    <!-- Select subtitle file -->
    <FileChooserGeneric
      :name="'chooseSubtitle1'"
      :id="'sc1'"
      :labelText="getLabelText('subtitles')"
      :getText="true"
      @textSent="newSubs"
    />
    <!-- Playtime in 00:00:00.000 format -->
    <p>Playtime: {{ getPlaytimeAsVttTime() }}</p>

    <div v-if="debug">
      <p>ID of active p element</p>
      <p v-if="activeP">{{ activeP.editorId }}</p>
    </div>

    <div id="workview">
      <!-- List of subtitles to edit -->
      <div id="subtitleListView">
        <ContentImsc :content="body" v-if="body" />
      </div>
      <!-- Video to be displayed -->
      <div id="fullScreenContainer" @fullscreenchange="handleFullscreenChange">
        <LiveActionsMenu />
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import ButtonGeneric from "./editorComponents/ButtonGeneric.vue";
import DropDownGeneric from "./editorComponents/DropDownGeneric.vue";
import ContentImsc from "./editorComponents/ContentImsc.vue";
import FileChooserGeneric from "./editorComponents/FileChooserGeneric.vue";
import h1Generic from "./editorComponents/h1Generic.vue";
import ImscData from "./modules/imscdata.js";
import ImscExport from "./modules/imscExport.js";
import LiveActionsMenu from "./editorComponents/LiveActionsMenu.vue";
import MenuGeneric from "./editorComponents/MenuGeneric.vue";
import MenuStyle from "./editorComponents/MenuStyle.vue";
import MyRegion from "./modules/myRegion.js";
import MyDebug from "./helper/MyDebug.vue";
import RadioGeneric from "./editorComponents/RadioGeneric.vue";
import { saveAs } from "file-saver";
import VideoGeneric from "./mediaComponents/VideoGeneric.vue";

export default {
  name: "app",
  components: {
    ButtonGeneric,
    ContentImsc,
    DropDownGeneric,
    FileChooserGeneric,
    h1Generic,
    LiveActionsMenu,
    MenuGeneric,
    MenuStyle,
    MyDebug,
    RadioGeneric,
    VideoGeneric
  },
  data() {
    return {
      myDropKey: 0,
      videoIsLoaded: false
    };
  },
  computed: {
    configUiButtonName() {
      var name = this.showConfigUi ? "hideConfigUi" : "showConfigUi";
      return this.getLabelText(name);
    },
    uiLayout: {
      get() {
        return this.$store.state.uiLayout;
      },
      set(val) {
        this.$store.commit("setuiLayout", val);
      }
    },
    menuStyleOptions() {
      var styles = [];
      for (var style in this.menuStyleConfig.styles) {
        styles.push(style);
      }
      return styles;
    },
    myRegionIds: {
      cache: false,
      get: function() {
        return Object.keys(this.currentSubtitleData.regionHash);
      }
    },
    showMenu() {
      return (
        this.activeP || this.activeSpan || this.activeDiv
        //|| (this.body && this.helper.objectHasEntries(this.body.styleAttrs)) // TODO
      );
    },
    ...mapState([
      "activeP",
      "activeSpan",
      "config",
      "custom",
      "currentSubtitleData",
      "debug",
      "forcedOnly",
      "helper",
      "menuStyleConfig",
      "menuStyle",
      "lang",
      "movieSrc",
      "playTime",
      "showRegionMenu",
      "showBodyMenu",
      "showConfigUi",
      "showDivMenu",
      "showPMenu",
      "showRegionSelect",
      "showSpanMenu",
      "uiData",
      "uiLayout"
    ]),
    ...mapGetters([
      "activeDiv",
      "activeRegionId",
      "body",
      "regionStyles",
      "renderDivDom",
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
    changevideofile: function(file) {
      this.changeVideo({ fileUrl: file.URL });
      //equivalent to
      //this.$store.commit('changeVideo', file.URL);
    },
    getAvailableLanguages() {
      return this.uiData.getAvailableLanguages();
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
    testLog() {
      window.subs = this.currentSubtitleData;
    },
    ...mapMutations([
      "addRegion",
      "addSubtitleData",
      "changeVideo",
      "setDebug",
      "setFullScreenActive",
      "setMenuStyle",
      "setLang",
      "setShowBodyMenu",
      "setShowDivMenu",
      "setShowPMenu",
      "setShowSpanMenu",
      "setShowRegionSelect",
      "setSubtitleData",
      "setVideoCustomWidth",
      "setVideoDomHeight",
      "setVideoDomWidth",
      "toggleShowConfigUi",
      "setUiLayout"
    ]),
    ...mapActions([
      "addVideoTextTrack",
      "removeSub",
      "resetFocusContent",
      "setForcedOnlyMode",
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
  height: 75vh;
  overflow-y: auto;
  margin-right: 5%;
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

.spanMenu {
  background-color: lightcyan;
}

.styleMenuHeading {
  background-color: dimgray;
  color: white;
  margin: 0px;
  text-align: center;
}

.floatRightBox {
  position: relative;
  float: right;
  margin-right: 1em;
}

#saveConfig {
  margin-top: 7rem;
}

#selectLang {
  margin-bottom: 20px;
  float: left;
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
</style>