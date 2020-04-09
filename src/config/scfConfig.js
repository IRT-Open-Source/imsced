function ScfConfig() {}

const url = "http://scf-service.irt.de:9000";

var proto = {
  url,
  endpoints: {
    convert: url + "/convert",
    template: url + "/templates"
  },
  importFormats: ["imsc", "stl", "srt"],
  exportFormats: ["ebu-tt-d-basic-de", "ebu-tt-d"]
};

ScfConfig.prototype = proto;

export default ScfConfig;
