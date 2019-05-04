(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
require("/Users/jleschner/pub/theme-brief/plugins/generator-plugin.js")(generator);
require("/Users/jleschner/pub/server/node_modules/pub-pkg-seo/generator-plugin.js")(generator);

},{"/Users/jleschner/pub/server/node_modules/pub-pkg-seo/generator-plugin.js":2,"/Users/jleschner/pub/theme-brief/plugins/generator-plugin.js":3}],2:[function(require,module,exports){
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "u", "argsIgnorePattern": "frame", }]*/

module.exports = function(generator) {
  var u = generator.util;
  var opts = generator.opts;
  var log = opts.log;
  var hb = generator.handlebars;

  if (!opts.appUrl || /\/\/localhost/.test(opts.appUrl)) {
    log('WARNING: pub-pkg-seo sitemap using appUrl "%s"', opts.appUrl);
  }

  hb.registerHelper('metaSeo', function(frame) {
    if (opts.noRobots) {
      return '<meta name="robots" content="noindex, nofollow">';
    }
  });

};

},{}],3:[function(require,module,exports){
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

},{}]},{},[1]);
