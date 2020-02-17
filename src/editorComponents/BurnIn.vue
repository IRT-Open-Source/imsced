<!-- Component to burn in subtitles -->
<template>
  <div id="burnIn" class="burnIn">
    <div class="options">
      <ButtonGeneric
        v-if="burnInJobRunning || jobFinished"
        :buttonName="minimizeButtonName"
        @click.native="toggleSize"
      />
      <ButtonGeneric buttonName="Hide" @click.native="toggleShowBurnIn" />
    </div>
    <div v-if="minimized">
      <div v-if="burnInJobRunning">
        <div>
          <b>Job progress:</b>
          <progress :value="progressPercentage" :max="100" />
          {{ Math.round(progressPercentage) }}%
        </div>
        <div>
          <b>Job status:</b>
          {{ progressText }}
        </div>
      </div>
      <div v-if="jobFinished">
        <div>
          <b class="jobFinished">Job finished successfully!</b>
        </div>
        <div>
          <b>Job status:</b>
          {{ progressText }}
        </div>
      </div>
    </div>
    <div v-else>
      <div class="subHeader">Burn-In Service</div>
      <!-- video source file -->
      <DropDownGeneric
        class="floatBox"
        :options="videoOptions"
        :selected="selectedVideo"
        :labelName="getLabelText('videoSource')"
        @valueChanged="setSelectedVideo"
      />
      <!-- video resolution -->
      <DropDownGeneric
        class="floatBox"
        :options="getResolutionOpts()"
        :selected="selectedResolution"
        :labelName="getLabelText('outputResolution')"
        @valueChanged="setResolution"
      />
      <!-- video quality -->
      <DropDownGeneric
        class="floatBox"
        :options="getQualityOptions()"
        :selected="selectedQuality"
        :labelName="getLabelText('outputQuality')"
        @valueChanged="setQuality"
      />
      <!-- subtitles, pngs -->
      <!-- <RadioGeneric
        :class="[{ radio: uiLayout != 'plain' }, 'clear', 'floatBox']"
        :options="['yes', 'no']"
        :selected="selectedUseCurrentST"
        :labelName="getLabelText('useCurrentST')"
        @valueChanged="setUseCurrentST"
      />
      <FileChooserGeneric
        class="clear floatBox"
        v-if="selectedUseCurrentST == 'no'"
        :name="'choosePNG'"
        :id="'choosePNG'"
        :labelText="getLabelText('choosePNG')"
        @filechange="setSubtitlePngs"
      /> -->
      <ButtonGeneric
        class="clear floatBox"
        :buttonName="getLabelText('burnInSubmit')"
        :disabled="burnInJobRunning"
        @click.native="burnInSubmit"
      />
      <div v-if="burnInJobRunning" class="clear burnInProgress floatBox">
        <div>
          <b>Job progress:</b>
          <progress :value="progressPercentage" :max="100" />
          {{ Math.round(progressPercentage) }}%
        </div>
        <div>
          <b>Job status:</b>
          {{ progressText }}
        </div>
      </div>
      <div v-if="jobFinished" class="clear burnInProgress floatBox">
        <div>
          <b class="jobFinished">Job finished successfully!</b>
        </div>
        <div>
          <b>Job status:</b>
          {{ progressText }}
        </div>
      </div>
      <br class="clear" />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import BurnerConfig from "../config/burnerConfig.js";
import ButtonGeneric from "./ButtonGeneric.vue";
import DropDownGeneric from "./DropDownGeneric.vue";
import FileChooserGeneric from "./FileChooserGeneric.vue";
import IsdExport from "../modules/isdExport.js";
import RadioGeneric from "./RadioGeneric.vue";

let burnerConfig = new BurnerConfig();

export default {
  components: {
    ButtonGeneric,
    DropDownGeneric,
    FileChooserGeneric,
    RadioGeneric
  },
  data() {
    return {
      burnerConfig,
      burnInJobRunning: false,
      intervalId: "",
      jobFinished: false,
      jobId: "",
      minimized: false,
      progressPercentage: 0,
      progressText: "",
      selectedPngs: "",
      selectedQuality: burnerConfig.defaultExportQuality,
      selectedResolution: "source",
      selectedUseCurrentST: "yes",
      selectedVideo: "",
      videoOptions: []
    };
  },
  computed: {
    minimizeButtonName() {
      return this.minimized ? "Maximize" : "Minimize";
    },
    ...mapState([
      "config",
      "currentSubtitleData",
      "debug",
      "lang",
      "uiData",
      "uiLayout"
    ])
  },
  created() {
    fetch(`${this.burnerConfig.url}/essences`, {
      method: "GET"
    })
      .then(response => {
        if (response.status != 200) {
          throw new Error(
            `Could not fetch Video files. Response status ${response.status}!`
          );
        }
        return response.json();
      })
      .then(json => {
        this.videoOptions = json;
        if (this.videoOptions.length > 0) {
          this.selectedVideo = this.videoOptions[0];
          //TODO select current video as default for export?
        }
      })
      .catch(error => {
        this.handleError(error);
      });
  },
  methods: {
    burnInGet(id) {
      fetch(`${this.burnerConfig.url}/jobs/${id}`, {
        method: "GET"
      })
        .then(response => {
          if (response.status != 200) {
            throw new Error(
              `Error requesting job status. Response status ${response.status}!`
            );
          }
          return response.json();
        })
        .then(json => {
          //console.log("response for job ", id, json);
          this.progressPercentage = json.progressPercentage;
          this.progressText = json.progressText;
          // check for end of progress
          if (json.exitStatus == 0) {
            clearInterval(this.intervalId);
            this.burnInJobRunning = false;
            this.jobFinished = true;
            // TODO reset all select fields to default?
          }
        })
        .catch(error => {
          this.handleError(error);
        });
    },
    burnInRequest() {
      const formData = new FormData();
      formData.append("essence", this.selectedVideo);
      formData.append("images", this.selectedPngs);
      let selectedResCopy = this.selectedResolution;
      if (this.selectedResolution === "source") selectedResCopy = "";
      formData.append("resolution", selectedResCopy);
      formData.append(
        "quality",
        this.burnerConfig.qualityOptions[this.selectedQuality]
      );
      fetch(`${this.burnerConfig.url}/jobs`, {
        method: "POST",
        body: formData
      })
        .then(response => {
          if (response.status != 200) {
            throw new Error(
              `Couldn't create new job. Response status ${response.status}!`
            );
          }
          return response.json();
        })
        .then(json => {
          if (json.job_id) {
            //keep track of job
            let interval_id = window.setInterval(
              function() {
                this.burnInGet(json.job_id);
              }.bind(this),
              2000
            );
            // set job
            this.jobId = json.job_id;
            this.intervalId = interval_id;
            this.progressPercentage = 0;
            this.progressText = "New job started...";
          }
        })
        .catch(error => {
          this.handleError(error);
        });
    },
    burnInSubmit() {
      if (this.burnInJobRunning) {
        alert("There is already a job running!");
        return;
      }
      this.jobFinished = false;
      if (this.selectedVideo == "") {
        alert("please select source video");
        return;
      }
      if (this.selectedUseCurrentST == "yes") {
        this.burnInJobRunning = true;
        // use isdExport
        this.progressText = "Creating Pngs from subtitles...";
        let isdExport = new IsdExport(this.currentSubtitleData.tt);
        let selectedResCopy = this.selectedResolution;
        isdExport
          .saveAsPng(this.config.defaultImageExportSize)
          .then(content => {
            this.selectedPngs = content;
            //request to api
            this.burnInRequest();
          })
          .catch(error => {
            this.handleError(error);
          });
      } else {
        if (this.selectedPngs == "") {
          alert("please select pngs");
          return;
        }
        this.burnInJobRunning = true;
        //request to api
        this.burnInRequest();
      }
    },
    getLabelText(name) {
      return this.uiData.getLabel(name, this.lang);
    },
    handleError(error) {
      if (this.debug) console.log(error);
      alert(error);
      this.resetJob();
    },

    getQualityOptions() {
      return Object.keys(this.burnerConfig.qualityOptions);
    },
    getResolutionOpts() {
      let choices = ["source"];
      this.burnerConfig.videoResolutionOptions.map(res => {
        choices.push(`${res.width}x${res.height}`);
      });
      return choices;
    },
    resetJob() {
      this.burnInJobRunning = false;
      this.jobId = "";
      this.jobFinished = false;
      if (this.intervalId != "") clearInterval(this.intervalId);
      this.intervalId = "";
      this.progressPercentage = 0;
      this.progressText = "";
      this.selectedVideo = "";
      this.selectedResolution = "source";
      this.selectedPngs = "";
      this.selectedQuality = burnerConfig.defaultExportQuality;
      this.selectedUseCurrentST = "yes";
    },
    setQuality(val) {
      this.selectedQuality = val;
    },
    setResolution(val) {
      this.selectedResolution = val;
    },
    setSelectedVideo(val) {
      this.selectedVideo = val;
    },
    setSubtitlePngs(file) {
      this.selectedPngs = file.obj;
    },
    setUseCurrentST(val) {
      this.selectedUseCurrentST = val;
    },
    toggleSize() {
      this.minimized = !this.minimized;
    },
    transformResToObj(val) {
      let splitted = val.split("x");
      return { width: splitted[0], height: splitted[1] };
    },
    ...mapMutations(["toggleShowBurnIn"])
  },
  beforeDestroy: function() {
    // TODO if job running -> cancel job in imsc-burner
    this.burnInJobRunning = false;
    if (this.intervalId != "") {
      clearInterval(this.intervalId);
    }
  }
};
</script>

<style scoped>
.burnIn {
  border: 1px solid lightgray;
  border-radius: 0.25rem;
  margin-top: 1em;
  padding: 1em;
}

.burnInProgress {
  border: 1px solid lightgray;
  border-radius: 0.25rem;
  padding: 1em;
  margin-top: 1em;
}

.clear {
  clear: both;
}

.floatBox {
  position: relative;
  float: left;
  margin-right: 1em;
  display: block;
}

.jobFinished {
  color: green;
}

.options {
  float: right;
}

.radio {
  border: 1px solid lightgray !important;
  border-radius: 0.25rem !important;
  margin-top: 1em !important;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

.subHeader {
  font-size: 1.5em;
  margin-bottom: 0.5em;
}
</style>