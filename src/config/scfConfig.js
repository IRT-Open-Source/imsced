function ScfConfig() {}

var proto = {
  url: "http://scf-service.irt.de:9000/convert",
  importFormats: ["imsc", "stl"],
  exportFormats: ["ebu-tt-d-basic-de", "ebu-tt-d"]
};

ScfConfig.prototype = proto;

export default ScfConfig;
