<template>
  <span>
    <a @mousedown.prevent="toggleEmojiPicker">
      <span class="emoji-button" title="Pick Emoji">
        <font-awesome-icon
          icon="smile"
          size="lg"
          :style="{ color: 'rgba(0, 0, 0, 0.6)' }"
        >
        </font-awesome-icon>
      </span>
    </a>
    <div class="emoji-container">
      <div v-show="showPicker" class="emoji-picker">
        <Picker
          v-if="showEmojisSetting == 'allowed only' && emojis"
          title="Pick your emoji…"
          native
          :showSearch="false"
          :recent="emojis"
          :showCategories="false"
          :include="['recent']"
          emoji="point_up"
          @select="addEmoji"
        />
        <Picker
          v-else-if="showEmojisSetting == 'allowed + default' && emojis"
          title="Pick your emoji…"
          native
          :recent="emojis"
          emoji="point_up"
          :infiniteScroll="false"
          @select="addEmoji"
        />
        <Picker
          v-else
          title="Pick your emoji…"
          native
          emoji="point_up"
          @select="addEmoji"
        />
      </div>
    </div>
  </span>
</template>
<script>
import { Picker } from "emoji-mart-vue";
import { mapState } from "vuex";
import { allowedEmojis } from "./../config/emojis.js";
import ButtonGeneric from "./ButtonGeneric.vue";

export default {
  components: {
    ButtonGeneric,
    Picker
  },
  data() {
    return {
      showPicker: false,
      focusId: null,
      emojis: allowedEmojis
    };
  },
  created() {
    document.addEventListener("focusin", this.focusChanged);
    document.addEventListener("focusout", this.focusChanged);
  },
  computed: {
    buttonStyle() {
      return this.showPicker ? "secondary" : "light";
    },

    ...mapState(["showEmojisSetting"])
  },
  methods: {
    addEmoji(emoji) {
      this.showPicker = false;
      if (this.focusId) {
        let element = document.getElementById(this.focusId);
        if (!element || element.type != "text") {
          return;
        }
        if (element.selectionStart != undefined) {
          element.value =
            element.value.slice(0, element.selectionStart) +
            emoji.native +
            element.value.slice(element.selectionStart, element.value.length);
        } else {
          element.value = element.value + emoji.native;
        }
        element.dispatchEvent(new Event("input"));
      }
    },
    focusChanged(event) {
      // check if input field belongs to editor and not e.g. search field inside the emoji picker
      if (event.type == "focusin" && event.target.classList.contains("form-control")) {
        this.focusId = event.target.id;
      } else if (event.type == "focusout") {
        if (this.showPicker) return;
        window.setTimeout((a) => {
          this.showPicker = false;
        }, 200);
      }
    },
    toggleEmojiPicker() {
      this.showPicker = !this.showPicker;
    }
  }
};
</script>
<style scoped>
.emoji-container {
  position: relative;
}
.emoji-button {
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 0.25em 0.5em;
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.5);
  vertical-align: -0.25em;
}
.emoji-button:hover {
  cursor: pointer;
}
.emoji-picker {
  position: absolute;
  display: block;
  z-index: 999;
  top: 0;
  left: -105%;
  width: 100%;
  height: 100%;
}

*/deep/ .emoji-mart-category-label {
  display: none !important;
}
</style>
