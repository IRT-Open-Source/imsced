/*
  Adding Text Track to video element and init
  cues with call back function
*/
/*
  Track is added not programmatically but using the DOM because
  in previous versions of the code, the DOM was also used to 
  remove the code.
*/
function MyTextTrack(kind, label, lang, video) {
  this.track = video.addTextTrack(kind, label, lang);
  this.track.mode = "hidden";
}

var proto = {
  addMyCue: function(inTime, outTime, inFunc, outFunc) {
    // Edge does not support VTTCue but uses TextTrackCue
    var Cue = window.VTTCue || window.TextTrackCue;
    var myCue = new Cue(inTime, outTime, "");
    myCue.onenter = inFunc;
    myCue.onexit = outFunc;
    myCue.id = this.makeCueId(inTime, outTime);
    this.track.addCue(myCue);
  },
  initCues: function(mediaTimes, inFunc, outFunc) {
    for (var i = 0; i < mediaTimes.length; i++) {
      var inTime = mediaTimes[i];
      var outTime = undefined;
      if (i < mediaTimes.length - 1) {
        outTime = mediaTimes[i + 1];
      } else {
        outTime = Number.MAX_VALUE;
      }
      // endtime in IMSC is exclusive, but in HTML seems
      // to be inclusive
      let inclusiveEndTime = outTime - 0.000000001;
      this.addMyCue(inTime, inclusiveEndTime, inFunc, outFunc);
    }
  },
  makeCueId: function(inTime, outTime) {
    return inTime + "#" + outTime;
  }
};

MyTextTrack.prototype = proto;

export default MyTextTrack;
