<!-- Configuration/Settings -->
<template>
  <div>
    <b-modal
      class="customized-model"
      no-enforce-focus
      hide-footer
      static
      lazy
      scrollable
      header-text-variant="secondary"
      v-model="showConfigUi"
      title="Settings"
    >
      <div role="tablist">
        <b-card no-body>
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button
              block
              href="#"
              v-b-toggle.accordion-1
              variant="secondary"
              class="align-acc-left"
            >
              {{ getLabelText("userInterface") }}
            </b-button>
          </b-card-header>
          <b-collapse
            id="accordion-1"
            visible
            accordion="config-accordion"
            role="tabpanel"
          >
            <b-card-body>
              <b-card-text>
                <!-- user interface configs -->

                <!-- Select language for User Interface  -->
                <DropDownGeneric
                  :options="getAvailableLanguages()"
                  :selected="lang"
                  :labelName="getLabelText('Language')"
                  @valueChanged="setLang"
                />
                <hr class="full-width-hr" />
                <!-- Choose menu style  -->
                <DropDownGeneric
                  v-if="uiLayout == 'bootstrap'"
                  :options="menuStyleOptions"
                  :selected="menuStyle"
                  :labelName="`${getLabelText('genericMenuType')}:`"
                  @valueChanged="setMenuStyle"
                />
                <hr class="full-width-hr" />
                <DropDownGeneric
                  :options="['bootstrap', 'plain']"
                  :selected="uiLayout"
                  :labelName="'UI Layout:'"
                  @valueChanged="setUiLayout"
                />
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body>
          <!-- subtitle guidelines config -->
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button
              block
              href="#"
              v-b-toggle.accordion-standards
              variant="secondary"
              class="align-acc-left"
            >
              {{ getLabelText("subtitleGuidelines") }}
            </b-button>
          </b-card-header>
          <b-collapse
            id="accordion-standards"
            accordion="config-accordion"
            role="tabpanel"
          >
            <b-card-body>
              <b-card-text>
                <div class="buttons">
                  <span
                    class="mr-1 mt-1 btn btn-secondary btn-sm py-0"
                    variant="secondary"
                  >
                    <CustomFileChooser
                      :getText="true"
                      id="settingsUpload"
                      :labelText="getLabelText('load')"
                      name="Load"
                      @textSent="uploadSettings"
                    />
                  </span>
                  <ButtonGeneric
                    :buttonName="getLabelText('save')"
                    @click.native="downloadSettings"
                  />
                </div>
                <RadioGeneric
                  :options="['show', 'hide']"
                  :translateOptions="true"
                  :selected="showHints"
                  :labelName="getLabelText('showHints')"
                  @valueChanged="setShowHints"
                />
                <InputGeneric
                  :value="charsPerLine"
                  type="number"
                  :step="1"
                  :labelName="getLabelText('charsPerLine')"
                  @valueChanged="setCharsPerLine"
                />
                <br />
                <InputGeneric
                  :value="readingSpeed"
                  type="number"
                  :step="1"
                  :labelName="getLabelText('readingSpeed')"
                  @valueChanged="setReadingSpeed"
                />
                <br />
                <InputGeneric
                  :value="minStDuration"
                  type="number"
                  :step="0.01"
                  :labelName="getLabelText('minStDuration')"
                  @valueChanged="setMinStDuration"
                />
                <br />
                <InputGeneric
                  :value="maxLinesPerST"
                  type="number"
                  :step="1"
                  :labelName="getLabelText('maxSTLines')"
                  @valueChanged="setMaxLinesPerST"
                />
                <br />
                <RadioGeneric
                  :options="['show', 'hide']"
                  :translateOptions="true"
                  :selected="showVisualization"
                  :labelName="getLabelText('showVisualization')"
                  @valueChanged="setShowVisualization"
                />
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body>
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button
              block
              href="#"
              v-b-toggle.accordion-2
              variant="secondary"
              class="align-acc-left"
            >
              {{ getLabelText("services") }}
            </b-button>
          </b-card-header>
          <b-collapse
            id="accordion-2"
            accordion="config-accordion"
            role="tabpanel"
          >
            <!-- services config -->
            <b-card no-body>
              <b-tabs card content-class="mt-3">
                <b-tab title="SCF Service">
                  <b-card-title> SCF Service</b-card-title>
                  <b-card-text>
                    <RadioGeneric
                      :options="['show', 'hide']"
                      :selected="showScfService"
                      :labelName="''"
                      @valueChanged="setShowScfService"
                    />
                    <span v-if="showScfService == 'show'">
                      <DropDownGeneric
                        v-if="scfImportFormat != 'imsc'"
                        :options="scfData.exportFormats"
                        :selected="scfExportFormat"
                        :labelName="getLabelText('scfExportFormat')"
                        @valueChanged="setScfExportFormat"
                      />
                      <br />
                      <fieldset>
                        <legend v-if="uiLayout == 'plain'">
                          {{ getLabelText("scfStartOffset") }}
                        </legend>
                        <b v-else>{{ getLabelText("scfStartOffset") }}</b>
                        <InputGeneric
                          :value="getScfStartOffsetFrames()"
                          :labelName="''"
                          @valueChanged="setOffsetFrames"
                        />
                      </fieldset>
                      <br />
                      <DropDownGeneric
                        :options="srtTemplateOptions"
                        :selected="srtImportTemplate"
                        :labelName="getLabelText('srtTemplateFile')"
                        @valueChanged="setSrtImportTemplate"
                      />
                      <br />
                      <InputGeneric
                        :value="srtImportLang"
                        :labelName="'SRT import language'"
                        @valueChanged="setSrtImportLang"
                      />
                      <br />
                    </span>
                  </b-card-text>
                </b-tab>

                <b-tab title="Burn-In Service">
                  <b-card-title>Burn-In Service</b-card-title>
                  <b-card-text>
                    <RadioGeneric
                      :options="['on', 'off']"
                      :translateOptions="true"
                      :selected="activateBurnIn ? 'on' : 'off'"
                      :labelName="''"
                      @valueChanged="setActivateBurnIn"
                    />
                    <hr class="full-width-hr" />
                    <fieldset>
                      <legend v-if="uiLayout == 'plain'">
                        {{ getLabelText("exportIsdAsPng") }}
                      </legend>
                      <h5 v-else>{{ getLabelText("exportIsdAsPng") }}</h5>
                      <InputGeneric
                        :value="getImageExportWidth()"
                        type="number"
                        :labelName="getLabelText('imageExportWidth')"
                        @valueChanged="setImageExportWidth"
                      />
                      <br />
                      <InputGeneric
                        :value="getImageExportHeight()"
                        type="number"
                        :labelName="getLabelText('imageExportHeight')"
                        @valueChanged="setImageExportHeight"
                      />
                    </fieldset>
                  </b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </b-collapse>
        </b-card>

        <b-card no-body>
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button
              block
              href="#"
              v-b-toggle.accordion-3
              variant="secondary"
              class="align-acc-left"
            >
              {{ getLabelText("styleMenus") }}
            </b-button>
          </b-card-header>
          <b-collapse
            id="accordion-3"
            accordion="config-accordion"
            role="tabpanel"
          >
            <b-card-body>
              <b-card-text>
                <!-- style menu config -->
                <RadioGeneric
                  :options="['show', 'hide']"
                  :translateOptions="true"
                  :selected="showBodyMenu"
                  :labelName="`${getLabelText('elementMenu')} <Body>`"
                  @valueChanged="setShowBodyMenu"
                />
                <hr class="full-width-hr" />
                <RadioGeneric
                  :options="['show', 'hide']"
                  :translateOptions="true"
                  :selected="showDivMenu"
                  :labelName="`${getLabelText('elementMenu')} <div>`"
                  @valueChanged="setShowDivMenu"
                />
                <hr class="full-width-hr" />
                <RadioGeneric
                  :options="['show', 'hide']"
                  :translateOptions="true"
                  :selected="showPMenu"
                  :labelName="`${getLabelText('elementMenu')} <p>`"
                  @valueChanged="setShowPMenu"
                />
                <hr class="full-width-hr" />
                <RadioGeneric
                  :options="['show', 'hide']"
                  :translateOptions="true"
                  :selected="showSpanMenu"
                  :labelName="`${getLabelText('elementMenu')} <span>`"
                  @valueChanged="setShowSpanMenu"
                />
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body>
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button
              block
              href="#"
              v-b-toggle.accordion-4
              variant="secondary"
              class="align-acc-left"
            >
              {{ getLabelText("advanced") }}
            </b-button>
          </b-card-header>
          <b-collapse
            id="accordion-4"
            accordion="config-accordion"
            role="tabpanel"
          >
            <b-card-body>
              <b-card-text>
                <!-- advanced stuff config -->
                <RadioGeneric
                  :options="['on', 'off']"
                  :translateOptions="true"
                  :selected="forcedOnly ? 'on' : 'off'"
                  :labelName="'Display forced only mode'"
                  @valueChanged="setForcedOnlyMode"
                />
                <hr class="full-width-hr" />
                <RadioGeneric
                  :options="[
                    'allowed only',
                    'allowed + default',
                    'default only'
                  ]"
                  :selected="showEmojisSetting"
                  :labelName="'Show Emojis'"
                  @valueChanged="setShowEmojisSetting"
                />
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body>
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button
              block
              href="#"
              v-b-toggle.accordion-5
              variant="secondary"
              class="align-acc-left"
            >
              Debug
            </b-button>
          </b-card-header>
          <b-collapse
            id="accordion-5"
            accordion="config-accordion"
            role="tabpanel"
          >
            <b-card-body>
              <b-card-text>
                <!-- debug config -->
                <RadioGeneric
                  :options="['on', 'off']"
                  :translateOptions="true"
                  :selected="debug ? 'on' : 'off'"
                  :labelName="'Debug info'"
                  @valueChanged="setDebug"
                />
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
import ButtonGeneric from "./ButtonGeneric.vue";
import CheckboxGeneric from "./CheckboxGeneric.vue";
import CustomFileChooser from "./CustomFileChooser.vue";
import DropDownGeneric from "./DropDownGeneric.vue";
import InputGeneric from "./InputGeneric.vue";
import RadioGeneric from "./RadioGeneric.vue";
import { saveAs } from "file-saver";

export default {
  components: {
    ButtonGeneric,
    CheckboxGeneric,
    CustomFileChooser,
    DropDownGeneric,
    InputGeneric,
    RadioGeneric
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
      "activateBurnIn",
      "charsPerLine",
      "config",
      "debug",
      "forcedOnly",
      "lang",
      "maxLinesPerST",
      "menuStyleConfig",
      "menuStyle",
      "minStDuration",
      "readingSpeed",
      "showEmojisSetting",
      "showHints",
      "showRegionSelect",
      "showSpanMenu",
      "showPMenu",
      "showDivMenu",
      "showBodyMenu",
      "showVisualization",
      "scfExportFormat",
      "scfData",
      "showScfService",
      "scfImportFormat",
      "srtImportTemplate",
      "srtTemplateOptions",
      "srtImportLang",
      "uiData",
      "uiLayout"
    ])
  },
  methods: {
    downloadSettings() {
      let settingsData = {
        showHints: this.showHints,
        showVisualization: this.showVisualization,
        charsPerLine: this.charsPerLine,
        readingSpeed: this.readingSpeed,
        minStDuration: this.minStDuration,
        maxLinesPerST: this.maxLinesPerST
      };
      const settingsJson = JSON.stringify(settingsData);
      var blob = new Blob([settingsJson], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, "imscED_subtitle_guidelines.json");
    },

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
    getScfStartOffsetFrames() {
      return this.config.defaultOffsetFrames;
    },
    uploadSettings(data) {
      let dataObj = null;
      try {
        dataObj = JSON.parse(data);
      } catch (error) {
        alert("Error: Invalid file! ", error);
        return;
      }
      if (dataObj.hasOwnProperty("showHints"))
        this.setShowHints(dataObj.showHints);
      if (dataObj.hasOwnProperty("showVisualization"))
        this.setShowVisualization(dataObj.showVisualization);
      if (dataObj.hasOwnProperty("charsPerLine"))
        this.setCharsPerLine(dataObj.charsPerLine);
      if (dataObj.hasOwnProperty("readingSpeed"))
        this.setReadingSpeed(dataObj.readingSpeed);
      if (dataObj.hasOwnProperty("minStDuration"))
        this.setMinStDuration(dataObj.minStDuration);
      if (dataObj.hasOwnProperty("maxLinesPerST"))
        this.setMaxLinesPerST(dataObj.maxLinesPerST);
    },
    ...mapMutations([
      "setDebug",
      "setActivateBurnIn",
      "setCharsPerLine",
      "setMaxLinesPerST",
      "setMinStDuration",
      "setReadingSpeed",
      "setShowEmojisSetting",
      "setShowHints",
      "setShowRegionSelect",
      "setShowSpanMenu",
      "setShowPMenu",
      "setShowDivMenu",
      "setShowBodyMenu",
      "setShowVisualization",
      "setScfExportFormat",
      "setShowScfService",
      "setLang",
      "setMenuStyle",
      "setSrtImportLang",
      "setSrtImportTemplate",
      "setUiLayout"
    ]),
    ...mapActions([
      "setImageExportHeight",
      "setImageExportWidth",
      "setForcedOnlyMode",
      "setOffsetFrames"
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
.align-acc-left {
  display: flex;
}
.full-width-hr {
  margin: 10px -20px 10px;
}

.checkboxGroup {
  display: inline-block;
  margin: 0.5em;
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
.buttons {
  float: right;
}
</style>
