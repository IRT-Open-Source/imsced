function MenuStyleConfig() {}

var proto = {
  /*
    Config to define different styles and settings.
       * settings:
          *  default settings
          * if current menu type configured in styles has 
            no settings 
       * styles:
          * configure different types of style menus
          * mandatory properties:
              * tabs (object): listing of tabs that are available
              * each tab (e.g. "position") has an array as value
                this array contains attributes that should appear
                in that that tab (e.g. "textAlign")
          * all settings that are defined as default can also be set
            by menu type e.g.:
            * inputTypes
            * regionStyles
            * getters
            * setters
            Settings defined on a menu type will override the default settings.
  */

  // TODO split into multiple files -> load custom style file e.g. as environment variable

  settings: {
    // default settings -> will be used if no specification in styles
    defaults: {
      inputTypes: {
        backgroundColor: "simple",
        color: "simple",
        direction: "radio",
        display: "radio",
        displayAlign: "radio",
        extent$h: "simple",
        extent$w: "simple",
        forcedDisplay: "radio",
        fillLineGap: "radio",
        fontFamily: "simple",
        fontSize: "simple",
        fontStyle: "radio",
        fontWeight: "radio",
        lineHeight: "simple",
        multiRowAlign: "radio",
        opacity: "simple",
        origin$h: "simple",
        origin$w: "simple",
        showBackground: "radio",
        textAlign: "radio",
        textShadow$0: "simple",
        textShadow$1: "simple",
        textShadow$2: "simple",
        textShadow$3: "simple",
        unicodeBidi: "radio",
        visibility: "radio",
        wrapOption: "radio",
        writingMode: "radio"
      },
      regionStyles: [
        "displayAlign",
        "extent$h",
        "extent$w",
        "forcedDisplay",
        "fillLineGap",
        "multiRowAlign",
        "opacity",
        "origin$h",
        "origin$w",
        "showBackground",
        "visibility",
        "writingMode"
      ],
      getters: {
        backgroundColor: "colorArrayToHexRgba",
        color: "colorArrayToHexRgba",
        textShadow$3: "colorArrayToHexRgba"
      },
      setters: {
        backgroundColor: "hexRgbaToColorArray",
        color: "hexRgbaToColorArray",
        textShadow$3: "hexRgbaToColorArray"
      }
    }
  },
  styles: {
    // styles with different tabs and attributes
    default: {
      tabs: {
        position: ["origin$h", "origin$w", "multiRowAlign", "textAlign"],
        size: ["extent$h", "extent$w", "lineHeight"],
        background: ["backgroundColor", "showBackground"],
        text: [
          "color",
          "fontFamily",
          "fontSize",
          "fontStyle",
          "fontWeight",
          "textShadow$0",
          "textShadow$1",
          "textShadow$2",
          "textShadow$3"
        ],
        style: [
          "direction",
          "display",
          "displayAlign",
          "fillLineGap",
          "opacity",
          "visibility"
        ],
        various: ["forcedDisplay", "unicodeBidi", "wrapOption", "writingMode"]
      }
    },
    simple: {
      tabs: {
        position: ["origin$h", "origin$w", "multiRowAlign", "textAlign"],
        size: ["extent$h", "extent$w", "fontSize"],
        style: ["backgroundColor", "color", "fillLineGap"]
      }
    }
  }
};

MenuStyleConfig.prototype = proto;

export default MenuStyleConfig;
