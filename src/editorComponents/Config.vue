<!-- Configuration/Settings -->
<template>
  <div>
    <b-modal
      class="customized-model"
      hide-backdrop
      no-enforce-focus
      hide-footer
      static
      lazy
      scrollable
      v-model="showConfigUi"
      title="Settings"
    >
      <DropDownGeneric
        :options="['bootstrap', 'plain']"
        :selected="uiLayout"
        :labelName="'UI Layout:'"
        @valueChanged="setUiLayout"
      />

      <!-- Choose menu style  -->
      <DropDownGeneric
        v-if="uiLayout == 'bootstrap'"
        :options="menuStyleOptions"
        :selected="menuStyle"
        :labelName="`${getLabelText('genericMenuType')}:`"
        @valueChanged="setMenuStyle"
      />

      <!-- Select language for User Interface  -->
      <DropDownGeneric
        :options="getAvailableLanguages()"
        :selected="lang"
        :labelName="getLabelText('Language')"
        @valueChanged="setLang"
      />

      <DropDownGeneric
        v-if="scfImportFormat != 'imsc' && showScfService == 'show'"
        :options="scfData.exportFormats"
        :selected="scfExportFormat"
        :labelName="getLabelText('scfExportFormat')"
        @valueChanged="setScfExportFormat"
      />

      <RadioGeneric
        :options="['show', 'hide']"
        :translateOptions="true"
        :selected="showBodyMenu"
        :labelName="`${getLabelText('elementMenu')} <Body>`"
        @valueChanged="setShowBodyMenu"
      />

      <RadioGeneric
        :options="['show', 'hide']"
        :translateOptions="true"
        :selected="showDivMenu"
        :labelName="`${getLabelText('elementMenu')} <div>`"
        @valueChanged="setShowDivMenu"
      />

      <RadioGeneric
        :options="['show', 'hide']"
        :translateOptions="true"
        :selected="showPMenu"
        :labelName="`${getLabelText('elementMenu')} <p>`"
        @valueChanged="setShowPMenu"
      />

      <RadioGeneric
        :options="['show', 'hide']"
        :translateOptions="true"
        :selected="showSpanMenu"
        :labelName="`${getLabelText('elementMenu')} <span>`"
        @valueChanged="setShowSpanMenu"
      />

      <RadioGeneric
        :options="['show', 'hide']"
        :translateOptions="true"
        :selected="showRegionSelect"
        :labelName="'Regions'"
        @valueChanged="setShowRegionSelect"
      />

      <RadioGeneric
        :options="['show', 'hide']"
        :selected="showScfService"
        :labelName="'SCF Service'"
        @valueChanged="setShowScfService"
      />

      <RadioGeneric
        :options="['on', 'off']"
        :translateOptions="true"
        :selected="activateBurnIn ? 'on' : 'off'"
        :labelName="'Activate Burn-In Service'"
        @valueChanged="setActivateBurnIn"
      />

      <RadioGeneric
        :options="['on', 'off']"
        :translateOptions="true"
        :selected="debug ? 'on' : 'off'"
        :labelName="'Debug info'"
        @valueChanged="setDebug"
      />

      <RadioGeneric
        :options="['on', 'off']"
        :translateOptions="true"
        :selected="forcedOnly ? 'on' : 'off'"
        :labelName="'Display forced only mode'"
        @valueChanged="setForcedOnlyMode"
      />

      <div>
        <fieldset>
          <legend v-if="uiLayout == 'plain'">
            {{ getLabelText("exportIsdAsPng") }}
          </legend>
          <b v-else>{{ getLabelText("exportIsdAsPng") }}</b>
          <InputGeneric
            :value="getImageExportWidth()"
            :labelName="getLabelText('imageExportWidth')"
            @valueChanged="setImageExportWidth"
          />
          <InputGeneric
            :value="getImageExportHeight()"
            :labelName="getLabelText('imageExportHeight')"
            @valueChanged="setImageExportHeight"
          />
        </fieldset>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
import DropDownGeneric from "./DropDownGeneric.vue";
import InputGeneric from "./InputGeneric.vue";
import RadioGeneric from "./RadioGeneric.vue";

export default {
  components: {
    DropDownGeneric,
    InputGeneric,
    RadioGeneric
  },
  data() {
    return {};
  },
  computed: {
    showConfigUi: {
      get() {
        return this.$store.state.showConfigUi;
      },
      set(val) {
        this.$store.commit("setShowConfigUi", val);
      }
    },
    menuStyleOptions() {
      var styles = [];
      for (var style in this.menuStyleConfig.styles) {
        styles.push(style);
      }
      return styles;
    },
    uiLayout: {
      get() {
        return this.$store.state.uiLayout;
      },
      set(val) {
        this.$store.commit("setuiLayout", val);
      }
    },
    ...mapState([
      "config",
      "forcedOnly",
      "debug",
      "activateBurnIn",
      "showRegionSelect",
      "showSpanMenu",
      "showPMenu",
      "showDivMenu",
      "showBodyMenu",
      "scfExportFormat",
      "scfData",
      "showScfService",
      "scfImportFormat",
      "lang",
      "menuStyleConfig",
      "menuStyle",
      "uiData",
      "uiLayout"
    ])
  },
  methods: {
    getImageExportHeight() {
      return this.config.defaultImageExportSize.height;
    },
    getImageExportWidth() {
      return this.config.defaultImageExportSize.width;
    },
    getAvailableLanguages() {
      return this.uiData.getAvailableLanguages();
    },
    getLabelText(name) {
      return this.uiData.getLabel(name, this.lang);
    },
    ...mapMutations([
      "setDebug",
      "setActivateBurnIn",
      "setShowRegionSelect",
      "setShowSpanMenu",
      "setShowPMenu",
      "setShowDivMenu",
      "setShowBodyMenu",
      "setScfExportFormat",
      "setShowScfService",
      "setLang",
      "setMenuStyle",
      "setUiLayout"
    ]),
    ...mapActions([
      "setImageExportHeight",
      "setImageExportWidth",
      "setForcedOnlyMode"
    ])
  }
};
</script>

<style lang="scss" scoped>
* /deep/ {
  @import "~bootstrap/dist/css/bootstrap.min";
}
/deep/ .customized-model .modal-dialog {
  margin-right: 0;
  margin-top: 4em;
}

#saveConfig {
  margin-top: 2rem;
}

#config {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 100%;
}

#selectLang {
  margin-bottom: 20px;
  float: left;
}
</style>