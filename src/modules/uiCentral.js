/*
  Language dependent text for the labels of editor UI
*/

function UiCentral() {}

var proto = {
  elements: {
    backgroundColor: {
      label: {
        lang: {
          en: "Background Color",
          de: "Hintergrundfarbe"
        }
      }
    },
    begin: {
      label: {
        lang: {
          en: "begin",
          de: "Start"
        }
      }
    },
    color: {
      label: {
        lang: {
          en: "Font Color",
          de: "Schriftfarbe"
        }
      }
    },
    direction: {
      label: {
        lang: {
          en: "direction",
          de: "direction"
        }
      }
    },
    display: {
      label: {
        lang: {
          en: "display",
          de: "Sichtbarkeit"
        }
      }
    },
    displayAlign: {
      label: {
        lang: {
          en: "Vertical position",
          de: "Vertikale Ausrichtung"
        }
      }
    },
    end: {
      label: {
        lang: {
          en: "end",
          de: "Ende"
        }
      }
    },
    extent$h: {
      label: {
        lang: {
          en: "height",
          de: "Höhe"
        }
      }
    },
    extent$w: {
      label: {
        lang: {
          en: "width",
          de: "Breite"
        }
      }
    },
    forcedDisplay: {
      label: {
        lang: {
          en: "Forced Display",
          de: "Forced Display"
        }
      }
    },
    fillLineGap: {
      label: {
        lang: {
          en: "Line Gap",
          de: "Zeilenzwischenraum"
        }
      }
    },
    fontSize: {
      label: {
        lang: {
          en: "Font Size",
          de: "Schriftgröße"
        }
      }
    },
    fontFamily: {
      label: {
        lang: {
          en: "Font Family",
          de: "Schiftart"
        }
      }
    },
    fontStyle: {
      label: {
        lang: {
          en: "Font Style",
          de: "Kursiv"
        }
      }
    },
    fontWeight: {
      label: {
        lang: {
          en: "Bold/Normal",
          de: "Fett/Normal"
        }
      }
    },
    lineHeight: {
      label: {
        lang: {
          en: "Line Height",
          de: "Höhe der Zeilen"
        }
      }
    },
    multiRowAlign: {
      label: {
        lang: {
          en: "Alignment of multiple lines",
          de: "Mehrere Zeilen aurichten"
        }
      }
    },
    opacity: {
      label: {
        lang: {
          en: "opacity",
          de: "Deckkraft"
        }
      }
    },
    origin$h: {
      label: {
        lang: {
          en: "y-coordinate",
          de: "y-Koordinate"
        }
      }
    },
    origin$w: {
      label: {
        lang: {
          en: "x-coordinate",
          de: "x-Koordinate"
        }
      }
    },
    showBackground: {
      label: {
        lang: {
          en: "show Background",
          de: "Hintergrund Region"
        }
      }
    },
    textAlign: {
      label: {
        lang: {
          en: "Align",
          de: "Ausrichtung"
        }
      }
    },
    unicodeBidi: {
      label: {
        lang: {
          en: "Unicode Bidi",
          de: "Unicode Bidi"
        }
      }
    },
    visibility: {
      label: {
        lang: {
          en: "Visibility",
          de: "Sichtbarkeit"
        }
      }
    },
    wrapOption: {
      label: {
        lang: {
          en: "Line Wrapping",
          de: "Zeilenumbruch"
        }
      }
    },
    writingMode: {
      label: {
        lang: {
          en: "WritingMode",
          de: "Schreibrichtung"
        }
      }
    }
  },
  getLabel(name, lang) {
    var data = this.elements[name].label;
    if (data.lang[lang]) {
      return data.lang[lang];
    } else if (data.lang["en"]) {
      return data.lang["en"];
    } else {
      return "";
    }
  },
  getAvailableLanguages() {
    var availableLanguages = [];
    for (var key in this.elements) {
      var attrs = this.elements[key];
      for (var lang in attrs.label.lang) {
        if (!availableLanguages.includes(lang)) {
          availableLanguages.push(lang);
        }
      }
    }
    return availableLanguages;
  }
};

UiCentral.prototype = proto;

export default UiCentral;
