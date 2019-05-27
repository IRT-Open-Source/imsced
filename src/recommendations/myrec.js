function MyRec() {}

var proto = {
  paraListViewAll: true, //show all subtitles or only the subtitles upcoming
  showMenu: ["body", "div", "p", "span"],
  showForcedLineBreaks: false,
  style: {
    attrs: {
      textAlign: {
        excludeValues: ["left", "right"]
      }
    }
  },
  video: {
    width: 40,
    widthMetric: "vw"
  }
};

MyRec.prototype = proto;

export default MyRec;
