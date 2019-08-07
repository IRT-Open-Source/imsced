<!-- 
* Collection of components to manipulate styles attributes.
* UI for a style attribute is only generated if:
  a) it is present on the collection of style attributes that was passed on
  from a content element or region.
  b) when it has any effect i.e. it applies to the content element
  from which it is passsed or it is inherited to a descendent content element.
  </style>
  
</style>

</style>

-->
<template>
  <div class="menu">
    <AttrStyle
      v-if="editable('origin$w')"
      :name="'origin$w'"
      :styles="styles"
      :type="'simple'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('origin$h')"
      :name="'origin$h'"
      :styles="styles"
      :type="'simple'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('extent$w')"
      :name="'extent$w'"
      :styles="styles"
      :type="'simple'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('extent$h')"
      :name="'extent$h'"
      :styles="styles"
      :type="'simple'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('displayAlign')"
      :name="'displayAlign'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('writingMode')"
      :name="'writingMode'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('showBackground')"
      :name="'showBackground'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('direction')"
      :name="'direction'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('unicodeBidi')"
      :name="'unicodeBidi'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('display')"
      :name="'display'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('textAlign')"
      :name="'textAlign'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('fontWeight')"
      :name="'fontWeight'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('fontStyle')"
      :name="'fontStyle'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('fontSize')"
      :name="'fontSize'"
      :styles="styles"
      :type="'simple'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('lineHeight')"
      :name="'lineHeight'"
      :styles="styles"
      :type="'simple'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('forcedDisplay')"
      :name="'forcedDisplay'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('fillLineGap')"
      :name="'fillLineGap'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('color')"
      :name="'color'"
      :styles="styles"
      :type="'simple'"
      :getter="helper.colorArrayToHexRgb"
      :setter="helper.hexRgbToColorArray"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('backgroundColor')"
      :name="'backgroundColor'"
      :styles="styles"
      :type="'simple'"
      :getter="helper.colorArrayToHexRgba"
      :setter="helper.hexRgbaToColorArray"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('fontFamily')"
      :name="'fontFamily'"
      :styles="styles"
      :type="'simple'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('multiRowAlign')"
      :name="'multiRowAlign'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('visibility')"
      :name="'visibility'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('wrapOption')"
      :name="'wrapOption'"
      :styles="styles"
      :type="'radio'"
      @gotFocus="focusBubble"
    />

    <AttrStyle
      v-if="editable('textShadow$0')"
      :name="'textShadow$0'"
      :styles="styles"
      :type="'simple'"
      @gotFocus="focusBubble"
    />    

    <AttrStyle
      v-if="editable('textShadow$1')"
      :name="'textShadow$1'"
      :styles="styles"
      :type="'simple'"
      @gotFocus="focusBubble"
    />   

    <AttrStyle
      v-if="editable('textShadow$2')"
      :name="'textShadow$2'"
      :styles="styles"
      :type="'simple'"
      @gotFocus="focusBubble"
    /> 

    <AttrStyle
      v-if="editable('textShadow$3')"
      :name="'textShadow$3'"
      :styles="styles"
      :type="'simple'"
      :getter="helper.colorArrayToHexRgb"
      :setter="helper.hexRgbToColorArray"
      @gotFocus="focusBubble"
    />      

    <AttrStyle
      v-if="editable('opacity')"
      :name="'opacity'"
      :styles="styles"
      :type="'simple'"
      @gotFocus="focusBubble"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AttrStyle from "./AttrStyle.vue";

export default {
  components: {
    AttrStyle
  },
  props: {
    contentKind: {
      type: String,
      required: true
    },
    styles: {
      required: true
    }
  },
  computed: {
    ...mapState(["helper", "styleData"])
  },
  methods: {
    editable(name, styles = this.styles) {
      var isEditable = this.styleData.editable(name, styles, this.contentKind);
      if (this.debug)
        console.log(
          name + " on " + this.contentKind + ": " + isEditable + styles
        );
      return this.styleData.editable(name, styles, this.contentKind);
    },
    focusBubble() {
      this.$emit("gotFocus");
    }
  }
};
</script>

<style scoped>
.menu {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  background-color: #f6f8fa !important;
  color: #24292e !important;
}

.menu div {
  padding: 1vw;
}
</style>