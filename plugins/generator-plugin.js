module.exports = function(generator) {

  var opts = generator.opts;
  var hb = generator.handlebars;
  var u = generator.util;

  hb.registerHelper('box-style', function(frame) {
    var bg = this['background-image'];
    if (bg) {
      return 'style=\'background-image:url("' +
        hb.fixPath(bg) +
        '"); background-size:cover;\'';
    }
  });

}
