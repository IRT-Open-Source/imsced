/*
  A simple XML serializer for the IMSC Data structure.
  Uses DOMParser().
  Only IMSC elements and attributes that are listed
  as properties are exported.

  Getting the imscJS parsed and through the editor
  manipulated data object as input for the constructor.
*/
function ImscExport(obj) {
  this.ttText =
    "<tt xmlns='http://www.w3.org/ns/ttml' \
		 xmlns:ttp='http://www.w3.org/ns/ttml#parameter' \
		 xmlns:tts='http://www.w3.org/ns/ttml#styling' \
		 xmlns:itts='http://www.w3.org/ns/ttml/profile/imsc1#styling'/>";
  this.parser = new DOMParser();
  this.xmlDoc = this.parser.parseFromString(this.ttText, "text/xml");
  this.convertColorHex = true;
  this.doc = this.xmlDoc.documentElement;
  this.stackObj = {
    stack: [this.doc],
    getLast: function() {
      return this.stack[this.stack.length - 1];
    }
  };
  this.data = obj;
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
  //TODO: Better to reuse function in helper
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
  "http://www.w3.org/ns/ttml#styling showBackground": function(obj) {
    this.setAttribute("tts:showBackground", obj);
  },
  "http://www.w3.org/ns/ttml#styling textAlign": function(obj) {
    this.setAttribute("tts:textAlign", obj);
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
      if (this[key]) {
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
  "urn:ebu:tt:style multiRowAlign": function(obj) {
    var value = obj.value;
    this.setAttribute("ebutts:multiRowAlign", value);
  }
};

ImscExport.prototype = proto;

export default ImscExport;
