/*
  A simple XML serializer for the IMSC Data structure.
  Uses DOMParser().
  Only IMSC elements and attributes that are listed
  as properties are exported.

  Getting the imscJS parsed and through the editor
  manipulated data object as input for the constructor.
*/

/**
 * constructor
 * @param {ImscData} obj
 */
function ImscExport(obj) {
  this.ttText = `<tt xmlns='http://www.w3.org/ns/ttml'
		 xmlns:ttp='http://www.w3.org/ns/ttml#parameter'
		 xmlns:tts='http://www.w3.org/ns/ttml#styling'
     xmlns:itts='http://www.w3.org/ns/ttml/profile/imsc1#styling'
     xmlns:ebutts='urn:ebu:tt:style'
     xml:lang='${obj.xmlLang}'
     ttp:cellResolution='${obj.docCellResolution}'/>`;
  this.parser = new DOMParser();
  this.help = obj.help;
  this.xmlDoc = this.parser.parseFromString(this.ttText, "text/xml");
  this.convertColorHex = true;
  this.doc = this.xmlDoc.documentElement;
  this.stackObj = {
    stack: [this.doc],
    getLast: function() {
      return this.stack[this.stack.length - 1];
    }
  };
  this.data = obj.tt;
  this.collapsWhitespace = true; //if empty span should be filtered out
  this.vttTimes = true;
}

let proto = {
  /*
    Adding XML element and continue recursion with subtree
  */
  addElement: function(obj, name, nsUri) {
    let myNsUri = nsUri ? nsUri : "http://www.w3.org/ns/ttml";
    let parent = this.stackObj.getLast();
    let el = this.xmlDoc.createElementNS(myNsUri, name);
    parent.appendChild(el);
    this.stackObj.stack.push(el);
    this.loop(obj);
    this.stackObj.stack.pop();
  },
  aspectRatio: function(obj) {
    let el = this.stackObj.getLast();
    let val = "";
    switch (Math.trunc(obj * 10)) {
      case 17:
        val = "16 9";
        break;
      case 13:
        val = "4 3";
        break;
      default:
        let maxDecimalPlaces = 4;
        let denominator = Math.pow(10, maxDecimalPlaces);
        let numerator = obj.toFixed(maxDecimalPlaces) * denominator;
        val = `${numerator} ${denominator}`;
    }
    if (val !== "") {
      el.setAttribute("ttp:displayAspectRatio", val);
    }
  },
  begin: function(obj) {
    var parent = this.stackObj.getLast();
    if (parent.nodeName == "p") {
      var time = this.vttTimes ? this.getVttTime(obj) : obj;
      parent.setAttribute("begin", time);
    }
  },
  body: function(obj) {
    this.addElement(obj, "body");
  },
  br: function(obj) {
    this.addElement(obj, "br");
  },
  cellResolution: function(obj) {
    let el = this.stackObj.getLast();
    let val = obj["w"] + " " + obj["h"];
    el.setAttribute("ttp:cellResolution", val);
  },
  contents: function(obj) {
    for (var i = 0; i < obj.length; i++) {
      var content = obj[i];
      var kind = content.kind;
      if (this[kind]) {
        this[kind](content);
      }
    }
  },
  div: function(obj) {
    this.addElement(obj, "div");
  },
  end: function(obj) {
    var parent = this.stackObj.getLast();
    if (parent.nodeName == "p") {
      var time = this.vttTimes ? this.getVttTime(obj) : obj;
      parent.setAttribute("end", time);
    }
  },
  getVttTime: function(seconds) {
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
    loop through the object and apply method
    to data if there is a method defined
    for the key i.e. attribute or element
    name
  */
  head: function(obj) {
    this.addElement(obj, "head");
  },
  "http://www.w3.org/ns/ttml#styling backgroundColor": function(obj) {
    var value = "";
    if (this.convertColorHex) {
      value = obj
        .map(function(x) {
          var chex = x.toString(16);
          return chex.length == 1 ? "0" + chex : chex;
        })
        .join("");
      value = "#" + value;
    } else {
      value = "rgba(" + obj.join() + ")";
    }
    this.setAttribute("tts:backgroundColor", value);
  },
  "http://www.w3.org/ns/ttml#styling color": function(obj) {
    var value = "";
    if (this.convertColorHex) {
      value = obj
        .map(function(x) {
          var chex = x.toString(16);
          return chex.length == 1 ? "0" + chex : chex;
        })
        .join("");
      value = "#" + value;
    } else {
      value = "rgba(" + obj.join() + ")";
    }
    this.setAttribute("tts:color", value);
  },
  "http://www.w3.org/ns/ttml#styling direction": function(obj) {
    this.setAttribute("tts:direction", obj);
  },
  "http://www.w3.org/ns/ttml#styling disparity": function(obj) {
    var value = obj.value + obj.unit;
    this.setAttribute("tts:disparity", value);
  },
  "http://www.w3.org/ns/ttml#styling display": function(obj) {
    this.setAttribute("tts:display", obj);
  },
  "http://www.w3.org/ns/ttml#styling displayAlign": function(obj) {
    this.setAttribute("tts:displayAlign", obj);
  },
  "http://www.w3.org/ns/ttml#styling extent": function(obj) {
    var value = obj.w.value + obj.w.unit + " " + obj.h.value + obj.h.unit;
    this.setAttribute("tts:extent", value);
  },
  "http://www.w3.org/ns/ttml/profile/imsc1#styling forcedDisplay": function(
    obj
  ) {
    this.setAttribute("itts:forcedDisplay", obj);
  },
  "http://www.w3.org/ns/ttml/profile/imsc1#styling fillLineGap": function(obj) {
    this.setAttribute("itts:fillLineGap", obj);
  },
  "http://www.w3.org/ns/ttml#styling fontFamily": function(obj) {
    var value = obj
      .map(function(x) {
        return x.trim();
      })
      .join();
    this.setAttribute("tts:fontFamily", value);
  },
  "http://www.w3.org/ns/ttml#styling fontSize": function(obj) {
    var value = obj.value + obj.unit;
    this.setAttribute("tts:fontSize", value);
  },
  "http://www.w3.org/ns/ttml#styling fontStyle": function(obj) {
    this.setAttribute("tts:fontStyle", obj);
  },
  "http://www.w3.org/ns/ttml#styling fontWeight": function(obj) {
    this.setAttribute("tts:fontWeight", obj);
  },
  "http://www.w3.org/ns/ttml#styling lineHeight": function(obj) {
    var value = obj.value + obj.unit;
    this.setAttribute("tts:lineHeight", value);
  },
  "http://www.w3.org/ns/ttml#styling opacity": function(obj) {
    this.setAttribute("tts:opacity", obj);
  },
  "http://www.w3.org/ns/ttml#styling origin": function(obj) {
    var value = obj.w.value + obj.w.unit + " " + obj.h.value + obj.h.unit;
    this.setAttribute("tts:origin", value);
  },
  "http://www.w3.org/ns/ttml#styling overflow": function(obj) {
    this.setAttribute("tts:overflow", obj);
  },
  "http://www.w3.org/ns/ttml#styling padding": function(obj) {
    var value = obj
      .map(function(x) {
        return `${x.value}${x.unit}`;
      })
      .join(" ");
    this.setAttribute("tts:padding", value);
  },
  "http://www.w3.org/ns/ttml#styling position": function(obj) {
    var hValue = obj.h.edge + " " + obj.h.offset.value + obj.h.offset.unit;
    var vValue = obj.v.edge + " " + obj.v.offset.value + obj.v.offset.unit;
    var value = hValue + " " + vValue;
    this.setAttribute("tts:position", value);
  },
  "http://www.w3.org/ns/ttml#styling ruby": function(obj) {
    this.setAttribute("tts:ruby", obj);
  },
  "http://www.w3.org/ns/ttml#styling rubyAlign": function(obj) {
    this.setAttribute("tts:rubyAlign", obj);
  },
  "http://www.w3.org/ns/ttml#styling rubyPosition": function(obj) {
    this.setAttribute("tts:rubyPosition", obj);
  },
  "http://www.w3.org/ns/ttml#styling rubyReserve": function(obj) {
    var value = obj[0];
    if (obj.length === 2 && obj[1] !== null) {
      value += " " + obj[1].value + obj[1].unit;
    }
    this.setAttribute("tts:rubyReserve", value);
  },
  "http://www.w3.org/ns/ttml#styling shear": function(obj) {
    var value = obj.value + obj.unit;
    this.setAttribute("tts:shear", value);
  },
  "http://www.w3.org/ns/ttml#styling showBackground": function(obj) {
    this.setAttribute("tts:showBackground", obj);
  },
  "http://www.w3.org/ns/ttml#styling textAlign": function(obj) {
    this.setAttribute("tts:textAlign", obj);
  },
  "http://www.w3.org/ns/ttml#styling textCombine": function(obj) {
    this.setAttribute("tts:textCombine", obj[0]);
  },
  "http://www.w3.org/ns/ttml#styling textDecoration": function(obj) {
    var value = obj.join(" ");
    this.setAttribute("tts:textDecoration", value);
  },
  "http://www.w3.org/ns/ttml#styling textShadow": function(obj) {
    var value = obj[0]
      .filter((x) => x !== null)
      .map(function(x) {
        if (x.value) {
          return `${x.value}${x.unit}`;
        } else {
          return this.convertColorHex
            ? `#${this.help.colorArrayToHexRgba(x)}`
            : `rgba(${x.join()})`;
        }
      }, this)
      .join(" ");
    this.setAttribute("tts:textShadow", value);
  },
  "http://www.w3.org/ns/ttml#styling unicodeBidi": function(obj) {
    this.setAttribute("tts:unicodeBidi", obj);
  },
  "http://www.w3.org/ns/ttml#styling visibility": function(obj) {
    this.setAttribute("tts:visibility", obj);
  },
  "http://www.w3.org/ns/ttml#styling wrapOption": function(obj) {
    this.setAttribute("tts:wrapOption", obj);
  },
  "http://www.w3.org/ns/ttml#styling writingMode": function(obj) {
    this.setAttribute("tts:writingMode", obj);
  },
  id: function(obj) {
    this.setAttributeNS("http://www.w3.org/XML/1998/namespace", "id", obj);
  },
  iterateData: function() {
    this.loop(this.data);
  },
  layout: function(obj) {
    this.addElement(obj, "layout");
  },
  loop: function(obj) {
    for (var key in obj) {
      if (this[key] && obj[key]) {
        this[key](obj[key]);
      }
    }
  },
  p: function(obj) {
    this.addElement(obj, "p");
  },
  regionID: function(obj) {
    this.setAttribute("region", obj);
  },
  regions: function(obj) {
    for (var key in obj) {
      this.addElement(obj[key], "region");
    }
  },
  setAttribute: function(name, value) {
    if (value) {
      var parent = this.stackObj.getLast();
      parent.setAttribute(name, value);
    }
  },
  setAttributeNS: function(ns, name, value) {
    if (value) {
      var parent = this.stackObj.getLast();
      parent.setAttributeNS(ns, name, value);
    }
  },
  span: function(obj) {
    if (
      this.collapsWhitespace === true &&
      obj.text &&
      obj.text.trim().length === 0
    ) {
      return;
    }
    this.addElement(obj, "span");
  },
  styleAttrs: function(obj) {
    this.loop(obj);
  },
  text: function(obj) {
    var parent = this.stackObj.getLast();
    var textNode = this.xmlDoc.createTextNode(obj);
    parent.appendChild(textNode);
  },
  "urn:ebu:tt:style linePadding": function(obj) {
    var value = obj.value + obj.unit;
    this.setAttribute("ebutts:linePadding", value);
  },
  "urn:ebu:tt:style multiRowAlign": function(obj) {
    this.setAttribute("ebutts:multiRowAlign", obj);
  }
};

ImscExport.prototype = proto;

export default ImscExport;
