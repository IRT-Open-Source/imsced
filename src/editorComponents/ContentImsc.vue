<template>
  <!-- Only for elements that can have styles -->
  <div v-if="content && contentWithStyles">
    <ul v-if="debug">
      <li>Debug Info Content Element</li>
      <ul>
        <li>Content Type: {{ type }}</li>
        <li>Editor-ID: {{ content.editorId }}</li>
      </ul>
    </ul>

    <!-- 
      BODY Content Element
      * Start recursion through the content tree 
    -->
    <div v-if="type == 'body'">
      <contentElement
        v-if="activeP && activeDiv"
        :content="activeDiv"
        :level="level"
      />

      <contentElement
        v-for="para in paraForView"
        :key="para.editorId"
        :content="para"
        :level="level"
      />
    </div>

    <!--TIMING FOR ELEMENTS P or SPAN  -->
    <div
      v-else-if="['p', 'span'].includes(type)"
      :id="[content.editorId]"
      :class="[contentTypeBlockClass, activeClass]"
    >
      <!-- Temporary Timing display -->
      <div id="tempTimingBox" v-if="type == 'p'">
        <div class="timingValues">{{ convertToVttTime(content.begin) }}</div>
        <div class="hyphen">-</div>
        <div class="timingValues">{{ convertToVttTime(content.end) }}</div>
      </div>

      <!-- Iteration of contents array of content element -->
      <template v-if="content.contents">
        <div class="content">
          <template v-for="item in content.contents">
            <ul v-if="debug" :key="item.editorId">
              <li>Contents of {{ type }}</li>
              <ul>
                <li>
                  {{ item }}
                </li>
              </ul>
            </ul>

            <contentElement
              v-if="item.kind == 'br'"
              :content="item"
              :key="item.editorId"
              :level="level"
            />

            <contentElement
              v-else-if="item.kind == 'span' && item.text && item.text.trim()"
              :content="item"
              :key="item.editorId"
              :level="level"
              @gotFocus="handleFocus"
            />

            <!-- Span with children or span with no whitespace text-->
            <div
              v-else-if="item.kind == 'span' && item.contents"
              :key="item.editorId"
              class="nested-span"
            >
              <SpanElement
                v-if="item.styleAttrs"
                :key="`span_${item.editorId}`"
                :element="item"
                :level="level + 1"
                @gotFocus="handleSpanFocus(item)"
              />

              <contentElement
                :content="item"
                :level="level + 1"
                @gotFocus="handleFocus"
              />
            </div>
          </template>
        </div>
      </template>

      <!-- SUBTITLE TEXT  -->
      <template v-else-if="content.text">
        <h3 v-if="debug">Content</h3>
        <TextImsc :element="content" @gotFocus="handleFocus" />
      </template>
    </div>
  </div>
  <!-- LINE BREAKS -->
  <div v-else-if="content && type == 'br' && custom.showForcedLineBreaks">
    <span>FORCED LINEBREAK</span>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import SpanElement from "./SpanElement.vue";
import TextImsc from "./TextImsc.vue";

export default {
  name: "contentElement",
  components: {
    SpanElement,
    TextImsc
  },
  props: {
    content: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      required: true
    }
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
        if (this.type == "p") {
          if (this.active) {
            return "activeP";
          } else {
            return "passiveP";
          }
        }
      }
    },
    contentStyles() {
      return this.content ? this.content.styleAttrs : undefined;
    },
    //to generate css class and appy styles by content type
    contentTypeBlockClass() {
      return this.type + "Block";
    },
    //if the content element can have styles
    contentWithStyles() {
      return ["body", "div", "p", "span"].includes(this.type);
    },
    //which subtitles should be shown
    paraForView() {
      if (this.custom.paraListViewAll) {
        return this.paraList;
      } else {
        return this.paraNext;
      }
    },
    type() {
      if (this.content) {
        return this.content.kind;
      }
    },
    ...mapState(["activeP", "custom", "debug", "helper", "playTime"]),
    ...mapGetters(["activeDiv", "paraList", "paraNext"])
  },
  methods: {
    convertToVttTime(seconds) {
      return this.helper.vttTimestamp(seconds);
    },
    handleFocus() {
      this.resetFocusContent();
      this.$emit("gotFocus");
      if (this.content.begin !== this.playTime) {
        this.setVideoPlayTime({ time: this.content.begin });
      }
      if (this.content.kind == "p") {
        this.setActiveP({ content: this.content });
      } else if (this.content.kind == "span" && this.content.styleAttrs) {
        /* We need to ignore span with no styles,
         otherwise span parents with styles are
         possibly not set as active span.
      */
        this.setActiveSpan({ content: this.content });
      }
    },
    handleSpanFocus(item) {
      this.$emit("gotFocus");
      if (item.begin && item.begin !== this.playTime) {
        this.setVideoPlayTime({ time: item.begin });
      }
      if (this.content.styleAttrs) {
        this.setActiveSpan({ content: item });
      }
    },
    ...mapActions(["resetFocusContent", "setVideoPlayTime"]),
    ...mapMutations(["setActiveP", "setActiveSpan"])
  }
};
</script>

<style>
.content {
  flex: 1;
  margin-right: 5px;
}

.content input[type="text"] {
  width: 100%;
}

.passiveP {
  background-color: ghostwhite;
}

.activeP {
  background-color: bisque;
}
.nested-span {
  border: 0.2em solid rgba(129, 129, 129, 0.075);
  margin-top: 0.5em;
  padding: 0.25em;
  background-color: rgba(129, 129, 129, 0.075);
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
</style>
