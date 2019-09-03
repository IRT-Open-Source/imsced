/*
  Generic helper functions
*/
const uuidVersion4 = require("uuid/v4");

function helperGeneric() {}

var proto = {
  /* capitalize first letter of a string,
     e.g. body => Body
  */
  capitalize(name) {
    if (typeof name !== 'string') {
      return ''
    }
    return name.charAt(0).toUpperCase() + name.slice(1); 
  },
  /* e.g. [255,255,255] => ffffff */
  colorArrayToHexRgb(colorArray) {
    return colorArray
      .map(function(colorDec) {
        var colorHex = colorDec.toString(16);
        if (colorHex.length == 1) {
          colorHex = "0" + colorHex;
        }
        return colorHex;
      })
      .join("")
      .slice(0, 6);
  },
  // e.g. [255,255,255,0] => ffffff00
  colorArrayToHexRgba(colorArray) {
    return colorArray
      .map(function(colorDec) {
        var colorHex = colorDec.toString(16);
        if (colorHex.length == 1) {
          colorHex = "0" + colorHex;
        }
        return colorHex;
      })
      .join("");
  },
  /* e.g. '0000ff' => [0, 0, 170, 250] */
  hexRgbToColorArray(hexRgb) {
    var colorArray = hexRgb.match(/.{2}/g).map(function(hexValue) {
      return parseInt(hexValue, 16);
    });
    //alpha channel is always set to full opacity
    colorArray.push(255);
    return colorArray;
  },
  /* e.g. '0000ffaa' => [ 0, 0, 255, 170 ]  */
  hexRgbaToColorArray(hexRgba) {
    return hexRgba.match(/.{2}/g).map(function(x) {
      return parseInt(x, 16);
    });
  },
  /* 
		e.g. { } => true or {a: 1} => false
	*/
  isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  },
  /* 
		e.g. {a: 1} => true or { } => false 
	*/
  objectHasEntries(obj) {
    return !this.isEmptyObject(obj);
  },
  /*
		Genereate a unique uuid for mostly used to get unique id values
	*/
  uuidv4() {
    return uuidVersion4();
  },
  /*
		e.g. 61 => "00:01:01.000"
	*/
  vttTimestamp(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor((seconds % 3600) % 60);
    var ms = seconds % 1;
    ms = ms.toFixed(3).slice(-3);
    return (
      `00${h}`.slice(-2) +
      ":" +
      `00${m}`.slice(-2) +
      ":" +
      `00${s}`.slice(-2) +
      "." +
      ms
    );
  }
};

helperGeneric.prototype = proto;

export default helperGeneric;
