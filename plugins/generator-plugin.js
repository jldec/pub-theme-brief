module.exports = function(generator) {

  var opts = generator.opts;
  var hb = generator.handlebars;
  var u = generator.util;

  hb.registerHelper('mod', function(n, frame) {
    return frame.data.index % n || 0;
  });

  hb.registerHelper('box-style', function(frame) {
    var bg = this['background-image'];
    if (bg) {
      return 'style=\'background-image:url("' + escape(bg) + '"); background-size:cover;\'';
    }
  });


}
