(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * humane.js
 * Humanized Messages for Notifications
 * @author Marc Harter (@wavded)
 * @example
 *   humane.log('hello world');
 * @license MIT
 * See more usage examples at: http://wavded.github.com/humane-js/
 */

;!function (name, context, definition) {
   if (typeof module !== 'undefined') module.exports = definition(name, context)
   else if (typeof define === 'function' && typeof define.amd  === 'object') define(definition)
   else context[name] = definition(name, context)
}('humane', this, function (name, context) {
   var win = window
   var doc = document

   var ENV = {
      on: function (el, type, cb) {
         'addEventListener' in win ? el.addEventListener(type,cb,false) : el.attachEvent('on'+type,cb)
      },
      off: function (el, type, cb) {
         'removeEventListener' in win ? el.removeEventListener(type,cb,false) : el.detachEvent('on'+type,cb)
      },
      bind: function (fn, ctx) {
         return function () { fn.apply(ctx,arguments) }
      },
      isArray: Array.isArray || function (obj) { return Object.prototype.toString.call(obj) === '[object Array]' },
      config: function (preferred, fallback) {
         return preferred != null ? preferred : fallback
      },
      transSupport: false,
      useFilter: /msie [678]/i.test(navigator.userAgent), // sniff, sniff
      _checkTransition: function () {
         var el = doc.createElement('div')
         var vendors = { webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' }

         for (var vendor in vendors)
            if (vendor + 'Transition' in el.style) {
               this.vendorPrefix = vendors[vendor]
               this.transSupport = true
            }
      }
   }
   ENV._checkTransition()

   var Humane = function (o) {
      o || (o = {})
      this.queue = []
      this.baseCls = o.baseCls || 'humane'
      this.addnCls = o.addnCls || ''
      this.timeout = 'timeout' in o ? o.timeout : 2500
      this.waitForMove = o.waitForMove || false
      this.clickToClose = o.clickToClose || false
      this.timeoutAfterMove = o.timeoutAfterMove || false
      this.container = o.container

      try { this._setupEl() } // attempt to setup elements
      catch (e) {
        ENV.on(win,'load',ENV.bind(this._setupEl, this)) // dom wasn't ready, wait till ready
      }
   }

   Humane.prototype = {
      constructor: Humane,
      _setupEl: function () {
         var el = doc.createElement('div')
         el.style.display = 'none'
         if (!this.container){
           if(doc.body) this.container = doc.body;
           else throw 'document.body is null'
         }
         this.container.appendChild(el)
         this.el = el
         this.removeEvent = ENV.bind(function(){
            var timeoutAfterMove = ENV.config(this.currentMsg.timeoutAfterMove,this.timeoutAfterMove)
            if (!timeoutAfterMove){
               this.remove()
            } else {
               setTimeout(ENV.bind(this.remove,this),timeoutAfterMove)
            }
         },this)

         this.transEvent = ENV.bind(this._afterAnimation,this)
         this._run()
      },
      _afterTimeout: function () {
         if (!ENV.config(this.currentMsg.waitForMove,this.waitForMove)) this.remove()

         else if (!this.removeEventsSet) {
            ENV.on(doc.body,'mousemove',this.removeEvent)
            ENV.on(doc.body,'click',this.removeEvent)
            ENV.on(doc.body,'keypress',this.removeEvent)
            ENV.on(doc.body,'touchstart',this.removeEvent)
            this.removeEventsSet = true
         }
      },
      _run: function () {
         if (this._animating || !this.queue.length || !this.el) return

         this._animating = true
         if (this.currentTimer) {
            clearTimeout(this.currentTimer)
            this.currentTimer = null
         }

         var msg = this.queue.shift()
         var clickToClose = ENV.config(msg.clickToClose,this.clickToClose)

         if (clickToClose) {
            ENV.on(this.el,'click',this.removeEvent)
            ENV.on(this.el,'touchstart',this.removeEvent)
         }

         var timeout = ENV.config(msg.timeout,this.timeout)

         if (timeout > 0)
            this.currentTimer = setTimeout(ENV.bind(this._afterTimeout,this), timeout)

         if (ENV.isArray(msg.html)) msg.html = '<ul><li>'+msg.html.join('<li>')+'</ul>'

         this.el.innerHTML = msg.html
         this.currentMsg = msg
         this.el.className = this.baseCls
         if (ENV.transSupport) {
            this.el.style.display = 'block'
            setTimeout(ENV.bind(this._showMsg,this),50)
         } else {
            this._showMsg()
         }

      },
      _setOpacity: function (opacity) {
         if (ENV.useFilter){
            try{
               this.el.filters.item('DXImageTransform.Microsoft.Alpha').Opacity = opacity*100
            } catch(err){}
         } else {
            this.el.style.opacity = String(opacity)
         }
      },
      _showMsg: function () {
         var addnCls = ENV.config(this.currentMsg.addnCls,this.addnCls)
         if (ENV.transSupport) {
            this.el.className = this.baseCls+' '+addnCls+' '+this.baseCls+'-animate'
         }
         else {
            var opacity = 0
            this.el.className = this.baseCls+' '+addnCls+' '+this.baseCls+'-js-animate'
            this._setOpacity(0) // reset value so hover states work
            this.el.style.display = 'block'

            var self = this
            var interval = setInterval(function(){
               if (opacity < 1) {
                  opacity += 0.1
                  if (opacity > 1) opacity = 1
                  self._setOpacity(opacity)
               }
               else clearInterval(interval)
            }, 30)
         }
      },
      _hideMsg: function () {
         var addnCls = ENV.config(this.currentMsg.addnCls,this.addnCls)
         if (ENV.transSupport) {
            this.el.className = this.baseCls+' '+addnCls
            ENV.on(this.el,ENV.vendorPrefix ? ENV.vendorPrefix+'TransitionEnd' : 'transitionend',this.transEvent)
         }
         else {
            var opacity = 1
            var self = this
            var interval = setInterval(function(){
               if(opacity > 0) {
                  opacity -= 0.1
                  if (opacity < 0) opacity = 0
                  self._setOpacity(opacity);
               }
               else {
                  self.el.className = self.baseCls+' '+addnCls
                  clearInterval(interval)
                  self._afterAnimation()
               }
            }, 30)
         }
      },
      _afterAnimation: function () {
         if (ENV.transSupport) ENV.off(this.el,ENV.vendorPrefix ? ENV.vendorPrefix+'TransitionEnd' : 'transitionend',this.transEvent)

         if (this.currentMsg.cb) this.currentMsg.cb()
         this.el.style.display = 'none'

         this._animating = false
         this._run()
      },
      remove: function (e) {
         var cb = typeof e == 'function' ? e : null

         ENV.off(doc.body,'mousemove',this.removeEvent)
         ENV.off(doc.body,'click',this.removeEvent)
         ENV.off(doc.body,'keypress',this.removeEvent)
         ENV.off(doc.body,'touchstart',this.removeEvent)
         ENV.off(this.el,'click',this.removeEvent)
         ENV.off(this.el,'touchstart',this.removeEvent)
         this.removeEventsSet = false

         if (cb && this.currentMsg) this.currentMsg.cb = cb
         if (this._animating) this._hideMsg()
         else if (cb) cb()
      },
      log: function (html, o, cb, defaults) {
         var msg = {}
         if (defaults)
           for (var opt in defaults)
               msg[opt] = defaults[opt]

         if (typeof o == 'function') cb = o
         else if (o)
            for (var opt in o) msg[opt] = o[opt]

         msg.html = html
         if (cb) msg.cb = cb
         this.queue.push(msg)
         this._run()
         return this
      },
      spawn: function (defaults) {
         var self = this
         return function (html, o, cb) {
            self.log.call(self,html,o,cb,defaults)
            return self
         }
      },
      create: function (o) { return new Humane(o) }
   }
   return new Humane()
});

},{}],2:[function(require,module,exports){
/*
 * editor-ui.js
 * browserify entry point for pub-pkg-editor user interface
 *
 * - depends on jquery
 * - uses iframe containing website layout for preview with 2 editing modes
 * - edit-mode captures clicks purely for selecting areas of content to edit
 * - nav-mode makes the iframe work just like a normal website
 *
 * copyright 2015-2020, Jürgen Leschner - github.com/jldec - MIT license
*/

var humane = require('humane-js').create({timeout:600});

window.onGeneratorLoaded = function editorUI(generator) {

  var opts = generator.opts;
  var u = generator.util;

  var log = opts.log;

  // var origin = location.href.replace(/^(.*?:\/\/[^\/]+)\/.*$/,'$1' + '/pub')

  var $outer = $('.outer').get(0); // outermost div - for width and height

  var editor =
    { $name:   $('.name'),            // jquery name area in header
      $edit:   $('textarea.editor'),  // jquery editor textarea
      $save:   $('.savebutton'),      // jquery save button

      // binding is the _href of fragment being edited
      // NOTE: don't bind by ref! recompile invalidates refs
      binding: '' };

  var $preview = $('iframe.preview'); // jquery preview iframe
  var iframe = $preview.get(0);       // preview iframe

  var isLeftRight = true;
  var editorSize; // set in resizeEditor

  var DDPANE = 'pane-handle-drag'; // custom drag event type for pane handles

  var $css, pwindow; // set in previewOnLoad

  // iframe navigation and window backbutton handlers - use polling instead of onload
  // iframe.onload = previewOnLoad;
  var previewPoller = setInterval(previewOnLoad, 150);

  // navigation handler - nav events emitted by pager in pub-preview.js
  // note: fragments are selected via fragmentClick in preview selection mode
  generator.on('nav', handleNav);
  generator.on('loaded', handleNav);
  generator.on('notify', function(s) { log(s); humane.log(s); });

  var onIOS = /iPad|iPhone/i.test(navigator.userAgent);
  $(window).on(onIOS ? "pagehide" : "beforeunload", function() {
    log('beforeunload')
    generator.clientSaveHoldText();
    generator.clientSaveUnThrottled(); // throttled version may do nothing
  });

  $('.editbutton').click(toggleFragments);

  // show save button on the static host
  if (opts.staticHost) {
    $('.savebutton').removeClass('hide').click(generator.clientSave);
  }

  /* disabled menu links
  // either do single action in editor or show iframe e.g for upload

  $('.panebutton').click(togglePanes);
  $('.menubutton').click(toggleForm);
  $('.name').click(revertEdits);
  $('.helpbutton').click(help);

  */

  // initialize drag to adjust panes - use Text for type to satisfy IE
  $('.handle').attr('draggable', 'true').get(0)
    .addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('Text', DDPANE);
    });

  // handle pane adjust event over editor
  document.addEventListener('dragover', function(e) {
    adjustPanes(e.clientX, e.clientY, false); // handle over editor
    e.preventDefault();
  });

  // handle pane adjuster drop event
  // (firefox will try to navigate to the url if text is dropped on it)
  document.addEventListener('drop', function(e) {
      e.preventDefault();
  });

  // restore pane dimensions
  resizeEditor(-1);

  // preview iframe onload handler - initializes pwindow and $css
  function previewOnLoad() {
    pwindow = iframe.contentWindow;
    var p$ = pwindow && pwindow.$;        // preview jquery object
    if (!p$ || p$.editorLoaded) return;   // not ready || already initialized

    var pdoc = pwindow.document;

    // handle pane adjust event over preview
    pdoc.addEventListener('dragover', function(e) {
      adjustPanes(e.clientX, e.clientY, true); // handle over preview
      e.preventDefault();
    });

    // handle pane adjuster drop event over preview
    // (firefox will try to navigate to the url if text is dropped on it)
    pdoc.addEventListener('drop', function(e) {
      e.preventDefault();
    });

    pRef = pwindow.pubRef || {};
    var relPath = pRef.relPath || '';

    $css = p$('<link rel="stylesheet" href="' + relPath + '/pub/css/pub-preview.css">');
    p$('head').append($css);
    $css.get(0).disabled = true;
    toggleFragments();

    var $script = p$('<script src="' + relPath + '/pub/js/pub-preview.js"></script>');
    p$('body').append($script);

    p$.editorLoaded = true;
    clearInterval(previewPoller);
  };

  function toggleFragments() {
    var css = $css && $css.get(0);
    if (!css) return;
    if (css.disabled) {
      css.disabled = false;
      pwindow.addEventListener('click', fragmentClick, true);
    }
    else {
      css.disabled = true;
      pwindow.removeEventListener('click', fragmentClick, true);
    }
  }

  // fragment click handler
  function fragmentClick(e) {
    var el = e.target;
    var href;
    while (el && el.nodeName !== 'HTML' && !el.getAttribute('data-render-html')) { el = el.parentNode };
    if (el && (href = el.getAttribute('data-render-html'))) {
      bindEditor(generator.fragment$[href]);
      e.preventDefault(); // will also stop pager because it checks for e.defaultPrevented
    }
  }

  // navigation handler
  function handleNav(path, query, hash) {
    if (path) {
      // replace /pub/path... with /path...
      // history.replaceState(null, null, origin + path + query + hash);
      bindEditor(generator.fragment$[path + hash]);
    }
    else {
      // reload
      bindEditor(generator.fragment$[editor.binding]);
    }
  }

  // change editingHref to a different fragment or page
  function bindEditor(fragment) {
    saveBreakHold();
    if (fragment) {
      editor.$name.text(fragment._href);
      if (fragment._holdUpdates) {
        editText(fragment._holdText);
      }
      else {
        editText(fragment._hdr + fragment._txt);
      }
      editor.binding = fragment._href;
    }
    else {
      editor.$name.text('');
      editText('');
      editor.binding = '';
    }
  }

  // replace text in editor using clone()
  // firefox gotcha: undo key mutates content after nav-triggered $edit.val()
  // assume that jquery takes care of removing keyup handler
  function editText(text) {
    var $newedit = editor.$edit.clone().val(text);
    editor.$edit.replaceWith($newedit);
    editor.$edit = $newedit;
    editor.$edit.on('keyup', editorUpdate);
  }

  // register updates from editor using editor.binding
  function editorUpdate() {
    if (editor.binding) {
      if ('hold' === generator.clientUpdateFragmentText(editor.binding, editor.$edit.val())) {
        editor.holding = true;
      }
    }
  }

  // save with breakHold - may result in modified href ==> loss of binding context?
  function saveBreakHold() {
    if (editor.binding && editor.holding) {
      generator.clientUpdateFragmentText(editor.binding, editor.$edit.val(), true);
      editor.holding = false;
    }
  }

  // toggle panes between left/right and top/bottom
  function togglePanes() {
    $('.editorpane').toggleClass('row col left top');
    $('.previewpane').toggleClass('row col right bottom');
    isLeftRight = $('.handle').toggleClass('leftright topbottom').hasClass('leftright');
    resizeEditor(-1);
  }

  function toggleForm() {
    $('.form').toggle();
    $('.editor').toggleClass('showform');
  }

  // draggable pane adjuster
  // x and y come from the mouse either over the preview or the editor
  // preview coordinates start at the separator (==> editorSize + ratio)
  // allow 25 pixels for the header (should be read from element)
  function adjustPanes(x, y, overPreview) {
    var ratio = isLeftRight ?
        (x / $outer.clientWidth) :
        ((overPreview ? y : y - 25) / ($outer.clientHeight - 25));
    var psize = overPreview ? editorSize + ratio * 100 : ratio * 100;
    if (psize >= 0) { resizeEditor(psize); }
  }

  // adjust editor window size between 0 and 100%
  //  0 means hide
  // -1 means restore last setting (or 50%)
  function resizeEditor(psize) {
    var force = false;
    if (psize === -1) {
      force = true;
      psize = max(10, editorSize || Number(localStorage.editorSize) || 50);
    } else {
      psize = psize % 100;
    }
    if (force || editorSize !== psize) {
      if (psize) { localStorage.editorSize = editorSize = psize; } // don't remember 0
      if (isLeftRight) {
        $('.left.col').css(  { width:  psize + '%', height: '100%' });
        $('.right.col').css( { width:  (100 - psize) + '%', height: '100%' });
        $('.handle').css( { left: psize + '%', top: '0' });
      } else {
        $('.top.row').css(   { height: psize + '%', width:  '100%' });
        $('.bottom.row').css({ height: 100 - psize + '%', width:  '100%' });
        $('.handle').css( { left: '0', top: ((psize / 100 * ($outer.clientHeight - 25)) + 25) + 'px' });
      }
    }
  }

  function max(x,y) { return x>y ? x : y; }

}

},{"humane-js":1}]},{},[2]);
