var
  VectorDrawable = require('./VectorDrawable');

module.exports = converter;

function converter(svgData) {
  return VectorDrawable.createFromSVG(svgData).toString();
}

converter.VectorDrawable = VectorDrawable;