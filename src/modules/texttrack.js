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
  addMyCue(cue) {
    this.track.addCue(cue);
  },
  removeAllCues() {
    let allCues = Object.values(this.track.cues);
    allCues.forEach((cue) => {
      this.track.removeCue(cue);
    });
  },
  removeMyCue(cue) {
    this.track.removeCue(cue);
  }
};

MyTextTrack.prototype = proto;

export default MyTextTrack;
