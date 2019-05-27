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
      editOn: ["body", "div", "p"]
    },
    extent$h: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["body", "div", "p"],
      valueObject: true
    },
    extent$w: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["body", "div", "p"],
      valueObject: true
    },
    fillLineGap: {
      ns: "http://www.w3.org/ns/ttml/profile/imsc1#styling",
      allowedValues: [true, false],
      editOn: ["body", "div", "p"]
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
      editOn: ["body", "div", "p"]
    },
    origin$h: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["body", "div", "p"],
      valueObject: true
    },
    origin$w: {
      ns: "http://www.w3.org/ns/ttml#styling",
      editOn: ["body", "div", "p"],
      valueObject: true
    },
    showBackground: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["always", "whenActive"],
      editOn: ["div", "p"]
    },
    textAlign: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["start", "center", "end", "left", "right"],
      editOn: ["body", "p"]
    },
    unicodeBidi: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["normal", "embed", "bidiOverride"],
      editOn: ["p", "span"]
    },
    writingMode: {
      ns: "http://www.w3.org/ns/ttml#styling",
      allowedValues: ["lrtb", "rltb", "tbrl", "tblr", "lr", "rl", "tb"],
      editOn: ["body", "div", "p"]
    }
  },
  /*
    Sets value of style attribute according to its
    imscJS data structure type
  */
  setAttr(name, styles, val) {
    var valueEntry;
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
    //e.g. h property of extent { h: { unit: "%", value: 80} }
    if (name.includes("$")) {
      var composition = name.split("$");
      var wrapperName = composition[0]; // e.g. 'extent'
      var propertyName = composition[1]; //e.g. 'h'
      if (isValueObject) {
        styles[this.attrs[name].ns + " " + wrapperName][
          propertyName
        ].value = val;
      } else {
        styles[this.attrs[name].ns + " " + wrapperName][propertyName] = val;
      }
    } else {
      if (isValueObject) {
        styles[this.attrs[name].ns + " " + name].value = val;
      } else {
        styles[this.attrs[name].ns + " " + name] = val;
      }
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
      var propertyName = composition[1];
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
