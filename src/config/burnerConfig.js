function BurnerConfig() {}

var proto = {
  videoResolutionOptions: [
    {
      width: 1920,
      height: 1080
    },
    {
      width: 960,
      height: 540
    },
    {
      width: 640,
      height: 360
    },
    {
      width: 512,
      height: 288
    },
    {
      width: 480,
      height: 270
    },
    {
      width: 320,
      height: 180
    }
  ],
  defaultExportQuality: 23,
  qualityOptions: [15, 20, 23, 26],
  url: "http://localhost:9010" // TODO
};

BurnerConfig.prototype = proto;

export default BurnerConfig;
