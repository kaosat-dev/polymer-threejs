
function captureScreen(callback, domElement, width, height, mimeType) {
  var srcImg, _aspectResize,
    _this = this;

	var width  = width  || 640;
	var height = height || 480;
	var mimeType = mimeType || 'image/png';

  if (!domElement) {
    throw new Error("Cannot Do screenshot without canvas domElement");
  }
  srcImg = domElement.toDataURL(mimeType);

  _aspectResize = function(srcUrl, dstW, dstH) {
    /* 
    resize an image to another resolution while preserving aspect
         
    @param {String} srcUrl the url of the image to resize
    @param {Number} dstWidth the destination width of the image
    @param {Number} dstHeight the destination height of the image
    @param {Number} callback the callback to notify once completed with callback(newImageUrl)
    */

    var cpuScaleAspect, img, onLoad;
    cpuScaleAspect = function(maxW, maxH, curW, curH) {
      var ratio;
      ratio = curH / curW;
      if (curW >= maxW && ratio <= 1) {
        curW = maxW;
        curH = maxW * ratio;
      } else if (curH >= maxH) {
        curH = maxH;
        curW = maxH / ratio;
      }
      return {
        width: curW,
        height: curH
      };
    };
    onLoad = function() {
      var canvas, ctx, mimetype, newDataUrl, offsetX, offsetY, scaled;
      canvas = document.createElement('canvas');
      canvas.width = dstW;
      canvas.height = dstH;
      ctx = canvas.getContext('2d');
      scaled = cpuScaleAspect(canvas.width, canvas.height, img.width, img.height);
      offsetX = (canvas.width - scaled.width) / 2;
      offsetY = (canvas.height - scaled.height) / 2;
      ctx.drawImage(img, offsetX, offsetY, scaled.width, scaled.height);
      mimetype = "image/png";
      newDataUrl = canvas.toDataURL(mimetype);
	  callback(newDataUrl);
    };
    img = new Image();
    img.onload = onLoad;
    return img.src = srcUrl;
  };
  _aspectResize(srcImg, width, height);

};

