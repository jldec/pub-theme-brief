# pub-theme-brief

Single-page lightweight flexbox design with slideshow navigation for [pub-server](https://github.com/jldec/pub-server)

Boxes are allowed flow to fill the entire window while keeping the text width inside each box constant.

![](/images/screen1.png)
![](/images/screen2.png)
![](/images/screen3.png)

#### installation
To use this theme for a project on localhost, first `npm install` `pub-server` and `pub-theme-brief`. The following command will run pub with this theme.

```sh
pub -t pub-theme-brief
```

To make the theme permanent, use a `pub-config.js` with **`pub-theme-brief`** in `pkgs`. E.g.

```js
module.exports = {
  pkgs:'pub-theme-brief',
  sources:'./markdown',
  staticPaths:'./images'
}
```

#### markdown fragments
This theme simply renders all markdown fragments in order using a flex layout.

```css
.container { display:-webkit-flex; display:flex; -webkit-flex-flow: wrap row; flex-flow: wrap row; }
.box { position:relative; -webkit-flex-grow:1; flex-grow:1; }
.box > div { width:450px; margin:auto; padding:20px; }
```






#### presentation controls
These controls allow the theme to be used for simple HTML presentations. Simply hit enter, and adjust the browser zoom for comfortable viewing. Use the arrow keys to go backwards and forwards.

- **enter**, **esc**: toggles presentation mode (boxes fill the window)
- **left**, **up**: scroll to previous box
- **right**, **down**: scroll to next box
