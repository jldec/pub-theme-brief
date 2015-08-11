var opts = module.exports = {

  'pub-pkg': 'pub-theme-brief',
  generatorPlugins: './plugins/generator-plugin.js',

  sources: './templates',

  staticPaths: [
    {path:'./css/brief.css', route:'/css', inject:true },
    {path:'./js/hammer.min.js', route:'/js', inject:true },
    {path:'./js/brief.js', route:'/js', inject:true }
  ]

};
