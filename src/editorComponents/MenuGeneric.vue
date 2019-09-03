<!-- Style Attributes for simple menu -->
<template>
  <div class="bs-wrapper">
    <!-- region styles -->
    <div v-if="showRegionSelect === 'show' && activeP && activeP.regionID">
      <b-card sub-title="REGION styles" class="region-style">
        <DropDownGenericBS
          :options="myRegionIds"
          :selected="activeRegionId"
          :labelName="'Select a region'"
          :dropKey="myDropKey"
          @valueChanged="setNewRegion"
        />
        <ButtonGenericBS
          class="mt-1"
          :buttonName="'Add a region'"
          @click.native="addNewRegion"
        />
      </b-card>
    </div>

    <!-- tabs for level (body, div, span, p) -->
    <b-card class="mt-2" no-body>
      <b-tabs class="tab-style" pills card vertical end>
        <!-- 
          Vertical list of content kinds, 
          kinds can be displayed differently (e.g. greyed out). 
          -->
        <b-tab
          v-for="contentKind of Object.keys(activeContentKinds)"
          :key="contentKind"
          :title="contentKind"
          :disabled="emptyContent(contentKind)"
          active
        >
          <!-- tab menu with editable attributes -->
          <b-tabs content-class="mt-4">
            <b-tab
              v-for="tab of Object.keys(activeContentKinds[contentKind])"
              :key="tab"
              :title="tab"
            >
              <!-- UI for each editable attribute based on tab and content kind  -->
              <b-row>
                <b-col
                  v-for="attr of getEditableAttrs(contentKind, tab)"
                  :key="attr"
                  :title="attr"
                >
                  <!-- 
                    UI type of the AttrStyle component is selected based on value
                     of store setting (currently the setting of "uiLayout")
                  -->
                  <AttrStyle
                    class="ml-2 attribute"
                    :name="attr"
                    :styles="getStyles(contentKind, attr)"
                    :type="getInputType(attr)"
                    :setter="getSetter(attr)"
                    :getter="getGetter(attr)"
                    @gotFocus="focusBubble"
                  />
                </b-col>
              </b-row>
            </b-tab>
          </b-tabs>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import AttrStyle from "./AttrStyle.vue";
import ButtonGenericBS from "./bootstrapComponents/ButtonGenericBS.vue";
import DropDownGenericBS from "./bootstrapComponents/DropDownGenericBS.vue";

export default {
  components: {
    AttrStyle,
    ButtonGenericBS,
    DropDownGenericBS
  },
  data() {
    return {
      contentKinds: ["region", "body", "div", "p", "span"],
      myDropKey: 0
    };
  },
  computed: {
    /*
     Returns (hashed by content kind) the tabs (e.g. position)
     with editable attributes.
    */
    activeContentKinds() {
      var activeContent = {};
      //loop through confifured content kind (e.g. br is not configured)
      for (var contentKind of this.contentKinds) {
        //get data of active tabs per content kind
        var activeTabs = this.tabsWithContent(contentKind);
        if (activeTabs && this.toBeDisplayed(contentKind)) {
          activeContent[contentKind] = activeTabs;
        }
      }
      return activeContent;
    },
    configStyles() {
      return this.menuStyleConfig.styles[this.menuStyle];
    },
    defaultSettings() {
      return this.menuStyleConfig.settings.defaults;
    },
    myRegionIds: {
      cache: false,
      get: function() {
        return Object.keys(this.currentSubtitleData.regionHash);
      }
    },
    tabNames() {
      var tabNames = [];
      for (var t in this.configStyles.tabs) tabNames.push(t);
      return tabNames;
    },
    ...mapState([
      "activeP",
      "activeSpan",
      "currentSubtitleData",
      "helper",
      "menuStyle",
      "menuStyleConfig",
      "showRegionSelect",
      "styleData"
    ]),
    ...mapGetters(["activeDiv", "activeRegionId", "body", "regionStyles"])
  },
  methods: {
    addNewRegion() {
      this.myDropKey++; //needed to display gets refresh
      this.addRegion();
    },
    emptyContent(contentKind) {
      var content = this.activeContentKinds[contentKind];
      if (Object.keys(content).length === 0 && content.constructor === Object) {
        return true;
      }
      return false;
    },
    editable(name, contentKind) {
      var styles = this.getStyles(contentKind, name);
      var isEditable = false;
      if (styles) {
        isEditable = this.styleData.editable(name, styles, contentKind);
      }
      if (this.debug)
        console.log(
          name + " on " + this.contentKind + ": " + isEditable + styles
        );
      return isEditable;
    },
    focusBubble() {
      this.$emit("gotFocus");
    },
    /* 
      Returns only the attributes of a tab like position that
      can be edited (e.g. ["textAlign", "multiRowAlign"] for content
      kind p.
     */
    getEditableAttrs(contentKind, tab) {
      var tabContent = this.configStyles.tabs[tab];
      var editableaAttrs = [];
      for (var attr of tabContent) {
        if (this.editable(attr, contentKind)) {
          editableaAttrs.push(attr);
        }
      }
      return editableaAttrs;
    },
    getGetter(attr) {
      var helper;
      if (this.configStyles.getters && this.configStyles.getters[attr]) {
        helper = this.configStyles.getters[attr];
      } else if (this.defaultSettings.getters[attr]) {
        helper = this.defaultSettings.getters[attr];
      }
      return helper;
    },
    getInputType(attr) {
      if (this.configStyles.inputTypes && this.configStyles.inputTypes[attr]) {
        return this.configStyles.inputTypes[attr];
      } else {
        return this.defaultSettings.inputTypes[attr];
      }
    },
    getSetter(attr) {
      var helper;
      if (this.configStyles.setters && this.configStyles.setters[attr]) {
        helper = this.configStyles.setters[attr];
      } else if (this.defaultSettings.setters[attr]) {
        helper = this.defaultSettings.setters[attr];
      }
      return helper;
    },

    getStyles(contentKind, attr) {
      switch (contentKind) {
        case "region":
          if(this.activeRegionId){
            return this.regionStyles;
          }
          break;
        case "body":
          if (this.body) {
            return this.body.styleAttrs;
          }
          break;
        case "div":
          if (this.activeDiv) {
            return this.activeDiv.styleAttrs;
          }
          break;
        case "span":
          if (this.activeSpan) {
            return this.activeSpan.styleAttrs;
          }
          break;
        case "p":
          if (this.activeP) {
            return this.activeP.styleAttrs;
          }
          break;
      }
    },
    /*
     Goes through the arributes that are configured for a specific tab
     (e.g. textAlign is configured for the tab position) and then checks
     if at least one of these attributes is "editable" for a specific content
     kind (e.g. span). If this is not the case (e.g. no attribute can be 
     edited for the position category of p) then the return value of false
     may be used to hide this tab when the specific content kind is selected. 
    */
    hasContent(contentKind, tab) {
      for (var attr of this.configStyles.tabs[tab]) {
        if (this.editable(attr, contentKind)) {
          return true;
        }
      }
      return false;
    },
     /* 
      Check which tabs (e.g. position or style) have any "editable
      property/attribute" (e.g. color or textAlign). This is checked
      for a specific content kind (e.g. body or p).
      Returns the configuration only of the tabs that have some
      editable properties. 
    */
    tabsWithContent(contentKind) {
      var tabsWithContent = {};
      for (var tab of Object.keys(this.configStyles.tabs)) {
        if (this.hasContent(contentKind, tab)) {
          tabsWithContent[tab] = this.configStyles.tabs[tab];
        }
      }
      return tabsWithContent;
    },
    toBeDisplayed(contentKind) {
      var storeProperty = `show${this.helper.capitalize(contentKind)}Menu`;
      return (this.$store.state[storeProperty] == 'show');
    },    
    ...mapMutations(["addRegion"]),
    ...mapActions(["setNewRegion"])
  }
};
</script>

<style scoped lang="scss">
.bs-wrapper /deep/ {
  @import "~bootstrap/dist/css/bootstrap.min";
}
.attribute {
  padding: 1em;
  border: 1px solid lightgrey;
  background-color: rgb(240, 243, 250);
}

.region-style {
  background-color: rgba(250, 244, 240, 0.5) !important;
}

.tab-style {
  background-color: rgba(240, 243, 250, 0.5) !important;
}
</style>
