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

  settings: {
    // default settings -> will be used if no specification in styles
    defaults: {
      inputTypes: {
        backgroundColor: "simple-color",
        color: "simple-color",
        direction: "radio",
        display: "radio",
        displayAlign: "radio",
        extent$h: "simple-number",
        extent$w: "simple-number",
        forcedDisplay: "radio",
        fillLineGap: "radio",
        fontFamily: "simple",
        fontSize: "simple-number",
        fontStyle: "radio",
        fontWeight: "radio",
        lineHeight: "simple-number",
        multiRowAlign: "radio",
        opacity: "simple-number",
        origin$h: "simple-number",
        origin$w: "simple-number",
        ruby: "radio",
        rubyAlign: "radio",
        rubyPosition: "radio",
        shear: "simple-number",
        showBackground: "radio",
        textAlign: "radio",
        textShadow$0: "simple-number",
        textShadow$1: "simple-number",
        textShadow$2: "simple-number",
        textShadow$3: "simple-color",
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
  position: {
    tabs: {
      RegionArea: ["origin$w", "origin$h", "extent$w", "extent$h"]
    }
  },
  styles: {
    // styles with different tabs and attributes
    default: {
      tabs: {
        Alignment: ["textAlign", "multiRowAlign", "displayAlign"],
        Display: ["display", "forcedDisplay", "visibility", "opacity"],
        Font: ["fontFamily", "fontSize", "fontStyle", "fontWeight"],
        TextShadow: [
          "textShadow$0",
          "textShadow$1",
          "textShadow$2",
          "textShadow$3"
        ],
        Ruby: ["ruby", "rubyAlign", "rubyPosition", "shear"],
        Color: ["color", "backgroundColor", "showBackground"],
        WritingDirection: ["writingMode", "direction", "unicodeBidi"],
        Line: ["lineHeight", "fillLineGap", "wrapOption"]
      }
    },
    simple: {
      tabs: {
        Font: ["fontFamily", "fontSize"],
        Color: ["color", "backgroundColor"],
        Line: ["lineHeight", "fillLineGap"]
      }
    }
  }
};

MenuStyleConfig.prototype = proto;

export default MenuStyleConfig;
