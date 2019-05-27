/*
 Creating a dummy region that can be used as base for 
 a new region.
*/
function MyRegion(regionId) {
  this.id = regionId;
  this.begin = 0;
  this.end = Number.POSITIVE_INFINITY;
  this.styleAttrs = {
    "http://www.w3.org/ns/ttml#styling displayAlign": "center",
    "http://www.w3.org/ns/ttml#styling writingMode": "lrtb",
    "http://www.w3.org/ns/ttml#styling extent": {
      h: {
        value: 30,
        unit: "%"
      },
      w: {
        value: 80,
        unit: "%"
      }
    },
    "http://www.w3.org/ns/ttml#styling showBackground": "whenActive",
    "http://www.w3.org/ns/ttml#styling origin": {
      h: {
        value: 60,
        unit: "%"
      },
      w: {
        value: 10,
        unit: "%"
      }
    }
  };
  this.sets = [];
}

var proto = {};

MyRegion.prototype = proto;

export default MyRegion;
