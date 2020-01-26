function DefaultConfig() {}

var proto = {
  defaultRenderDiv: {
    id: "renderDiv"
  },
  defaultVideo: {
    containerId: "videoContainer",
    videoId: "v1",
    videoControls: true,
    autobuffer: false
  },
  defaultImageExportSize: {
    width: 1920,
    height: 1080
  },
  defaultOffsetSeconds: 0,
  defaultOffsetFrames: "00:00:00:00"
};

DefaultConfig.prototype = proto;

export default DefaultConfig;
