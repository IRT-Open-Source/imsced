<template>
  <div id="app">
    <h1>imscED</h1>

    <!-- switch between original menu and new generic menu  -->
    <div class="styleSelect">
      <label for="genericMenu">Generic menu:</label>
      <input type="checkbox" id="genericMenu" v-model="genericMenu" />
    </div>

    <!-- Choose menu style  -->
    <DropDownGeneric
      v-if="genericMenu"
      class="styleSelect"
      :options="menuStyleOptions"
      :selected="menuStyle"
      :labelName="'Menu style:'"
      @valueChanged="setMenuStyle"
    />
    <!-- Select language for User Interface  -->      
    <DropDownGeneric
      id="selectLang"
      :options=getAvailableLanguages()
      :selected="lang"
      :labelName="'Language'"
      @valueChanged="setLang"
    />

    <!-- Export IMSC as XML  -->
    <ButtonGeneric :buttonName="'Save File'" @click.native="saveXml" />

    <!-- UI to customize display-->
    <ButtonGeneric
      :buttonName="showConfigUi ? 'Hide Configuration' : 'Configuration'"
      @click.native="toggleShowConfigUi"
    />
    <br />&nbsp;
    <transition name="fade">
      <div v-if="showConfigUi" id="config">
        <RadioGeneric
          v-if="genericMenu == false"
          :options="['show', 'hide']"
          :selected="showBodyMenu"
          :labelName="'Menu for <Body>'"
          @valueChanged="setShowBodyMenu"
        />

        <RadioGeneric
          v-if="genericMenu == false"
          :options="['show', 'hide']"
          :selected="showDivMenu"
          :labelName="'Menu for <div>'"
          @valueChanged="setShowDivMenu"
        />

        <RadioGeneric
          v-if="genericMenu == false"
          :options="['show', 'hide']"
          :selected="showPMenu"
          :labelName="'Menu for <p>'"
          @valueChanged="setShowPMenu"
        />

        <RadioGeneric
          v-if="genericMenu == false"
          :options="['show', 'hide']"
          :selected="showSpanMenu"
          :labelName="'Menu for <span>'"
          @valueChanged="setShowSpanMenu"
        />

        <RadioGeneric
          :options="['show', 'hide']"
          :selected="showRegionSelect"
          :labelName="'Regions'"
          @valueChanged="setShowRegionSelect"
        />

        <RadioGeneric
          :options="['on', 'off']"
          :selected="debug ? 'on' : 'off'"
          :labelName="'Debug info'"
          @valueChanged="setDebug"
        />

        <RadioGeneric
          :options="['on', 'off']"
          :selected="forcedOnly ? 'on' : 'off'"
          :labelName="'Display forced only mode'"
          @valueChanged="setForcedOnlyMode"
        />        
      </div>
    </transition>

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
        genericMenu == false &&
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
        genericMenu == false &&
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
        genericMenu == false &&
          showRegionSelect === 'show' &&
          activeP &&
          activeP.regionID
      "
    >
      <h3 class="styleMenuHeading">REGION Styles</h3>
      <DropDownGeneric
        :options="myRegionIds"
        :selected="activeP.regionID"
        :labelName="'Select a region'"
        :dropKey="myDropKey"
        @valueChanged="setNewRegionForP"
        class="regionMenu"
      />
      <ButtonGeneric
        :buttonName="'Add a region'"
        @click.native="addNewRegion"
      />
    </div>
    <!-- Styles for <p>  -->
    <div v-if="genericMenu == false && activeP && showPMenu === 'show'">
      <h3 class="styleMenuHeading">P Styles</h3>
      <MenuStyle
        :styles="activeP.styleAttrs"
        :contentKind="'p'"
        :regionStyles="regionStylesActiveP"
        class="pMenu"
      />
    </div>
    <!-- Styles for <span> -->
    <div v-if="genericMenu == false && activeSpan && showSpanMenu === 'show'">
      <h3 class="styleMenuHeading">SPAN Styles</h3>
      <MenuStyle
        :styles="activeSpan.styleAttrs"
        :contentKind="'span'"
        class="spanMenu"
      />
    </div>

    <!-- Show menu depending on menustyle -->
    <MenuGeneric v-if="genericMenu && showMenu" class="mt-2" />
    <br />&nbsp;
    <!-- Select video file  -->
    <FileChooserGeneric
      :name="'choosevideo1'"
      :id="'vc1'"
      :labelText="'Video'"
      @filechange="changevideofile"
    />

    <!-- Select subtitle file -->
    <FileChooserGeneric
      :name="'chooseSubtitle1'"
      :id="'sc1'"
      :labelText="'Subs'"
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
      <div>
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
import FileChooserGeneric from "./helper/FileChooserGeneric.vue";
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
    genericMenu: {
      get() {
        return this.$store.state.genericMenu;
      },
      set(val) {
        this.$store.commit("setGenericMenu", val);
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
      "showBodyMenu",
      "showConfigUi",
      "showDivMenu",
      "showPMenu",
      "showRegionSelect",
      "showSpanMenu",
      "uiData"
    ]),
    ...mapGetters([
      "activeDiv",
      "body",
      "regionStylesActiveP",
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
            <p begin='2s'\
              end='10s' \
              region='r1'\
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
    getPlaytimeAsVttTime() {
      return this.helper.vttTimestamp(this.playTime);
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
    setNewRegionForP(val) {
      this.setNewRegionActiveP({ regId: val });
    },
    testLog() {
      window.subs = this.currentSubtitleData;
    },
    ...mapMutations([
      "addRegion",
      "addSubtitleData",
      "changeVideo",
      "setDebug",
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
      "toggleShowConfigUi"
    ]),
    ...mapActions([
      "addVideoTextTrack",
      "removeSub",
      "resetFocusContent",
      "setForcedOnlyMode",
      "setNewRegionActiveP",
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
  font-size: 80%;
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

.styleSelect {
  position: relative;
  float: right;
  margin-right: 1em;
}

/* .BackgroundColor {
  background-size: 15%;
  background-repeat: no-repeat;
  background-position-y: 50%;
  padding-left: 20% !important;
  margin-left: 10%;
} */

#selectLang {
  margin-bottom: 10px;
}
</style>