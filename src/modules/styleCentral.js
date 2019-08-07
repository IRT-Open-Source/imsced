/*
  Helper module for all style attribute related operation.
  Stores also what values are allowed for style attribute and
  what kind of data structure attributes have.
*/
function StyleCentral() {
  //TODO: Import custom settings here
}
//TODO: Describe what he different properties of the attribtes mean
//      e.g. editOn, valueObject etc.
var proto = {
  attrs: {
    backgroundColor: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["body", "div", "p", "span"],
      valueArray: true,
      delimiter: "," //value array, delimter mandatory
    },
    color: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["body", "div", "p", "span"],
      valueArray: true,
      delimiter: "," //value array, delimter mandatory
    },
    direction: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["ltr", "rtl"],
      editOn: ["body", "div", "p", "span"]
    },
    display: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["auto", "none"],
      editOn: ["body", "div", "p", "span"]
    },
    displayAlign: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["before", "after"],
      editOn: ["region"]
    },
    extent$h: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["region"],
      valueObject: true
    },
    extent$w: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["region"],
      valueObject: true
    },
    forcedDisplay: {
      ns: "http://www.w3.org/ns/ttml/profile/imsc1#styling",
      allowedValues: [true, false],
      editOn: ["body", "div", "p", "region", "span"]
    },
    fillLineGap: {
      ns: "http://www.w3.org/ns/ttml/profile/imsc1#styling",
      allowedValues: [true, false],
      editOn: ["region"]
    },
    fontFamily: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["p", "span"],
      valueArray: true
    },
    fontSize: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["body", "div", "p", "span"],
      valueObject: true //value not stored as string
    },
    fontStyle: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["normal", "italic", "oblique"],
      editOn: ["body", "div", "p", "span"]
    },
    fontWeight: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["normal", "bold"],
      editOn: ["body", "div", "p", "span"]
    },
    lineHeight: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["p"],
      valueObject: true //value not stored as string
    },
    multiRowAlign: {
      ns: "urn:ebu:tt:style",
      allowedValues: ["start", "center", "end", "auto"],
      editOn: ["region", "body", "div", "p"]
    },
    opacity: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["region"]
    },
    origin$h: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["region"],
      valueObject: true
    },
    origin$w: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["region"],
      valueObject: true
    },
    showBackground: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["always", "whenActive"],
      editOn: ["region"]
    },
    textAlign: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["start", "center", "end", "left", "right"],
      editOn: ["body", "p"]
    },
    textShadow$0: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["span"],
      valueObject: true
    },
    textShadow$1: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["span"],
      valueObject: true
    },
    textShadow$2: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["span"],
      valueObject: true
    },
    textShadow$3: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["span"],
      valueArray: true,
      delimiter: "," //value array, delimter mandatory
    },    
    unicodeBidi: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["normal", "embed", "bidiOverride"],
      editOn: ["p", "span"]
    },
    visibility: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["visible", "hidden"],
      editOn: ["body", "div", "image", "p", "region", "span"]
    },
    wrapOption: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["wrap", "noWrap"],
      editOn: ["body", "div", "p", "span"]
    },
    writingMode: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["lrtb", "rltb", "tbrl", "tblr", "lr", "rl", "tb"],
      editOn: ["region"]
    }
  },
  /*
    Sets value of style attribute according to its
    imscJS data structure type
  */
  setAttr(name, styles, val) {
    //access to values depends on data structure type
    var isValueObject = this.attrs[name].valueObject;
    var isValueArray = this.attrs[name].valueArray;
    if (name == "fillLineGap") {
      if (val == "true") {
        val = true;
      } else {
        val = false;
      }
    }
    if (isValueArray) {
      //transform if val not already array
      if (!Array.isArray(val)) {
        val = val.split(this.attrs[name].delimiter);
      }
    }
    var styleName = this.getStyleName(name);
    if (isValueArray && name.includes("$")) {
      var composition = this.getComposition(name);
      if (Array.isArray(styles[styleName])) {
        styles[styleName][0][composition.propertyName] = val;
      }
      else {
        styles[styleName][composition.propertyName] = val;
      }
    }
    else if (isValueObject) {
      var valueEntry = this.getValueEntry(name, styles);
      valueEntry.value = val;
    }
    else {
      styles[styleName] = val;
    }
  },
  getComposition(name) {
    var composition = name.split("$");
    return {
      'wrapperName': composition[0],
      'propertyName': composition[1]
    }; 
  },
  /*
    get style name depends on data structure type
  */
  getStyleName(name) {
    var namespace = this.attrs[name].ns;
    if (name.includes("$")) {
      var composition = this.getComposition(name);
      name = composition.wrapperName;
    }
    return namespace + " " + name;
  },
  /*
    get composed value entry
  */
  getComposedValueEntry(name, styles) {
    var styleName = this.getStyleName(name);
    var composition = this.getComposition(name);
    var propertyName =composition.propertyName; 
    var styleEntry = styles[styleName];
    styleEntry = Array.isArray(styleEntry) ? styleEntry[0] : styleEntry;
    return styleEntry[propertyName];
  },
  /*
    get value entry depends on data structure type
  */
  getValueEntry(name, styles) {
    if (name.includes("$")) {
      return this.getComposedValueEntry(name, styles);
    }
    else {
      var styleName = this.getStyleName(name);
      return styles[styleName];
    }
  },  
  /*
    Checks if a concrete style attribute should have the option
    to be edited. This could be used for example to decide if 
    a edit UI should be generated for this attribute.
  */
  editable(name, styles, contentKind) {
    //styles may be undefined, e.g. region styles on span
    if (!styles) {
      return false;
    }
    var contentAllowsEdit = this.attrs[name].editOn.includes(contentKind);
    var styleIsSet = false;
    if (name.includes("$")) {
      var composition = name.split("$");
      var wrapperName = composition[0];
      if (styles[this.attrs[name].ns + " " + wrapperName]) {
        styleIsSet = true;
      }
    } else {
      if (
        styles[this.attrs[name].ns + " " + name] ||
        typeof styles[this.attrs[name].ns + " " + name] === "boolean"
      ) {
        //e.g. fillLineGap
        styleIsSet = true;
      }
    }
    return contentAllowsEdit && styleIsSet;
  }
};

StyleCentral.prototype = proto;

export default StyleCentral;
