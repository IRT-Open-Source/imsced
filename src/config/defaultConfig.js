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
  }
};

DefaultConfig.prototype = proto;

export default DefaultConfig;
