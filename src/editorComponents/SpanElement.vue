<template>
  <div>
    <p v-if="hasRubyAttr()" @click="focusBubble" :class="spanLevelClass">
      {{ getRubyAttribute() }}
    </p>
    <p v-else @click="focusBubble" :class="spanLevelClass">
      Span element
    </p>
  </div>
</template>

<script>
export default {
  props: {
    element: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      required: true
    }
  },
  computed: {
    spanLevelClass: function() {
      if (this.level < 4) {
        return "higher-span-" + this.level;
      } else {
        return "higher-span";
      }
    }
  },
  methods: {
    focusBubble() {
      if (this.debug) console.log("got focus");
      this.$emit("gotFocus");
    },
    getRubyAttribute() {
      let attr = "";
      let attrs = Object.keys(this.element.styleAttrs);
      attrs.forEach((element) => {
        let name = element.split(" ")[1];
        if (name == "ruby") {
          attr = "Ruby - " + this.element.styleAttrs[element];
        }
      });
      return attr;
    },
    hasRubyAttr() {
      if (JSON.stringify(this.element.styleAttrs).includes("ruby")) return true;
      return false;
    }
  }
};
</script>

<style scoped>
/* first span level */
.higher-span-1 {
  margin: 0;
  padding: 2px;
  color: rgba(0, 0, 0, 0.75);
  font-size: 75%;
  font-weight: bold;
}

/* second span level (inside span-1)*/
.higher-span-2 {
  margin: 0;
  padding: 2px;
  color: rgba(0, 0, 0, 0.75);
  font-size: 75%;
  font-weight: bold;
}

/* third span level (inside span-2)*/
.higher-span-3 {
  margin: 0;
  padding: 2px;
  color: rgba(0, 0, 0, 0.75);
  font-size: 75%;
  font-weight: bold;
}

/* for deeper span levels that are not defined */
.higher-span {
  margin: 0;
  padding: 2px;
  color: rgba(0, 0, 0, 0.75);
  font-size: 75%;
  font-weight: bold;
}

.higher-span:hover,
.higher-span-1:hover,
.higher-span-2:hover,
.higher-span-3:hover {
  background-color: rgba(129, 129, 129, 0.15);
  cursor: pointer;
}
</style>
