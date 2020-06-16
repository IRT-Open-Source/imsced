<template>
  <div>
    <div
      :id="[content.editorId]"
      :class="['pBlock', activeClass, { warningBorder: showWarning }]"
      @click="handleClick"
    >
      <span class="tempTimingBox">
        <span class="timeDescription">BEGIN:</span>
        <TimeInput
          class="timeBox"
          :time="begin"
          @timeChanged="setBegin"
          @gotFocus="handleTimeFocus(begin)"
        />
      </span>
      <span class="tempTimingBox">
        <span class="timeDescription">END:</span>
        <TimeInput
          class="timeBox"
          :time="end"
          @timeChanged="setEnd"
          @gotFocus="handleTimeFocusEnd(end)"
        />
      </span>
      <div v-if="initDelete" class="popup">
        <div class="textSpacing">
          Are you sure you want to delete this subtitle block?
        </div>
        <ButtonGeneric
          class="buttonSpacing"
          :buttonName="'Cancel'"
          @click.native="toggleInitDelete"
        />
        <ButtonGeneric
          class="buttonSpacing"
          :buttonName="'Delete'"
          variant="danger"
          @click.native="deleteBlock"
        />
      </div>
      <span class="deleteBlock">
        <ButtonGeneric
          :buttonName="'delete'"
          icon="times-circle"
          iconSize="sm"
          :iconStyle="{ color: 'grey' }"
          @click.native="toggleInitDelete"
          :disabled="activeP == undefined"
        />
      </span>
      <!-- Iteration of grouped contents array of content element -->
      <div class="subtitleLines">
        <template v-for="(group, index) in subtitleLines">
          <SubtitleLine
            :parent="content"
            :contentGroup="group"
            :level="0"
            :key="index"
            @gotFocus="handleFocus"
            @characterWarning="handleCharacterWarning"
          />
        </template>
      </div>
      <div v-if="showWarning" class="warningText">
        <div v-if="minDurationWarning">
          {{ getLabelText("minDurationWarning") }}
        </div>
        <div v-if="timingWarning">{{ getLabelText("timingWarning") }}</div>
        <div v-if="stLinesWarning">{{ getLabelText("tooManyLines") }}</div>
        <div v-if="characterWarning > 0">
          {{ getLabelText("tooManyChars") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import ButtonGeneric from "./ButtonGeneric.vue";
import InputGeneric from "./InputGeneric.vue";
import SpanElement from "./SpanElement.vue";
import SubtitleLine from "./SubtitleLine.vue";
import TextImsc from "./TextImsc.vue";
import TimeInput from "./TimeInput.vue";

export default {
  name: "SubtitleBlock",
  components: {
    ButtonGeneric,
    InputGeneric,
    SpanElement,
    SubtitleLine,
    TextImsc,
    TimeInput
  },
  data() {
    return {
      characterWarning: 0,
      cue: undefined,
      initDelete: false
    };
  },
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  watch: {
    textTrack() {
      if (!this.textTrack) {
        return;
      }
      let newCue = this.createCue();
      this.cue = newCue;
      this.addCue(newCue);
    }
  },
  mounted() {
    if (!this.textTrack) {
      return;
    }
    let newCue = this.createCue();
    this.cue = newCue;
    this.addCue(newCue);
  },
  computed: {
    active: function() {
      if (
        this.playTime >= this.content.begin &&
        this.playTime < this.content.end
      ) {
        return true;
      } else {
        return false;
      }
    },
    activeClass: {
      cache: false,
      get: function() {
        if (this.active) {
          return "activeP";
        } else {
          return "passiveP";
        }
      }
    },
    begin() {
      return this.convertToVttTime(this.content.begin);
    },
    end() {
      return this.convertToVttTime(this.content.end);
    },
    minDurationWarning() {
      let duration = this.content.end - this.content.begin;
      if (duration < this.minStDuration) {
        return true;
      }
      return false;
    },
    showWarning() {
      return (
        this.showHints == "show" &&
        (this.timingWarning ||
          this.minDurationWarning ||
          this.characterWarning > 0 ||
          this.stLinesWarning)
      );
    },
    stLinesWarning() {
      if (this.maxLinesPerST < this.subtitleLines.length) {
        return true;
      }
      return false;
    },
    subtitleLines() {
      let lines = [];
      if (this.content.contents) {
        let lineCounter = 0;
        lines.push([]);
        this.content.contents.forEach((item) => {
          if (item.kind == "span") {
            if (item.hasOwnProperty("contents")) {
              // item has child elements -> check if it has real span children otherwise resolve
              if (this.containsRealSpan(item)) {
                lines[lineCounter].push(item); // nested Span
              } else {
                // no real child elements -> resolve structure
                item.contents.forEach((element) => {
                  if (element.kind == "span") {
                    lines[lineCounter].push(element);
                  } else if (element.kind == "br") {
                    lineCounter++;
                    lines.push([]);
                  }
                });
              }
            } else {
              // item is (anonymous) span with direct text
              lines[lineCounter].push(item);
            }
          } else if (item.kind == "br") {
            // item is br element
            lineCounter++;
            lines.push([]);
          }
        });
      }
      return lines;
    },
    timingWarning() {
      let duration = this.content.end - this.content.begin;
      let allText = this.getAllText(this.content, "");
      allText = allText.trim().replace(/\s+/g, " ");
      let minTime = allText.length / this.readingSpeed;
      if (duration < minTime) {
        return true;
      } else {
        return false;
      }
    },
    type() {
      if (this.content) {
        return this.content.kind;
      }
    },
    ...mapState([
      "activeDiv",
      "activeP",
      "helper",
      "lang",
      "maxLinesPerST",
      "minStDuration",
      "playTime",
      "readingSpeed",
      "showHints",
      "textTrack",
      "uiData"
    ]),
    ...mapGetters(["body", "videoDom"])
  },
  methods: {
    convertToSeconds(vttTime) {
      return this.helper.seconds(vttTime);
    },
    convertToVttTime(seconds) {
      return this.helper.vttTimestamp(seconds);
    },
    createCue() {
      let vm = this;
      let callIn = function() {
        vm.updateSubtitlePlane({ time: vm.videoDom.currentTime });
      };
      let callOut = function() {
        vm.updateSubtitlePlane({ time: vm.videoDom.currentTime });
      };
      // Edge does not support VTTCue but uses TextTrackCue
      let Cue = window.VTTCue || window.TextTrackCue;
      // endtime in IMSC is exclusive, but in HTML seems to be inclusive
      //let inclusiveEndTime = this.content.end - 0.000000001;
      let myCue = new Cue(this.content.begin, this.content.end, "");
      myCue.onenter = callIn;
      myCue.onexit = callOut;
      myCue.id =
        this.content.begin + "#" + this.content.end + this.content.editorId;
      this.cue = myCue;
      return myCue;
    },
    containsRealSpan(content) {
      return content.contents.some(
        (item) => item.kind == "span" && item.hasOwnProperty("regionID")
      );
    },
    deleteBlock() {
      if (this.content.parentDiv) {
        let parent = this.content.parentDiv;
        parent.contents.forEach((obj, i) => {
          if (obj.editorId && obj.editorId == this.content.editorId) {
            if (this.cue) this.removeCue(this.cue);
            parent.contents.splice(i, 1);
          }
        });
        this.updateSubtitlePlane({ time: this.playTime });
        this.resetFocusContent();
      }
    },
    getAllText(content, text) {
      if (content.text) {
        text += content.text;
      }
      if (content.contents) {
        content.contents.forEach((element) => {
          text = this.getAllText(element, text);
        });
      }
      return text;
    },
    getLabelText(name) {
      return this.uiData.getLabel(name, this.lang);
    },
    getLastElementOfTheLine(subtitleLine) {
      let lastElement = null;
      let contentItem = null;
      for (let i = subtitleLine.length - 1; i >= 0; i--) {
        let item = subtitleLine[i];
        if (item.text && item.text.trim()) {
          contentItem = subtitleLine[i];
          break;
        }
      }
      if (contentItem != null) {
        lastElement = document.getElementById(`input_${contentItem.editorId}`);
      }
      return lastElement;
    },
    handleCharacterWarning(warning) {
      if (warning) {
        this.characterWarning++;
      } else {
        this.characterWarning--;
      }
    },
    handleClick(e) {
      if (e.target.localName != "input") {
        let firstLine = this.subtitleLines[0];
        let lastElement = this.getLastElementOfTheLine(firstLine);
        if (lastElement) {
          lastElement.focus();
          lastElement.selectionStart = lastElement.selectionEnd =
            lastElement.value.length;
        }
      }
    },
    handleFocus() {
      this.resetFocusContent();
      this.$emit("gotFocus");
      if (this.content.begin !== this.playTime) {
        this.setVideoPlayTime({ time: this.content.begin });
      }
      this.setActiveP({ content: this.content });
    },
    handleTimeFocus(focusTime) {
      focusTime = this.convertToSeconds(focusTime);
      this.resetFocusContent();
      this.$emit("gotFocus");
      if (focusTime !== this.playTime) {
        this.setVideoPlayTime({ time: focusTime });
      }
      this.setActiveP({ content: this.content });
    },
    handleTimeFocusEnd(focusTime) {
      focusTime = this.convertToSeconds(focusTime);
      if (focusTime % 0.04 < 0.00001) {
        focusTime = focusTime - (focusTime % 0.04);
      } else {
        focusTime = focusTime - 0.04;
      }
      if (focusTime < 0) {
        focusTime = 0;
      }
      this.resetFocusContent();
      this.$emit("gotFocus");
      if (focusTime !== this.playTime) {
        this.setVideoPlayTime({ time: focusTime });
      }
      this.setActiveP({ content: this.content });
    },
    setBegin(val) {
      this.content.begin = this.convertToSeconds(val);
      this.setBeginTimeChildren(this.content, this.content.begin);
      if (this.body && this.body.begin > this.content.begin) {
        this.body.begin = this.content.begin;
      }
      if (this.activeDiv && this.activeDiv.begin > this.content.begin) {
        this.activeDiv.begin = this.content.begin;
      }
      if (this.cue) this.removeCue(this.cue);
      let newCue = this.createCue();
      this.addCue(newCue);
      if (this.content.begin !== this.playTime) {
        this.setVideoPlayTime({ time: this.content.begin });
      }
    },
    setBeginTimeChildren(content, time) {
      if (content.contents) {
        content.contents.forEach((element) => {
          if (element.begin) {
            element.begin = time;
          }
          if (element.contents) {
            this.setBeginTimeChildren(element, time);
          }
        });
      }
    },
    setEnd(val) {
      this.content.end = this.convertToSeconds(val);
      if (this.body && this.body.end < this.content.end) {
        this.body.end = this.content.end;
      }
      if (this.activeDiv && this.activeDiv.end < this.content.end) {
        this.activeDiv.end = this.content.end;
      }
      if (this.cue) this.removeCue(this.cue);
      let newCue = this.createCue();
      this.addCue(newCue);

      let timeAdjust = 0.04;
      if (this.content.end % 0.04 > 0.0001) {
        timeAdjust = this.content.end % 0.04;
      }
      let timeUpdate = this.content.end - timeAdjust;
      if (timeUpdate < 0) {
        timeUpdate = 0;
      }
      if (timeUpdate !== this.playTime) {
        this.setVideoPlayTime({ time: timeUpdate });
      }
    },
    toggleInitDelete() {
      this.initDelete = !this.initDelete;
    },
    ...mapActions([
      "addCue",
      "removeCue",
      "updateSubtitlePlane",
      "resetFocusContent",
      "setVideoPlayTime"
    ]),
    ...mapMutations(["setActiveP"])
  }
};
</script>

<style>
.activeP {
  background-color: bisque;
}
.buttonSpacing {
  float: right;
  margin: 0.25em;
}
.deleteBlock {
  position: absolute;
  top: -4px;
  right: 0.25em;
  cursor: pointer;
  width: 12px;
  text-align: center;
  font-weight: bold;
  color: rgb(209, 0, 0);
}
.passiveP {
  background-color: rgb(238, 238, 252);
}
.pBlock {
  margin-bottom: 0.25em;
  padding: 0.5em 0.25em;
  position: relative;
}
.subtitleLines {
  padding-top: 0.2em;
  width: 100%;
}
.tempTimingBox {
  white-space: nowrap;
  padding: 0 0.25em;
  padding-right: 0;
  padding-bottom: 0.2em;
  margin: 0.25em;
}
.textSpacing {
  margin: 0.5em;
}
.timeBox {
  margin: 0.25em;
}
.timeDescription {
  color: rgba(0, 0, 0, 0.5);
  font-size: 70%;
  font-weight: bold;
}
.popup {
  z-index: 99;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
  background-color: white;
  border: 2px solid rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 0.5em;
  padding-top: 0;
}
.warningBorder {
  border: 1px solid rgba(204, 37, 7, 0.5) !important;
}
.warningText {
  color: rgb(204, 37, 7);
  font-size: 80%;
  margin-left: 0.25em;
}
</style>
