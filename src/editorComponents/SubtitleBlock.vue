<template>
  <div>
    <div
      :id="[content.editorId]"
      :class="['pBlock', activeClass, { warningBorder: showWarning }]"
      @click="handleClick"
    >
      <span id="tempTimingBox">
        <span class="timingValues">{{ convertToVttTime(content.begin) }}</span>
        <span class="hyphen">-</span>
        <span class="timingValues">{{ convertToVttTime(content.end) }}</span>
        <span v-if="showWarning" class="warningText">
          <div v-if="minDurationWarning">
            {{ getLabelText("minDurationWarning") }}
          </div>
          <div v-if="timingWarning">{{ getLabelText("timingWarning") }}</div>
          <div v-if="stLinesWarning">{{ getLabelText("tooManyLines") }}</div>
          <div v-if="characterWarning > 0">
            {{ getLabelText("tooManyChars") }}
          </div>
        </span>
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
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import SubtitleLine from "./SubtitleLine.vue";
import SpanElement from "./SpanElement.vue";
import TextImsc from "./TextImsc.vue";

export default {
  name: "SubtitleBlock",
  components: {
    SpanElement,
    TextImsc,
    SubtitleLine
  },
  data() {
    return {
      characterWarning: 0
    };
  },
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  computed: {
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
    contentStyles() {
      return this.content ? this.content.styleAttrs : undefined;
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
      "activeP",
      "custom",
      "debug",
      "helper",
      "lang",
      "maxLinesPerST",
      "minStDuration",
      "playTime",
      "readingSpeed",
      "showHints",
      "uiData"
    ])
  },
  methods: {
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
    containsRealSpan(content) {
      return content.contents.some(
        (item) => item.kind == "span" && item.hasOwnProperty("regionID")
      );
    },
    convertToVttTime(seconds) {
      return this.helper.vttTimestamp(seconds);
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
    ...mapActions(["resetFocusContent", "setVideoPlayTime"]),
    ...mapMutations(["setActiveP"])
  }
};
</script>

<style>
.subtitleLines {
  width: 100%;
}

.warningBorder {
  border: 2px solid rgba(240, 57, 25, 0.4) !important;
}

.warningText {
  color: rgb(204, 37, 7);
  font-size: 80%;
}

.passiveP {
  background-color: ghostwhite;
}

.activeP {
  background-color: bisque;
}

.pBlock {
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  padding: 5px;
  display: flex;
  justify-content: flex-start;
}

#tempTimingBox {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-right: 10px;
  padding-left: 5px;
}

.hyphen {
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
}

.timingValues {
  font-family: Arial, Helvetica, sans-serif;
}

.border {
  margin: 2px;
  padding: 2px;
  border: 2px solid black;
}
</style>
