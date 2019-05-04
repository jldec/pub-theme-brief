module.exports = {

  appUrl: 'https://jldec.github.io/pub-theme-brief',

  // replace '..' below with 'pub-theme-brief' if directory is copied
  pkgs: ['..', 'pub-pkg-seo', 'pub-pkg-font-open-sans'],

  sources: { path:'./index.md', writable:1 },

  staticPaths: [
    { path:'./images', route:'/images' },
    './.gitignore',
    './.nojekyll',
    './CNAME'
  ],

  outputs: { path:'../docs', relPaths:1 },
  noRobots: 1
}
