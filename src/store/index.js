import DefaultConfig from "../config/defaultConfig.js";
import helperGeneric from "../modules/helperGeneric.js";
import imsc from "imsc";
import ImscExport from "../modules/imscExport.js";
import MenuStyleConfig from "../config/menuStyleConfig.js";
import MyRec from "../recommendations/myRec.js";
import MyRegion from "../modules/myRegion.js";
import MyTextTrack from "../modules/texttrack.js";
import scfData from "../config/scfConfig";
import StyleCentral from "../modules/styleCentral.js";
import UiCentral from "../modules/uiCentral.js";
import Vue from "vue";
import Vuex from "vuex";

var customSettingsFile;

if (process.env.VUE_APP_CUSTOMSETTINGS == "true") {
  customSettingsFile = require("../../custom/customSettings.json");
} else {
  customSettingsFile = require("../config/customSettings.json");
}

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    activateBurnIn: false, //activate or disactivate burn in service to allow usage
    activeDiv: undefined, // div element with focus in editor
    activeP: undefined, // p element with focus in editor
    activeSpan: undefined, // span element with focus in editor
    charsPerLine: customSettingsFile.charsPerLine, // the maximum number of allowed characters per line
    config: new DefaultConfig(),
    currentSubtitleData: {}, // active subtitle document as parsed by imscJS
    currentCueCall: undefined,
    custom: new MyRec(), // user configuration
    debug: false, // show debug info in editor view
    draggingActive: false, // status of drag/move feature - can not be true the same time as resizingActive
    forcedOnly: false, // enable/disable displayForcedOnlyMode
    fullScreenActive: false,
    framegap: 0.04, // gab between two subtitles in seconds, should depend on fps
    helper: new helperGeneric(), // access to generic helper methods
    lang: customSettingsFile.lang, // language for the editor interface
    maxLinesPerST: customSettingsFile.maxLinesPerST, // max. number of lines per subtitle block
    loadingST: false, // are subtitles currently loaded (or converted) -> not ready to show
    menuStyle: "default",
    menuStyleConfig: new MenuStyleConfig(),
    minStDuration: customSettingsFile.minStDuration, // minimum lifetime for one subtitle in seconds
    movieName: "", // video file name
    movieSrc: "./assets/videos/coffee.mp4", // video for the subtitles
    playTime: "-", //current playtime of the video
    playTimeChangedByApp: false,
    playTimeChangedByUser: false,
    readingSpeed: customSettingsFile.readingSpeed, // reading speed: characters per second
    refreshSubtitles: false, // request to refresh the order of subtitles
    resizingActive: false, // status of resizing feature - can not be true the same time as draggingActive
    scfData: new scfData(), //config for subtitle conversion api
    scfImportFormat: "stl",
    scfExportFormat: "ebu-tt-d-basic-de",
    showEmojisSetting: "allowed + default",
    showRegionMenu: "show", //whether to show the style menu for a region
    showBodyMenu: "show",
    showBurnIn: false, // toggle the burn in user interface(requires activateBurnIn to be true)
    showConfigUi: false,
    showDivMenu: "show",
    showHints: customSettingsFile.showHints, // show hints for subtitle standards like chars per line
    showPMenu: "show",
    showRegionSelect: "show",
    showScfService: "show",
    showSpanMenu: "show",
    showVisualization: customSettingsFile.showVisualization, // show hints for subtitle standards like chars per line
    srtImportLang: "original (template)", // language for the imsc document
    srtImportTemplate: "ebu-tt-d-basic-de.xml",
    srtTemplateOptions: ["ebu-tt-d-basic-de.xml"],
    styleData: new StyleCentral(), // setting for and processing of style attributes
    subActive: false, // if subtitle data is rendered on video
    subsFileName: "imscTestFile", // default value if no subtitle file was loaded
    subtitleDataList: [], // for using more than one subtitle doc (not implemented yet)
    templateImsc: undefined, // subtitle data object that is used as template for style attributes and region, parsed by imscJS
    templateSrc: "/assets/template.xml",
    textTrack: undefined,
    uiData: new UiCentral(), // language specific labels for ui
    uiLayout: "bootstrap" // choose UI layout for editor (e.g. bootstrap), bootstrap is default
  },
  getters: {
    activeRegionId(state, getters) {
      if (state.activeDiv) {
        if (state.activeDiv.regionID) {
          return state.activeDiv.regionID;
        } else if (state.activeP && state.activeP.regionID) {
          return state.activeP.regionID;
        }
      } else {
        return undefined;
      }
    },
    activeSubtitleDuration(state) {
      if (!state.activeP) {
        return 0;
      }
      return state.activeP.end - state.activeP.begin;
    },
    activeText(state, getters) {
      if (!state.activeP) {
        return "";
      }
      return getters._getTextHelper(state.activeP, "");
    },
    _getTextHelper: (state, getters) => (content, text) => {
      if (content.text) {
        text += content.text;
      }
      if (content.contents) {
        content.contents.forEach((element) => {
          text = getters._getTextHelper(element, text);
        });
      }
      return text;
    },
    body(state) {
      if (state.currentSubtitleData) {
        return state.currentSubtitleData.body;
      } else {
        return false;
      }
    },
    containerDom(state) {
      return document.getElementById(state.config.defaultVideo.containerId);
    },
    getFirstActivePara(state) {
      let bodyContents = state.currentSubtitleData.body.contents;
      let activeContent = null;
      let isActive = function(content) {
        return content.end
          ? state.playTime >= content.begin && state.playTime <= content.end
          : false;
      };

      let getLastContent = (contents) => {
        for (let i = 0; i < contents.length; i++) {
          let item = contents[i];
          if (item.kind == "p" && isActive(item)) {
            activeContent = item;
            break;
          } else if (item.contents) {
            getLastContent(item.contents);
          }

          if (activeContent != null) {
            break;
          }
        }
      };

      getLastContent(bodyContents);
      return activeContent;
    },
    //all p elements as array
    paraList(state) {
      var paraData = [];
      var hash = state.currentSubtitleData.paraHash;
      for (var i in hash) {
        /*array is two dimensional,  
        i - "begin#end" 
        j - index of entry with "begin#end" value  */
        for (var j in hash[i]) {
          paraData.push(hash[i][j]);
        }
      }
      return paraData;
    },
    //only p elements that are ahead of playtime
    paraNext(state, getters) {
      var isNext = function(element) {
        return Boolean(element.end > state.playTime);
      };
      var result = getters.paraList.filter(isNext);
      if (result.length > 0) {
        return result;
      } else {
        return undefined;
      }
    },
    regionIds(state) {
      if (state.helper.objectHasEntries(state.currentSubtitleData)) {
        return Object.keys(state.currentSubtitleData.regionHash);
      } else {
        return undefined;
      }
    },
    regionSelectAvailable(state) {
      return (
        state.showRegionSelect === "show" &&
        state.activeP &&
        state.activeP.regionID.trim().length > 0
      );
    },
    /*
      The style attributes of the region element that is 
      referenced by the currently "active" div  element.
    */
    regionStyles(state, getters) {
      if (getters.activeRegionId) {
        return state.currentSubtitleData.regionHash[getters.activeRegionId]
          .styleAttrs;
      } else {
        return;
      }
    },
    regionStylesActiveDiv(state, getters) {
      let regionStyles;
      if (state.activeDiv) {
        if (state.activeDiv.regionID) {
          if (state.currentSubtitleData.regionHash[state.activeDiv.regionID]) {
            regionStyles =
              state.currentSubtitleData.regionHash[state.activeDiv.regionID]
                .styleAttrs;
          }
        }
      }
      return regionStyles;
    },
    /*
      The style attributes of the region element that is 
      referenced by the currently "active" p element.
    */
    regionStylesActiveP(state) {
      let regionStyles;
      if (state.activeP) {
        if (state.activeP.regionID) {
          if (state.currentSubtitleData.regionHash[state.activeP.regionID]) {
            regionStyles =
              state.currentSubtitleData.regionHash[state.activeP.regionID]
                .styleAttrs;
          }
        }
      }
      return regionStyles;
    },
    //DOM Obj for the container where subtitles will be "injected"
    renderDivDom() {
      return document.getElementById("renderDiv");
    },
    //DOM Obj for the container where subtitles can be edited
    subsDivDom() {
      return document.getElementById("subtitleListView");
    },
    videoDom(state) {
      return document.getElementById(state.config.defaultVideo.videoId);
    },
    // get a specific value from region styles (like "extent$h")
    getRegionValue(state, getters) {
      return (name) => {
        let namespace = state.styleData.attrs[name].ns;
        let valueEntry, value;

        //composed values e.g. extent or origin
        let composition = name.split("$");
        let wrapperName = composition[0];
        let propertyName = composition[1];

        if (getters.regionStyles) {
          valueEntry =
            getters.regionStyles[namespace + " " + wrapperName][propertyName];
        } else {
          return;
        }
        if (!valueEntry.hasOwnProperty("value")) {
          value = valueEntry;
        } else {
          value = valueEntry.value;
        }
        return value;
      };
    }
  },
  mutations: {
    activateSub(state) {
      state.subActive = true;
    },
    addSubtitleData(state, payload) {
      state.subtitleDataList.unshift(payload.imscData);
    },
    changeVideo(state, payload) {
      state.movieName = payload.obj.name;
      state.movieSrc = payload.URL;
    },
    deactivateDragging(state) {
      state.draggingActive = false;
    },
    deactivateResizing(state) {
      state.resizingActive = false;
    },
    deactivateSub(state) {
      state.subActive = false;
    },
    incrementTrackIdCounter(state) {
      state.trackIdCounter++;
    },
    resetTextTrack(state) {
      state.textTrack.removeAllCues();
    },
    setActivateBurnIn(state, val) {
      if (val === "on") {
        state.activateBurnIn = true;
      } else {
        state.activateBurnIn = false;
      }
    },
    setActiveDiv(state, payload) {
      state.activeDiv = payload.content;
    },
    setActiveP(state, payload) {
      state.activeP = payload.content;
    },
    setActiveSpan(state, payload) {
      state.activeSpan = payload.content;
    },
    setDebug(state, val) {
      if (val === "on") {
        state.debug = true;
      } else {
        state.debug = false;
      }
    },
    setLang(state, val) {
      state.lang = val;
    },
    setCharsPerLine(state, val) {
      state.charsPerLine = val;
    },
    setFullScreenActive(state, val) {
      state.fullScreenActive = val;
    },
    setLoadingST(state, val) {
      state.loadingST = val;
    },
    setMaxLinesPerST(state, val) {
      state.maxLinesPerST = val;
    },
    setMenuStyle(state, val) {
      state.menuStyle = val;
    },
    setMinStDuration(state, val) {
      if (isNaN(val)) return;
      state.minStDuration = parseFloat(val);
    },
    setPlayTime(state, payload) {
      state.playTime = payload.time;
    },
    setPlayTimeChangedByApp(state, val) {
      state.playTimeChangedByApp = val;
    },
    setPlayTimeChangedByUser(state, val) {
      state.playTimeChangedByUser = val;
    },
    setReadingSpeed(state, val) {
      state.readingSpeed = val;
    },
    setRefreshSubtitles(state, val) {
      state.refreshSubtitles = val;
    },
    setScfExportFormat(state, val) {
      state.scfExportFormat = val;
    },
    setScfImportFormat(state, val) {
      state.scfImportFormat = val;
    },
    setShowConfigUi(state, val) {
      state.showConfigUi = val;
    },
    setShowEmojisSetting(state, val) {
      state.showEmojisSetting = val;
    },
    setShowScfService(state, val) {
      state.showScfService = val;
    },
    setShowBodyMenu(state, val) {
      state.showBodyMenu = val;
    },
    setShowDivMenu(state, val) {
      state.showDivMenu = val;
    },
    setShowHints(state, val) {
      state.showHints = val;
    },
    setShowPMenu(state, val) {
      state.showPMenu = val;
    },
    setShowRegionSelect(state, val) {
      state.showRegionSelect = val;
      state.showRegionMenu = val;
    },
    setShowSpanMenu(state, val) {
      state.showSpanMenu = val;
    },
    setShowVisualization(state, val) {
      state.showVisualization = val;
    },
    setSrtImportLang(state, val) {
      state.srtImportLang = val;
    },
    setSrtImportTemplate(state, val) {
      state.srtImportTemplate = val;
    },
    setSrtTemplateOptions(state, val) {
      state.srtTemplateOptions = val;
    },
    setSubsFileName(state, val) {
      state.subsFileName = val;
    },
    setSubtitleData(state, payload) {
      state.currentSubtitleData = payload.imscData;
    },
    setTemplateImsc(state, payload) {
      state.templateImsc = payload.imscData;
    },
    setTextTrack(state, obj) {
      state.textTrack = obj;
    },
    setUiLayout(state, val) {
      state.uiLayout = val;
    },
    setVideoDomHeight(state, payload) {
      document.getElementById(state.config.defaultVideo.videoId).style.height =
        payload.height;
    },
    setVideoDomWidth(state, payload) {
      document.getElementById(state.config.defaultVideo.videoId).style.width =
        payload.width;
    },
    toggleShowBurnIn(state) {
      state.showBurnIn = !state.showBurnIn;
    },
    toggleShowConfigUi(state) {
      state.showConfigUi = state.showConfigUi ? false : true;
    },
    toggleDraggingActive(state) {
      state.draggingActive = !state.draggingActive;
      if (state.draggingActive && state.resizingActive) {
        state.resizingActive = false;
      }
    },
    toggleFullScreenMode() {
      if (!document.fullscreenElement) {
        document.getElementById("fullScreenContainer").requestFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    },
    toggleResizingActive(state) {
      state.resizingActive = !state.resizingActive;
      if (state.resizingActive && state.draggingActive) {
        state.draggingActive = false;
      }
    }
  },
  actions: {
    addCue({ state }, cue) {
      state.textTrack.addMyCue(cue);
    },
    addRegion({ dispatch, state }) {
      let newRegionId = "r-" + state.helper.uuidv4().substring(0, 8);
      let newRegion = new MyRegion(newRegionId);
      dispatch("setNewRegion", newRegionId);
      Vue.set(state.currentSubtitleData.regionHash, newRegionId, newRegion);
    },
    initTextTrack({ commit, getters }) {
      let trackObj = new MyTextTrack(
        "subtitles",
        "imsc",
        "de",
        getters.videoDom
      );
      commit("setTextTrack", trackObj);
    },
    removeCue({ state }, cue) {
      state.textTrack.removeMyCue(cue);
    },
    removeSub({ getters, commit }) {
      var container = getters.renderDivDom;
      container.removeChild(container.getElementsByTagName("div")[0]);
      commit("deactivateSub");
    },
    resetFocusContent({ commit }) {
      commit("setActiveP", { content: undefined });
      commit("setActiveSpan", { content: undefined });
      commit("setActiveDiv", { content: undefined });
    },
    resetSubtitlePlane({ dispatch, state }) {
      if (state.subActive) {
        dispatch("removeSub");
      }
    },
    /**
     * Save the active subtitle document as xml
     */
    saveAsXml({ state }) {
      return new Promise((r) => {
        let imscXml = new ImscExport(state.currentSubtitleData);
        imscXml.iterateData();
        let serializer = new XMLSerializer();
        let xmlString = serializer.serializeToString(imscXml.doc);
        r(
          new Blob([xmlString], {
            type: "text/xml"
          })
        );
      });
    },
    setForcedOnlyMode({ state, dispatch }, val) {
      state.forcedOnly = val === "on";
      dispatch("updateSubtitlePlane", { time: state.playTime });
    },
    setImageExportHeight({ state }, val) {
      state.config.defaultImageExportSize.height = val;
    },
    setImageExportWidth({ state }, val) {
      state.config.defaultImageExportSize.width = val;
    },
    /*
      For the moment a region can only be set if a region
      is present either on div or p. It will not work
      if a default region applies
    */
    setNewRegion({ state, dispatch }, val) {
      let regionId = val;
      if (state.activeDiv && state.activeDiv.regionID) {
        dispatch("setNewRegionActiveDiv", { regId: regionId });
      } else if (state.activeP && state.activeP.regionID) {
        dispatch("setNewRegionActiveP", { regId: regionId });
      }
    },
    setNewRegionActiveDiv({ state, dispatch }, payload) {
      state.activeDiv.regionID = payload.regId;
      dispatch("updateSubtitlePlane", { time: state.playTime });
    },
    setNewRegionActiveP({ state, dispatch }, payload) {
      state.activeP.regionID = payload.regId;
      dispatch("updateSubtitlePlane", { time: state.playTime });
    },
    setOffsetFrames({ state }, val) {
      state.config.defaultOffsetFrames = val;
    },
    setOffsetSeconds({ state }, val) {
      if (typeof val == "string") {
        let seconds = state.helper.seconds(val);
        state.config.defaultOffsetSeconds = seconds;
      } else {
        state.config.defaultOffsetSeconds = val;
      }
    },
    setVideoPlayTime({ state, getters, dispatch }, payload) {
      if (getters.videoDom) {
        state.playTimeChangedByApp = true;
        var myVideo = getters.videoDom;
        myVideo.currentTime = payload.time;
        dispatch("updateSubtitlePlane", { time: payload.time });
      }
    },
    triggerTimeUpdate({ state, getters, dispatch }) {
      var store = this;
      if (getters.videoDom) {
        getters.videoDom.ontimeupdate = function() {
          store.dispatch("updatePlayTime");
        };
        dispatch("updatePlayTime");
      }
    },
    updatePlayTime({ getters, commit }) {
      var timeVal = getters.videoDom.currentTime;
      commit("setPlayTime", { time: timeVal });
    },
    updateSubtitlePlane({ state, dispatch, getters, commit }, payload) {
      var isd = imsc.generateISD(state.currentSubtitleData.tt, payload.time);

      if (state.subActive) {
        dispatch("removeSub");
      }
      imsc.renderHTML(
        isd,
        getters.renderDivDom,
        null,
        null,
        null,
        state.forcedOnly
      );
      /* console.log(
        "update subtitle plane",
        payload.time,
        state.currentSubtitleData.tt
      ); */
      commit("activateSub");
    },
    updateSubtitlePlanePlayTime({ state, dispatch }) {
      dispatch("updateSubtitlePlane", { time: state.playTime });
    }
  }
});
