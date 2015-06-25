var
  SvgPath = require('svgpath'),
  SvgPathBoundingBox = require('svg-path-bounding-box'),
  SvgNumbers = require('svg-numbers'),
  Cheerio = require('cheerio'),
  SvgPathNormalize = require('svg-path');

module.exports = VectorDrawable;

function VectorDrawable(path, width, height) {
  this.path = path || '';
  this.width = width || 0;
  this.height = height || 0;
}

VectorDrawable.createFromSVG = function(svgData) {
  var
    doc,
    pathElement,
    svgElement,
    viewBox,
    boundingBox,
    pathDriver,
    path,
    width,
    height,
    translateX,
    translateY;

  doc = Cheerio.load(svgData, {
    xmlMode: true,
    decodeEntities: true,
    normalizeWhitespace: true
  });

  pathElement = doc('path[d]');
  svgElement = doc('svg');

  if (
    doc('rect,line,circle,ellipsis,polyline,polygon,mask,[xlink\\:href],[clip-path]').length > 0 ||
    pathElement.length != 1 ||
    svgElement.length != 1
  ) {
    throw new Error('Only monochrome simplified SVG support');
  }

  viewBox = SvgNumbers(svgElement.attr('viewBox') || '');
  if (viewBox.length != 4) {
    viewBox = [0, 0, 0, 0];
  }

  pathDriver = new SvgPath(pathElement.attr('d'));
  if (viewBox[0] || viewBox[1]) {
    pathDriver.translate(-viewBox[0], -viewBox[1]);
  }
  path = pathDriver.toString();

  boundingBox = SvgPathBoundingBox(path);

  translateX = -Math.min(boundingBox.x1, 0);
  translateY = -Math.min(boundingBox.y1, 0);
  if (translateX || translateY) {
    pathDriver.translate(translateX, translateY);
    pathDriver.__evaluateStack();
  }

  path = pathDriver
    .rel()
    .toString();

  width = Math.max(viewBox[2], boundingBox.width);
  height = Math.max(viewBox[3], boundingBox.height);

  path = SvgPathNormalize(path).toString();

  return new VectorDrawable(
    path,
    width,
    height
  )
};

VectorDrawable.prototype = {

  toString: function() {
    var
      path = this.path,
      width = this.width,
      height = this.height,
      xml;

    xml = '<vector xmlns:android="http://schemas.android.com/apk/res/android" ' +
      'android:width="' + width + 'dp" ' +
      'android:height="' + height + 'dp" ' +
      'android:viewportWidth="' + width + '" ' +
      'android:viewportHeight="' + height + '">' +
      '<path ' +
      'android:fillColor="#FF000000" ' +
      'android:pathData="' + path + '"/>' +
      '</vector>';

    return xml;
  }

};
