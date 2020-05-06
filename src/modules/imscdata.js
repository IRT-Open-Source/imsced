import imsc from "imsc";
import helperGeneric from "./helperGeneric.js";

function ImscData(text) {
  this.help = new helperGeneric();
  /*
    get xml:lang attribute value 
  */
  let xmlDoc = this.help.getXmlDocument(text);
  try {
    this.xmlLang = this.help.getXmlLang(xmlDoc);
  } catch (e) {
    console.log(e);
    this.xmlLang = "";
  }
  /*
    get ttp:cellResolution
  */
  this.docCellResolution = this.help.getCellResolution(xmlDoc);
  /*
		parse TTML document with imscJS and get data structure
	*/
  this.tt = imsc.fromXML(text);
  // set id for body
  if (this.tt.body) {
    this.body = this.tt.body;
    this.body.editorId = this.help.uuidv4();
  } else {
    return undefined;
  }
  /*
	  All <p> per timecode
	  e.g. for two subtitles with
	  begin=>0s and end=>2s and
	  one subtitle begin=>2s and
	  end 3s
	  {
		  '0#2':[
			  { <p> obj },
			  { <p> obj }
		  ],
		  '2#3': [
			  { <p> obj }
		  ]
	  }
	*/
  this.paraHash = {};
  /*
		All <region> hashed by region id
		This is just a convenience property 
		for pointer in imsc data structure
		(tt.head.layout.regions)
	*/

  this.regionHash;
}

var proto = {
  initRegionHash: function() {
    this.regionHash = this.tt.head.layout.regions;
  },
  /* 
		Recursive processing of imsc data structure to
		add editor ids and populate para hash with <p>
	*/
  initData: function() {
    var bodyContents = this.tt.body.contents;
    for (var i = 0; i < bodyContents.length; i++) {
      var child = bodyContents[i];
      if (child.kind && child.kind == "div") {
        this.processDiv(child);
      }
    }
  },
  processDiv: function(divElement) {
    divElement.editorId = this.help.uuidv4();
    if (divElement.contents) {
      this.processDivChildren(divElement, divElement.contents);
    }
  },
  processDivChildren(divParent, divChildren) {
    for (var i = 0; i < divChildren.length; i++) {
      var child = divChildren[i];
      var hash = child.begin.toString() + "#" + child.end.toString();
      /* 
			 at the moment only p with timing on begin and end
			 are suppoted
			 */
      if (child.kind == "div") {
        this.processDiv(child);
      } else if (
        child.kind == "p" &&
        child.begin !== undefined && //currently assumption is that p have begin+end
        child.end !== undefined
      ) {
        //Set Div Parent (to activate div for active p)
        child.parentDiv = divParent;
        //We need an id later on
        child.editorId = this.help.uuidv4();
        //recursive loop to tag with id's
        //p can only have inline children
        if (child.contents) {
          this.processInlineChildren(child.contents);
        }
        /*
 				 more than one p could have the same begin 
 				 and end therefore store them in an array
 				 */
        if (this.paraHash[hash] == undefined) {
          this.paraHash[hash] = [child];
        } else {
          this.paraHash[hash].push(child);
        }
      }
    }
  },
  processInlineChildren(inlineChildren) {
    for (var i = 0; i < inlineChildren.length; i++) {
      this.processInlineContent(inlineChildren[i]);
    }
  },
  processInlineContent(content) {
    if (content.kind == "span") {
      this.processSpan(content);
    } else if (content.kind == "br") {
      this.processBr(content);
    } else {
      content.editorId = this.help.uuidv4();
    }
  },
  processSpan(span) {
    span.editorId = this.help.uuidv4();
    if (span.contents) {
      this.processInlineChildren(span.contents); //recursion
    }
  },
  processBr(br) {
    br.editorId = this.help.uuidv4(); // each br gets unique id
  }
};

ImscData.prototype = proto;

export default ImscData;
