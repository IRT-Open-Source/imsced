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
          @gotFocusByApp="handleFocus('gotFocusByApp')"
        />
      </template>
    </template>

    <template v-else-if="type == 'div' && content.contents">
      <!-- contentImsc is DIV element => can contain DIV or P elements -->
      <span @click="addFirstSubtitleBlock" class="addBlock"
        ><ButtonGeneric
          :buttonName="'add subtitle block'"
          icon="plus-circle"
          iconSize="xs"
          :iconStyle="{
            color: 'grey',
            backgroundColor: 'white'
          }"
      /></span>
      <template v-for="item in content.contents">
        <template v-if="item.kind == 'p'">
          <SubtitleBlock
            :content="item"
            :key="item.editorId"
            :ref="item.editorId"
            @gotFocus="handleFocus"
            @gotFocusByApp="handleFocus('gotFocusByApp')"
          />
          <span
            @click="addSubtitleBlock(item)"
            class="addBlock"
            :key="`addAfter_${item.editorId}`"
            ><ButtonGeneric
              :buttonName="'add subtitle block'"
              icon="plus-circle"
              iconSize="xs"
              :iconStyle="{
                color: 'grey',
                backgroundColor: 'white'
              }"
          /></span>
        </template>
        <contentElement
          v-else-if="item.kind == 'div'"
          :content="item"
          :key="item.editorId"
          @gotFocus="handleFocus"
          @gotFocusByApp="handleFocus('gotFocusByApp')"
        />
      </template>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import ButtonGeneric from "./ButtonGeneric.vue";
import ImscData from "../modules/imscdata.js";
import SubtitleBlock from "./SubtitleBlock.vue";

export default {
  name: "contentElement",
  components: {
    ButtonGeneric,
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
    ...mapState([
      "activeDiv",
      "currentSubtitleData",
      "framegap",
      "minStDuration",
      "playTime",
      "refreshSubtitles",
      "templateImsc"
    ]),
    ...mapGetters(["body"])
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
    addFirstSubtitleBlock() {
      let newP = this.currentSubtitleData.createP(
        this.content,
        0,
        this.minStDuration,
        this.templateImsc
      );
      this.content.contents.splice(0, 0, newP);
      if (this.body && this.body.end < newP.end) {
        this.body.end = newP.end;
      }
      if (this.content.end < newP.end) {
        this.content.end = newP.end;
      }
      if (newP.begin !== this.playTime) {
        this.setVideoPlayTime({ time: newP.begin });
      } else {
        this.updateSubtitlePlane({ time: this.playTime });
      }
      this.$nextTick(() => {
        let pComponent = this.$refs[newP.editorId][0];
        pComponent.setFocus();
      });
    },
    addSubtitleBlock(pBefore) {
      let newBegin = pBefore.end + this.framegap;
      newBegin = Math.round(newBegin * 1000) / 1000; // TODO why does is result in calc error without?
      let newP = this.currentSubtitleData.createP(
        this.content,
        newBegin,
        newBegin + this.minStDuration,
        this.templateImsc
      );
      this.content.contents.forEach((obj, i) => {
        if (obj.editorId == pBefore.editorId) {
          this.content.contents.splice(i + 1, 0, newP);
        }
      });
      if (this.body && this.body.end < newP.end) {
        this.body.end = newP.end;
      }
      if (this.content.end < newP.end) {
        this.content.end = newP.end;
      }
      if (newP.begin !== this.playTime) {
        this.setVideoPlayTime({ time: newP.begin });
      } else {
        this.updateSubtitlePlane({ time: this.playTime });
      }
      this.$nextTick(() => {
        let pComponent = this.$refs[newP.editorId][0];
        pComponent.setFocus();
      });
    },
    handleFocus(event = "gotFocus") {
      this.resetFocusContent();
      this.$emit(event);
      if (this.type == "div") {
        this.setActiveDiv({ content: this.content });
      }
    },
    ...mapMutations(["setActiveDiv", "setActiveP", "setRefreshSubtitles"]),
    ...mapActions([
      "resetFocusContent",
      "setVideoPlayTime",
      "updateSubtitlePlane"
    ])
  }
};
</script>

<style>
.addBlock {
  text-align: center;
  height: 0.7em;
  margin-bottom: 0.35em;
  margin-top: -0.375em;
  content: " ";
  display: block;
  border-bottom: 2px solid rgba(0, 0, 0, 0.25);
}
.addBlock:hover {
  border-bottom: 2px solid rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
</style>
