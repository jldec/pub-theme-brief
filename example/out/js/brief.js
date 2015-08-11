// jquery plugin copyright 2014 github.com/hammerjs/jquery.hammer.js
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'hammerjs'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'), require('hammerjs'));
    } else {
        factory(jQuery, Hammer);
    }
}(function($, Hammer) {
    function hammerify(el, options) {
        var $el = $(el);
        if(!$el.data("hammer")) {
            $el.data("hammer", new Hammer($el[0], options));
        }
    }

    $.fn.hammer = function(options) {
        return this.each(function() {
            hammerify(this, options);
        });
    };

    // extend the emit method to also trigger jQuery events
    Hammer.Manager.prototype.emit = (function(originalEmit) {
        return function(type, data) {
            originalEmit.call(this, type, data);
            $(this.element).trigger({
                type: type,
                gesture: data
            });
        };
    })(Hammer.Manager.prototype.emit);
}));


// pub-theme-brief navigation code
// copyright 2015 jurgen leschner (github/jldec) - MIT license

$(function(){

  var $body = $('body');
  var $boxes = $('.box');
  var offsets = [];
  calibrate();

  $(window).resize(calibrate);

  // touch assignments
  $body.hammer().on('doubletap', function(evt) {
    // console.log('doubletap');
    return toggleMode(evt);
  });

  // keyboard assignments
  $body.keydown(function(evt) {
    if (evt.shiftKey || evt.altKey || evt.ctrlKey) return true;
    switch(evt.which) {
      case 13: // enter
        return toggleMode(evt, true);
      case 27: // esc
        return toggleMode(evt, false);
      case 37: // left
      case 38: // up
        return prev(evt);
      case 39: // right
      case 40: // down
        return next(evt);
    }
  });

  function calibrate() {
    offsets = [];
    $boxes.each(function() {
      offsets.push($(this).offset().top);
    });
    // console.log(offsets);
  }

  function next(evt) {
    var old = getTop();
    if (evt.metaKey) {
      // console.log('scrolling to last box')
      setTop(offsets[offsets.length - 1]);
      return false;
    }
    for (var i=0; i<offsets.length; i++) {
      if (offsets[i] > old + 5) {
        // console.log('scrolling down from '+old+' to '+offsets[i])
        setTop(offsets[i]);
        return false;
      }
    }
  }

  function prev(evt) {
    var old = getTop();
    if (evt.metaKey) {
      // console.log('scrolling to first box')
      setTop(offsets[0]);
      return false;
    }
    for (var i=offsets.length-1; i>=0; i--) {
      if (offsets[i] < old - 5) {
        // console.log('scrolling up from '+old+' to '+offsets[i]);
        setTop(offsets[i]);
        return false;
      }
    }
  }

  function toggleMode(evt, state) {
    if (typeof state === 'boolean') {
      $body.toggleClass('presentation', state);
    }
    else {
      $body.toggleClass('presentation');
    }
    calibrate();
    return false;
  }

  function getTop() {
    return typeof window.pageYOffset === 'number' ? window.pageYOffset : document.body.scrollTop
  }

  function setTop(pos) {
    // $('html,body').scrollTop(pos);
    $('html,body').animate(
      { scrollTop: pos },
      200
    );
  }

});
