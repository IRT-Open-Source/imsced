function MyRec() {}

var proto = {
  paraListViewAll: true, //show all subtitles or only the subtitles upcoming
  showMenu: ["body", "div", "p", "span"],
  showForcedLineBreaks: false,
  style: {
    attrs: {
      textAlign: {
        excludeValues: []
      }
    }
  },
  video: {
    width: 42,
    widthMetric: "vw"
  }
};

MyRec.prototype = proto;

export default MyRec;
