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
    if (typeof name !== "string") {
      return "";
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
  /* deep clones an object, 
  does not work for some cases where there are referencing loops, 
  e.g. it cannot copy a full imscdata object that contains parentDiv references! */
  cloneObj(obj) {
    let copy;
    if (obj == null || typeof obj != "object") return obj;
    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, length = obj.length; i < length; i++) {
        copy[i] = this.cloneObj(obj[i]);
      }
      return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.cloneObj(obj[attr]);
      }
      return copy;
    }
    throw new Error("Unable to copy object!");
  },
  /**
   * get ttp:cellResolution attribute value on the <tt> element
   * if attribute value is not set, returns default value
   * @param {XMLDocument} xmlDoc
   * @returns {string}
   */
  getCellResolution(xmlDoc) {
    let tt = xmlDoc.documentElement;
    let value = tt.getAttribute("ttp:cellResolution");
    if (value === null) {
      value = "32 15";
    }

    return value;
  },
  /**
   * parse XML from a string into a XMLDocument
   * @param {string} text
   * @returns {XMLDocument}
   */
  getXmlDocument(text) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(text, "text/xml");
    return xmlDoc;
  },
  /**
   * get xml:lang attribute value on the <tt> element
   * @param {XMLDocument} xmlDoc
   * @returns {string}
   */
  getXmlLang(xmlDoc) {
    let tt = xmlDoc.documentElement;
    let value = tt.getAttribute("xml:lang");
    if (value === null) {
      value = "";
    }

    return value;
  },
  /* e.g. '0000ff' => [0, 0, 170, 250] */
  hexRgbToColorArray(hexRgb) {
    if (hexRgb.length !== 6) {
      return;
    }
    var hexChar = "ABCDEFabcdef0123456789";
    var colorArray = hexRgb.match(/.{2}/g).map(function(hexValue) {
      if (hexChar.includes(hexValue[0], hexValue[1])) {
        return parseInt(hexValue, 16);
      } else {
        throw new Error("Invalid color hexadecimal value");
      }
    });
    //alpha channel is always set to full opacity
    colorArray.push(255);
    return colorArray;
  },
  /* e.g. '0000ffaa' => [ 0, 0, 255, 170 ]  */
  hexRgbaToColorArray(hexRgba) {
    if (hexRgba.length !== 8) {
      return;
    }
    var hexChar = "ABCDEFabcdef0123456789";
    var colorArray = hexRgba.match(/.{2}/g).map(function(x) {
      if (hexChar.includes(x[0], x[1])) {
        return parseInt(x, 16);
      } else {
        throw new Error("Invalid color hexadecimal value");
      }
    });
    return colorArray;
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
  },
  /*
    e.g. "00:01:01.000" => 61
  */
  seconds(vttTimestamp) {
    var seconds = new Date(`1970-01-01T${vttTimestamp}Z`).getTime() / 1000;
    return seconds;
  }
};

helperGeneric.prototype = proto;

export default helperGeneric;
