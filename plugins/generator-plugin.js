module.exports = function(generator) {

  var opts = generator.opts;
  var hb = generator.handlebars;
  var u = generator.util;

  hb.registerHelper('navIcon', function(frame) {

    return hb.defaultFragmentHtml('/#navicon',
      '_!arrow-circle-o-down 2x_',
      '<span class="icon">-V-</span>',
      frame);
  });


  hb.registerHelper('box-style', function(frame) {
    var bg = this['background-image'];
    if (bg) {
      return 'style=\'background-image:url("' +
        hb.fixPath(bg) +
        '"); background-size:cover;\'';
    }
  });

}
