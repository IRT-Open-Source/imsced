<template>
  <div class="lineWithHints" @focusout="handleFocusOut">
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
    <ButtonGeneric
      v-if="showDelete"
      :class="{ visible: active, deleteLine }"
      :buttonName="'delete subtitle line'"
      icon="window-close"
      iconSize="xs"
      :iconStyle="{
        color: 'grey'
      }"
      @click.native="deleteLine"
    />
    <ButtonGeneric
      v-if="level < 1"
      :class="{ visible: active, addLine }"
      :buttonName="'add subtitle line'"
      icon="plus-circle"
      iconSize="xs"
      :iconStyle="{
        color: 'grey'
      }"
      @click.native="addLine"
    />
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
            @gotFocusByApp="handleFocus(item, 'gotFocusByApp')"
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
                @gotFocusByApp="handleFocus(item, 'gotFocusByApp')"
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
import ButtonGeneric from "./ButtonGeneric.vue";
import SpanElement from "./SpanElement.vue";
import TextImsc from "./TextImsc.vue";

export default {
  name: "SubtitleLine",
  components: {
    ButtonGeneric,
    SpanElement,
    TextImsc
  },
  data() {
    return {
      active: false,
      characterWarning: false,
      textLength: 0
    };
  },
  props: {
    contentGroup: {
      type: Array,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    parent: {
      type: Object,
      required: true
    },
    showDelete: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["activeSpan", "charsPerLine", "showHints"])
  },
  watch: {
    charsPerLine() {
      this.updateCharacterWarning();
    },
    textLength() {
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
    addLine(e) {
      e.stopPropagation();
      this.$emit(
        "addLineAfter",
        this.contentGroup[this.contentGroup.length - 1].editorId
      );
    },
    deleteLine(e) {
      e.stopPropagation();
      let contentIds = [];
      this.contentGroup.forEach((obj, i) => {
        contentIds.push(obj.editorId);
      });
      this.$emit("deleteLine", contentIds);
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
    handleFocus(item, event = "gotFocus") {
      this.resetFocusContent();
      this.$emit(event);
      this.active = true;
      if (item.styleAttrs) {
        /* We need to ignore span with no styles,
         otherwise span parents with styles are
         possibly not set as active span.
      */
        this.setActiveSpan({ content: item });
      }
    },
    handleFocusOut() {
      this.active = false;
    },
    handleSpanFocus(item) {
      this.$emit("gotFocus");
      this.active = true;
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
.addLine {
  position: absolute;
  right: 0.5em;
  margin-top: 1.25em;
}
.addLine,
.deleteLine {
  visibility: hidden;
}
.charactersHint {
  display: flex;
  justify-content: flex-end;
  font-size: 80%;
  margin-right: 0.5em;
  margin-bottom: -1.5em;
  z-index: 2;
}
.deleteLine {
  position: absolute;
  right: 0.5em;
  margin-top: -0.125em;
}
.hintWarning {
  color: rgb(204, 37, 7);
}
.hintOk {
  color: rgb(0, 150, 0);
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
.subtitleLine {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.textInput {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-right: 2px;
  padding-left: 2px;
  width: 100%;
}
.visible {
  visibility: visible !important;
}
</style>
