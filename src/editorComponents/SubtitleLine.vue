<template>
  <div class="lineWithHints">
    <template v-if="showHints == 'show' && level == 0">
      <div
        v-bind:class="[
          characterWarning ? 'hintWarning' : 'hintOk',
          'charactersHint'
        ]"
      >
        {{ textLength }}/{{ charsPerLine }}
      </div>
    </template>
    <div class="subtitleLine">
      <template v-for="(item, index) in contentGroup">
        <div
          class="textInput"
          v-if="item.text && item.text.trim()"
          :key="index"
        >
          <TextImsc
            :element="item"
            @gotFocus="handleFocus(item)"
            @textChanged="handleChange"
          />
        </div>

        <!-- Span with children or span with no whitespace text-->
        <template v-else-if="item.contents">
          <div :key="`span_${item.editorId}`" class="textInput nestedSpan">
            <SpanElement
              v-if="item.styleAttrs"
              :element="item"
              :level="level + 1"
              @gotFocus="handleSpanFocus(item)"
            />

            <template v-for="(group, index) in getContentGroups(item)">
              <SubtitleLine
                :parent="item"
                :contentGroup="group"
                :level="level + 1"
                :key="`span_${index}`"
                @textChanged="handleChange"
                @gotFocus="handleFocus(item)"
                @characterWarning="handleCharacterWarning"
              />
            </template>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import SpanElement from "./SpanElement.vue";
import TextImsc from "./TextImsc.vue";

export default {
  name: "SubtitleLine",
  components: {
    SpanElement,
    TextImsc
  },
  data() {
    return {
      characterWarning: false,
      textLength: 0
    };
  },
  props: {
    parent: {
      type: Object,
      required: true
    },
    contentGroup: {
      type: Array,
      required: true
    },
    level: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(["charsPerLine", "debug", "playTime", "showHints"])
  },
  watch: {
    textLength() {
      this.updateCharacterWarning();
    },
    charsPerLine() {
      this.updateCharacterWarning();
    }
  },
  mounted() {
    this.updateTextLength();
  },
  methods: {
    _getText(content, text) {
      if (content.text) {
        text += content.text;
      }
      if (content.contents) {
        content.contents.forEach((element) => {
          text = this._getText(element, text);
        });
      }
      return text;
    },
    getContentGroups(content) {
      let lines = [];
      if (content.contents) {
        let lineCounter = 0;
        lines.push([]);
        content.contents.forEach((item) => {
          if (item.kind == "span") {
            lines[lineCounter].push(item);
          } else if (item.kind == "br") {
            lineCounter++;
            lines.push([]);
          }
        });
      }
      return lines;
    },
    handleChange() {
      this.updateTextLength();
      if (this.level > 0) {
        this.$emit("textChanged");
      }
    },
    handleCharacterWarning(warning) {
      this.$emit("characterWarning", warning);
    },
    handleFocus(item) {
      this.resetFocusContent();
      this.$emit("gotFocus");
      if (item.styleAttrs) {
        /* We need to ignore span with no styles,
         otherwise span parents with styles are
         possibly not set as active span.
      */
        this.setActiveSpan({ content: item });
      }
    },
    handleSpanFocus(item) {
      this.$emit("gotFocus");
      if (this.parent.styleAttrs) {
        this.setActiveSpan({ content: item });
      }
    },
    updateCharacterWarning() {
      if (
        this.textLength > this.charsPerLine &&
        this.characterWarning == false
      ) {
        this.characterWarning = true;
        this.$emit("characterWarning", true);
      } else if (
        this.textLength <= this.charsPerLine &&
        this.characterWarning == true
      ) {
        this.characterWarning = false;
        this.$emit("characterWarning", false);
      }
    },
    updateTextLength() {
      let textArray = [];
      this.contentGroup.forEach((element) => {
        textArray.push(this._getText(element, ""));
      });
      let text = textArray.join("");
      text = text.trim().replace(/\s+/g, " ");
      this.textLength = text.length;
    },
    ...mapActions(["resetFocusContent"]),
    ...mapMutations(["setActiveSpan"])
  }
};
</script>

<style>
.textInput {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-right: 2px;
  padding-left: 2px;
  width: 100%;
}

.subtitleLine {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.lineWithHints {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.nestedSpan {
  border: 0.2em solid rgba(129, 129, 129, 0.075);
  margin-top: 0.15em;
  padding: 0.25em;
  background-color: rgba(129, 129, 129, 0.075);
}

.charactersHint {
  display: flex;
  justify-content: flex-end;
  font-size: 80%;
  margin-right: 0.5em;
}

.hintWarning {
  color: rgb(204, 37, 7);
}

.hintOk {
  color: rgb(0, 150, 0);
}
</style>
