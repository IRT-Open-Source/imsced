<template>
  <div>
    <!-- contentImsc is BODY element => can only contain DIV elements -->
    <template v-if="type == 'body' && content.contents">
      <template v-for="item in content.contents">
        <contentElement
          v-if="item.kind == 'div'"
          :content="item"
          :key="item.editorId"
          @gotFocus="handleFocus"
        />
      </template>
    </template>

    <template v-else-if="type == 'div' && content.contents">
      <!-- contentImsc is DIV element => can contain DIV or P elements -->
      <template v-for="item in content.contents">
        <SubtitleBlock
          v-if="item.kind == 'p'"
          :content="item"
          :key="item.editorId"
          @gotFocus="handleFocus"
        />
        <contentElement
          v-else-if="item.kind == 'div'"
          :content="item"
          :key="item.editorId"
          @gotFocus="handleFocus"
        />
      </template>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import SubtitleBlock from "./SubtitleBlock.vue";

export default {
  name: "contentElement",
  components: {
    SubtitleBlock
  },
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  computed: {
    type() {
      if (this.content) {
        return this.content.kind;
      }
    },
    ...mapState(["activeDiv", "refreshSubtitles"])
  },
  watch: {
    refreshSubtitles(newValue) {
      if (
        newValue &&
        this.content.kind == "div" &&
        this.content.contents &&
        this.content.contents[0].kind == "p"
      ) {
        this.content.contents.sort((a, b) => {
          if (a.begin == b.begin) {
            return a.end - b.end;
          } else {
            return a.begin - b.begin;
          }
        });
        this.setRefreshSubtitles(false);
      }
    }
  },
  methods: {
    handleFocus() {
      this.resetFocusContent();
      this.$emit("gotFocus");
      if (this.type == "div") {
        this.setActiveDiv({ content: this.content });
      }
    },
    ...mapMutations(["setActiveDiv", "setRefreshSubtitles"]),
    ...mapActions(["resetFocusContent"])
  }
};
</script>

<style></style>
