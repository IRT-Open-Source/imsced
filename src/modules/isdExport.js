/*
  Getting the imscJS parsed and through the editor
  manipulated data object as input for the constructor.

  Default size for result images: 1920 x 1080
*/

import imsc from "imsc";
import { store } from "../store/index";
import JSZip from "jszip";

function IsdExport(obj) {
  this.data = obj;
  (this.imageSize = {}),
    (this.mainContainer = null),
    (this.mediaEvents = obj.getMediaTimeEvents()),
    (this.renderDiv = null),
    (this.svgContainer = null);
}

let proto = {
  createContainers: function() {
    let svgContainer = this.createSvgContainer();
    let foreignObject = this.createForeignObject();
    let renderDiv = this.createRenderDiv();

    foreignObject.appendChild(renderDiv);
    svgContainer.appendChild(foreignObject);

    this.svgContainer = svgContainer;
    this.renderDiv = renderDiv;
  },
  createForeignObject: function() {
    let fo = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    fo.setAttribute("width", "100%");
    fo.setAttribute("height", "100%");

    return fo;
  },
  createMainContainer: function() {
    let div = document.createElement("div");
    div.setAttribute("height", this.imageSize.height + "px");
    div.setAttribute("width", this.imageSize.width + "px");
    div.setAttribute("overflow", "hidden");
    div.setAttribute("display", "flex");
    div.style.background = "rgba(0,0,0,0)";

    return div;
  },
  createPngImage: function(url) {
    return new Promise((resolve) => {
      let canvas = document.createElement("canvas");

      let ctx = canvas.getContext("2d");
      ctx.canvas.height = this.imageSize.height;
      ctx.canvas.width = this.imageSize.width;

      let img = new Image();
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
        let data = canvas.toDataURL("image/png");
        resolve(data.substr(data.indexOf(",") + 1));
      };
      img.src = url;
    });
  },
  createRenderDiv: function() {
    let rdiv = document.createElement("div");
    rdiv.style.height = "100%";
    rdiv.style.width = "100%";
    rdiv.style.position = "relative";
    rdiv.style.background = "rgba(0,0,0,0)";

    return rdiv;
  },
  createSvgContainer: function() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", this.imageSize.width + "px");
    svg.setAttribute("height", this.imageSize.height + "px");
    svg.setAttribute("xmlns", svg.namespaceURI);

    return svg;
  },
  prepareRendering: function() {
    while (this.mainContainer.hasChildNodes()) {
      this.mainContainer.removeChild(this.mainContainer.lastChild);
    }
    this.createContainers();
    this.mainContainer.appendChild(this.svgContainer);
  },
  renderMediaEvent: function(offset, renderDiv) {
    let isd = imsc.generateISD(this.data, offset);

    imsc.renderHTML(
      isd,
      renderDiv,
      function(uri) {
        return uri;
      },
      this.imageSize.height,
      this.imageSize.width,
      store.state.forcedOnly
    );
  },
  /*
    Generates the complete zip file.
    Returns a Promise of the generated zip file
  */

  saveAsPng: function(size = { width: 1920, height: 1080 }) {
    this.imageSize = size;
    this.mainContainer = this.createMainContainer();

    let zip = new JSZip();
    document.body.appendChild(this.mainContainer);

    let handleMediaEvent = (offset) => {
      return new Promise((resolve) => {
        this.prepareRendering();
        this.renderMediaEvent(offset, this.renderDiv);

        let svgser = new XMLSerializer().serializeToString(this.svgContainer);
        let fname = `${offset}.png`;
        let url =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgser);
        this.createPngImage(url).then(function(data) {
          zip.file(fname, data, { base64: true });
          resolve();
        });
      });
    };

    return Promise.all(this.mediaEvents.map(handleMediaEvent))
      .then(() => {
        document.body.removeChild(this.mainContainer);
        return zip.generateAsync({ type: "blob" });
      })
      .catch((reason) => {
        throw reason;
      });
  }
};

IsdExport.prototype = proto;

export default IsdExport;
