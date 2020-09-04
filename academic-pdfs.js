var fs = require("fs");
var pdfjs = require("pdfjs-dist/es5/build/pdf.js");

var pdfPath = process.argv[2];
var data = new Uint8Array(fs.readFileSync(pdfPath));

// Load the PDF file.
var loadingTask = pdfjs.getDocument({
  data: data,
  cMapUrl: 'cmaps/',
  cMapPacked: true,
});

loadingTask.promise
  .then(function (pdfDocument) {
    console.log("# PDF document loaded.");

    // Get the first page.
    pdfDocument.getPage(1).then(function (page) {
      var viewport = page.getViewport({ scale: 1.0 });

      page.getTextContent().then(function(textContent) {
        textContent.items.map(function(item) {
          console.log(item);
          const tx = pdfjs.Util.transform( // eslint-disable-line no-undef
            viewport.transform,
            item.transform
          );

          const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
          const dividedHeight = item.height / fontHeight;
          console.log({
            x: Math.round(item.transform[4]),
            y: Math.round(item.transform[5]),
            width: Math.round(item.width),
            height: Math.round(dividedHeight <= 1 ? item.height : dividedHeight),
            text: item.str,
            font: item.fontName
          });
        });
      });
    });
  })
  .catch(function (reason) {
    console.log(reason);
  });

