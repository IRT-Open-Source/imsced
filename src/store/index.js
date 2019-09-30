import DefaultConfig from "../config/defaultConfig.js";
import helperGeneric from "../modules/helperGeneric.js";
import imsc from "imsc";
import MenuStyleConfig from "../config/menuStyleConfig.js";
import MyRec from "../recommendations/myRec.js";
import MyRegion from "../modules/myRegion.js";
import MyTextTrack from "../modules/texttrack.js";
import scfData from "../config/scfConfig";
import StyleCentral from "../modules/styleCentral.js";
import UiCentral from "../modules/uiCentral.js";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    activeP: undefined, // p element with focus in editor
    activeSpan: undefined, // span element with focus in editor
    config: new DefaultConfig(),
    currentSubtitleData: {}, // active subtitle document as parsed by imscJS
    currentVideoTextTrack: undefined,
    custom: new MyRec(), // user configuration
    debug: false, // show debug info in editor view
    draggingActive: false, // status of drag/move feature - can not be true the same time as resizingActive
    forcedOnly: false, // enable/disable displayForcedOnlyMode
    fullScreenActive: false,
    helper: new helperGeneric(), // access to generic helper methods
    lang: "en", // language for the editor interface
    loadingST: false, // are subtitles currently loaded (or converted) -> not ready to show
    menuStyle: "default",
    menuStyleConfig: new MenuStyleConfig(),
    movieSrc: "./data/videos/coffee.mp4", // video for the subtitles
    playTime: "-", //current playtime of the video
    resizingActive: false, // status of resizing feature - can not be true the same time as draggingActive
    scfData: new scfData(), //config for subtitle conversion api
    scfImportFormat: "imsc",
    scfExportFormat: "ebu-tt-d-basic-de",
    showRegionMenu: "show", //whether to show the style menu for a region
    showBodyMenu: "show",
    showConfigUi: false,
    showDivMenu: "show",
    showPMenu: "show",
    showRegionSelect: "show",
    showScfService: "hide",
    showSpanMenu: "show",
    styleData: new StyleCentral(), // setting for and processing of style attributes
    subActive: false, // if subtitle data is rendered on video
    subtitleDataList: [], // for using more than one subtitle doc (not implemented yet)
    uiData: new UiCentral(), // language specific labels for ui
    uiLayout: "bootstrap" // choose UI layout for editor (e.g. bootstrap), bootstrap is default
  },
  getters: {
    activeDiv(state) {
      if (state.activeP) {
        return state.activeP.parentDiv;
      }
    },
    activeRegionId(state, getters) {
      if (getters.activeDiv) {
        if (getters.activeDiv.regionID) {
          return getters.activeDiv.regionID;
        } else if (state.activeP && state.activeP.regionID) {
          return state.activeP.regionID;
        }
      } else {
        return undefined;
      }
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
      if (getters.activeDiv) {
        if (getters.activeDiv.regionID) {
          if (
            state.currentSubtitleData.regionHash[getters.activeDiv.regionID]
          ) {
            regionStyles =
              state.currentSubtitleData.regionHash[getters.activeDiv.regionID]
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
    videoDom(state) {
      return document.getElementById(state.config.defaultVideo.videoId);
    },
    // get a specific value from region styles (like "extent$h") (TODO: check if working for every case)
    getRegionValue(state, getters) {
      return name => {
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

        if (!valueEntry.value) {
          value = valueEntry; // better to check on string type?
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
    addRegion(state) {
      let newRegionId = "r-" + state.helper.uuidv4();
      let newRegion = new MyRegion(newRegionId);
      state.currentSubtitleData.regionHash[newRegionId] = newRegion;
    },
    addSubtitleData(state, payload) {
      state.subtitleDataList.unshift(payload.imscData);
    },
    changeVideo(state, payload) {
      state.movieSrc = payload.fileUrl;
    },
    deactivateSub(state) {
      state.subActive = false;
    },
    incrementTrackIdCounter(state) {
      state.trackIdCounter++;
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
    setCurrentTrack(state, payload) {
      state.currentVideoTextTrack = payload.track;
    },
    setCurrentTrackMode(state, payload) {
      state.currentVideoTextTrack.track.mode = payload.mode;
    },
    setFullScreenActive(state, val) {
      state.fullScreenActive = val;
    },
    setLoadingST(state, val) {
      state.loadingST = val;
    },
    setMenuStyle(state, val) {
      state.menuStyle = val;
    },
    setPlayTime(state, payload) {
      state.playTime = payload.time;
    },
    setScfExportFormat(state, val) {
      state.scfExportFormat = val;
    },
    setScfImportFormat(state, val) {
      state.scfImportFormat = val;
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
    setSubtitleData(state, payload) {
      state.currentSubtitleData = payload.imscData;
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
    /* 
      Add video text track and init cues with callbacks
      to render the imsc subtitles.
    */
    addVideoTextTrack({ commit, getters, state }) {
      if (state.currentVideoTextTrack) {
        commit("setCurrentTrackMode", { mode: "disabled" });
      }
      var store = this;
      var mediaTimeEvents = state.currentSubtitleData.tt.getMediaTimeEvents();
      if (state.debug) console.log(mediaTimeEvents);
      //Callback
      var callIn = function() {
        if (state.debug) {
          console.log("Cue Enter: " + this.startTime + "/" + this.endTime);
        }
        store.dispatch("updateSubtitlePlane", { time: this.startTime });
      };
      var callOut = function() {
        if (state.debug) {
          console.log("Cue EXIT: " + this.startTime + "/" + this.endTime);
        }
        /*
          when seeking backwards in time
          chrome fires the onexit event of the
          previous cue after the onenter event of 
          the current cue. to avoid removal of the active
          cue, in this case no removal action for the
          onexist removal will be triggered-
        */
        if (
          this.track.activeCues &&
          !(this.track.activeCues[0].endTime < this.endTime)
        ) {
          store.dispatch("resetSubtitlePlane");
        }
      };
      var trackObj = new MyTextTrack(
        "subtitles",
        "imsc",
        "de",
        getters.videoDom
      );
      if (state.debug) console.log(mediaTimeEvents);
      if (state.debug) console.log(trackObj.track);
      trackObj.initCues(mediaTimeEvents, callIn, callOut);
      commit("setCurrentTrack", { track: trackObj });
    },
    removeSub({ getters, commit }) {
      var container = getters.renderDivDom;
      container.removeChild(container.getElementsByTagName("div")[0]);
      commit("deactivateSub");
    },
    resetFocusContent({ commit }) {
      commit("setActiveP", { content: undefined });
      commit("setActiveSpan", { content: undefined });
    },
    resetSubtitlePlane({ dispatch, state }) {
      if (state.subActive) {
        dispatch("removeSub");
      }
    },
    setForcedOnlyMode({ state, dispatch }, val) {
      state.forcedOnly = val === "on";
      dispatch("updateSubtitlePlane", { time: state.playTime });
    },
    /*
      For the moment a region can only be set if a region
      is present either on div or p. It will not work
      if a default region applies
    */
    setNewRegion({ state, getters, dispatch }, val) {
      let regionId = val;
      if (getters.activeDiv && getters.activeDiv.regionID) {
        dispatch("setNewRegionActiveDiv", { regId: regionId });
      } else if (state.activeP && state.activeP.regionID) {
        dispatch("setNewRegionActiveP", { regId: regionId });
      }
    },
    setNewRegionActiveDiv({ state, getters, dispatch }, payload) {
      getters.activeDiv.regionID = payload.regId;
      dispatch("updateSubtitlePlane", { time: state.playTime });
    },
    setNewRegionActiveP({ state, dispatch }, payload) {
      state.activeP.regionID = payload.regId;
      dispatch("updateSubtitlePlane", { time: state.playTime });
    },
    setVideoPlayTime({ getters, dispatch }, payload) {
      if (getters.videoDom) {
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
        dispatch("updateSubtitlePlane", { time: state.playTime }); //re-render subs
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
      commit("activateSub");
    },
    updateSubtitlePlanePlayTime({ state, dispatch }) {
      dispatch("updateSubtitlePlane", { time: state.playTime });
    }
  }
});
