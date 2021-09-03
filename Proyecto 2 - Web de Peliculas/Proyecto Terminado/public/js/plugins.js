/*!
 * Dropdownhover v1.0.0 (http://bs-dropdownhover.kybarg.com)
 */
+function ($) {
  'use strict';

  // DROPDOWNHOVER CLASS DEFINITION
  // =========================

  var Dropdownhover = function (element, options) {
    this.options    = options    
    this.$element   = $(element)

    var that = this

    // Defining if navigation tree or single dropdown
    this.dropdowns = this.$element.hasClass('dropdown-toggle') ? this.$element.parent().find('.dropdown-menu').parent('.dropdown') : this.$element.find('.dropdown')

    this.dropdowns.each(function(){
        $(this).on('mouseenter.bs.dropdownhover', function(e) {
          that.show($(this).children('a, button'))
        })
    })
    this.dropdowns.each(function(){
        $(this).on('mouseleave.bs.dropdownhover', function(e) {
          that.hide($(this).children('a, button'))
        })
    })

  }

  Dropdownhover.TRANSITION_DURATION = 300
  Dropdownhover.DELAY = 150
  Dropdownhover.TIMEOUT

  Dropdownhover.DEFAULTS = {
    animations : ['', '', '', ''],
  }

  // Opens dropdown menu when mouse is over the trigger element
  Dropdownhover.prototype.show = function (_dropdownLink) {
    var $this = $(_dropdownLink)

    window.clearTimeout(Dropdownhover.TIMEOUT)
    // Close all dropdowns
    $('.dropdown').not($this.parents()).each(function(){
         $(this).removeClass('open');
     });

    var effect = this.options.animations[0]

    if ($this.is('.disabled, :disabled')) return

    var $parent  = $this.parent()
    var isActive = $parent.hasClass('open')

    if (!isActive) {

      var $dropdown = $this.next('.dropdown-menu')
      var relatedTarget = { relatedTarget: this }

      $parent
        .addClass('open')

      var side = this.position($dropdown)
      side == 'top' ? effect = this.options.animations[2] :
      side == 'right' ? effect = this.options.animations[3] :
      side == 'left' ? effect = this.options.animations[1] :
      effect = this.options.animations[0]

      $dropdown.addClass('animated ' + effect)

      var transition = $.support.transition && $dropdown.hasClass('animated')

      transition ?
        $dropdown
          .one('bsTransitionEnd', function () {
            $dropdown.removeClass('animated ' + effect)
          })
          .emulateTransitionEnd(Dropdownhover.TRANSITION_DURATION) :
        $dropdown.removeClass('animated ' + effect)
    }

    return false
  }

  // Closes dropdown menu when moise is out of it
  Dropdownhover.prototype.hide = function (_dropdownLink) {

    var that = this
    var $this = $(_dropdownLink)
    var $parent  = $this.parent()
    Dropdownhover.TIMEOUT = window.setTimeout(function () {
      $parent.removeClass('open')
    }, Dropdownhover.DELAY)
  }

  // Calculating position of dropdown menu
  Dropdownhover.prototype.position = function (dropdown) {

    var win = $(window);

    // Reset css to prevent incorrect position
    dropdown.css({ bottom: '', left: '', top: '', right: '' }).removeClass('dropdownhover-top')
  
    var viewport = {
      top : win.scrollTop(),
      left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
    
    var bounds = dropdown.offset();
      bounds.right = bounds.left + dropdown.outerWidth();
      bounds.bottom = bounds.top + dropdown.outerHeight();
    var position = dropdown.position();
      position.right = bounds.left + dropdown.outerWidth();
      position.bottom = bounds.top + dropdown.outerHeight();
  
    var side = ''
   
    var isSubnow = dropdown.parents('.dropdown-menu').length

    if(isSubnow) {

      if (position.left < 0) {
        side = 'left'
        dropdown.removeClass('dropdownhover-right').addClass('dropdownhover-left')
      } else {
        side = 'right'
        dropdown.addClass('dropdownhover-right').removeClass('dropdownhover-left')
      }

      if (bounds.left < viewport.left) {
        side = 'right'
        dropdown.css({ left: '100%', right: 'auto' }).addClass('dropdownhover-right').removeClass('dropdownhover-left')
      } else if (bounds.right > viewport.right) {
        side = 'left'
        dropdown.css({ left: 'auto', right: '100%' }).removeClass('dropdownhover-right').addClass('dropdownhover-left')
      }

      if (bounds.bottom > viewport.bottom) {
        dropdown.css({ bottom: 'auto', top: -(bounds.bottom-viewport.bottom) })
      } else if (bounds.top < viewport.top) {
        dropdown.css({ bottom: -(viewport.top-bounds.top), top: 'auto' })
      }

    } else { // Defines special position styles for root dropdown menu

      var parentLi = dropdown.parent('.dropdown')
      var pBounds = parentLi.offset()
        pBounds.right = pBounds.left + parentLi.outerWidth()
        pBounds.bottom = pBounds.top + parentLi.outerHeight()

      if (bounds.right > viewport.right) {
        dropdown.css({ left: -(bounds.right-viewport.right), right: 'auto' })
      }

      if (bounds.bottom > viewport.bottom && (pBounds.top - viewport.top) > (viewport.bottom - pBounds.bottom) || dropdown.position().top < 0) {
        side = 'top'
        dropdown.css({ bottom: '100%', top: 'auto' }).addClass('dropdownhover-top').removeClass('dropdownhover-bottom')
      } else {
        side = 'bottom'
        dropdown.addClass('dropdownhover-bottom')
      }
    }

    return side;

  }


  // DROPDOWNHOVER PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdownhover')
      var settings = $this.data()
      if($this.data('animations') !== undefined && $this.data('animations') !== null)
         settings.animations =  $.isArray(settings.animations) ? settings.animations : settings.animations.split(' ')

      var options = $.extend({}, Dropdownhover.DEFAULTS, settings, typeof option == 'object' && option)

      if (!data) $this.data('bs.dropdownhover', (data = new Dropdownhover(this, options)))

    })
  }

  var old = $.fn.dropdownhover

  $.fn.dropdownhover             = Plugin
  $.fn.dropdownhover.Constructor = Dropdownhover


  // DROPDOWNHOVER NO CONFLICT
  // ====================

  $.fn.dropdownhover.noConflict = function () {
    $.fn.dropdownhover = old
    return this
  }


  // APPLY TO STANDARD DROPDOWNHOVER ELEMENTS
  // ===================================

  var resizeTimer;
  $(document).ready(function () {
    if($(window).width() >= 768) { // Breakpoin plugin is activated (768px)
      $('[data-hover="dropdown"]').each(function () {
        var $target = $(this)
        Plugin.call($target, $target.data())
      })
    }
  })
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      if($(window).width() >= 768) // Breakpoin plugin is activated (768px)
        $('[data-hover="dropdown"]').each(function () {
          var $target = $(this)
          Plugin.call($target, $target.data())
        })
      else  // Disabling and clearing plugin data if screen is less 768px
        $('[data-hover="dropdown"]').each(function () {
          $(this).removeData('bs.dropdownhover')
          if($(this).hasClass('dropdown-toggle'))
            $(this).parent('.dropdown').find('.dropdown').andSelf().off('mouseenter.bs.dropdownhover mouseleave.bs.dropdownhover')
          else
            $(this).find('.dropdown').off('mouseenter.bs.dropdownhover mouseleave.bs.dropdownhover')
        })
    }, 200)
  })

}(jQuery);

/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1||b[0]>3)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){if(a(b.target).is(this))return b.handleObj.handler.apply(this,arguments)}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.7",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a("#"===f?[]:f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.7",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c).prop(c,!0)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c).prop(c,!1))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")?(c.prop("checked")&&(a=!1),b.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==c.prop("type")&&(c.prop("checked")!==this.$element.hasClass("active")&&(a=!1),this.$element.toggleClass("active")),c.prop("checked",this.$element.hasClass("active")),a&&c.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target).closest(".btn");b.call(d,"toggle"),a(c.target).is('input[type="radio"], input[type="checkbox"]')||(c.preventDefault(),d.is("input,button")?d.trigger("focus"):d.find("input:visible,button:visible").first().trigger("focus"))}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.7",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));if(!(a>this.$items.length-1||a<0))return this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){if(!this.sliding)return this.slide("next")},c.prototype.prev=function(){if(!this.sliding)return this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.7",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function c(c){c&&3===c.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=b(d),f={relatedTarget:this};e.hasClass("open")&&(c&&"click"==c.type&&/input|textarea/i.test(c.target.tagName)&&a.contains(e[0],c.target)||(e.trigger(c=a.Event("hide.bs.dropdown",f)),c.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger(a.Event("hidden.bs.dropdown",f)))))}))}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.7",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=b(e),g=f.hasClass("open");if(c(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",c);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger(a.Event("shown.bs.dropdown",h))}return!1}},g.prototype.keydown=function(c){if(/(38|40|27|32)/.test(c.which)&&!/input|textarea/i.test(c.target.tagName)){var d=a(this);if(c.preventDefault(),c.stopPropagation(),!d.is(".disabled, :disabled")){var e=b(d),g=e.hasClass("open");if(!g&&27!=c.which||g&&27==c.which)return 27==c.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find(".dropdown-menu"+h);if(i.length){var j=i.index(c.target);38==c.which&&j>0&&j--,40==c.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",c).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.7",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in"),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){document===a.target||this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+e).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;!e&&/destroy|hide/.test(b)||(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",a,b)};c.VERSION="3.3.7",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(a.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusin"==b.type?"focus":"hover"]=!0),c.tip().hasClass("in")||"in"==c.hoverState?void(c.hoverState="in"):(clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.isInStateTrue=function(){for(var a in this.inState)if(this.inState[a])return!0;return!1},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);if(c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusout"==b.type?"focus":"hover"]=!1),!c.isInStateTrue())return clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.getPosition(this.$viewport);h="bottom"==h&&k.bottom+m>o.bottom?"top":"top"==h&&k.top-m<o.top?"bottom":"right"==h&&k.right+l>o.width?"left":"left"==h&&k.left-l<o.left?"right":h,f.removeClass(n).addClass(h)}var p=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(p,h);var q=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",q).emulateTransitionEnd(c.TRANSITION_DURATION):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top+=g,b.left+=h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element&&e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);if(this.$element.trigger(g),!g.isDefaultPrevented())return f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=window.SVGElement&&c instanceof window.SVGElement,g=d?{top:0,left:0}:f?null:b.offset(),h={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},i=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,h,i,g)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.right&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){if(!this.$tip&&(this.$tip=a(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),b?(c.inState.click=!c.inState.click,c.isInStateTrue()?c.enter(c):c.leave(c)):c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type),a.$tip&&a.$tip.detach(),a.$tip=null,a.$arrow=null,a.$viewport=null,a.$element=null})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;!e&&/destroy|hide/.test(b)||(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.7",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.7",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){
this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.7",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.7",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return e<c&&"top";if("bottom"==this.affixed)return null!=c?!(e+this.unpin<=f.top)&&"bottom":!(e+g<=a-d)&&"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&e<=c?"top":null!=d&&i+j>=a-d&&"bottom"},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=Math.max(a(document).height(),a(document.body).height());"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);
/*!
 * Isotope PACKAGED v2.2.0
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2015 Metafizzy
 */

(function(t){function e(){}function i(t){function i(e){e.prototype.option||(e.prototype.option=function(e){t.isPlainObject(e)&&(this.options=t.extend(!0,this.options,e))})}function n(e,i){t.fn[e]=function(n){if("string"==typeof n){for(var s=o.call(arguments,1),a=0,u=this.length;u>a;a++){var p=this[a],h=t.data(p,e);if(h)if(t.isFunction(h[n])&&"_"!==n.charAt(0)){var f=h[n].apply(h,s);if(void 0!==f)return f}else r("no such method '"+n+"' for "+e+" instance");else r("cannot call methods on "+e+" prior to initialization; "+"attempted to call '"+n+"'")}return this}return this.each(function(){var o=t.data(this,e);o?(o.option(n),o._init()):(o=new i(this,n),t.data(this,e,o))})}}if(t){var r="undefined"==typeof console?e:function(t){console.error(t)};return t.bridget=function(t,e){i(e),n(t,e)},t.bridget}}var o=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],i):"object"==typeof exports?i(require("jquery")):i(t.jQuery)})(window),function(t){function e(e){var i=t.event;return i.target=i.target||i.srcElement||e,i}var i=document.documentElement,o=function(){};i.addEventListener?o=function(t,e,i){t.addEventListener(e,i,!1)}:i.attachEvent&&(o=function(t,i,o){t[i+o]=o.handleEvent?function(){var i=e(t);o.handleEvent.call(o,i)}:function(){var i=e(t);o.call(t,i)},t.attachEvent("on"+i,t[i+o])});var n=function(){};i.removeEventListener?n=function(t,e,i){t.removeEventListener(e,i,!1)}:i.detachEvent&&(n=function(t,e,i){t.detachEvent("on"+e,t[e+i]);try{delete t[e+i]}catch(o){t[e+i]=void 0}});var r={bind:o,unbind:n};"function"==typeof define&&define.amd?define("eventie/eventie",r):"object"==typeof exports?module.exports=r:t.eventie=r}(window),function(){function t(){}function e(t,e){for(var i=t.length;i--;)if(t[i].listener===e)return i;return-1}function i(t){return function(){return this[t].apply(this,arguments)}}var o=t.prototype,n=this,r=n.EventEmitter;o.getListeners=function(t){var e,i,o=this._getEvents();if(t instanceof RegExp){e={};for(i in o)o.hasOwnProperty(i)&&t.test(i)&&(e[i]=o[i])}else e=o[t]||(o[t]=[]);return e},o.flattenListeners=function(t){var e,i=[];for(e=0;t.length>e;e+=1)i.push(t[e].listener);return i},o.getListenersAsObject=function(t){var e,i=this.getListeners(t);return i instanceof Array&&(e={},e[t]=i),e||i},o.addListener=function(t,i){var o,n=this.getListenersAsObject(t),r="object"==typeof i;for(o in n)n.hasOwnProperty(o)&&-1===e(n[o],i)&&n[o].push(r?i:{listener:i,once:!1});return this},o.on=i("addListener"),o.addOnceListener=function(t,e){return this.addListener(t,{listener:e,once:!0})},o.once=i("addOnceListener"),o.defineEvent=function(t){return this.getListeners(t),this},o.defineEvents=function(t){for(var e=0;t.length>e;e+=1)this.defineEvent(t[e]);return this},o.removeListener=function(t,i){var o,n,r=this.getListenersAsObject(t);for(n in r)r.hasOwnProperty(n)&&(o=e(r[n],i),-1!==o&&r[n].splice(o,1));return this},o.off=i("removeListener"),o.addListeners=function(t,e){return this.manipulateListeners(!1,t,e)},o.removeListeners=function(t,e){return this.manipulateListeners(!0,t,e)},o.manipulateListeners=function(t,e,i){var o,n,r=t?this.removeListener:this.addListener,s=t?this.removeListeners:this.addListeners;if("object"!=typeof e||e instanceof RegExp)for(o=i.length;o--;)r.call(this,e,i[o]);else for(o in e)e.hasOwnProperty(o)&&(n=e[o])&&("function"==typeof n?r.call(this,o,n):s.call(this,o,n));return this},o.removeEvent=function(t){var e,i=typeof t,o=this._getEvents();if("string"===i)delete o[t];else if(t instanceof RegExp)for(e in o)o.hasOwnProperty(e)&&t.test(e)&&delete o[e];else delete this._events;return this},o.removeAllListeners=i("removeEvent"),o.emitEvent=function(t,e){var i,o,n,r,s=this.getListenersAsObject(t);for(n in s)if(s.hasOwnProperty(n))for(o=s[n].length;o--;)i=s[n][o],i.once===!0&&this.removeListener(t,i.listener),r=i.listener.apply(this,e||[]),r===this._getOnceReturnValue()&&this.removeListener(t,i.listener);return this},o.trigger=i("emitEvent"),o.emit=function(t){var e=Array.prototype.slice.call(arguments,1);return this.emitEvent(t,e)},o.setOnceReturnValue=function(t){return this._onceReturnValue=t,this},o._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},o._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return n.EventEmitter=r,t},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return t}):"object"==typeof module&&module.exports?module.exports=t:n.EventEmitter=t}.call(this),function(t){function e(t){if(t){if("string"==typeof o[t])return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e,n=0,r=i.length;r>n;n++)if(e=i[n]+t,"string"==typeof o[e])return e}}var i="Webkit Moz ms Ms O".split(" "),o=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return e}):"object"==typeof exports?module.exports=e:t.getStyleProperty=e}(window),function(t){function e(t){var e=parseFloat(t),i=-1===t.indexOf("%")&&!isNaN(e);return i&&e}function i(){}function o(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0,i=s.length;i>e;e++){var o=s[e];t[o]=0}return t}function n(i){function n(){if(!d){d=!0;var o=t.getComputedStyle;if(p=function(){var t=o?function(t){return o(t,null)}:function(t){return t.currentStyle};return function(e){var i=t(e);return i||r("Style returned "+i+". Are you running this code in a hidden iframe on Firefox? "+"See http://bit.ly/getsizebug1"),i}}(),h=i("boxSizing")){var n=document.createElement("div");n.style.width="200px",n.style.padding="1px 2px 3px 4px",n.style.borderStyle="solid",n.style.borderWidth="1px 2px 3px 4px",n.style[h]="border-box";var s=document.body||document.documentElement;s.appendChild(n);var a=p(n);f=200===e(a.width),s.removeChild(n)}}}function a(t){if(n(),"string"==typeof t&&(t=document.querySelector(t)),t&&"object"==typeof t&&t.nodeType){var i=p(t);if("none"===i.display)return o();var r={};r.width=t.offsetWidth,r.height=t.offsetHeight;for(var a=r.isBorderBox=!(!h||!i[h]||"border-box"!==i[h]),d=0,l=s.length;l>d;d++){var c=s[d],m=i[c];m=u(t,m);var y=parseFloat(m);r[c]=isNaN(y)?0:y}var g=r.paddingLeft+r.paddingRight,v=r.paddingTop+r.paddingBottom,_=r.marginLeft+r.marginRight,I=r.marginTop+r.marginBottom,z=r.borderLeftWidth+r.borderRightWidth,L=r.borderTopWidth+r.borderBottomWidth,x=a&&f,E=e(i.width);E!==!1&&(r.width=E+(x?0:g+z));var b=e(i.height);return b!==!1&&(r.height=b+(x?0:v+L)),r.innerWidth=r.width-(g+z),r.innerHeight=r.height-(v+L),r.outerWidth=r.width+_,r.outerHeight=r.height+I,r}}function u(e,i){if(t.getComputedStyle||-1===i.indexOf("%"))return i;var o=e.style,n=o.left,r=e.runtimeStyle,s=r&&r.left;return s&&(r.left=e.currentStyle.left),o.left=i,i=o.pixelLeft,o.left=n,s&&(r.left=s),i}var p,h,f,d=!1;return a}var r="undefined"==typeof console?i:function(t){console.error(t)},s=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],n):"object"==typeof exports?module.exports=n(require("desandro-get-style-property")):t.getSize=n(t.getStyleProperty)}(window),function(t){function e(t){"function"==typeof t&&(e.isReady?t():s.push(t))}function i(t){var i="readystatechange"===t.type&&"complete"!==r.readyState;e.isReady||i||o()}function o(){e.isReady=!0;for(var t=0,i=s.length;i>t;t++){var o=s[t];o()}}function n(n){return"complete"===r.readyState?o():(n.bind(r,"DOMContentLoaded",i),n.bind(r,"readystatechange",i),n.bind(t,"load",i)),e}var r=t.document,s=[];e.isReady=!1,"function"==typeof define&&define.amd?define("doc-ready/doc-ready",["eventie/eventie"],n):"object"==typeof exports?module.exports=n(require("eventie")):t.docReady=n(t.eventie)}(window),function(t){function e(t,e){return t[s](e)}function i(t){if(!t.parentNode){var e=document.createDocumentFragment();e.appendChild(t)}}function o(t,e){i(t);for(var o=t.parentNode.querySelectorAll(e),n=0,r=o.length;r>n;n++)if(o[n]===t)return!0;return!1}function n(t,o){return i(t),e(t,o)}var r,s=function(){if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0,o=e.length;o>i;i++){var n=e[i],r=n+"MatchesSelector";if(t[r])return r}}();if(s){var a=document.createElement("div"),u=e(a,"div");r=u?e:n}else r=o;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return r}):"object"==typeof exports?module.exports=r:window.matchesSelector=r}(Element.prototype),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["doc-ready/doc-ready","matches-selector/matches-selector"],function(i,o){return e(t,i,o)}):"object"==typeof exports?module.exports=e(t,require("doc-ready"),require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.docReady,t.matchesSelector)}(window,function(t,e,i){var o={};o.extend=function(t,e){for(var i in e)t[i]=e[i];return t},o.modulo=function(t,e){return(t%e+e)%e};var n=Object.prototype.toString;o.isArray=function(t){return"[object Array]"==n.call(t)},o.makeArray=function(t){var e=[];if(o.isArray(t))e=t;else if(t&&"number"==typeof t.length)for(var i=0,n=t.length;n>i;i++)e.push(t[i]);else e.push(t);return e},o.indexOf=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,o=t.length;o>i;i++)if(t[i]===e)return i;return-1},o.removeFrom=function(t,e){var i=o.indexOf(t,e);-1!=i&&t.splice(i,1)},o.isElement="function"==typeof HTMLElement||"object"==typeof HTMLElement?function(t){return t instanceof HTMLElement}:function(t){return t&&"object"==typeof t&&1==t.nodeType&&"string"==typeof t.nodeName},o.setText=function(){function t(t,i){e=e||(void 0!==document.documentElement.textContent?"textContent":"innerText"),t[e]=i}var e;return t}(),o.getParent=function(t,e){for(;t!=document.body;)if(t=t.parentNode,i(t,e))return t},o.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},o.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},o.filterFindElements=function(t,e){t=o.makeArray(t);for(var n=[],r=0,s=t.length;s>r;r++){var a=t[r];if(o.isElement(a))if(e){i(a,e)&&n.push(a);for(var u=a.querySelectorAll(e),p=0,h=u.length;h>p;p++)n.push(u[p])}else n.push(a)}return n},o.debounceMethod=function(t,e,i){var o=t.prototype[e],n=e+"Timeout";t.prototype[e]=function(){var t=this[n];t&&clearTimeout(t);var e=arguments,r=this;this[n]=setTimeout(function(){o.apply(r,e),delete r[n]},i||100)}},o.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var r=t.console;return o.htmlInit=function(i,n){e(function(){for(var e=o.toDashed(n),s=document.querySelectorAll(".js-"+e),a="data-"+e+"-options",u=0,p=s.length;p>u;u++){var h,f=s[u],d=f.getAttribute(a);try{h=d&&JSON.parse(d)}catch(l){r&&r.error("Error parsing "+a+" on "+f.nodeName.toLowerCase()+(f.id?"#"+f.id:"")+": "+l);continue}var c=new i(f,h),m=t.jQuery;m&&m.data(f,n,c)}})},o}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property","fizzy-ui-utils/utils"],function(i,o,n,r){return e(t,i,o,n,r)}):"object"==typeof exports?module.exports=e(t,require("wolfy87-eventemitter"),require("get-size"),require("desandro-get-style-property"),require("fizzy-ui-utils")):(t.Outlayer={},t.Outlayer.Item=e(t,t.EventEmitter,t.getSize,t.getStyleProperty,t.fizzyUIUtils))}(window,function(t,e,i,o,n){function r(t){for(var e in t)return!1;return e=null,!0}function s(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}var a=t.getComputedStyle,u=a?function(t){return a(t,null)}:function(t){return t.currentStyle},p=o("transition"),h=o("transform"),f=p&&h,d=!!o("perspective"),l={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[p],c=["transform","transition","transitionDuration","transitionProperty"],m=function(){for(var t={},e=0,i=c.length;i>e;e++){var n=c[e],r=o(n);r&&r!==n&&(t[n]=r)}return t}();n.extend(s.prototype,e.prototype),s.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},s.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},s.prototype.getSize=function(){this.size=i(this.element)},s.prototype.css=function(t){var e=this.element.style;for(var i in t){var o=m[i]||i;e[o]=t[i]}},s.prototype.getPosition=function(){var t=u(this.element),e=this.layout.options,i=e.isOriginLeft,o=e.isOriginTop,n=parseInt(t[i?"left":"right"],10),r=parseInt(t[o?"top":"bottom"],10);n=isNaN(n)?0:n,r=isNaN(r)?0:r;var s=this.layout.size;n-=i?s.paddingLeft:s.paddingRight,r-=o?s.paddingTop:s.paddingBottom,this.position.x=n,this.position.y=r},s.prototype.layoutPosition=function(){var t=this.layout.size,e=this.layout.options,i={},o=e.isOriginLeft?"paddingLeft":"paddingRight",n=e.isOriginLeft?"left":"right",r=e.isOriginLeft?"right":"left",s=this.position.x+t[o];s=e.percentPosition&&!e.isHorizontal?100*(s/t.width)+"%":s+"px",i[n]=s,i[r]="";var a=e.isOriginTop?"paddingTop":"paddingBottom",u=e.isOriginTop?"top":"bottom",p=e.isOriginTop?"bottom":"top",h=this.position.y+t[a];h=e.percentPosition&&e.isHorizontal?100*(h/t.height)+"%":h+"px",i[u]=h,i[p]="",this.css(i),this.emitEvent("layout",[this])};var y=d?function(t,e){return"translate3d("+t+"px, "+e+"px, 0)"}:function(t,e){return"translate("+t+"px, "+e+"px)"};s.prototype._transitionTo=function(t,e){this.getPosition();var i=this.position.x,o=this.position.y,n=parseInt(t,10),r=parseInt(e,10),s=n===this.position.x&&r===this.position.y;if(this.setPosition(t,e),s&&!this.isTransitioning)return this.layoutPosition(),void 0;var a=t-i,u=e-o,p={},h=this.layout.options;a=h.isOriginLeft?a:-a,u=h.isOriginTop?u:-u,p.transform=y(a,u),this.transition({to:p,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},s.prototype.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},s.prototype.moveTo=f?s.prototype._transitionTo:s.prototype.goTo,s.prototype.setPosition=function(t,e){this.position.x=parseInt(t,10),this.position.y=parseInt(e,10)},s.prototype._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},s.prototype._transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return this._nonTransition(t),void 0;var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var o=this.element.offsetHeight;o=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var g=h&&n.toDashed(h)+",opacity";s.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:g,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(l,this,!1))},s.prototype.transition=s.prototype[p?"_transition":"_nonTransition"],s.prototype.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},s.prototype.onotransitionend=function(t){this.ontransitionend(t)};var v={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};s.prototype.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,i=v[t.propertyName]||t.propertyName;if(delete e.ingProperties[i],r(e.ingProperties)&&this.disableTransition(),i in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[i]),i in e.onEnd){var o=e.onEnd[i];o.call(this),delete e.onEnd[i]}this.emitEvent("transitionEnd",[this])}},s.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(l,this,!1),this.isTransitioning=!1},s.prototype._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var _={transitionProperty:"",transitionDuration:""};return s.prototype.removeTransitionStyles=function(){this.css(_)},s.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},s.prototype.remove=function(){if(!p||!parseFloat(this.layout.options.transitionDuration))return this.removeElem(),void 0;var t=this;this.once("transitionEnd",function(){t.removeElem()}),this.hide()},s.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},s.prototype.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},s.prototype.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},s.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},s.prototype.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},s.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},s}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","eventEmitter/EventEmitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,o,n,r,s){return e(t,i,o,n,r,s)}):"object"==typeof exports?module.exports=e(t,require("eventie"),require("wolfy87-eventemitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.eventie,t.EventEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,o,n,r){function s(t,e){var i=n.getQueryElement(t);if(!i)return a&&a.error("Bad element for "+this.constructor.namespace+": "+(i||t)),void 0;this.element=i,u&&(this.$element=u(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e);var o=++h;this.element.outlayerGUID=o,f[o]=this,this._create(),this.options.isInitLayout&&this.layout()}var a=t.console,u=t.jQuery,p=function(){},h=0,f={};return s.namespace="outlayer",s.Item=r,s.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},n.extend(s.prototype,i.prototype),s.prototype.option=function(t){n.extend(this.options,t)},s.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),n.extend(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},s.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},s.prototype._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,o=[],n=0,r=e.length;r>n;n++){var s=e[n],a=new i(s,this);o.push(a)}return o},s.prototype._filterFindItemElements=function(t){return n.filterFindElements(t,this.options.itemSelector)},s.prototype.getItemElements=function(){for(var t=[],e=0,i=this.items.length;i>e;e++)t.push(this.items[e].element);return t},s.prototype.layout=function(){this._resetLayout(),this._manageStamps();var t=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,t),this._isLayoutInited=!0},s.prototype._init=s.prototype.layout,s.prototype._resetLayout=function(){this.getSize()},s.prototype.getSize=function(){this.size=o(this.element)},s.prototype._getMeasurement=function(t,e){var i,r=this.options[t];r?("string"==typeof r?i=this.element.querySelector(r):n.isElement(r)&&(i=r),this[t]=i?o(i)[e]:r):this[t]=0},s.prototype.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},s.prototype._getItemsForLayout=function(t){for(var e=[],i=0,o=t.length;o>i;i++){var n=t[i];n.isIgnored||e.push(n)}return e},s.prototype._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){for(var i=[],o=0,n=t.length;n>o;o++){var r=t[o],s=this._getItemLayoutPosition(r);s.item=r,s.isInstant=e||r.isLayoutInstant,i.push(s)}this._processLayoutQueue(i)}},s.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},s.prototype._processLayoutQueue=function(t){for(var e=0,i=t.length;i>e;e++){var o=t[e];this._positionItem(o.item,o.x,o.y,o.isInstant)}},s.prototype._positionItem=function(t,e,i,o){o?t.goTo(e,i):t.moveTo(e,i)},s.prototype._postLayout=function(){this.resizeContainer()},s.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var t=this._getContainerSize();t&&(this._setContainerMeasure(t.width,!0),this._setContainerMeasure(t.height,!1))}},s.prototype._getContainerSize=p,s.prototype._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},s.prototype._emitCompleteOnItems=function(t,e){function i(){n.emitEvent(t+"Complete",[e])}function o(){s++,s===r&&i()}var n=this,r=e.length;if(!e||!r)return i(),void 0;for(var s=0,a=0,u=e.length;u>a;a++){var p=e[a];p.once(t,o)}},s.prototype.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},s.prototype.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},s.prototype.stamp=function(t){if(t=this._find(t)){this.stamps=this.stamps.concat(t);for(var e=0,i=t.length;i>e;e++){var o=t[e];this.ignore(o)}}},s.prototype.unstamp=function(t){if(t=this._find(t))for(var e=0,i=t.length;i>e;e++){var o=t[e];n.removeFrom(this.stamps,o),this.unignore(o)}},s.prototype._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=n.makeArray(t)):void 0},s.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var t=0,e=this.stamps.length;e>t;t++){var i=this.stamps[t];this._manageStamp(i)}}},s.prototype._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},s.prototype._manageStamp=p,s.prototype._getElementOffset=function(t){var e=t.getBoundingClientRect(),i=this._boundingRect,n=o(t),r={left:e.left-i.left-n.marginLeft,top:e.top-i.top-n.marginTop,right:i.right-e.right-n.marginRight,bottom:i.bottom-e.bottom-n.marginBottom};return r},s.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},s.prototype.bindResize=function(){this.isResizeBound||(e.bind(t,"resize",this),this.isResizeBound=!0)},s.prototype.unbindResize=function(){this.isResizeBound&&e.unbind(t,"resize",this),this.isResizeBound=!1},s.prototype.onresize=function(){function t(){e.resize(),delete e.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var e=this;this.resizeTimeout=setTimeout(t,100)},s.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},s.prototype.needsResizeLayout=function(){var t=o(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},s.prototype.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},s.prototype.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},s.prototype.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},s.prototype.reveal=function(t){this._emitCompleteOnItems("reveal",t);for(var e=t&&t.length,i=0;e&&e>i;i++){var o=t[i];o.reveal()}},s.prototype.hide=function(t){this._emitCompleteOnItems("hide",t);for(var e=t&&t.length,i=0;e&&e>i;i++){var o=t[i];o.hide()}},s.prototype.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},s.prototype.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},s.prototype.getItem=function(t){for(var e=0,i=this.items.length;i>e;e++){var o=this.items[e];if(o.element===t)return o}},s.prototype.getItems=function(t){t=n.makeArray(t);for(var e=[],i=0,o=t.length;o>i;i++){var r=t[i],s=this.getItem(r);s&&e.push(s)}return e},s.prototype.remove=function(t){var e=this.getItems(t);if(this._emitCompleteOnItems("remove",e),e&&e.length)for(var i=0,o=e.length;o>i;i++){var r=e[i];r.remove(),n.removeFrom(this.items,r)}},s.prototype.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="";for(var e=0,i=this.items.length;i>e;e++){var o=this.items[e];o.destroy()}this.unbindResize();var n=this.element.outlayerGUID;delete f[n],delete this.element.outlayerGUID,u&&u.removeData(this.element,this.constructor.namespace)},s.data=function(t){t=n.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&f[e]},s.create=function(t,e){function i(){s.apply(this,arguments)}return Object.create?i.prototype=Object.create(s.prototype):n.extend(i.prototype,s.prototype),i.prototype.constructor=i,i.defaults=n.extend({},s.defaults),n.extend(i.defaults,e),i.prototype.settings={},i.namespace=t,i.data=s.data,i.Item=function(){r.apply(this,arguments)},i.Item.prototype=new r,n.htmlInit(i,t),u&&u.bridget&&u.bridget(t,i),i},s.Item=r,s}),function(t,e){"function"==typeof define&&define.amd?define("isotope/js/item",["outlayer/outlayer"],e):"object"==typeof exports?module.exports=e(require("outlayer")):(t.Isotope=t.Isotope||{},t.Isotope.Item=e(t.Outlayer))}(window,function(t){function e(){t.Item.apply(this,arguments)}e.prototype=new t.Item,e.prototype._create=function(){this.id=this.layout.itemGUID++,t.Item.prototype._create.call(this),this.sortData={}},e.prototype.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var t=this.layout.options.getSortData,e=this.layout._sorters;for(var i in t){var o=e[i];this.sortData[i]=o(this.element,this)}}};var i=e.prototype.destroy;return e.prototype.destroy=function(){i.apply(this,arguments),this.css({display:""})},e}),function(t,e){"function"==typeof define&&define.amd?define("isotope/js/layout-mode",["get-size/get-size","outlayer/outlayer"],e):"object"==typeof exports?module.exports=e(require("get-size"),require("outlayer")):(t.Isotope=t.Isotope||{},t.Isotope.LayoutMode=e(t.getSize,t.Outlayer))}(window,function(t,e){function i(t){this.isotope=t,t&&(this.options=t.options[this.namespace],this.element=t.element,this.items=t.filteredItems,this.size=t.size)}return function(){function t(t){return function(){return e.prototype[t].apply(this.isotope,arguments)}}for(var o=["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout"],n=0,r=o.length;r>n;n++){var s=o[n];i.prototype[s]=t(s)}}(),i.prototype.needsVerticalResizeLayout=function(){var e=t(this.isotope.element),i=this.isotope.size&&e;return i&&e.innerHeight!=this.isotope.size.innerHeight},i.prototype._getMeasurement=function(){this.isotope._getMeasurement.apply(this,arguments)},i.prototype.getColumnWidth=function(){this.getSegmentSize("column","Width")},i.prototype.getRowHeight=function(){this.getSegmentSize("row","Height")},i.prototype.getSegmentSize=function(t,e){var i=t+e,o="outer"+e;if(this._getMeasurement(i,o),!this[i]){var n=this.getFirstItemSize();this[i]=n&&n[o]||this.isotope.size["inner"+e]}},i.prototype.getFirstItemSize=function(){var e=this.isotope.filteredItems[0];return e&&e.element&&t(e.element)},i.prototype.layout=function(){this.isotope.layout.apply(this.isotope,arguments)},i.prototype.getSize=function(){this.isotope.getSize(),this.size=this.isotope.size},i.modes={},i.create=function(t,e){function o(){i.apply(this,arguments)}return o.prototype=new i,e&&(o.options=e),o.prototype.namespace=t,i.modes[t]=o,o},i}),function(t,e){"function"==typeof define&&define.amd?define("masonry/masonry",["outlayer/outlayer","get-size/get-size","fizzy-ui-utils/utils"],e):"object"==typeof exports?module.exports=e(require("outlayer"),require("get-size"),require("fizzy-ui-utils")):t.Masonry=e(t.Outlayer,t.getSize,t.fizzyUIUtils)}(window,function(t,e,i){var o=t.create("masonry");return o.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var t=this.cols;for(this.colYs=[];t--;)this.colYs.push(0);this.maxY=0},o.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var o=this.columnWidth+=this.gutter,n=this.containerWidth+this.gutter,r=n/o,s=o-n%o,a=s&&1>s?"round":"floor";r=Math[a](r),this.cols=Math.max(r,1)},o.prototype.getContainerWidth=function(){var t=this.options.isFitWidth?this.element.parentNode:this.element,i=e(t);this.containerWidth=i&&i.innerWidth},o.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,o=e&&1>e?"round":"ceil",n=Math[o](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var r=this._getColGroup(n),s=Math.min.apply(Math,r),a=i.indexOf(r,s),u={x:this.columnWidth*a,y:s},p=s+t.size.outerHeight,h=this.cols+1-r.length,f=0;h>f;f++)this.colYs[a+f]=p;return u},o.prototype._getColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,o=0;i>o;o++){var n=this.colYs.slice(o,o+t);e[o]=Math.max.apply(Math,n)}return e},o.prototype._manageStamp=function(t){var i=e(t),o=this._getElementOffset(t),n=this.options.isOriginLeft?o.left:o.right,r=n+i.outerWidth,s=Math.floor(n/this.columnWidth);s=Math.max(0,s);var a=Math.floor(r/this.columnWidth);a-=r%this.columnWidth?0:1,a=Math.min(this.cols-1,a);for(var u=(this.options.isOriginTop?o.top:o.bottom)+i.outerHeight,p=s;a>=p;p++)this.colYs[p]=Math.max(u,this.colYs[p])},o.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this.options.isFitWidth&&(t.width=this._getContainerFitWidth()),t},o.prototype._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},o.prototype.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!==this.containerWidth},o}),function(t,e){"function"==typeof define&&define.amd?define("isotope/js/layout-modes/masonry",["../layout-mode","masonry/masonry"],e):"object"==typeof exports?module.exports=e(require("../layout-mode"),require("masonry-layout")):e(t.Isotope.LayoutMode,t.Masonry)}(window,function(t,e){function i(t,e){for(var i in e)t[i]=e[i];return t}var o=t.create("masonry"),n=o.prototype._getElementOffset,r=o.prototype.layout,s=o.prototype._getMeasurement;i(o.prototype,e.prototype),o.prototype._getElementOffset=n,o.prototype.layout=r,o.prototype._getMeasurement=s;var a=o.prototype.measureColumns;o.prototype.measureColumns=function(){this.items=this.isotope.filteredItems,a.call(this)};var u=o.prototype._manageStamp;return o.prototype._manageStamp=function(){this.options.isOriginLeft=this.isotope.options.isOriginLeft,this.options.isOriginTop=this.isotope.options.isOriginTop,u.apply(this,arguments)},o}),function(t,e){"function"==typeof define&&define.amd?define("isotope/js/layout-modes/fit-rows",["../layout-mode"],e):"object"==typeof exports?module.exports=e(require("../layout-mode")):e(t.Isotope.LayoutMode)}(window,function(t){var e=t.create("fitRows");return e.prototype._resetLayout=function(){this.x=0,this.y=0,this.maxY=0,this._getMeasurement("gutter","outerWidth")
},e.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth+this.gutter,i=this.isotope.size.innerWidth+this.gutter;0!==this.x&&e+this.x>i&&(this.x=0,this.y=this.maxY);var o={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+t.size.outerHeight),this.x+=e,o},e.prototype._getContainerSize=function(){return{height:this.maxY}},e}),function(t,e){"function"==typeof define&&define.amd?define("isotope/js/layout-modes/vertical",["../layout-mode"],e):"object"==typeof exports?module.exports=e(require("../layout-mode")):e(t.Isotope.LayoutMode)}(window,function(t){var e=t.create("vertical",{horizontalAlignment:0});return e.prototype._resetLayout=function(){this.y=0},e.prototype._getItemLayoutPosition=function(t){t.getSize();var e=(this.isotope.size.innerWidth-t.size.outerWidth)*this.options.horizontalAlignment,i=this.y;return this.y+=t.size.outerHeight,{x:e,y:i}},e.prototype._getContainerSize=function(){return{height:this.y}},e}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","matches-selector/matches-selector","fizzy-ui-utils/utils","isotope/js/item","isotope/js/layout-mode","isotope/js/layout-modes/masonry","isotope/js/layout-modes/fit-rows","isotope/js/layout-modes/vertical"],function(i,o,n,r,s,a){return e(t,i,o,n,r,s,a)}):"object"==typeof exports?module.exports=e(t,require("outlayer"),require("get-size"),require("desandro-matches-selector"),require("fizzy-ui-utils"),require("./item"),require("./layout-mode"),require("./layout-modes/masonry"),require("./layout-modes/fit-rows"),require("./layout-modes/vertical")):t.Isotope=e(t,t.Outlayer,t.getSize,t.matchesSelector,t.fizzyUIUtils,t.Isotope.Item,t.Isotope.LayoutMode)}(window,function(t,e,i,o,n,r,s){function a(t,e){return function(i,o){for(var n=0,r=t.length;r>n;n++){var s=t[n],a=i.sortData[s],u=o.sortData[s];if(a>u||u>a){var p=void 0!==e[s]?e[s]:e,h=p?1:-1;return(a>u?1:-1)*h}}return 0}}var u=t.jQuery,p=String.prototype.trim?function(t){return t.trim()}:function(t){return t.replace(/^\s+|\s+$/g,"")},h=document.documentElement,f=h.textContent?function(t){return t.textContent}:function(t){return t.innerText},d=e.create("isotope",{layoutMode:"masonry",isJQueryFiltering:!0,sortAscending:!0});d.Item=r,d.LayoutMode=s,d.prototype._create=function(){this.itemGUID=0,this._sorters={},this._getSorters(),e.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"];for(var t in s.modes)this._initLayoutMode(t)},d.prototype.reloadItems=function(){this.itemGUID=0,e.prototype.reloadItems.call(this)},d.prototype._itemize=function(){for(var t=e.prototype._itemize.apply(this,arguments),i=0,o=t.length;o>i;i++){var n=t[i];n.id=this.itemGUID++}return this._updateItemsSortData(t),t},d.prototype._initLayoutMode=function(t){var e=s.modes[t],i=this.options[t]||{};this.options[t]=e.options?n.extend(e.options,i):i,this.modes[t]=new e(this)},d.prototype.layout=function(){return!this._isLayoutInited&&this.options.isInitLayout?(this.arrange(),void 0):(this._layout(),void 0)},d.prototype._layout=function(){var t=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,t),this._isLayoutInited=!0},d.prototype.arrange=function(t){function e(){o.reveal(i.needReveal),o.hide(i.needHide)}this.option(t),this._getIsInstant();var i=this._filter(this.items);this.filteredItems=i.matches;var o=this;this._bindArrangeComplete(),this._isInstant?this._noTransition(e):e(),this._sort(),this._layout()},d.prototype._init=d.prototype.arrange,d.prototype._getIsInstant=function(){var t=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;return this._isInstant=t,t},d.prototype._bindArrangeComplete=function(){function t(){e&&i&&o&&n.emitEvent("arrangeComplete",[n.filteredItems])}var e,i,o,n=this;this.once("layoutComplete",function(){e=!0,t()}),this.once("hideComplete",function(){i=!0,t()}),this.once("revealComplete",function(){o=!0,t()})},d.prototype._filter=function(t){var e=this.options.filter;e=e||"*";for(var i=[],o=[],n=[],r=this._getFilterTest(e),s=0,a=t.length;a>s;s++){var u=t[s];if(!u.isIgnored){var p=r(u);p&&i.push(u),p&&u.isHidden?o.push(u):p||u.isHidden||n.push(u)}}return{matches:i,needReveal:o,needHide:n}},d.prototype._getFilterTest=function(t){return u&&this.options.isJQueryFiltering?function(e){return u(e.element).is(t)}:"function"==typeof t?function(e){return t(e.element)}:function(e){return o(e.element,t)}},d.prototype.updateSortData=function(t){var e;t?(t=n.makeArray(t),e=this.getItems(t)):e=this.items,this._getSorters(),this._updateItemsSortData(e)},d.prototype._getSorters=function(){var t=this.options.getSortData;for(var e in t){var i=t[e];this._sorters[e]=l(i)}},d.prototype._updateItemsSortData=function(t){for(var e=t&&t.length,i=0;e&&e>i;i++){var o=t[i];o.updateSortData()}};var l=function(){function t(t){if("string"!=typeof t)return t;var i=p(t).split(" "),o=i[0],n=o.match(/^\[(.+)\]$/),r=n&&n[1],s=e(r,o),a=d.sortDataParsers[i[1]];return t=a?function(t){return t&&a(s(t))}:function(t){return t&&s(t)}}function e(t,e){var i;return i=t?function(e){return e.getAttribute(t)}:function(t){var i=t.querySelector(e);return i&&f(i)}}return t}();d.sortDataParsers={parseInt:function(t){return parseInt(t,10)},parseFloat:function(t){return parseFloat(t)}},d.prototype._sort=function(){var t=this.options.sortBy;if(t){var e=[].concat.apply(t,this.sortHistory),i=a(e,this.options.sortAscending);this.filteredItems.sort(i),t!=this.sortHistory[0]&&this.sortHistory.unshift(t)}},d.prototype._mode=function(){var t=this.options.layoutMode,e=this.modes[t];if(!e)throw Error("No layout mode: "+t);return e.options=this.options[t],e},d.prototype._resetLayout=function(){e.prototype._resetLayout.call(this),this._mode()._resetLayout()},d.prototype._getItemLayoutPosition=function(t){return this._mode()._getItemLayoutPosition(t)},d.prototype._manageStamp=function(t){this._mode()._manageStamp(t)},d.prototype._getContainerSize=function(){return this._mode()._getContainerSize()},d.prototype.needsResizeLayout=function(){return this._mode().needsResizeLayout()},d.prototype.appended=function(t){var e=this.addItems(t);if(e.length){var i=this._filterRevealAdded(e);this.filteredItems=this.filteredItems.concat(i)}},d.prototype.prepended=function(t){var e=this._itemize(t);if(e.length){this._resetLayout(),this._manageStamps();var i=this._filterRevealAdded(e);this.layoutItems(this.filteredItems),this.filteredItems=i.concat(this.filteredItems),this.items=e.concat(this.items)}},d.prototype._filterRevealAdded=function(t){var e=this._filter(t);return this.hide(e.needHide),this.reveal(e.matches),this.layoutItems(e.matches,!0),e.matches},d.prototype.insert=function(t){var e=this.addItems(t);if(e.length){var i,o,n=e.length;for(i=0;n>i;i++)o=e[i],this.element.appendChild(o.element);var r=this._filter(e).matches;for(i=0;n>i;i++)e[i].isLayoutInstant=!0;for(this.arrange(),i=0;n>i;i++)delete e[i].isLayoutInstant;this.reveal(r)}};var c=d.prototype.remove;return d.prototype.remove=function(t){t=n.makeArray(t);var e=this.getItems(t);c.call(this,t);var i=e&&e.length;if(i)for(var o=0;i>o;o++){var r=e[o];n.removeFrom(this.filteredItems,r)}},d.prototype.shuffle=function(){for(var t=0,e=this.items.length;e>t;t++){var i=this.items[t];i.sortData.random=Math.random()}this.options.sortBy="random",this._sort(),this._layout()},d.prototype._noTransition=function(t){var e=this.options.transitionDuration;this.options.transitionDuration=0;var i=t.call(this);return this.options.transitionDuration=e,i},d.prototype.getFilteredItemElements=function(){for(var t=[],e=0,i=this.filteredItems.length;i>e;e++)t.push(this.filteredItems[e].element);return t},d});
/*!
 * jQuery Browser Plugin 0.0.7
 * https://github.com/gabceb/jquery-browser-plugin
 *
 * Original jquery-browser code Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * http://jquery.org/license
 *
 * Modifications Copyright 2014 Gabriel Cebrian
 * https://github.com/gabceb
 *
 * Released under the MIT license
 *
 * Date: 12-12-2014
 */!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],function(c){b(c,a)}):b(jQuery,a)}(this,function(a,b){"use strict";var c,d;if(a.uaMatch=function(a){a=a.toLowerCase();var b=/(edge)\/([\w.]+)/.exec(a)||/(opr)[\/]([\w.]+)/.exec(a)||/(chrome)[ \/]([\w.]+)/.exec(a)||/(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||a.indexOf("trident")>=0&&/(rv)(?::| )([\w.]+)/.exec(a)||a.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||[],c=/(ipad)/.exec(a)||/(ipod)/.exec(a)||/(iphone)/.exec(a)||/(kindle)/.exec(a)||/(silk)/.exec(a)||/(android)/.exec(a)||/(windows phone)/.exec(a)||/(win)/.exec(a)||/(mac)/.exec(a)||/(linux)/.exec(a)||/(cros)/.exec(a)||/(playbook)/.exec(a)||/(bb)/.exec(a)||/(blackberry)/.exec(a)||[];return{browser:b[5]||b[3]||b[1]||"",version:b[2]||b[4]||"0",versionNumber:b[4]||b[2]||"0",platform:c[0]||""}},c=a.uaMatch(b.navigator.userAgent),d={},c.browser&&(d[c.browser]=!0,d.version=c.version,d.versionNumber=parseInt(c.versionNumber,10)),c.platform&&(d[c.platform]=!0),(d.android||d.bb||d.blackberry||d.ipad||d.iphone||d.ipod||d.kindle||d.playbook||d.silk||d["windows phone"])&&(d.mobile=!0),(d.cros||d.mac||d.linux||d.win)&&(d.desktop=!0),(d.chrome||d.opr||d.safari)&&(d.webkit=!0),d.rv||d.edge){var e="msie";c.browser=e,d[e]=!0}if(d.safari&&d.blackberry){var f="blackberry";c.browser=f,d[f]=!0}if(d.safari&&d.playbook){var g="playbook";c.browser=g,d[g]=!0}if(d.bb){var h="blackberry";c.browser=h,d[h]=!0}if(d.opr){var i="opera";c.browser=i,d[i]=!0}if(d.safari&&d.android){var j="android";c.browser=j,d[j]=!0}if(d.safari&&d.kindle){var k="kindle";c.browser=k,d[k]=!0}if(d.safari&&d.silk){var l="silk";c.browser=l,d[l]=!0}return d.name=c.browser,d.platform=c.platform,a.browser=d,d});
/* ============================================================
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * https://raw.github.com/danro/jquery-easing/master/LICENSE
 * ======================================================== */jQuery.easing.jswing=jQuery.easing.swing,jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(a,b,c,d,e){return jQuery.easing[jQuery.easing.def](a,b,c,d,e)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b+c:-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b+c:d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b*b+c:-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b*b*b+c:d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return b==0?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){return b==0?c:b==e?c+d:(b/=e/2)<1?d/2*Math.pow(2,10*(b-1))+c:d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){return(b/=e/2)<1?-d/2*(Math.sqrt(1-b*b)-1)+c:d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(b==0)return c;if((b/=e)==1)return c+d;g||(g=e*.3);if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(b==0)return c;if((b/=e)==1)return c+d;g||(g=e*.3);if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(b==0)return c;if((b/=e/2)==2)return c+d;g||(g=e*.3*1.5);if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return b<1?-0.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c:h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)*.5+d+c},easeInBack:function(a,b,c,d,e,f){return f==undefined&&(f=1.70158),d*(b/=e)*b*((f+1)*b-f)+c},easeOutBack:function(a,b,c,d,e,f){return f==undefined&&(f=1.70158),d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInOutBack:function(a,b,c,d,e,f){return f==undefined&&(f=1.70158),(b/=e/2)<1?d/2*b*b*(((f*=1.525)+1)*b-f)+c:d/2*((b-=2)*b*(((f*=1.525)+1)*b+f)+2)+c},easeInBounce:function(a,b,c,d,e){return d-jQuery.easing.easeOutBounce(a,e-b,0,d,e)+c},easeOutBounce:function(a,b,c,d,e){return(b/=e)<1/2.75?d*7.5625*b*b+c:b<2/2.75?d*(7.5625*(b-=1.5/2.75)*b+.75)+c:b<2.5/2.75?d*(7.5625*(b-=2.25/2.75)*b+.9375)+c:d*(7.5625*(b-=2.625/2.75)*b+.984375)+c},easeInOutBounce:function(a,b,c,d,e){return b<e/2?jQuery.easing.easeInBounce(a,b*2,0,d,e)*.5+c:jQuery.easing.easeOutBounce(a,b*2-e,0,d,e)*.5+d*.5+c}});
!function(t,i,o,e){function n(i,o){this.el=i,this.$el=t(this.el),this.options=t.extend({},l,o),this._defaults=l,this._name=a,this.init()}var a="nivoLightbox",l={effect:"fade",theme:"default",keyboardNav:!0,clickOverlayToClose:!0,onInit:function(){},beforeShowLightbox:function(){},afterShowLightbox:function(t){},beforeHideLightbox:function(){},afterHideLightbox:function(){},onPrev:function(t){},onNext:function(t){},errorMessage:"The requested content cannot be loaded. Please try again later."};n.prototype={init:function(){var i=this;t("html").hasClass("nivo-lightbox-notouch")||t("html").addClass("nivo-lightbox-notouch"),"ontouchstart"in o&&t("html").removeClass("nivo-lightbox-notouch"),this.$el.on("click",function(t){i.showLightbox(t)}),this.options.keyboardNav&&t("body").off("keyup").on("keyup",function(o){var e=o.keyCode?o.keyCode:o.which;27==e&&i.destructLightbox(),37==e&&t(".nivo-lightbox-prev").trigger("click"),39==e&&t(".nivo-lightbox-next").trigger("click")}),this.options.onInit.call(this)},showLightbox:function(i){var o=this,e=this.$el,n=this.checkContent(e);if(n){i.preventDefault(),this.options.beforeShowLightbox.call(this);var a=this.constructLightbox();if(a){var l=a.find(".nivo-lightbox-content");if(l){if(t("body").addClass("nivo-lightbox-body-effect-"+this.options.effect),this.processContent(l,e),this.$el.attr("data-lightbox-gallery")){var h=t('[data-lightbox-gallery="'+this.$el.attr("data-lightbox-gallery")+'"]');t(".nivo-lightbox-nav").show(),t(".nivo-lightbox-prev").off("click").on("click",function(i){i.preventDefault();var n=h.index(e);e=h.eq(n-1),t(e).length||(e=h.last()),o.processContent(l,e),o.options.onPrev.call(this,[e])}),t(".nivo-lightbox-next").off("click").on("click",function(i){i.preventDefault();var n=h.index(e);e=h.eq(n+1),t(e).length||(e=h.first()),o.processContent(l,e),o.options.onNext.call(this,[e])})}setTimeout(function(){a.addClass("nivo-lightbox-open"),o.options.afterShowLightbox.call(this,[a])},1)}}}},checkContent:function(t){var i=t.attr("href"),o=i.match(/(youtube|youtu|vimeo)\.(com|be)\/(watch\?v=([\w-]+)|([\w-]+))/);return null!==i.match(/\.(jpeg|jpg|gif|png)$/i)?!0:o?!0:"ajax"==t.attr("data-lightbox-type")?!0:"#"==i.substring(0,1)&&"inline"==t.attr("data-lightbox-type")?!0:"iframe"==t.attr("data-lightbox-type")?!0:!1},processContent:function(o,e){var n=this,a=e.attr("href"),l=a.match(/(youtube|youtu|vimeo)\.(com|be)\/(watch\?v=([\w-]+)|([\w-]+))/);if(o.html("").addClass("nivo-lightbox-loading"),this.isHidpi()&&e.attr("data-lightbox-hidpi")&&(a=e.attr("data-lightbox-hidpi")),null!==a.match(/\.(jpeg|jpg|gif|png)$/i)){var h=t("<img>",{src:a});h.one("load",function(){var e=t('<div class="nivo-lightbox-image" />');e.append(h),o.html(e).removeClass("nivo-lightbox-loading"),e.css({"line-height":t(".nivo-lightbox-content").height()+"px",height:t(".nivo-lightbox-content").height()+"px"}),t(i).resize(function(){e.css({"line-height":t(".nivo-lightbox-content").height()+"px",height:t(".nivo-lightbox-content").height()+"px"})})}).each(function(){this.complete&&t(this).load()}),h.error(function(){var i=t('<div class="nivo-lightbox-error"><p>'+n.options.errorMessage+"</p></div>");o.html(i).removeClass("nivo-lightbox-loading")})}else if(l){var s="",r="nivo-lightbox-video";if("youtube"==l[1]&&(s="http://www.youtube.com/embed/"+l[4],r="nivo-lightbox-youtube"),"youtu"==l[1]&&(s="http://www.youtube.com/embed/"+l[3],r="nivo-lightbox-youtube"),"vimeo"==l[1]&&(s="http://player.vimeo.com/video/"+l[3],r="nivo-lightbox-vimeo"),s){var c=t("<iframe>",{src:s,"class":r,frameborder:0,vspace:0,hspace:0,scrolling:"auto"});o.html(c),c.load(function(){o.removeClass("nivo-lightbox-loading")})}}else if("ajax"==e.attr("data-lightbox-type"))t.ajax({url:a,cache:!1,success:function(e){var n=t('<div class="nivo-lightbox-ajax" />');n.append(e),o.html(n).removeClass("nivo-lightbox-loading"),n.outerHeight()<o.height()&&n.css({position:"relative",top:"50%","margin-top":-(n.outerHeight()/2)+"px"}),t(i).resize(function(){n.outerHeight()<o.height()&&n.css({position:"relative",top:"50%","margin-top":-(n.outerHeight()/2)+"px"})})},error:function(){var i=t('<div class="nivo-lightbox-error"><p>'+n.options.errorMessage+"</p></div>");o.html(i).removeClass("nivo-lightbox-loading")}});else if("#"==a.substring(0,1)&&"inline"==e.attr("data-lightbox-type"))if(t(a).length){var v=t('<div class="nivo-lightbox-inline" />');v.append(t(a).clone().show()),o.html(v).removeClass("nivo-lightbox-loading"),v.outerHeight()<o.height()&&v.css({position:"relative",top:"50%","margin-top":-(v.outerHeight()/2)+"px"}),t(i).resize(function(){v.outerHeight()<o.height()&&v.css({position:"relative",top:"50%","margin-top":-(v.outerHeight()/2)+"px"})})}else{var g=t('<div class="nivo-lightbox-error"><p>'+n.options.errorMessage+"</p></div>");o.html(g).removeClass("nivo-lightbox-loading")}else{if("iframe"!=e.attr("data-lightbox-type"))return!1;var b=t("<iframe>",{src:a,"class":"nivo-lightbox-item",frameborder:0,vspace:0,hspace:0,scrolling:"auto"});o.html(b),b.load(function(){o.removeClass("nivo-lightbox-loading")})}if(e.attr("title")){var x=t("<span>",{"class":"nivo-lightbox-title"});x.text(e.attr("title")),t(".nivo-lightbox-title-wrap").html(x)}else t(".nivo-lightbox-title-wrap").html("")},constructLightbox:function(){if(t(".nivo-lightbox-overlay").length)return t(".nivo-lightbox-overlay");var i=t("<div>",{"class":"nivo-lightbox-overlay nivo-lightbox-theme-"+this.options.theme+" nivo-lightbox-effect-"+this.options.effect}),o=t("<div>",{"class":"nivo-lightbox-wrap"}),e=t("<div>",{"class":"nivo-lightbox-content"}),n=t('<a href="#" class="nivo-lightbox-nav nivo-lightbox-prev">Previous</a><a href="#" class="nivo-lightbox-nav nivo-lightbox-next">Next</a>'),a=t('<a href="#" class="nivo-lightbox-close" title="Close">Close</a>'),l=t("<div>",{"class":"nivo-lightbox-title-wrap"}),h=0;h&&i.addClass("nivo-lightbox-ie"),o.append(e),o.append(l),i.append(o),i.append(n),i.append(a),t("body").append(i);var s=this;return s.options.clickOverlayToClose&&i.on("click",function(i){(i.target===this||t(i.target).hasClass("nivo-lightbox-content")||t(i.target).hasClass("nivo-lightbox-image"))&&s.destructLightbox()}),a.on("click",function(t){t.preventDefault(),s.destructLightbox()}),i},destructLightbox:function(){var i=this;this.options.beforeHideLightbox.call(this),t(".nivo-lightbox-overlay").removeClass("nivo-lightbox-open"),t(".nivo-lightbox-nav").hide(),t("body").removeClass("nivo-lightbox-body-effect-"+i.options.effect);var o=0;o&&(t(".nivo-lightbox-overlay iframe").attr("src"," "),t(".nivo-lightbox-overlay iframe").remove()),t(".nivo-lightbox-prev").off("click"),t(".nivo-lightbox-next").off("click"),t(".nivo-lightbox-content").empty(),this.options.afterHideLightbox.call(this)},isHidpi:function(){var t="(-webkit-min-device-pixel-ratio: 1.5),                              (min--moz-device-pixel-ratio: 1.5),                              (-o-min-device-pixel-ratio: 3/2),                              (min-resolution: 1.5dppx)";return i.devicePixelRatio>1?!0:i.matchMedia&&i.matchMedia(t).matches?!0:!1}},t.fn[a]=function(i){return this.each(function(){t.data(this,a)||t.data(this,a,new n(this,i))})}}(jQuery,window,document);
 /*
 * # Semantic UI - 2.2.10
 * https://github.com/Semantic-Org/Semantic-UI
 * http://www.semantic-ui.com/
 *
 * Copyright 2014 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
!function(e,t,n,i){e.site=e.fn.site=function(o){var a,r,s=(new Date).getTime(),l=[],c=arguments[0],u="string"==typeof c,d=[].slice.call(arguments,1),f=e.isPlainObject(o)?e.extend(!0,{},e.site.settings,o):e.extend({},e.site.settings),m=f.namespace,g=f.error,p="module-"+m,h=e(n),v=h,b=this,y=v.data(p);return a={initialize:function(){a.instantiate()},instantiate:function(){a.verbose("Storing instance of site",a),y=a,v.data(p,a)},normalize:function(){a.fix.console(),a.fix.requestAnimationFrame()},fix:{console:function(){a.debug("Normalizing window.console"),console!==i&&console.log!==i||(a.verbose("Console not available, normalizing events"),a.disable.console()),"undefined"!=typeof console.group&&"undefined"!=typeof console.groupEnd&&"undefined"!=typeof console.groupCollapsed||(a.verbose("Console group not available, normalizing events"),t.console.group=function(){},t.console.groupEnd=function(){},t.console.groupCollapsed=function(){}),"undefined"==typeof console.markTimeline&&(a.verbose("Mark timeline not available, normalizing events"),t.console.markTimeline=function(){})},consoleClear:function(){a.debug("Disabling programmatic console clearing"),t.console.clear=function(){}},requestAnimationFrame:function(){a.debug("Normalizing requestAnimationFrame"),t.requestAnimationFrame===i&&(a.debug("RequestAnimationFrame not available, normalizing event"),t.requestAnimationFrame=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)})}},moduleExists:function(t){return e.fn[t]!==i&&e.fn[t].settings!==i},enabled:{modules:function(t){var n=[];return t=t||f.modules,e.each(t,function(e,t){a.moduleExists(t)&&n.push(t)}),n}},disabled:{modules:function(t){var n=[];return t=t||f.modules,e.each(t,function(e,t){a.moduleExists(t)||n.push(t)}),n}},change:{setting:function(t,n,o,r){o="string"==typeof o?"all"===o?f.modules:[o]:o||f.modules,r=r!==i?r:!0,e.each(o,function(i,o){var s,l=a.moduleExists(o)?e.fn[o].settings.namespace||!1:!0;a.moduleExists(o)&&(a.verbose("Changing default setting",t,n,o),e.fn[o].settings[t]=n,r&&l&&(s=e(":data(module-"+l+")"),s.length>0&&(a.verbose("Modifying existing settings",s),s[o]("setting",t,n))))})},settings:function(t,n,o){n="string"==typeof n?[n]:n||f.modules,o=o!==i?o:!0,e.each(n,function(n,i){var r;a.moduleExists(i)&&(a.verbose("Changing default setting",t,i),e.extend(!0,e.fn[i].settings,t),o&&m&&(r=e(":data(module-"+m+")"),r.length>0&&(a.verbose("Modifying existing settings",r),r[i]("setting",t))))})}},enable:{console:function(){a.console(!0)},debug:function(e,t){e=e||f.modules,a.debug("Enabling debug for modules",e),a.change.setting("debug",!0,e,t)},verbose:function(e,t){e=e||f.modules,a.debug("Enabling verbose debug for modules",e),a.change.setting("verbose",!0,e,t)}},disable:{console:function(){a.console(!1)},debug:function(e,t){e=e||f.modules,a.debug("Disabling debug for modules",e),a.change.setting("debug",!1,e,t)},verbose:function(e,t){e=e||f.modules,a.debug("Disabling verbose debug for modules",e),a.change.setting("verbose",!1,e,t)}},console:function(e){if(e){if(y.cache.console===i)return void a.error(g.console);a.debug("Restoring console function"),t.console=y.cache.console}else a.debug("Disabling console function"),y.cache.console=t.console,t.console={clear:function(){},error:function(){},group:function(){},groupCollapsed:function(){},groupEnd:function(){},info:function(){},log:function(){},markTimeline:function(){},warn:function(){}}},destroy:function(){a.verbose("Destroying previous site for",v),v.removeData(p)},cache:{},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,f,t);else{if(n===i)return f[t];f[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,a,t);else{if(n===i)return a[t];a[t]=n}},debug:function(){f.debug&&(f.performance?a.performance.log(arguments):(a.debug=Function.prototype.bind.call(console.info,console,f.name+":"),a.debug.apply(console,arguments)))},verbose:function(){f.verbose&&f.debug&&(f.performance?a.performance.log(arguments):(a.verbose=Function.prototype.bind.call(console.info,console,f.name+":"),a.verbose.apply(console,arguments)))},error:function(){a.error=Function.prototype.bind.call(console.error,console,f.name+":"),a.error.apply(console,arguments)},performance:{log:function(e){var t,n,i;f.performance&&(t=(new Date).getTime(),i=s||t,n=t-i,s=t,l.push({Element:b,Name:e[0],Arguments:[].slice.call(e,1)||"","Execution Time":n})),clearTimeout(a.performance.timer),a.performance.timer=setTimeout(a.performance.display,500)},display:function(){var t=f.name+":",n=0;s=!1,clearTimeout(a.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",(console.group!==i||console.table!==i)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,o){var s,l,c,u=y;return n=n||d,o=b||o,"string"==typeof t&&u!==i&&(t=t.split(/[\. ]/),s=t.length-1,e.each(t,function(n,o){var r=n!=s?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(u[r])&&n!=s)u=u[r];else{if(u[r]!==i)return l=u[r],!1;if(!e.isPlainObject(u[o])||n==s)return u[o]!==i?(l=u[o],!1):(a.error(g.method,t),!1);u=u[o]}})),e.isFunction(l)?c=l.apply(o,n):l!==i&&(c=l),e.isArray(r)?r.push(c):r!==i?r=[r,c]:c!==i&&(r=c),l}},u?(y===i&&a.initialize(),a.invoke(c)):(y!==i&&a.destroy(),a.initialize()),r!==i?r:this},e.site.settings={name:"Site",namespace:"site",error:{console:"Console cannot be restored, most likely it was overwritten outside of module",method:"The method you called is not defined."},debug:!1,verbose:!1,performance:!0,modules:["accordion","api","checkbox","dimmer","dropdown","embed","form","modal","nag","popup","rating","shape","sidebar","state","sticky","tab","transition","visit","visibility"],siteNamespace:"site",namespaceStub:{cache:{},config:{},sections:{},section:{},utilities:{}}},e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(n){return!!e.data(n,t)}}):function(t,n,i){return!!e.data(t,i[3])}})}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.form=function(t){var o,a=e(this),r=a.selector||"",s=(new Date).getTime(),l=[],c=arguments[0],u=arguments[1],d="string"==typeof c,f=[].slice.call(arguments,1);return a.each(function(){var m,g,p,h,v,b,y,x,C,w,k,S,T,A,R,P,E,F,O,D=e(this),q=this,j=[],z=!1;O={initialize:function(){O.get.settings(),d?(F===i&&O.instantiate(),O.invoke(c)):(F!==i&&F.invoke("destroy"),O.verbose("Initializing form validation",D,x),O.bindEvents(),O.set.defaults(),O.instantiate())},instantiate:function(){O.verbose("Storing instance of module",O),F=O,D.data(P,O)},destroy:function(){O.verbose("Destroying previous module",F),O.removeEvents(),D.removeData(P)},refresh:function(){O.verbose("Refreshing selector cache"),m=D.find(k.field),g=D.find(k.group),p=D.find(k.message),h=D.find(k.prompt),v=D.find(k.submit),b=D.find(k.clear),y=D.find(k.reset)},submit:function(){O.verbose("Submitting form",D),D.submit()},attachEvents:function(t,n){n=n||"submit",e(t).on("click"+E,function(e){O[n](),e.preventDefault()})},bindEvents:function(){O.verbose("Attaching form events"),D.on("submit"+E,O.validate.form).on("blur"+E,k.field,O.event.field.blur).on("click"+E,k.submit,O.submit).on("click"+E,k.reset,O.reset).on("click"+E,k.clear,O.clear),x.keyboardShortcuts&&D.on("keydown"+E,k.field,O.event.field.keydown),m.each(function(){var t=e(this),n=t.prop("type"),i=O.get.changeEvent(n,t);e(this).on(i+E,O.event.field.change)})},clear:function(){m.each(function(){var t=e(this),n=t.parent(),i=t.closest(g),o=i.find(k.prompt),a=t.data(w.defaultValue)||"",r=n.is(k.uiCheckbox),s=n.is(k.uiDropdown),l=i.hasClass(S.error);l&&(O.verbose("Resetting error on field",i),i.removeClass(S.error),o.remove()),s?(O.verbose("Resetting dropdown value",n,a),n.dropdown("clear")):r?t.prop("checked",!1):(O.verbose("Resetting field value",t,a),t.val(""))})},reset:function(){m.each(function(){var t=e(this),n=t.parent(),o=t.closest(g),a=o.find(k.prompt),r=t.data(w.defaultValue),s=n.is(k.uiCheckbox),l=n.is(k.uiDropdown),c=o.hasClass(S.error);r!==i&&(c&&(O.verbose("Resetting error on field",o),o.removeClass(S.error),a.remove()),l?(O.verbose("Resetting dropdown value",n,r),n.dropdown("restore defaults")):s?(O.verbose("Resetting checkbox value",n,r),t.prop("checked",r)):(O.verbose("Resetting field value",t,r),t.val(r)))})},determine:{isValid:function(){var t=!0;return e.each(C,function(e,n){O.validate.field(n,e,!0)||(t=!1)}),t}},is:{bracketedRule:function(e){return e.type&&e.type.match(x.regExp.bracket)},empty:function(e){return e&&0!==e.length?e.is('input[type="checkbox"]')?!e.is(":checked"):O.is.blank(e):!0},blank:function(t){return""===e.trim(t.val())},valid:function(t){var n=!0;return t?(O.verbose("Checking if field is valid",t),O.validate.field(C[t],t,!1)):(O.verbose("Checking if form is valid"),e.each(C,function(e,t){O.is.valid(e)||(n=!1)}),n)}},removeEvents:function(){D.off(E),m.off(E),v.off(E),m.off(E)},event:{field:{keydown:function(t){var n=e(this),i=t.which,o=n.is(k.input),a=n.is(k.checkbox),r=n.closest(k.uiDropdown).length>0,s={enter:13,escape:27};i==s.escape&&(O.verbose("Escape key pressed blurring field"),n.blur()),t.ctrlKey||i!=s.enter||!o||r||a||(z||(n.one("keyup"+E,O.event.field.keyup),O.submit(),O.debug("Enter pressed on input submitting form")),z=!0)},keyup:function(){z=!1},blur:function(t){var n=e(this),i=n.closest(g),o=O.get.validation(n);i.hasClass(S.error)?(O.debug("Revalidating field",n,o),o&&O.validate.field(o)):"blur"!=x.on&&"change"!=x.on||o&&O.validate.field(o)},change:function(t){var n=e(this),i=n.closest(g),o=O.get.validation(n);o&&("change"==x.on||i.hasClass(S.error)&&x.revalidate)&&(clearTimeout(O.timer),O.timer=setTimeout(function(){O.debug("Revalidating field",n,O.get.validation(n)),O.validate.field(o)},x.delay))}}},get:{ancillaryValue:function(e){return e.type&&(e.value||O.is.bracketedRule(e))?e.value!==i?e.value:e.type.match(x.regExp.bracket)[1]+"":!1},ruleName:function(e){return O.is.bracketedRule(e)?e.type.replace(e.type.match(x.regExp.bracket)[0],""):e.type},changeEvent:function(e,t){return"checkbox"==e||"radio"==e||"hidden"==e||t.is("select")?"change":O.get.inputEvent()},inputEvent:function(){return n.createElement("input").oninput!==i?"input":n.createElement("input").onpropertychange!==i?"propertychange":"keyup"},prompt:function(e,t){var n,i,o,a=O.get.ruleName(e),r=O.get.ancillaryValue(e),s=e.prompt||x.prompt[a]||x.text.unspecifiedRule,l=-1!==s.search("{value}"),c=-1!==s.search("{name}");return(c||l)&&(i=O.get.field(t.identifier)),l&&(s=s.replace("{value}",i.val())),c&&(n=i.closest(k.group).find("label").eq(0),o=1==n.length?n.text():i.prop("placeholder")||x.text.unspecifiedField,s=s.replace("{name}",o)),s=s.replace("{identifier}",t.identifier),s=s.replace("{ruleValue}",r),e.prompt||O.verbose("Using default validation prompt for type",s,a),s},settings:function(){if(e.isPlainObject(t)){var n,o=Object.keys(t),a=o.length>0?t[o[0]].identifier!==i&&t[o[0]].rules!==i:!1;a?(x=e.extend(!0,{},e.fn.form.settings,u),C=e.extend({},e.fn.form.settings.defaults,t),O.error(x.error.oldSyntax,q),O.verbose("Extending settings from legacy parameters",C,x)):(t.fields&&(n=Object.keys(t.fields),("string"==typeof t.fields[n[0]]||e.isArray(t.fields[n[0]]))&&e.each(t.fields,function(n,i){"string"==typeof i&&(i=[i]),t.fields[n]={rules:[]},e.each(i,function(e,i){t.fields[n].rules.push({type:i})})})),x=e.extend(!0,{},e.fn.form.settings,t),C=e.extend({},e.fn.form.settings.defaults,x.fields),O.verbose("Extending settings",C,x))}else x=e.fn.form.settings,C=e.fn.form.settings.defaults,O.verbose("Using default form validation",C,x);R=x.namespace,w=x.metadata,k=x.selector,S=x.className,T=x.regExp,A=x.error,P="module-"+R,E="."+R,F=D.data(P),O.refresh()},field:function(t){return O.verbose("Finding field with identifier",t),t=O.escape.string(t),m.filter("#"+t).length>0?m.filter("#"+t):m.filter('[name="'+t+'"]').length>0?m.filter('[name="'+t+'"]'):m.filter('[name="'+t+'[]"]').length>0?m.filter('[name="'+t+'[]"]'):m.filter("[data-"+w.validate+'="'+t+'"]').length>0?m.filter("[data-"+w.validate+'="'+t+'"]'):e("<input/>")},fields:function(t){var n=e();return e.each(t,function(e,t){n=n.add(O.get.field(t))}),n},validation:function(t){var n,i;return C?(e.each(C,function(e,o){i=o.identifier||e,O.get.field(i)[0]==t[0]&&(o.identifier=i,n=o)}),n||!1):!1},value:function(e){var t,n=[];return n.push(e),t=O.get.values.call(q,n),t[e]},values:function(t){var n=e.isArray(t)?O.get.fields(t):m,i={};return n.each(function(t,n){var o=e(n),a=(o.prop("type"),o.prop("name")),r=o.val(),s=o.is(k.checkbox),l=o.is(k.radio),c=-1!==a.indexOf("[]"),u=s?o.is(":checked"):!1;a&&(c?(a=a.replace("[]",""),i[a]||(i[a]=[]),s?u?i[a].push(r||!0):i[a].push(!1):i[a].push(r)):l?u&&(i[a]=r):s?u?i[a]=r||!0:i[a]=!1:i[a]=r)}),i}},has:{field:function(e){return O.verbose("Checking for existence of a field with identifier",e),e=O.escape.string(e),"string"!=typeof e&&O.error(A.identifier,e),m.filter("#"+e).length>0?!0:m.filter('[name="'+e+'"]').length>0?!0:m.filter("[data-"+w.validate+'="'+e+'"]').length>0}},escape:{string:function(e){return e=String(e),e.replace(T.escape,"\\$&")}},add:{prompt:function(t,n){var o=O.get.field(t),a=o.closest(g),r=a.children(k.prompt),s=0!==r.length;n="string"==typeof n?[n]:n,O.verbose("Adding field error state",t),a.addClass(S.error),x.inline&&(s||(r=x.templates.prompt(n),r.appendTo(a)),r.html(n[0]),s?O.verbose("Inline errors are disabled, no inline error added",t):x.transition&&e.fn.transition!==i&&D.transition("is supported")?(O.verbose("Displaying error with css transition",x.transition),r.transition(x.transition+" in",x.duration)):(O.verbose("Displaying error with fallback javascript animation"),r.fadeIn(x.duration)))},errors:function(e){O.debug("Adding form error messages",e),O.set.error(),p.html(x.templates.error(e))}},remove:{prompt:function(t){var n=O.get.field(t),o=n.closest(g),a=o.children(k.prompt);o.removeClass(S.error),x.inline&&a.is(":visible")&&(O.verbose("Removing prompt for field",t),x.transition&&e.fn.transition!==i&&D.transition("is supported")?a.transition(x.transition+" out",x.duration,function(){a.remove()}):a.fadeOut(x.duration,function(){a.remove()}))}},set:{success:function(){D.removeClass(S.error).addClass(S.success)},defaults:function(){m.each(function(){var t=e(this),n=t.filter(k.checkbox).length>0,i=n?t.is(":checked"):t.val();t.data(w.defaultValue,i)})},error:function(){D.removeClass(S.success).addClass(S.error)},value:function(e,t){var n={};return n[e]=t,O.set.values.call(q,n)},values:function(t){e.isEmptyObject(t)||e.each(t,function(t,n){var i,o=O.get.field(t),a=o.parent(),r=e.isArray(n),s=a.is(k.uiCheckbox),l=a.is(k.uiDropdown),c=o.is(k.radio)&&s,u=o.length>0;u&&(r&&s?(O.verbose("Selecting multiple",n,o),a.checkbox("uncheck"),e.each(n,function(e,t){i=o.filter('[value="'+t+'"]'),a=i.parent(),i.length>0&&a.checkbox("check")})):c?(O.verbose("Selecting radio value",n,o),o.filter('[value="'+n+'"]').parent(k.uiCheckbox).checkbox("check")):s?(O.verbose("Setting checkbox value",n,a),n===!0?a.checkbox("check"):a.checkbox("uncheck")):l?(O.verbose("Setting dropdown value",n,a),a.dropdown("set selected",n)):(O.verbose("Setting field value",n,o),o.val(n)))})}},validate:{form:function(e,t){var n=O.get.values();if(z)return!1;if(j=[],O.determine.isValid()){if(O.debug("Form has no validation errors, submitting"),O.set.success(),t!==!0)return x.onSuccess.call(q,e,n)}else if(O.debug("Form has errors"),O.set.error(),x.inline||O.add.errors(j),D.data("moduleApi")!==i&&e.stopImmediatePropagation(),t!==!0)return x.onFailure.call(q,j,n)},field:function(t,n,o){o=o!==i?o:!0,"string"==typeof t&&(O.verbose("Validating field",t),n=t,t=C[t]);var a=t.identifier||n,r=O.get.field(a),s=t.depends?O.get.field(t.depends):!1,l=!0,c=[];return t.identifier||(O.debug("Using field name as identifier",a),t.identifier=a),r.prop("disabled")?(O.debug("Field is disabled. Skipping",a),l=!0):t.optional&&O.is.blank(r)?(O.debug("Field is optional and blank. Skipping",a),l=!0):t.depends&&O.is.empty(s)?(O.debug("Field depends on another value that is not present or empty. Skipping",s),l=!0):t.rules!==i&&e.each(t.rules,function(e,n){O.has.field(a)&&!O.validate.rule(t,n)&&(O.debug("Field is invalid",a,n.type),c.push(O.get.prompt(n,t)),l=!1)}),l?(o&&(O.remove.prompt(a,c),x.onValid.call(r)),!0):(o&&(j=j.concat(c),O.add.prompt(a,c),x.onInvalid.call(r,c)),!1)},rule:function(t,n){var o=O.get.field(t.identifier),a=(n.type,o.val()),r=O.get.ancillaryValue(n),s=O.get.ruleName(n),l=x.rules[s];return e.isFunction(l)?(a=a===i||""===a||null===a?"":e.trim(a+""),l.call(o,a,r)):void O.error(A.noRule,s)}},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,x,t);else{if(n===i)return x[t];x[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,O,t);else{if(n===i)return O[t];O[t]=n}},debug:function(){!x.silent&&x.debug&&(x.performance?O.performance.log(arguments):(O.debug=Function.prototype.bind.call(console.info,console,x.name+":"),O.debug.apply(console,arguments)))},verbose:function(){!x.silent&&x.verbose&&x.debug&&(x.performance?O.performance.log(arguments):(O.verbose=Function.prototype.bind.call(console.info,console,x.name+":"),O.verbose.apply(console,arguments)))},error:function(){x.silent||(O.error=Function.prototype.bind.call(console.error,console,x.name+":"),O.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;x.performance&&(t=(new Date).getTime(),i=s||t,n=t-i,s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:q,"Execution Time":n})),clearTimeout(O.performance.timer),O.performance.timer=setTimeout(O.performance.display,500)},display:function(){var t=x.name+":",n=0;s=!1,clearTimeout(O.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",r&&(t+=" '"+r+"'"),a.length>1&&(t+=" ("+a.length+")"),(console.group!==i||console.table!==i)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,a){var r,s,l,c=F;return n=n||f,a=q||a,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):!1;c=c[o]}})),e.isFunction(s)?l=s.apply(a,n):s!==i&&(l=s),e.isArray(o)?o.push(l):o!==i?o=[o,l]:l!==i&&(o=l),s}},O.initialize()}),o!==i?o:this},e.fn.form.settings={name:"Form",namespace:"form",debug:!1,verbose:!1,performance:!0,fields:!1,keyboardShortcuts:!0,on:"submit",inline:!1,delay:200,revalidate:!0,transition:"scale",duration:200,onValid:function(){},onInvalid:function(){},onSuccess:function(){return!0},onFailure:function(){return!1},metadata:{defaultValue:"default",validate:"validate"},regExp:{htmlID:/^[a-zA-Z][\w:.-]*$/g,bracket:/\[(.*)\]/i,decimal:/^\d+\.?\d*$/,email:/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,escape:/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,flags:/^\/(.*)\/(.*)?/,integer:/^\-?\d+$/,number:/^\-?\d*(\.\d+)?$/,url:/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i},text:{unspecifiedRule:"Please enter a valid value",unspecifiedField:"This field"},prompt:{empty:"{name} must have a value",checked:"{name} must be checked",email:"{name} must be a valid e-mail",url:"{name} must be a valid url",regExp:"{name} is not formatted correctly",integer:"{name} must be an integer",decimal:"{name} must be a decimal number",number:"{name} must be set to a number",is:'{name} must be "{ruleValue}"',isExactly:'{name} must be exactly "{ruleValue}"',not:'{name} cannot be set to "{ruleValue}"',notExactly:'{name} cannot be set to exactly "{ruleValue}"',contain:'{name} cannot contain "{ruleValue}"',containExactly:'{name} cannot contain exactly "{ruleValue}"',doesntContain:'{name} must contain  "{ruleValue}"',doesntContainExactly:'{name} must contain exactly "{ruleValue}"',minLength:"{name} must be at least {ruleValue} characters",length:"{name} must be at least {ruleValue} characters",exactLength:"{name} must be exactly {ruleValue} characters",maxLength:"{name} cannot be longer than {ruleValue} characters",match:"{name} must match {ruleValue} field",different:"{name} must have a different value than {ruleValue} field",creditCard:"{name} must be a valid credit card number",minCount:"{name} must have at least {ruleValue} choices",exactCount:"{name} must have exactly {ruleValue} choices",maxCount:"{name} must have {ruleValue} or less choices"},selector:{checkbox:'input[type="checkbox"], input[type="radio"]',clear:".clear",field:"input, textarea, select",group:".field",input:"input",message:".error.message",prompt:".prompt.label",radio:'input[type="radio"]',reset:'.reset:not([type="reset"])',submit:'.submit:not([type="submit"])',uiCheckbox:".ui.checkbox",uiDropdown:".ui.dropdown"},className:{error:"error",label:"ui prompt label",pressed:"down",success:"success"},error:{identifier:"You must specify a string identifier for each field",method:"The method you called is not defined.",noRule:"There is no rule matching the one you specified",oldSyntax:"Starting in 2.0 forms now only take a single settings object. Validation settings converted to new syntax automatically."},templates:{error:function(t){var n='<ul class="list">';return e.each(t,function(e,t){n+="<li>"+t+"</li>"}),n+="</ul>",e(n)},prompt:function(t){return e("<div/>").addClass("ui basic red pointing prompt label").html(t[0])}},rules:{empty:function(t){return!(t===i||""===t||e.isArray(t)&&0===t.length)},checked:function(){return e(this).filter(":checked").length>0},email:function(t){return e.fn.form.settings.regExp.email.test(t)},url:function(t){return e.fn.form.settings.regExp.url.test(t)},regExp:function(t,n){if(n instanceof RegExp)return t.match(n);var i,o=n.match(e.fn.form.settings.regExp.flags);return o&&(n=o.length>=2?o[1]:n,i=o.length>=3?o[2]:""),t.match(new RegExp(n,i))},integer:function(t,n){var o,a,r,s=e.fn.form.settings.regExp.integer;return n&&-1===["",".."].indexOf(n)&&(-1==n.indexOf("..")?s.test(n)&&(o=a=n-0):(r=n.split("..",2),s.test(r[0])&&(o=r[0]-0),s.test(r[1])&&(a=r[1]-0))),s.test(t)&&(o===i||t>=o)&&(a===i||a>=t)},decimal:function(t){return e.fn.form.settings.regExp.decimal.test(t)},number:function(t){return e.fn.form.settings.regExp.number.test(t)},is:function(e,t){return t="string"==typeof t?t.toLowerCase():t,e="string"==typeof e?e.toLowerCase():e,e==t},isExactly:function(e,t){return e==t},not:function(e,t){return e="string"==typeof e?e.toLowerCase():e,t="string"==typeof t?t.toLowerCase():t,e!=t},notExactly:function(e,t){return e!=t},contains:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1!==t.search(new RegExp(n,"i"))},containsExactly:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1!==t.search(new RegExp(n))},doesntContain:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1===t.search(new RegExp(n,"i"))},doesntContainExactly:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1===t.search(new RegExp(n))},minLength:function(e,t){return e!==i?e.length>=t:!1},length:function(e,t){return e!==i?e.length>=t:!1},exactLength:function(e,t){return e!==i?e.length==t:!1},maxLength:function(e,t){return e!==i?e.length<=t:!1},match:function(t,n){var o;e(this);return e('[data-validate="'+n+'"]').length>0?o=e('[data-validate="'+n+'"]').val():e("#"+n).length>0?o=e("#"+n).val():e('[name="'+n+'"]').length>0?o=e('[name="'+n+'"]').val():e('[name="'+n+'[]"]').length>0&&(o=e('[name="'+n+'[]"]')),o!==i?t.toString()==o.toString():!1},different:function(t,n){var o;e(this);return e('[data-validate="'+n+'"]').length>0?o=e('[data-validate="'+n+'"]').val():e("#"+n).length>0?o=e("#"+n).val():e('[name="'+n+'"]').length>0?o=e('[name="'+n+'"]').val():e('[name="'+n+'[]"]').length>0&&(o=e('[name="'+n+'[]"]')),o!==i?t.toString()!==o.toString():!1},creditCard:function(t,n){var i,o,a={visa:{pattern:/^4/,length:[16]},amex:{pattern:/^3[47]/,length:[15]},mastercard:{pattern:/^5[1-5]/,length:[16]},discover:{pattern:/^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,length:[16]},unionPay:{pattern:/^(62|88)/,length:[16,17,18,19]},jcb:{pattern:/^35(2[89]|[3-8][0-9])/,length:[16]},maestro:{pattern:/^(5018|5020|5038|6304|6759|676[1-3])/,length:[12,13,14,15,16,17,18,19]},dinersClub:{pattern:/^(30[0-5]|^36)/,length:[14]},laser:{pattern:/^(6304|670[69]|6771)/,length:[16,17,18,19]},visaElectron:{pattern:/^(4026|417500|4508|4844|491(3|7))/,length:[16]}},r={},s=!1,l="string"==typeof n?n.split(","):!1;if("string"==typeof t&&0!==t.length){if(t=t.replace(/[\-]/g,""),l&&(e.each(l,function(n,i){o=a[i],o&&(r={length:-1!==e.inArray(t.length,o.length),pattern:-1!==t.search(o.pattern)},r.length&&r.pattern&&(s=!0))}),!s))return!1;if(i={number:-1!==e.inArray(t.length,a.unionPay.length),pattern:-1!==t.search(a.unionPay.pattern)},i.number&&i.pattern)return!0;for(var c=t.length,u=0,d=[[0,1,2,3,4,5,6,7,8,9],[0,2,4,6,8,1,3,5,7,9]],f=0;c--;)f+=d[u][parseInt(t.charAt(c),10)],u^=1;return f%10===0&&f>0}},minCount:function(e,t){return 0==t?!0:1==t?""!==e:e.split(",").length>=t},exactCount:function(e,t){return 0==t?""===e:1==t?""!==e&&-1===e.search(","):e.split(",").length==t},maxCount:function(e,t){return 0==t?!1:1==t?-1===e.search(","):e.split(",").length<=t}}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.accordion=function(n){var o,a=e(this),r=(new Date).getTime(),s=[],l=arguments[0],c="string"==typeof l,u=[].slice.call(arguments,1);t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)};return a.each(function(){var d,f,m=e.isPlainObject(n)?e.extend(!0,{},e.fn.accordion.settings,n):e.extend({},e.fn.accordion.settings),g=m.className,p=m.namespace,h=m.selector,v=m.error,b="."+p,y="module-"+p,x=a.selector||"",C=e(this),w=C.find(h.title),k=C.find(h.content),S=this,T=C.data(y);f={initialize:function(){f.debug("Initializing",C),f.bind.events(),m.observeChanges&&f.observeChanges(),f.instantiate()},instantiate:function(){T=f,C.data(y,f)},destroy:function(){f.debug("Destroying previous instance",C),C.off(b).removeData(y)},refresh:function(){w=C.find(h.title),k=C.find(h.content)},observeChanges:function(){"MutationObserver"in t&&(d=new MutationObserver(function(e){f.debug("DOM tree modified, updating selector cache"),f.refresh()}),d.observe(S,{childList:!0,subtree:!0}),f.debug("Setting up mutation observer",d))},bind:{events:function(){f.debug("Binding delegated events"),C.on(m.on+b,h.trigger,f.event.click)}},event:{click:function(){f.toggle.call(this)}},toggle:function(t){var n=t!==i?"number"==typeof t?w.eq(t):e(t).closest(h.title):e(this).closest(h.title),o=n.next(k),a=o.hasClass(g.animating),r=o.hasClass(g.active),s=r&&!a,l=!r&&a;f.debug("Toggling visibility of content",n),s||l?m.collapsible?f.close.call(n):f.debug("Cannot close accordion content collapsing is disabled"):f.open.call(n)},open:function(t){var n=t!==i?"number"==typeof t?w.eq(t):e(t).closest(h.title):e(this).closest(h.title),o=n.next(k),a=o.hasClass(g.animating),r=o.hasClass(g.active),s=r||a;return s?void f.debug("Accordion already open, skipping",o):(f.debug("Opening accordion content",n),m.onOpening.call(o),m.exclusive&&f.closeOthers.call(n),n.addClass(g.active),o.stop(!0,!0).addClass(g.animating),m.animateChildren&&(e.fn.transition!==i&&C.transition("is supported")?o.children().transition({animation:"fade in",queue:!1,useFailSafe:!0,debug:m.debug,verbose:m.verbose,duration:m.duration}):o.children().stop(!0,!0).animate({opacity:1},m.duration,f.resetOpacity)),void o.slideDown(m.duration,m.easing,function(){o.removeClass(g.animating).addClass(g.active),f.reset.display.call(this),m.onOpen.call(this),m.onChange.call(this)}))},close:function(t){var n=t!==i?"number"==typeof t?w.eq(t):e(t).closest(h.title):e(this).closest(h.title),o=n.next(k),a=o.hasClass(g.animating),r=o.hasClass(g.active),s=!r&&a,l=r&&a;!r&&!s||l||(f.debug("Closing accordion content",o),m.onClosing.call(o),n.removeClass(g.active),o.stop(!0,!0).addClass(g.animating),m.animateChildren&&(e.fn.transition!==i&&C.transition("is supported")?o.children().transition({animation:"fade out",queue:!1,useFailSafe:!0,debug:m.debug,verbose:m.verbose,duration:m.duration}):o.children().stop(!0,!0).animate({opacity:0},m.duration,f.resetOpacity)),o.slideUp(m.duration,m.easing,function(){o.removeClass(g.animating).removeClass(g.active),f.reset.display.call(this),m.onClose.call(this),m.onChange.call(this)}))},closeOthers:function(t){var n,o,a,r=t!==i?w.eq(t):e(this).closest(h.title),s=r.parents(h.content).prev(h.title),l=r.closest(h.accordion),c=h.title+"."+g.active+":visible",u=h.content+"."+g.active+":visible";m.closeNested?(n=l.find(c).not(s),a=n.next(k)):(n=l.find(c).not(s),o=l.find(u).find(c).not(s),n=n.not(o),a=n.next(k)),n.length>0&&(f.debug("Exclusive enabled, closing other content",n),n.removeClass(g.active),a.removeClass(g.animating).stop(!0,!0),m.animateChildren&&(e.fn.transition!==i&&C.transition("is supported")?a.children().transition({animation:"fade out",useFailSafe:!0,debug:m.debug,verbose:m.verbose,duration:m.duration}):a.children().stop(!0,!0).animate({opacity:0},m.duration,f.resetOpacity)),a.slideUp(m.duration,m.easing,function(){e(this).removeClass(g.active),f.reset.display.call(this)}))},reset:{display:function(){f.verbose("Removing inline display from element",this),e(this).css("display",""),""===e(this).attr("style")&&e(this).attr("style","").removeAttr("style")},opacity:function(){f.verbose("Removing inline opacity from element",this),e(this).css("opacity",""),""===e(this).attr("style")&&e(this).attr("style","").removeAttr("style")}},setting:function(t,n){if(f.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,m,t);else{if(n===i)return m[t];e.isPlainObject(m[t])?e.extend(!0,m[t],n):m[t]=n}},internal:function(t,n){return f.debug("Changing internal",t,n),n===i?f[t]:void(e.isPlainObject(t)?e.extend(!0,f,t):f[t]=n)},debug:function(){!m.silent&&m.debug&&(m.performance?f.performance.log(arguments):(f.debug=Function.prototype.bind.call(console.info,console,m.name+":"),f.debug.apply(console,arguments)))},verbose:function(){!m.silent&&m.verbose&&m.debug&&(m.performance?f.performance.log(arguments):(f.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),f.verbose.apply(console,arguments)))},error:function(){m.silent||(f.error=Function.prototype.bind.call(console.error,console,m.name+":"),f.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;m.performance&&(t=(new Date).getTime(),i=r||t,n=t-i,r=t,s.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:S,"Execution Time":n})),clearTimeout(f.performance.timer),f.performance.timer=setTimeout(f.performance.display,500)},display:function(){var t=m.name+":",n=0;r=!1,clearTimeout(f.performance.timer),e.each(s,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",x&&(t+=" '"+x+"'"),(console.group!==i||console.table!==i)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,n,a){var r,s,l,c=T;return n=n||u,a=S||a,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):(f.error(v.method,t),!1);c=c[o]}
})),e.isFunction(s)?l=s.apply(a,n):s!==i&&(l=s),e.isArray(o)?o.push(l):o!==i?o=[o,l]:l!==i&&(o=l),s}},c?(T===i&&f.initialize(),f.invoke(l)):(T!==i&&T.invoke("destroy"),f.initialize())}),o!==i?o:this},e.fn.accordion.settings={name:"Accordion",namespace:"accordion",silent:!1,debug:!1,verbose:!1,performance:!0,on:"click",observeChanges:!0,exclusive:!0,collapsible:!0,closeNested:!1,animateChildren:!0,duration:350,easing:"easeOutQuad",onOpening:function(){},onOpen:function(){},onClosing:function(){},onClose:function(){},onChange:function(){},error:{method:"The method you called is not defined"},className:{active:"active",animating:"animating"},selector:{accordion:".accordion",title:".title",trigger:".title",content:".content"}},e.extend(e.easing,{easeOutQuad:function(e,t,n,i,o){return-i*(t/=o)*(t-2)+n}})}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.checkbox=function(o){var a,r=e(this),s=r.selector||"",l=(new Date).getTime(),c=[],u=arguments[0],d="string"==typeof u,f=[].slice.call(arguments,1);return r.each(function(){var r,m,g=e.extend(!0,{},e.fn.checkbox.settings,o),p=g.className,h=g.namespace,v=g.selector,b=g.error,y="."+h,x="module-"+h,C=e(this),w=e(this).children(v.label),k=e(this).children(v.input),S=k[0],T=!1,A=!1,R=C.data(x),P=this;m={initialize:function(){m.verbose("Initializing checkbox",g),m.create.label(),m.bind.events(),m.set.tabbable(),m.hide.input(),m.observeChanges(),m.instantiate(),m.setup()},instantiate:function(){m.verbose("Storing instance of module",m),R=m,C.data(x,m)},destroy:function(){m.verbose("Destroying module"),m.unbind.events(),m.show.input(),C.removeData(x)},fix:{reference:function(){C.is(v.input)&&(m.debug("Behavior called on <input> adjusting invoked element"),C=C.closest(v.checkbox),m.refresh())}},setup:function(){m.set.initialLoad(),m.is.indeterminate()?(m.debug("Initial value is indeterminate"),m.indeterminate()):m.is.checked()?(m.debug("Initial value is checked"),m.check()):(m.debug("Initial value is unchecked"),m.uncheck()),m.remove.initialLoad()},refresh:function(){w=C.children(v.label),k=C.children(v.input),S=k[0]},hide:{input:function(){m.verbose("Modifying <input> z-index to be unselectable"),k.addClass(p.hidden)}},show:{input:function(){m.verbose("Modifying <input> z-index to be selectable"),k.removeClass(p.hidden)}},observeChanges:function(){"MutationObserver"in t&&(r=new MutationObserver(function(e){m.debug("DOM tree modified, updating selector cache"),m.refresh()}),r.observe(P,{childList:!0,subtree:!0}),m.debug("Setting up mutation observer",r))},attachEvents:function(t,n){var i=e(t);n=e.isFunction(m[n])?m[n]:m.toggle,i.length>0?(m.debug("Attaching checkbox events to element",t,n),i.on("click"+y,n)):m.error(b.notFound)},event:{click:function(t){var n=e(t.target);return n.is(v.input)?void m.verbose("Using default check action on initialized checkbox"):n.is(v.link)?void m.debug("Clicking link inside checkbox, skipping toggle"):(m.toggle(),k.focus(),void t.preventDefault())},keydown:function(e){var t=e.which,n={enter:13,space:32,escape:27};t==n.escape?(m.verbose("Escape key pressed blurring field"),k.blur(),A=!0):e.ctrlKey||t!=n.space&&t!=n.enter?A=!1:(m.verbose("Enter/space key pressed, toggling checkbox"),m.toggle(),A=!0)},keyup:function(e){A&&e.preventDefault()}},check:function(){m.should.allowCheck()&&(m.debug("Checking checkbox",k),m.set.checked(),m.should.ignoreCallbacks()||(g.onChecked.call(S),g.onChange.call(S)))},uncheck:function(){m.should.allowUncheck()&&(m.debug("Unchecking checkbox"),m.set.unchecked(),m.should.ignoreCallbacks()||(g.onUnchecked.call(S),g.onChange.call(S)))},indeterminate:function(){return m.should.allowIndeterminate()?void m.debug("Checkbox is already indeterminate"):(m.debug("Making checkbox indeterminate"),m.set.indeterminate(),void(m.should.ignoreCallbacks()||(g.onIndeterminate.call(S),g.onChange.call(S))))},determinate:function(){return m.should.allowDeterminate()?void m.debug("Checkbox is already determinate"):(m.debug("Making checkbox determinate"),m.set.determinate(),void(m.should.ignoreCallbacks()||(g.onDeterminate.call(S),g.onChange.call(S))))},enable:function(){return m.is.enabled()?void m.debug("Checkbox is already enabled"):(m.debug("Enabling checkbox"),m.set.enabled(),g.onEnable.call(S),void g.onEnabled.call(S))},disable:function(){return m.is.disabled()?void m.debug("Checkbox is already disabled"):(m.debug("Disabling checkbox"),m.set.disabled(),g.onDisable.call(S),void g.onDisabled.call(S))},get:{radios:function(){var t=m.get.name();return e('input[name="'+t+'"]').closest(v.checkbox)},otherRadios:function(){return m.get.radios().not(C)},name:function(){return k.attr("name")}},is:{initialLoad:function(){return T},radio:function(){return k.hasClass(p.radio)||"radio"==k.attr("type")},indeterminate:function(){return k.prop("indeterminate")!==i&&k.prop("indeterminate")},checked:function(){return k.prop("checked")!==i&&k.prop("checked")},disabled:function(){return k.prop("disabled")!==i&&k.prop("disabled")},enabled:function(){return!m.is.disabled()},determinate:function(){return!m.is.indeterminate()},unchecked:function(){return!m.is.checked()}},should:{allowCheck:function(){return m.is.determinate()&&m.is.checked()&&!m.should.forceCallbacks()?(m.debug("Should not allow check, checkbox is already checked"),!1):g.beforeChecked.apply(S)===!1?(m.debug("Should not allow check, beforeChecked cancelled"),!1):!0},allowUncheck:function(){return m.is.determinate()&&m.is.unchecked()&&!m.should.forceCallbacks()?(m.debug("Should not allow uncheck, checkbox is already unchecked"),!1):g.beforeUnchecked.apply(S)===!1?(m.debug("Should not allow uncheck, beforeUnchecked cancelled"),!1):!0},allowIndeterminate:function(){return m.is.indeterminate()&&!m.should.forceCallbacks()?(m.debug("Should not allow indeterminate, checkbox is already indeterminate"),!1):g.beforeIndeterminate.apply(S)===!1?(m.debug("Should not allow indeterminate, beforeIndeterminate cancelled"),!1):!0},allowDeterminate:function(){return m.is.determinate()&&!m.should.forceCallbacks()?(m.debug("Should not allow determinate, checkbox is already determinate"),!1):g.beforeDeterminate.apply(S)===!1?(m.debug("Should not allow determinate, beforeDeterminate cancelled"),!1):!0},forceCallbacks:function(){return m.is.initialLoad()&&g.fireOnInit},ignoreCallbacks:function(){return T&&!g.fireOnInit}},can:{change:function(){return!(C.hasClass(p.disabled)||C.hasClass(p.readOnly)||k.prop("disabled")||k.prop("readonly"))},uncheck:function(){return"boolean"==typeof g.uncheckable?g.uncheckable:!m.is.radio()}},set:{initialLoad:function(){T=!0},checked:function(){return m.verbose("Setting class to checked"),C.removeClass(p.indeterminate).addClass(p.checked),m.is.radio()&&m.uncheckOthers(),!m.is.indeterminate()&&m.is.checked()?void m.debug("Input is already checked, skipping input property change"):(m.verbose("Setting state to checked",S),k.prop("indeterminate",!1).prop("checked",!0),void m.trigger.change())},unchecked:function(){return m.verbose("Removing checked class"),C.removeClass(p.indeterminate).removeClass(p.checked),!m.is.indeterminate()&&m.is.unchecked()?void m.debug("Input is already unchecked"):(m.debug("Setting state to unchecked"),k.prop("indeterminate",!1).prop("checked",!1),void m.trigger.change())},indeterminate:function(){return m.verbose("Setting class to indeterminate"),C.addClass(p.indeterminate),m.is.indeterminate()?void m.debug("Input is already indeterminate, skipping input property change"):(m.debug("Setting state to indeterminate"),k.prop("indeterminate",!0),void m.trigger.change())},determinate:function(){return m.verbose("Removing indeterminate class"),C.removeClass(p.indeterminate),m.is.determinate()?void m.debug("Input is already determinate, skipping input property change"):(m.debug("Setting state to determinate"),void k.prop("indeterminate",!1))},disabled:function(){return m.verbose("Setting class to disabled"),C.addClass(p.disabled),m.is.disabled()?void m.debug("Input is already disabled, skipping input property change"):(m.debug("Setting state to disabled"),k.prop("disabled","disabled"),void m.trigger.change())},enabled:function(){return m.verbose("Removing disabled class"),C.removeClass(p.disabled),m.is.enabled()?void m.debug("Input is already enabled, skipping input property change"):(m.debug("Setting state to enabled"),k.prop("disabled",!1),void m.trigger.change())},tabbable:function(){m.verbose("Adding tabindex to checkbox"),k.attr("tabindex")===i&&k.attr("tabindex",0)}},remove:{initialLoad:function(){T=!1}},trigger:{change:function(){var e=n.createEvent("HTMLEvents"),t=k[0];t&&(m.verbose("Triggering native change event"),e.initEvent("change",!0,!1),t.dispatchEvent(e))}},create:{label:function(){k.prevAll(v.label).length>0?(k.prev(v.label).detach().insertAfter(k),m.debug("Moving existing label",w)):m.has.label()||(w=e("<label>").insertAfter(k),m.debug("Creating label",w))}},has:{label:function(){return w.length>0}},bind:{events:function(){m.verbose("Attaching checkbox events"),C.on("click"+y,m.event.click).on("keydown"+y,v.input,m.event.keydown).on("keyup"+y,v.input,m.event.keyup)}},unbind:{events:function(){m.debug("Removing events"),C.off(y)}},uncheckOthers:function(){var e=m.get.otherRadios();m.debug("Unchecking other radios",e),e.removeClass(p.checked)},toggle:function(){return m.can.change()?void(m.is.indeterminate()||m.is.unchecked()?(m.debug("Currently unchecked"),m.check()):m.is.checked()&&m.can.uncheck()&&(m.debug("Currently checked"),m.uncheck())):void(m.is.radio()||m.debug("Checkbox is read-only or disabled, ignoring toggle"))},setting:function(t,n){if(m.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,g,t);else{if(n===i)return g[t];e.isPlainObject(g[t])?e.extend(!0,g[t],n):g[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,m,t);else{if(n===i)return m[t];m[t]=n}},debug:function(){!g.silent&&g.debug&&(g.performance?m.performance.log(arguments):(m.debug=Function.prototype.bind.call(console.info,console,g.name+":"),m.debug.apply(console,arguments)))},verbose:function(){!g.silent&&g.verbose&&g.debug&&(g.performance?m.performance.log(arguments):(m.verbose=Function.prototype.bind.call(console.info,console,g.name+":"),m.verbose.apply(console,arguments)))},error:function(){g.silent||(m.error=Function.prototype.bind.call(console.error,console,g.name+":"),m.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;g.performance&&(t=(new Date).getTime(),i=l||t,n=t-i,l=t,c.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:P,"Execution Time":n})),clearTimeout(m.performance.timer),m.performance.timer=setTimeout(m.performance.display,500)},display:function(){var t=g.name+":",n=0;l=!1,clearTimeout(m.performance.timer),e.each(c,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",s&&(t+=" '"+s+"'"),(console.group!==i||console.table!==i)&&c.length>0&&(console.groupCollapsed(t),console.table?console.table(c):e.each(c,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),c=[]}},invoke:function(t,n,o){var r,s,l,c=R;return n=n||f,o=P||o,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):(m.error(b.method,t),!1);c=c[o]}})),e.isFunction(s)?l=s.apply(o,n):s!==i&&(l=s),e.isArray(a)?a.push(l):a!==i?a=[a,l]:l!==i&&(a=l),s}},d?(R===i&&m.initialize(),m.invoke(u)):(R!==i&&R.invoke("destroy"),m.initialize())}),a!==i?a:this},e.fn.checkbox.settings={name:"Checkbox",namespace:"checkbox",silent:!1,debug:!1,verbose:!0,performance:!0,uncheckable:"auto",fireOnInit:!1,onChange:function(){},beforeChecked:function(){},beforeUnchecked:function(){},beforeDeterminate:function(){},beforeIndeterminate:function(){},onChecked:function(){},onUnchecked:function(){},onDeterminate:function(){},onIndeterminate:function(){},onEnable:function(){},onDisable:function(){},onEnabled:function(){},onDisabled:function(){},className:{checked:"checked",indeterminate:"indeterminate",disabled:"disabled",hidden:"hidden",radio:"radio",readOnly:"read-only"},error:{method:"The method you called is not defined"},selector:{checkbox:".ui.checkbox",label:"label, .box",input:'input[type="checkbox"], input[type="radio"]',link:"a[href]"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.dimmer=function(t){var o,a=e(this),r=(new Date).getTime(),s=[],l=arguments[0],c="string"==typeof l,u=[].slice.call(arguments,1);return a.each(function(){var d,f,m,g=e.isPlainObject(t)?e.extend(!0,{},e.fn.dimmer.settings,t):e.extend({},e.fn.dimmer.settings),p=g.selector,h=g.namespace,v=g.className,b=g.error,y="."+h,x="module-"+h,C=a.selector||"",w="ontouchstart"in n.documentElement?"touchstart":"click",k=e(this),S=this,T=k.data(x);m={preinitialize:function(){m.is.dimmer()?(f=k.parent(),d=k):(f=k,d=m.has.dimmer()?g.dimmerName?f.find(p.dimmer).filter("."+g.dimmerName):f.find(p.dimmer):m.create(),m.set.variation())},initialize:function(){m.debug("Initializing dimmer",g),m.bind.events(),m.set.dimmable(),m.instantiate()},instantiate:function(){m.verbose("Storing instance of module",m),T=m,k.data(x,T)},destroy:function(){m.verbose("Destroying previous module",d),m.unbind.events(),m.remove.variation(),f.off(y)},bind:{events:function(){"hover"==g.on?f.on("mouseenter"+y,m.show).on("mouseleave"+y,m.hide):"click"==g.on&&f.on(w+y,m.toggle),m.is.page()&&(m.debug("Setting as a page dimmer",f),m.set.pageDimmer()),m.is.closable()&&(m.verbose("Adding dimmer close event",d),f.on(w+y,p.dimmer,m.event.click))}},unbind:{events:function(){k.removeData(x),f.off(y)}},event:{click:function(t){m.verbose("Determining if event occured on dimmer",t),(0===d.find(t.target).length||e(t.target).is(p.content))&&(m.hide(),t.stopImmediatePropagation())}},addContent:function(t){var n=e(t);m.debug("Add content to dimmer",n),n.parent()[0]!==d[0]&&n.detach().appendTo(d)},create:function(){var t=e(g.template.dimmer());return g.dimmerName&&(m.debug("Creating named dimmer",g.dimmerName),t.addClass(g.dimmerName)),t.appendTo(f),t},show:function(t){t=e.isFunction(t)?t:function(){},m.debug("Showing dimmer",d,g),m.is.dimmed()&&!m.is.animating()||!m.is.enabled()?m.debug("Dimmer is already shown or disabled"):(m.animate.show(t),g.onShow.call(S),g.onChange.call(S))},hide:function(t){t=e.isFunction(t)?t:function(){},m.is.dimmed()||m.is.animating()?(m.debug("Hiding dimmer",d),m.animate.hide(t),g.onHide.call(S),g.onChange.call(S)):m.debug("Dimmer is not visible")},toggle:function(){m.verbose("Toggling dimmer visibility",d),m.is.dimmed()?m.hide():m.show()},animate:{show:function(t){t=e.isFunction(t)?t:function(){},g.useCSS&&e.fn.transition!==i&&d.transition("is supported")?("auto"!==g.opacity&&m.set.opacity(),d.transition({animation:g.transition+" in",queue:!1,duration:m.get.duration(),useFailSafe:!0,onStart:function(){m.set.dimmed()},onComplete:function(){m.set.active(),t()}})):(m.verbose("Showing dimmer animation with javascript"),m.set.dimmed(),"auto"==g.opacity&&(g.opacity=.8),d.stop().css({opacity:0,width:"100%",height:"100%"}).fadeTo(m.get.duration(),g.opacity,function(){d.removeAttr("style"),m.set.active(),t()}))},hide:function(t){t=e.isFunction(t)?t:function(){},g.useCSS&&e.fn.transition!==i&&d.transition("is supported")?(m.verbose("Hiding dimmer with css"),d.transition({animation:g.transition+" out",queue:!1,duration:m.get.duration(),useFailSafe:!0,onStart:function(){m.remove.dimmed()},onComplete:function(){m.remove.active(),t()}})):(m.verbose("Hiding dimmer with javascript"),m.remove.dimmed(),d.stop().fadeOut(m.get.duration(),function(){m.remove.active(),d.removeAttr("style"),t()}))}},get:{dimmer:function(){return d},duration:function(){return"object"==typeof g.duration?m.is.active()?g.duration.hide:g.duration.show:g.duration}},has:{dimmer:function(){return g.dimmerName?k.find(p.dimmer).filter("."+g.dimmerName).length>0:k.find(p.dimmer).length>0}},is:{active:function(){return d.hasClass(v.active)},animating:function(){return d.is(":animated")||d.hasClass(v.animating)},closable:function(){return"auto"==g.closable?"hover"!=g.on:g.closable},dimmer:function(){return k.hasClass(v.dimmer)},dimmable:function(){return k.hasClass(v.dimmable)},dimmed:function(){return f.hasClass(v.dimmed)},disabled:function(){return f.hasClass(v.disabled)},enabled:function(){return!m.is.disabled()},page:function(){return f.is("body")},pageDimmer:function(){return d.hasClass(v.pageDimmer)}},can:{show:function(){return!d.hasClass(v.disabled)}},set:{opacity:function(e){var t=d.css("background-color"),n=t.split(","),i=n&&3==n.length,o=n&&4==n.length;e=0===g.opacity?0:g.opacity||e,i||o?(n[3]=e+")",t=n.join(",")):t="rgba(0, 0, 0, "+e+")",m.debug("Setting opacity to",e),d.css("background-color",t)},active:function(){d.addClass(v.active)},dimmable:function(){f.addClass(v.dimmable)},dimmed:function(){f.addClass(v.dimmed)},pageDimmer:function(){d.addClass(v.pageDimmer)},disabled:function(){d.addClass(v.disabled)},variation:function(e){e=e||g.variation,e&&d.addClass(e)}},remove:{active:function(){d.removeClass(v.active)},dimmed:function(){f.removeClass(v.dimmed)},disabled:function(){d.removeClass(v.disabled)},variation:function(e){e=e||g.variation,e&&d.removeClass(e)}},setting:function(t,n){if(m.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,g,t);else{if(n===i)return g[t];e.isPlainObject(g[t])?e.extend(!0,g[t],n):g[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,m,t);else{if(n===i)return m[t];m[t]=n}},debug:function(){!g.silent&&g.debug&&(g.performance?m.performance.log(arguments):(m.debug=Function.prototype.bind.call(console.info,console,g.name+":"),m.debug.apply(console,arguments)))},verbose:function(){!g.silent&&g.verbose&&g.debug&&(g.performance?m.performance.log(arguments):(m.verbose=Function.prototype.bind.call(console.info,console,g.name+":"),m.verbose.apply(console,arguments)))},error:function(){g.silent||(m.error=Function.prototype.bind.call(console.error,console,g.name+":"),m.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;g.performance&&(t=(new Date).getTime(),i=r||t,n=t-i,r=t,s.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:S,"Execution Time":n})),clearTimeout(m.performance.timer),m.performance.timer=setTimeout(m.performance.display,500)},display:function(){var t=g.name+":",n=0;r=!1,clearTimeout(m.performance.timer),e.each(s,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",C&&(t+=" '"+C+"'"),a.length>1&&(t+=" ("+a.length+")"),(console.group!==i||console.table!==i)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,n,a){var r,s,l,c=T;return n=n||u,a=S||a,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):(m.error(b.method,t),!1);c=c[o]}})),e.isFunction(s)?l=s.apply(a,n):s!==i&&(l=s),e.isArray(o)?o.push(l):o!==i?o=[o,l]:l!==i&&(o=l),s}},m.preinitialize(),c?(T===i&&m.initialize(),m.invoke(l)):(T!==i&&T.invoke("destroy"),m.initialize())}),o!==i?o:this},e.fn.dimmer.settings={name:"Dimmer",namespace:"dimmer",silent:!1,debug:!1,verbose:!1,performance:!0,dimmerName:!1,variation:!1,closable:"auto",useCSS:!0,transition:"fade",on:!1,opacity:"auto",duration:{show:500,hide:500},onChange:function(){},onShow:function(){},onHide:function(){},error:{method:"The method you called is not defined."},className:{active:"active",animating:"animating",dimmable:"dimmable",dimmed:"dimmed",dimmer:"dimmer",disabled:"disabled",hide:"hide",pageDimmer:"page",show:"show"},selector:{dimmer:"> .ui.dimmer",content:".ui.dimmer > .content, .ui.dimmer > .content > .center"},template:{dimmer:function(){return e("<div />").attr("class","ui dimmer")}}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.dropdown=function(o){var a,r=e(this),s=e(n),l=r.selector||"",c="ontouchstart"in n.documentElement,u=(new Date).getTime(),d=[],f=arguments[0],m="string"==typeof f,g=[].slice.call(arguments,1);return r.each(function(p){var h,v,b,y,x,C,w,k,S=e.isPlainObject(o)?e.extend(!0,{},e.fn.dropdown.settings,o):e.extend({},e.fn.dropdown.settings),T=S.className,A=S.message,R=S.fields,P=S.keys,E=S.metadata,F=S.namespace,O=S.regExp,D=S.selector,q=S.error,j=S.templates,z="."+F,I="module-"+F,M=e(this),L=e(S.context),N=M.find(D.text),V=M.find(D.search),H=M.find(D.sizer),U=M.find(D.input),W=M.find(D.icon),B=M.prev().find(D.text).length>0?M.prev().find(D.text):M.prev(),Q=M.children(D.menu),X=Q.find(D.item),$=!1,Y=!1,Z=!1,K=this,J=M.data(I);k={initialize:function(){k.debug("Initializing dropdown",S),k.is.alreadySetup()?k.setup.reference():(k.setup.layout(),k.refreshData(),k.save.defaults(),k.restore.selected(),k.create.id(),k.bind.events(),k.observeChanges(),k.instantiate())},instantiate:function(){k.verbose("Storing instance of dropdown",k),J=k,M.data(I,k)},destroy:function(){k.verbose("Destroying previous dropdown",M),k.remove.tabbable(),M.off(z).removeData(I),Q.off(z),s.off(y),k.disconnect.menuObserver(),k.disconnect.selectObserver()},observeChanges:function(){"MutationObserver"in t&&(C=new MutationObserver(k.event.select.mutation),w=new MutationObserver(k.event.menu.mutation),k.debug("Setting up mutation observer",C,w),k.observe.select(),k.observe.menu())},disconnect:{menuObserver:function(){w&&w.disconnect()},selectObserver:function(){C&&C.disconnect()}},observe:{select:function(){k.has.input()&&C.observe(U[0],{childList:!0,subtree:!0})},menu:function(){k.has.menu()&&w.observe(Q[0],{childList:!0,subtree:!0})}},create:{id:function(){x=(Math.random().toString(16)+"000000000").substr(2,8),y="."+x,k.verbose("Creating unique id for element",x)},userChoice:function(t){var n,o,a;return(t=t||k.get.userValues())?(t=e.isArray(t)?t:[t],e.each(t,function(t,r){k.get.item(r)===!1&&(a=S.templates.addition(k.add.variables(A.addResult,r)),o=e("<div />").html(a).attr("data-"+E.value,r).attr("data-"+E.text,r).addClass(T.addition).addClass(T.item),S.hideAdditions&&o.addClass(T.hidden),n=n===i?o:n.add(o),k.verbose("Creating user choices for value",r,o))}),n):!1},userLabels:function(t){var n=k.get.userValues();n&&(k.debug("Adding user labels",n),e.each(n,function(e,t){k.verbose("Adding custom user value"),k.add.label(t,t)}))},menu:function(){Q=e("<div />").addClass(T.menu).appendTo(M)},sizer:function(){H=e("<span />").addClass(T.sizer).insertAfter(V)}},search:function(e){e=e!==i?e:k.get.query(),k.verbose("Searching for query",e),k.has.minCharacters(e)?k.filter(e):k.hide()},select:{firstUnfiltered:function(){k.verbose("Selecting first non-filtered element"),k.remove.selectedItem(),X.not(D.unselectable).not(D.addition+D.hidden).eq(0).addClass(T.selected)},nextAvailable:function(e){e=e.eq(0);var t=e.nextAll(D.item).not(D.unselectable).eq(0),n=e.prevAll(D.item).not(D.unselectable).eq(0),i=t.length>0;i?(k.verbose("Moving selection to",t),t.addClass(T.selected)):(k.verbose("Moving selection to",n),n.addClass(T.selected))}},setup:{api:function(){var e={debug:S.debug,urlData:{value:k.get.value(),query:k.get.query()},on:!1};k.verbose("First request, initializing API"),M.api(e)},layout:function(){M.is("select")&&(k.setup.select(),k.setup.returnedObject()),k.has.menu()||k.create.menu(),k.is.search()&&!k.has.search()&&(k.verbose("Adding search input"),V=e("<input />").addClass(T.search).prop("autocomplete","off").insertBefore(N)),k.is.multiple()&&k.is.searchSelection()&&!k.has.sizer()&&k.create.sizer(),S.allowTab&&k.set.tabbable()},select:function(){var t=k.get.selectValues();k.debug("Dropdown initialized on a select",t),M.is("select")&&(U=M),U.parent(D.dropdown).length>0?(k.debug("UI dropdown already exists. Creating dropdown menu only"),M=U.closest(D.dropdown),k.has.menu()||k.create.menu(),Q=M.children(D.menu),k.setup.menu(t)):(k.debug("Creating entire dropdown from select"),M=e("<div />").attr("class",U.attr("class")).addClass(T.selection).addClass(T.dropdown).html(j.dropdown(t)).insertBefore(U),U.hasClass(T.multiple)&&U.prop("multiple")===!1&&(k.error(q.missingMultiple),U.prop("multiple",!0)),U.is("[multiple]")&&k.set.multiple(),U.prop("disabled")&&(k.debug("Disabling dropdown"),M.addClass(T.disabled)),U.removeAttr("class").detach().prependTo(M)),k.refresh()},menu:function(e){Q.html(j.menu(e,R)),X=Q.find(D.item)},reference:function(){k.debug("Dropdown behavior was called on select, replacing with closest dropdown"),M=M.parent(D.dropdown),k.refresh(),k.setup.returnedObject(),m&&(J=k,k.invoke(f))},returnedObject:function(){var e=r.slice(0,p),t=r.slice(p+1);r=e.add(M).add(t)}},refresh:function(){k.refreshSelectors(),k.refreshData()},refreshItems:function(){X=Q.find(D.item)},refreshSelectors:function(){k.verbose("Refreshing selector cache"),N=M.find(D.text),V=M.find(D.search),U=M.find(D.input),W=M.find(D.icon),B=M.prev().find(D.text).length>0?M.prev().find(D.text):M.prev(),Q=M.children(D.menu),X=Q.find(D.item)},refreshData:function(){k.verbose("Refreshing cached metadata"),X.removeData(E.text).removeData(E.value)},clearData:function(){k.verbose("Clearing metadata"),X.removeData(E.text).removeData(E.value),M.removeData(E.defaultText).removeData(E.defaultValue).removeData(E.placeholderText)},toggle:function(){k.verbose("Toggling menu visibility"),k.is.active()?k.hide():k.show()},show:function(t){if(t=e.isFunction(t)?t:function(){},!k.can.show()&&k.is.remote()&&(k.debug("No API results retrieved, searching before show"),k.queryRemote(k.get.query(),k.show)),k.can.show()&&!k.is.active()){if(k.debug("Showing dropdown"),!k.has.message()||k.has.maxSelections()||k.has.allResultsFiltered()||k.remove.message(),k.is.allFiltered())return!0;S.onShow.call(K)!==!1&&k.animate.show(function(){k.can.click()&&k.bind.intent(),k.has.menuSearch()&&k.focusSearch(),k.set.visible(),t.call(K)})}},hide:function(t){t=e.isFunction(t)?t:function(){},k.is.active()&&(k.debug("Hiding dropdown"),S.onHide.call(K)!==!1&&k.animate.hide(function(){k.remove.visible(),t.call(K)}))},hideOthers:function(){k.verbose("Finding other dropdowns to hide"),r.not(M).has(D.menu+"."+T.visible).dropdown("hide")},hideMenu:function(){k.verbose("Hiding menu  instantaneously"),k.remove.active(),k.remove.visible(),Q.transition("hide")},hideSubMenus:function(){var e=Q.children(D.item).find(D.menu);k.verbose("Hiding sub menus",e),e.transition("hide")},bind:{events:function(){c&&k.bind.touchEvents(),k.bind.keyboardEvents(),k.bind.inputEvents(),k.bind.mouseEvents()},touchEvents:function(){k.debug("Touch device detected binding additional touch events"),k.is.searchSelection()||k.is.single()&&M.on("touchstart"+z,k.event.test.toggle),Q.on("touchstart"+z,D.item,k.event.item.mouseenter)},keyboardEvents:function(){k.verbose("Binding keyboard events"),M.on("keydown"+z,k.event.keydown),k.has.search()&&M.on(k.get.inputEvent()+z,D.search,k.event.input),k.is.multiple()&&s.on("keydown"+y,k.event.document.keydown)},inputEvents:function(){k.verbose("Binding input change events"),M.on("change"+z,D.input,k.event.change)},mouseEvents:function(){k.verbose("Binding mouse events"),k.is.multiple()&&M.on("click"+z,D.label,k.event.label.click).on("click"+z,D.remove,k.event.remove.click),k.is.searchSelection()?(M.on("mousedown"+z,k.event.mousedown).on("mouseup"+z,k.event.mouseup).on("mousedown"+z,D.menu,k.event.menu.mousedown).on("mouseup"+z,D.menu,k.event.menu.mouseup).on("click"+z,D.icon,k.event.icon.click).on("focus"+z,D.search,k.event.search.focus).on("click"+z,D.search,k.event.search.focus).on("blur"+z,D.search,k.event.search.blur).on("click"+z,D.text,k.event.text.focus),k.is.multiple()&&M.on("click"+z,k.event.click)):("click"==S.on?M.on("click"+z,D.icon,k.event.icon.click).on("click"+z,k.event.test.toggle):"hover"==S.on?M.on("mouseenter"+z,k.delay.show).on("mouseleave"+z,k.delay.hide):M.on(S.on+z,k.toggle),M.on("mousedown"+z,k.event.mousedown).on("mouseup"+z,k.event.mouseup).on("focus"+z,k.event.focus),k.has.menuSearch()?M.on("blur"+z,D.search,k.event.search.blur):M.on("blur"+z,k.event.blur)),Q.on("mouseenter"+z,D.item,k.event.item.mouseenter).on("mouseleave"+z,D.item,k.event.item.mouseleave).on("click"+z,D.item,k.event.item.click)},intent:function(){k.verbose("Binding hide intent event to document"),c&&s.on("touchstart"+y,k.event.test.touch).on("touchmove"+y,k.event.test.touch),s.on("click"+y,k.event.test.hide)}},unbind:{intent:function(){k.verbose("Removing hide intent event from document"),c&&s.off("touchstart"+y).off("touchmove"+y),s.off("click"+y)}},filter:function(e){var t=e!==i?e:k.get.query(),n=function(){k.is.multiple()&&k.filterActive(),k.select.firstUnfiltered(),k.has.allResultsFiltered()?S.onNoResults.call(K,t)?S.allowAdditions?S.hideAdditions&&(k.verbose("User addition with no menu, setting empty style"),k.set.empty(),k.hideMenu()):(k.verbose("All items filtered, showing message",t),k.add.message(A.noResults)):(k.verbose("All items filtered, hiding dropdown",t),k.hideMenu()):(k.remove.empty(),k.remove.message()),S.allowAdditions&&k.add.userSuggestion(e),k.is.searchSelection()&&k.can.show()&&k.is.focusedOnSearch()&&k.show()};S.useLabels&&k.has.maxSelections()||(S.apiSettings?k.can.useAPI()?k.queryRemote(t,function(){S.filterRemoteData&&k.filterItems(t),n()}):k.error(q.noAPI):(k.filterItems(t),n()))},queryRemote:function(t,n){var i={errorDuration:!1,cache:"local",throttle:S.throttle,urlData:{query:t},onError:function(){k.add.message(A.serverError),n()},onFailure:function(){k.add.message(A.serverError),n()},onSuccess:function(e){k.remove.message(),k.setup.menu({values:e[R.remoteValues]}),n()}};M.api("get request")||k.setup.api(),i=e.extend(!0,{},i,S.apiSettings),M.api("setting",i).api("query")},filterItems:function(t){var n=t!==i?t:k.get.query(),o=null,a=k.escape.string(n),r=new RegExp("^"+a,"igm");k.has.query()&&(o=[],k.verbose("Searching for matching values",n),X.each(function(){var t,i,a=e(this);if("both"==S.match||"text"==S.match){if(t=String(k.get.choiceText(a,!1)),-1!==t.search(r))return o.push(this),!0;if("exact"===S.fullTextSearch&&k.exactSearch(n,t))return o.push(this),!0;if(S.fullTextSearch===!0&&k.fuzzySearch(n,t))return o.push(this),!0}if("both"==S.match||"value"==S.match){if(i=String(k.get.choiceValue(a,t)),-1!==i.search(r))return o.push(this),!0;if("exact"===S.fullTextSearch&&k.exactSearch(n,i))return o.push(this),!0;if(S.fullTextSearch===!0&&k.fuzzySearch(n,i))return o.push(this),!0}})),k.debug("Showing only matched items",n),k.remove.filteredItem(),o&&X.not(o).addClass(T.filtered)},fuzzySearch:function(e,t){var n=t.length,i=e.length;if(e=e.toLowerCase(),t=t.toLowerCase(),i>n)return!1;if(i===n)return e===t;e:for(var o=0,a=0;i>o;o++){for(var r=e.charCodeAt(o);n>a;)if(t.charCodeAt(a++)===r)continue e;return!1}return!0},exactSearch:function(e,t){return e=e.toLowerCase(),t=t.toLowerCase(),t.indexOf(e)>-1},filterActive:function(){S.useLabels&&X.filter("."+T.active).addClass(T.filtered)},focusSearch:function(e){k.has.search()&&!k.is.focusedOnSearch()&&(e?(M.off("focus"+z,D.search),V.focus(),M.on("focus"+z,D.search,k.event.search.focus)):V.focus())},forceSelection:function(){var e=X.not(T.filtered).filter("."+T.selected).eq(0),t=X.not(T.filtered).filter("."+T.active).eq(0),n=e.length>0?e:t,i=n.length>0;return i&&!k.is.multiple()?(k.debug("Forcing partial selection to selected item",n),void k.event.item.click.call(n,{},!0)):void(S.allowAdditions?(k.set.selected(k.get.query()),k.remove.searchTerm()):k.remove.searchTerm())},event:{change:function(){Z||(k.debug("Input changed, updating selection"),
k.set.selected())},focus:function(){S.showOnFocus&&!$&&k.is.hidden()&&!v&&k.show()},blur:function(e){v=n.activeElement===this,$||v||(k.remove.activeLabel(),k.hide())},mousedown:function(){k.is.searchSelection()?b=!0:$=!0},mouseup:function(){k.is.searchSelection()?b=!1:$=!1},click:function(t){var n=e(t.target);n.is(M)&&(k.is.focusedOnSearch()?k.show():k.focusSearch())},search:{focus:function(){$=!0,k.is.multiple()&&k.remove.activeLabel(),S.showOnFocus&&k.search()},blur:function(e){v=n.activeElement===this,k.is.searchSelection()&&!b&&(Y||v||(S.forceSelection&&k.forceSelection(),k.hide())),b=!1}},icon:{click:function(e){k.toggle()}},text:{focus:function(e){$=!0,k.focusSearch()}},input:function(e){(k.is.multiple()||k.is.searchSelection())&&k.set.filtered(),clearTimeout(k.timer),k.timer=setTimeout(k.search,S.delay.search)},label:{click:function(t){var n=e(this),i=M.find(D.label),o=i.filter("."+T.active),a=n.nextAll("."+T.active),r=n.prevAll("."+T.active),s=a.length>0?n.nextUntil(a).add(o).add(n):n.prevUntil(r).add(o).add(n);t.shiftKey?(o.removeClass(T.active),s.addClass(T.active)):t.ctrlKey?n.toggleClass(T.active):(o.removeClass(T.active),n.addClass(T.active)),S.onLabelSelect.apply(this,i.filter("."+T.active))}},remove:{click:function(){var t=e(this).parent();t.hasClass(T.active)?k.remove.activeLabels():k.remove.activeLabels(t)}},test:{toggle:function(e){var t=k.is.multiple()?k.show:k.toggle;k.is.bubbledLabelClick(e)||k.is.bubbledIconClick(e)||k.determine.eventOnElement(e,t)&&e.preventDefault()},touch:function(e){k.determine.eventOnElement(e,function(){"touchstart"==e.type?k.timer=setTimeout(function(){k.hide()},S.delay.touch):"touchmove"==e.type&&clearTimeout(k.timer)}),e.stopPropagation()},hide:function(e){k.determine.eventInModule(e,k.hide)}},select:{mutation:function(e){k.debug("<select> modified, recreating menu"),k.setup.select()}},menu:{mutation:function(t){var n=t[0],i=e(n.addedNodes?n.addedNodes[0]:!1),o=e(n.removedNodes?n.removedNodes[0]:!1),a=i.add(o),r=a.is(D.addition)||a.closest(D.addition).length>0,s=a.is(D.message)||a.closest(D.message).length>0;r||s?(k.debug("Updating item selector cache"),k.refreshItems()):(k.debug("Menu modified, updating selector cache"),k.refresh())},mousedown:function(){Y=!0},mouseup:function(){Y=!1}},item:{mouseenter:function(t){var n=e(t.target),i=e(this),o=i.children(D.menu),a=i.siblings(D.item).children(D.menu),r=o.length>0,s=o.find(n).length>0;!s&&r&&(clearTimeout(k.itemTimer),k.itemTimer=setTimeout(function(){k.verbose("Showing sub-menu",o),e.each(a,function(){k.animate.hide(!1,e(this))}),k.animate.show(!1,o)},S.delay.show),t.preventDefault())},mouseleave:function(t){var n=e(this).children(D.menu);n.length>0&&(clearTimeout(k.itemTimer),k.itemTimer=setTimeout(function(){k.verbose("Hiding sub-menu",n),k.animate.hide(!1,n)},S.delay.hide))},click:function(t,i){var o=e(this),a=e(t?t.target:""),r=o.find(D.menu),s=k.get.choiceText(o),l=k.get.choiceValue(o,s),c=r.length>0,u=r.find(a).length>0;k.has.menuSearch()&&e(n.activeElement).blur(),u||c&&!S.allowCategorySelection||(k.is.searchSelection()&&(S.allowAdditions&&k.remove.userAddition(),k.remove.searchTerm(),k.is.focusedOnSearch()||1==i||k.focusSearch(!0)),S.useLabels||(k.remove.filteredItem(),k.set.scrollPosition(o)),k.determine.selectAction.call(this,s,l))}},document:{keydown:function(e){var t=e.which,n=k.is.inObject(t,P);if(n){var i=M.find(D.label),o=i.filter("."+T.active),a=(o.data(E.value),i.index(o)),r=i.length,s=o.length>0,l=o.length>1,c=0===a,u=a+1==r,d=k.is.searchSelection(),f=k.is.focusedOnSearch(),m=k.is.focused(),g=f&&0===k.get.caretPosition();if(d&&!s&&!f)return;t==P.leftArrow?!m&&!g||s?s&&(e.shiftKey?k.verbose("Adding previous label to selection"):(k.verbose("Selecting previous label"),i.removeClass(T.active)),c&&!l?o.addClass(T.active):o.prev(D.siblingLabel).addClass(T.active).end(),e.preventDefault()):(k.verbose("Selecting previous label"),i.last().addClass(T.active)):t==P.rightArrow?(m&&!s&&i.first().addClass(T.active),s&&(e.shiftKey?k.verbose("Adding next label to selection"):(k.verbose("Selecting next label"),i.removeClass(T.active)),u?d?f?i.removeClass(T.active):k.focusSearch():l?o.next(D.siblingLabel).addClass(T.active):o.addClass(T.active):o.next(D.siblingLabel).addClass(T.active),e.preventDefault())):t==P.deleteKey||t==P.backspace?s?(k.verbose("Removing active labels"),u&&d&&!f&&k.focusSearch(),o.last().next(D.siblingLabel).addClass(T.active),k.remove.activeLabels(o),e.preventDefault()):g&&!s&&t==P.backspace&&(k.verbose("Removing last label on input backspace"),o=i.last().addClass(T.active),k.remove.activeLabels(o)):o.removeClass(T.active)}}},keydown:function(e){var t=e.which,n=k.is.inObject(t,P);if(n){var i,o,a=X.not(D.unselectable).filter("."+T.selected).eq(0),r=Q.children("."+T.active).eq(0),s=a.length>0?a:r,l=s.length>0?s.siblings(":not(."+T.filtered+")").addBack():Q.children(":not(."+T.filtered+")"),c=s.children(D.menu),u=s.closest(D.menu),d=u.hasClass(T.visible)||u.hasClass(T.animating)||u.parent(D.menu).length>0,f=c.length>0,m=s.length>0,g=s.not(D.unselectable).length>0,p=t==P.delimiter&&S.allowAdditions&&k.is.multiple(),h=S.allowAdditions&&S.hideAdditions&&(t==P.enter||p)&&g;if(h&&(k.verbose("Selecting item from keyboard shortcut",s),k.event.item.click.call(s,e),k.is.searchSelection()&&k.remove.searchTerm()),k.is.visible()){if((t==P.enter||p)&&(t==P.enter&&m&&f&&!S.allowCategorySelection?(k.verbose("Pressed enter on unselectable category, opening sub menu"),t=P.rightArrow):g&&(k.verbose("Selecting item from keyboard shortcut",s),k.event.item.click.call(s,e),k.is.searchSelection()&&k.remove.searchTerm()),e.preventDefault()),m&&(t==P.leftArrow&&(o=u[0]!==Q[0],o&&(k.verbose("Left key pressed, closing sub-menu"),k.animate.hide(!1,u),s.removeClass(T.selected),u.closest(D.item).addClass(T.selected),e.preventDefault())),t==P.rightArrow&&f&&(k.verbose("Right key pressed, opening sub-menu"),k.animate.show(!1,c),s.removeClass(T.selected),c.find(D.item).eq(0).addClass(T.selected),e.preventDefault())),t==P.upArrow){if(i=m&&d?s.prevAll(D.item+":not("+D.unselectable+")").eq(0):X.eq(0),l.index(i)<0)return k.verbose("Up key pressed but reached top of current menu"),void e.preventDefault();k.verbose("Up key pressed, changing active item"),s.removeClass(T.selected),i.addClass(T.selected),k.set.scrollPosition(i),S.selectOnKeydown&&k.is.single()&&k.set.selectedItem(i),e.preventDefault()}if(t==P.downArrow){if(i=m&&d?i=s.nextAll(D.item+":not("+D.unselectable+")").eq(0):X.eq(0),0===i.length)return k.verbose("Down key pressed but reached bottom of current menu"),void e.preventDefault();k.verbose("Down key pressed, changing active item"),X.removeClass(T.selected),i.addClass(T.selected),k.set.scrollPosition(i),S.selectOnKeydown&&k.is.single()&&k.set.selectedItem(i),e.preventDefault()}t==P.pageUp&&(k.scrollPage("up"),e.preventDefault()),t==P.pageDown&&(k.scrollPage("down"),e.preventDefault()),t==P.escape&&(k.verbose("Escape key pressed, closing dropdown"),k.hide())}else p&&e.preventDefault(),t!=P.downArrow||k.is.visible()||(k.verbose("Down key pressed, showing dropdown"),k.select.firstUnfiltered(),k.show(),e.preventDefault())}else k.has.search()||k.set.selectedLetter(String.fromCharCode(t))}},trigger:{change:function(){var e=n.createEvent("HTMLEvents"),t=U[0];t&&(k.verbose("Triggering native change event"),e.initEvent("change",!0,!1),t.dispatchEvent(e))}},determine:{selectAction:function(t,n){k.verbose("Determining action",S.action),e.isFunction(k.action[S.action])?(k.verbose("Triggering preset action",S.action,t,n),k.action[S.action].call(K,t,n,this)):e.isFunction(S.action)?(k.verbose("Triggering user action",S.action,t,n),S.action.call(K,t,n,this)):k.error(q.action,S.action)},eventInModule:function(t,i){var o=e(t.target),a=o.closest(n.documentElement).length>0,r=o.closest(M).length>0;return i=e.isFunction(i)?i:function(){},a&&!r?(k.verbose("Triggering event",i),i(),!0):(k.verbose("Event occurred in dropdown, canceling callback"),!1)},eventOnElement:function(t,i){var o=e(t.target),a=o.closest(D.siblingLabel),r=n.body.contains(t.target),s=0===M.find(a).length,l=0===o.closest(Q).length;return i=e.isFunction(i)?i:function(){},r&&s&&l?(k.verbose("Triggering event",i),i(),!0):(k.verbose("Event occurred in dropdown menu, canceling callback"),!1)}},action:{nothing:function(){},activate:function(t,n,o){if(n=n!==i?n:t,k.can.activate(e(o))){if(k.set.selected(n,e(o)),k.is.multiple()&&!k.is.allFiltered())return;k.hideAndClear()}},select:function(t,n,o){if(n=n!==i?n:t,k.can.activate(e(o))){if(k.set.value(n,e(o)),k.is.multiple()&&!k.is.allFiltered())return;k.hideAndClear()}},combo:function(t,n,o){n=n!==i?n:t,k.set.selected(n,e(o)),k.hideAndClear()},hide:function(e,t,n){k.set.value(t,e),k.hideAndClear()}},get:{id:function(){return x},defaultText:function(){return M.data(E.defaultText)},defaultValue:function(){return M.data(E.defaultValue)},placeholderText:function(){return M.data(E.placeholderText)||""},text:function(){return N.text()},query:function(){return e.trim(V.val())},searchWidth:function(e){return e=e!==i?e:V.val(),H.text(e),Math.ceil(H.width()+1)},selectionCount:function(){var t,n=k.get.values();return t=k.is.multiple()?e.isArray(n)?n.length:0:""!==k.get.value()?1:0},transition:function(e){return"auto"==S.transition?k.is.upward(e)?"slide up":"slide down":S.transition},userValues:function(){var t=k.get.values();return t?(t=e.isArray(t)?t:[t],e.grep(t,function(e){return k.get.item(e)===!1})):!1},uniqueArray:function(t){return e.grep(t,function(n,i){return e.inArray(n,t)===i})},caretPosition:function(){var e,t,i=V.get(0);return"selectionStart"in i?i.selectionStart:n.selection?(i.focus(),e=n.selection.createRange(),t=e.text.length,e.moveStart("character",-i.value.length),e.text.length-t):void 0},value:function(){var t=U.length>0?U.val():M.data(E.value),n=e.isArray(t)&&1===t.length&&""===t[0];return t===i||n?"":t},values:function(){var e=k.get.value();return""===e?"":!k.has.selectInput()&&k.is.multiple()?"string"==typeof e?e.split(S.delimiter):"":e},remoteValues:function(){var t=k.get.values(),n=!1;return t&&("string"==typeof t&&(t=[t]),e.each(t,function(e,t){var i=k.read.remoteData(t);k.verbose("Restoring value from session data",i,t),i&&(n||(n={}),n[t]=i)})),n},choiceText:function(t,n){return n=n!==i?n:S.preserveHTML,t?(t.find(D.menu).length>0&&(k.verbose("Retrieving text of element with sub-menu"),t=t.clone(),t.find(D.menu).remove(),t.find(D.menuIcon).remove()),t.data(E.text)!==i?t.data(E.text):n?e.trim(t.html()):e.trim(t.text())):void 0},choiceValue:function(t,n){return n=n||k.get.choiceText(t),t?t.data(E.value)!==i?String(t.data(E.value)):"string"==typeof n?e.trim(n.toLowerCase()):String(n):!1},inputEvent:function(){var e=V[0];return e?e.oninput!==i?"input":e.onpropertychange!==i?"propertychange":"keyup":!1},selectValues:function(){var t={};return t.values=[],M.find("option").each(function(){var n=e(this),o=n.html(),a=n.attr("disabled"),r=n.attr("value")!==i?n.attr("value"):o;"auto"===S.placeholder&&""===r?t.placeholder=o:t.values.push({name:o,value:r,disabled:a})}),S.placeholder&&"auto"!==S.placeholder&&(k.debug("Setting placeholder value to",S.placeholder),t.placeholder=S.placeholder),S.sortSelect?(t.values.sort(function(e,t){return e.name>t.name?1:-1}),k.debug("Retrieved and sorted values from select",t)):k.debug("Retrieved values from select",t),t},activeItem:function(){return X.filter("."+T.active)},selectedItem:function(){var e=X.not(D.unselectable).filter("."+T.selected);return e.length>0?e:X.eq(0)},itemWithAdditions:function(e){var t=k.get.item(e),n=k.create.userChoice(e),i=n&&n.length>0;return i&&(t=t.length>0?t.add(n):n),t},item:function(t,n){var o,a,r=!1;return t=t!==i?t:k.get.values()!==i?k.get.values():k.get.text(),o=a?t.length>0:t!==i&&null!==t,a=k.is.multiple()&&e.isArray(t),n=""===t||0===t?!0:n||!1,o&&X.each(function(){var o=e(this),s=k.get.choiceText(o),l=k.get.choiceValue(o,s);if(null!==l&&l!==i)if(a)-1===e.inArray(String(l),t)&&-1===e.inArray(s,t)||(r=r?r.add(o):o);else if(n){if(k.verbose("Ambiguous dropdown value using strict type check",o,t),l===t||s===t)return r=o,!0}else if(String(l)==String(t)||s==t)return k.verbose("Found select item by value",l,t),r=o,!0}),r}},check:{maxSelections:function(e){return S.maxSelections?(e=e!==i?e:k.get.selectionCount(),e>=S.maxSelections?(k.debug("Maximum selection count reached"),S.useLabels&&(X.addClass(T.filtered),k.add.message(A.maxSelections)),!0):(k.verbose("No longer at maximum selection count"),k.remove.message(),k.remove.filteredItem(),k.is.searchSelection()&&k.filterItems(),!1)):!0}},restore:{defaults:function(){k.clear(),k.restore.defaultText(),k.restore.defaultValue()},defaultText:function(){var e=k.get.defaultText(),t=k.get.placeholderText;e===t?(k.debug("Restoring default placeholder text",e),k.set.placeholderText(e)):(k.debug("Restoring default text",e),k.set.text(e))},placeholderText:function(){k.set.placeholderText()},defaultValue:function(){var e=k.get.defaultValue();e!==i&&(k.debug("Restoring default value",e),""!==e?(k.set.value(e),k.set.selected()):(k.remove.activeItem(),k.remove.selectedItem()))},labels:function(){S.allowAdditions&&(S.useLabels||(k.error(q.labels),S.useLabels=!0),k.debug("Restoring selected values"),k.create.userLabels()),k.check.maxSelections()},selected:function(){k.restore.values(),k.is.multiple()?(k.debug("Restoring previously selected values and labels"),k.restore.labels()):k.debug("Restoring previously selected values")},values:function(){k.set.initialLoad(),S.apiSettings&&S.saveRemoteData&&k.get.remoteValues()?k.restore.remoteValues():k.set.selected(),k.remove.initialLoad()},remoteValues:function(){var t=k.get.remoteValues();k.debug("Recreating selected from session data",t),t&&(k.is.single()?e.each(t,function(e,t){k.set.text(t)}):e.each(t,function(e,t){k.add.label(e,t)}))}},read:{remoteData:function(e){var n;return t.Storage===i?void k.error(q.noStorage):(n=sessionStorage.getItem(e),n!==i?n:!1)}},save:{defaults:function(){k.save.defaultText(),k.save.placeholderText(),k.save.defaultValue()},defaultValue:function(){var e=k.get.value();k.verbose("Saving default value as",e),M.data(E.defaultValue,e)},defaultText:function(){var e=k.get.text();k.verbose("Saving default text as",e),M.data(E.defaultText,e)},placeholderText:function(){var e;S.placeholder!==!1&&N.hasClass(T.placeholder)&&(e=k.get.text(),k.verbose("Saving placeholder text as",e),M.data(E.placeholderText,e))},remoteData:function(e,n){return t.Storage===i?void k.error(q.noStorage):(k.verbose("Saving remote data to session storage",n,e),void sessionStorage.setItem(n,e))}},clear:function(){k.is.multiple()&&S.useLabels?k.remove.labels():(k.remove.activeItem(),k.remove.selectedItem()),k.set.placeholderText(),k.clearValue()},clearValue:function(){k.set.value("")},scrollPage:function(e,t){var n,i,o,a=t||k.get.selectedItem(),r=a.closest(D.menu),s=r.outerHeight(),l=r.scrollTop(),c=X.eq(0).outerHeight(),u=Math.floor(s/c),d=(r.prop("scrollHeight"),"up"==e?l-c*u:l+c*u),f=X.not(D.unselectable);o="up"==e?f.index(a)-u:f.index(a)+u,n="up"==e?o>=0:o<f.length,i=n?f.eq(o):"up"==e?f.first():f.last(),i.length>0&&(k.debug("Scrolling page",e,i),a.removeClass(T.selected),i.addClass(T.selected),S.selectOnKeydown&&k.is.single()&&k.set.selectedItem(i),r.scrollTop(d))},set:{filtered:function(){var e=k.is.multiple(),t=k.is.searchSelection(),n=e&&t,i=t?k.get.query():"",o="string"==typeof i&&i.length>0,a=k.get.searchWidth(),r=""!==i;e&&o&&(k.verbose("Adjusting input width",a,S.glyphWidth),V.css("width",a)),o||n&&r?(k.verbose("Hiding placeholder text"),N.addClass(T.filtered)):(!e||n&&!r)&&(k.verbose("Showing placeholder text"),N.removeClass(T.filtered))},empty:function(){M.addClass(T.empty)},loading:function(){M.addClass(T.loading)},placeholderText:function(e){e=e||k.get.placeholderText(),k.debug("Setting placeholder text",e),k.set.text(e),N.addClass(T.placeholder)},tabbable:function(){k.is.searchSelection()?(k.debug("Added tabindex to searchable dropdown"),V.val("").attr("tabindex",0),Q.attr("tabindex",-1)):(k.debug("Added tabindex to dropdown"),M.attr("tabindex")===i&&(M.attr("tabindex",0),Q.attr("tabindex",-1)))},initialLoad:function(){k.verbose("Setting initial load"),h=!0},activeItem:function(e){S.allowAdditions&&e.filter(D.addition).length>0?e.addClass(T.filtered):e.addClass(T.active)},partialSearch:function(e){var t=k.get.query().length;V.val(e.substr(0,t))},scrollPosition:function(e,t){var n,o,a,r,s,l,c,u,d,f=5;e=e||k.get.selectedItem(),n=e.closest(D.menu),o=e&&e.length>0,t=t!==i?t:!1,e&&n.length>0&&o&&(r=e.position().top,n.addClass(T.loading),l=n.scrollTop(),s=n.offset().top,r=e.offset().top,a=l-s+r,t||(c=n.height(),d=a+f>l+c,u=l>a-f),k.debug("Scrolling to active item",a),(t||u||d)&&n.scrollTop(a),n.removeClass(T.loading))},text:function(e){"select"!==S.action&&("combo"==S.action?(k.debug("Changing combo button text",e,B),S.preserveHTML?B.html(e):B.text(e)):(e!==k.get.placeholderText()&&N.removeClass(T.placeholder),k.debug("Changing text",e,N),N.removeClass(T.filtered),S.preserveHTML?N.html(e):N.text(e)))},selectedItem:function(e){var t=k.get.choiceValue(e),n=k.get.choiceText(e,!1),i=k.get.choiceText(e,!0);k.debug("Setting user selection to item",e),k.remove.activeItem(),k.set.partialSearch(n),k.set.activeItem(e),k.set.selected(t,e),k.set.text(i)},selectedLetter:function(t){var n,i=X.filter("."+T.selected),o=i.length>0&&k.has.firstLetter(i,t),a=!1;o&&(n=i.nextAll(X).eq(0),k.has.firstLetter(n,t)&&(a=n)),a||X.each(function(){return k.has.firstLetter(e(this),t)?(a=e(this),!1):void 0}),a&&(k.verbose("Scrolling to next value with letter",t),k.set.scrollPosition(a),i.removeClass(T.selected),a.addClass(T.selected),S.selectOnKeydown&&k.is.single()&&k.set.selectedItem(a))},direction:function(e){"auto"==S.direction?k.is.onScreen(e)?k.remove.upward(e):k.set.upward(e):"upward"==S.direction&&k.set.upward(e)},upward:function(e){var t=e||M;t.addClass(T.upward)},value:function(e,t,n){var o=k.escape.value(e),a=U.length>0,r=(!k.has.value(e),k.get.values()),s=e!==i?String(e):e;if(a){if(!S.allowReselection&&s==r&&(k.verbose("Skipping value update already same value",e,r),!k.is.initialLoad()))return;k.is.single()&&k.has.selectInput()&&k.can.extendSelect()&&(k.debug("Adding user option",e),k.add.optionValue(e)),k.debug("Updating input value",o,r),Z=!0,U.val(o),S.fireOnInit===!1&&k.is.initialLoad()?k.debug("Input native change event ignored on initial load"):k.trigger.change(),Z=!1}else k.verbose("Storing value in metadata",o,U),o!==r&&M.data(E.value,s);S.fireOnInit===!1&&k.is.initialLoad()?k.verbose("No callback on initial load",S.onChange):S.onChange.call(K,e,t,n)},active:function(){M.addClass(T.active)},multiple:function(){M.addClass(T.multiple)},visible:function(){M.addClass(T.visible)},exactly:function(e,t){k.debug("Setting selected to exact values"),k.clear(),k.set.selected(e,t)},selected:function(t,n){var i=k.is.multiple();n=S.allowAdditions?n||k.get.itemWithAdditions(t):n||k.get.item(t),n&&(k.debug("Setting selected menu item to",n),k.is.multiple()&&k.remove.searchWidth(),k.is.single()?(k.remove.activeItem(),k.remove.selectedItem()):S.useLabels&&k.remove.selectedItem(),n.each(function(){var t=e(this),o=k.get.choiceText(t),a=k.get.choiceValue(t,o),r=t.hasClass(T.filtered),s=t.hasClass(T.active),l=t.hasClass(T.addition),c=i&&1==n.length;i?!s||l?(S.apiSettings&&S.saveRemoteData&&k.save.remoteData(o,a),S.useLabels?(k.add.value(a,o,t),k.add.label(a,o,c),k.set.activeItem(t),k.filterActive(),k.select.nextAvailable(n)):(k.add.value(a,o,t),k.set.text(k.add.variables(A.count)),k.set.activeItem(t))):r||(k.debug("Selected active value, removing label"),k.remove.selected(a)):(S.apiSettings&&S.saveRemoteData&&k.save.remoteData(o,a),k.set.text(o),k.set.value(a,o,t),t.addClass(T.active).addClass(T.selected))}))}},add:{label:function(t,n,i){var o,a=k.is.searchSelection()?V:N,r=k.escape.value(t);return o=e("<a />").addClass(T.label).attr("data-"+E.value,r).html(j.label(r,n)),o=S.onLabelCreate.call(o,r,n),k.has.label(t)?void k.debug("Label already exists, skipping",r):(S.label.variation&&o.addClass(S.label.variation),void(i===!0?(k.debug("Animating in label",o),o.addClass(T.hidden).insertBefore(a).transition(S.label.transition,S.label.duration)):(k.debug("Adding selection label",o),o.insertBefore(a))))},message:function(t){var n=Q.children(D.message),i=S.templates.message(k.add.variables(t));n.length>0?n.html(i):n=e("<div/>").html(i).addClass(T.message).appendTo(Q)},optionValue:function(t){var n=k.escape.value(t),i=U.find('option[value="'+k.escape.string(n)+'"]'),o=i.length>0;o||(k.disconnect.selectObserver(),k.is.single()&&(k.verbose("Removing previous user addition"),U.find("option."+T.addition).remove()),e("<option/>").prop("value",n).addClass(T.addition).html(t).appendTo(U),k.verbose("Adding user addition as an <option>",t),k.observe.select())},userSuggestion:function(e){var t,n=Q.children(D.addition),i=k.get.item(e),o=i&&i.not(D.addition).length,a=n.length>0;if(!S.useLabels||!k.has.maxSelections()){if(""===e||o)return void n.remove();a?(n.data(E.value,e).data(E.text,e).attr("data-"+E.value,e).attr("data-"+E.text,e).removeClass(T.filtered),S.hideAdditions||(t=S.templates.addition(k.add.variables(A.addResult,e)),n.html(t)),k.verbose("Replacing user suggestion with new value",n)):(n=k.create.userChoice(e),n.prependTo(Q),k.verbose("Adding item choice to menu corresponding with user choice addition",n)),S.hideAdditions&&!k.is.allFiltered()||n.addClass(T.selected).siblings().removeClass(T.selected),k.refreshItems()}},variables:function(e,t){var n,i,o=-1!==e.search("{count}"),a=-1!==e.search("{maxCount}"),r=-1!==e.search("{term}");return k.verbose("Adding templated variables to message",e),o&&(n=k.get.selectionCount(),e=e.replace("{count}",n)),a&&(n=k.get.selectionCount(),e=e.replace("{maxCount}",S.maxSelections)),r&&(i=t||k.get.query(),e=e.replace("{term}",i)),e},value:function(t,n,i){var o,a=k.get.values();return""===t?void k.debug("Cannot select blank values from multiselect"):(e.isArray(a)?(o=a.concat([t]),o=k.get.uniqueArray(o)):o=[t],k.has.selectInput()?k.can.extendSelect()&&(k.debug("Adding value to select",t,o,U),k.add.optionValue(t)):(o=o.join(S.delimiter),k.debug("Setting hidden input to delimited value",o,U)),S.fireOnInit===!1&&k.is.initialLoad()?k.verbose("Skipping onadd callback on initial load",S.onAdd):S.onAdd.call(K,t,n,i),k.set.value(o,t,n,i),void k.check.maxSelections())}},remove:{active:function(){M.removeClass(T.active)},activeLabel:function(){M.find(D.label).removeClass(T.active)},empty:function(){M.removeClass(T.empty)},loading:function(){M.removeClass(T.loading)},initialLoad:function(){h=!1},upward:function(e){var t=e||M;t.removeClass(T.upward)},visible:function(){M.removeClass(T.visible)},activeItem:function(){X.removeClass(T.active)},filteredItem:function(){S.useLabels&&k.has.maxSelections()||(S.useLabels&&k.is.multiple()?X.not("."+T.active).removeClass(T.filtered):X.removeClass(T.filtered),k.remove.empty())},optionValue:function(e){var t=k.escape.value(e),n=U.find('option[value="'+k.escape.string(t)+'"]'),i=n.length>0;i&&n.hasClass(T.addition)&&(C&&(C.disconnect(),k.verbose("Temporarily disconnecting mutation observer")),n.remove(),k.verbose("Removing user addition as an <option>",t),C&&C.observe(U[0],{childList:!0,subtree:!0}))},message:function(){Q.children(D.message).remove()},searchWidth:function(){V.css("width","")},searchTerm:function(){k.verbose("Cleared search term"),V.val(""),k.set.filtered()},userAddition:function(){X.filter(D.addition).remove()},selected:function(t,n){return(n=S.allowAdditions?n||k.get.itemWithAdditions(t):n||k.get.item(t))?void n.each(function(){var t=e(this),n=k.get.choiceText(t),i=k.get.choiceValue(t,n);k.is.multiple()?S.useLabels?(k.remove.value(i,n,t),k.remove.label(i)):(k.remove.value(i,n,t),0===k.get.selectionCount()?k.set.placeholderText():k.set.text(k.add.variables(A.count))):k.remove.value(i,n,t),t.removeClass(T.filtered).removeClass(T.active),S.useLabels&&t.removeClass(T.selected)}):!1},selectedItem:function(){X.removeClass(T.selected)},value:function(e,t,n){var i,o=k.get.values();k.has.selectInput()?(k.verbose("Input is <select> removing selected option",e),i=k.remove.arrayValue(e,o),k.remove.optionValue(e)):(k.verbose("Removing from delimited values",e),i=k.remove.arrayValue(e,o),i=i.join(S.delimiter)),S.fireOnInit===!1&&k.is.initialLoad()?k.verbose("No callback on initial load",S.onRemove):S.onRemove.call(K,e,t,n),k.set.value(i,t,n),k.check.maxSelections()},arrayValue:function(t,n){return e.isArray(n)||(n=[n]),n=e.grep(n,function(e){return t!=e}),k.verbose("Removed value from delimited string",t,n),n},label:function(e,t){var n=M.find(D.label),i=n.filter("[data-"+E.value+'="'+k.escape.string(e)+'"]');k.verbose("Removing label",i),i.remove()},activeLabels:function(e){e=e||M.find(D.label).filter("."+T.active),k.verbose("Removing active label selections",e),k.remove.labels(e)},labels:function(t){t=t||M.find(D.label),k.verbose("Removing labels",t),t.each(function(){var t=e(this),n=t.data(E.value),o=n!==i?String(n):n,a=k.is.userValue(o);return S.onLabelRemove.call(t,n)===!1?void k.debug("Label remove callback cancelled removal"):(k.remove.message(),void(a?(k.remove.value(o),k.remove.label(o)):k.remove.selected(o)))})},tabbable:function(){k.is.searchSelection()?(k.debug("Searchable dropdown initialized"),V.removeAttr("tabindex"),Q.removeAttr("tabindex")):(k.debug("Simple selection dropdown initialized"),M.removeAttr("tabindex"),Q.removeAttr("tabindex"))}},has:{menuSearch:function(){return k.has.search()&&V.closest(Q).length>0},search:function(){return V.length>0},sizer:function(){return H.length>0},selectInput:function(){return U.is("select")},minCharacters:function(e){return S.minCharacters?(e=e!==i?String(e):String(k.get.query()),e.length>=S.minCharacters):!0},firstLetter:function(e,t){var n,i;return e&&0!==e.length&&"string"==typeof t?(n=k.get.choiceText(e,!1),t=t.toLowerCase(),i=String(n).charAt(0).toLowerCase(),t==i):!1},input:function(){return U.length>0},items:function(){return X.length>0},menu:function(){return Q.length>0},message:function(){return 0!==Q.children(D.message).length},label:function(e){var t=k.escape.value(e),n=M.find(D.label);return n.filter("[data-"+E.value+'="'+k.escape.string(t)+'"]').length>0},maxSelections:function(){return S.maxSelections&&k.get.selectionCount()>=S.maxSelections},allResultsFiltered:function(){var e=X.not(D.addition);return e.filter(D.unselectable).length===e.length},userSuggestion:function(){return Q.children(D.addition).length>0},query:function(){return""!==k.get.query()},value:function(t){var n=k.get.values(),i=e.isArray(n)?n&&-1!==e.inArray(t,n):n==t;return!!i}},is:{active:function(){return M.hasClass(T.active)},bubbledLabelClick:function(t){return e(t.target).is("select, input")&&M.closest("label").length>0},bubbledIconClick:function(t){return e(t.target).closest(W).length>0},alreadySetup:function(){return M.is("select")&&M.parent(D.dropdown).length>0&&0===M.prev().length},animating:function(e){return e?e.transition&&e.transition("is animating"):Q.transition&&Q.transition("is animating")},disabled:function(){return M.hasClass(T.disabled)},focused:function(){return n.activeElement===M[0]},focusedOnSearch:function(){return n.activeElement===V[0]},allFiltered:function(){return(k.is.multiple()||k.has.search())&&!(0==S.hideAdditions&&k.has.userSuggestion())&&!k.has.message()&&k.has.allResultsFiltered()},hidden:function(e){return!k.is.visible(e)},initialLoad:function(){return h},onScreen:function(e){var t,n=e||Q,i=!0,o={};return n.addClass(T.loading),t={context:{scrollTop:L.scrollTop(),height:L.outerHeight()},menu:{offset:n.offset(),height:n.outerHeight()}},k.is.verticallyScrollableContext()&&(t.menu.offset.top+=t.context.scrollTop),o={above:t.context.scrollTop<=t.menu.offset.top-t.menu.height,below:t.context.scrollTop+t.context.height>=t.menu.offset.top+t.menu.height},o.below?(k.verbose("Dropdown can fit in context downward",o),i=!0):o.below||o.above?(k.verbose("Dropdown cannot fit below, opening upward",o),i=!1):(k.verbose("Dropdown cannot fit in either direction, favoring downward",o),i=!0),n.removeClass(T.loading),i},inObject:function(t,n){var i=!1;return e.each(n,function(e,n){return n==t?(i=!0,!0):void 0}),i},multiple:function(){return M.hasClass(T.multiple)},remote:function(){return S.apiSettings&&k.can.useAPI()},single:function(){return!k.is.multiple()},selectMutation:function(t){var n=!1;return e.each(t,function(t,i){return i.target&&e(i.target).is("select")?(n=!0,!0):void 0}),n},search:function(){return M.hasClass(T.search)},searchSelection:function(){return k.has.search()&&1===V.parent(D.dropdown).length},selection:function(){return M.hasClass(T.selection)},userValue:function(t){return-1!==e.inArray(t,k.get.userValues())},upward:function(e){var t=e||M;return t.hasClass(T.upward)},visible:function(e){return e?e.hasClass(T.visible):Q.hasClass(T.visible)},verticallyScrollableContext:function(){var e=L.get(0)!==t?L.css("overflow-y"):!1;return"auto"==e||"scroll"==e}},can:{activate:function(e){return S.useLabels?!0:k.has.maxSelections()?!(!k.has.maxSelections()||!e.hasClass(T.active)):!0},click:function(){return c||"click"==S.on},extendSelect:function(){return S.allowAdditions||S.apiSettings},show:function(){return!k.is.disabled()&&(k.has.items()||k.has.message())},useAPI:function(){return e.fn.api!==i}},animate:{show:function(t,n){var o,a=n||Q,r=n?function(){}:function(){k.hideSubMenus(),k.hideOthers(),k.set.active()};t=e.isFunction(t)?t:function(){},k.verbose("Doing menu show animation",a),k.set.direction(n),o=k.get.transition(n),k.is.selection()&&k.set.scrollPosition(k.get.selectedItem(),!0),(k.is.hidden(a)||k.is.animating(a))&&("none"==o?(r(),a.transition("show"),t.call(K)):e.fn.transition!==i&&M.transition("is supported")?a.transition({animation:o+" in",debug:S.debug,verbose:S.verbose,duration:S.duration,queue:!0,onStart:r,onComplete:function(){t.call(K)}}):k.error(q.noTransition,o))},hide:function(t,n){var o=n||Q,a=(n?.9*S.duration:S.duration,n?function(){}:function(){k.can.click()&&k.unbind.intent(),k.remove.active()}),r=k.get.transition(n);t=e.isFunction(t)?t:function(){},(k.is.visible(o)||k.is.animating(o))&&(k.verbose("Doing menu hide animation",o),"none"==r?(a(),o.transition("hide"),t.call(K)):e.fn.transition!==i&&M.transition("is supported")?o.transition({animation:r+" out",duration:S.duration,debug:S.debug,verbose:S.verbose,queue:!0,onStart:a,onComplete:function(){"auto"==S.direction&&k.remove.upward(n),t.call(K)}}):k.error(q.transition))}},hideAndClear:function(){k.remove.searchTerm(),k.has.maxSelections()||(k.has.search()?k.hide(function(){k.remove.filteredItem()}):k.hide())},delay:{show:function(){k.verbose("Delaying show event to ensure user intent"),clearTimeout(k.timer),k.timer=setTimeout(k.show,S.delay.show)},hide:function(){k.verbose("Delaying hide event to ensure user intent"),clearTimeout(k.timer),k.timer=setTimeout(k.hide,S.delay.hide)}},escape:{value:function(t){var n=e.isArray(t),i="string"==typeof t,o=!i&&!n,a=i&&-1!==t.search(O.quote),r=[];return o||!a?t:(k.debug("Encoding quote values for use in select",t),n?(e.each(t,function(e,t){r.push(t.replace(O.quote,"&quot;"))}),r):t.replace(O.quote,"&quot;"))},string:function(e){return e=String(e),e.replace(O.escape,"\\$&")}},setting:function(t,n){if(k.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,S,t);else{if(n===i)return S[t];e.isPlainObject(S[t])?e.extend(!0,S[t],n):S[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,k,t);else{if(n===i)return k[t];k[t]=n}},debug:function(){!S.silent&&S.debug&&(S.performance?k.performance.log(arguments):(k.debug=Function.prototype.bind.call(console.info,console,S.name+":"),k.debug.apply(console,arguments)))},verbose:function(){!S.silent&&S.verbose&&S.debug&&(S.performance?k.performance.log(arguments):(k.verbose=Function.prototype.bind.call(console.info,console,S.name+":"),k.verbose.apply(console,arguments)))},error:function(){S.silent||(k.error=Function.prototype.bind.call(console.error,console,S.name+":"),
k.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;S.performance&&(t=(new Date).getTime(),i=u||t,n=t-i,u=t,d.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:K,"Execution Time":n})),clearTimeout(k.performance.timer),k.performance.timer=setTimeout(k.performance.display,500)},display:function(){var t=S.name+":",n=0;u=!1,clearTimeout(k.performance.timer),e.each(d,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",l&&(t+=" '"+l+"'"),(console.group!==i||console.table!==i)&&d.length>0&&(console.groupCollapsed(t),console.table?console.table(d):e.each(d,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),d=[]}},invoke:function(t,n,o){var r,s,l,c=J;return n=n||g,o=K||o,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):(k.error(q.method,t),!1);c=c[o]}})),e.isFunction(s)?l=s.apply(o,n):s!==i&&(l=s),e.isArray(a)?a.push(l):a!==i?a=[a,l]:l!==i&&(a=l),s}},m?(J===i&&k.initialize(),k.invoke(f)):(J!==i&&J.invoke("destroy"),k.initialize())}),a!==i?a:r},e.fn.dropdown.settings={silent:!1,debug:!1,verbose:!1,performance:!0,on:"click",action:"activate",apiSettings:!1,selectOnKeydown:!0,minCharacters:0,filterRemoteData:!1,saveRemoteData:!0,throttle:200,context:t,direction:"auto",keepOnScreen:!0,match:"both",fullTextSearch:!1,placeholder:"auto",preserveHTML:!0,sortSelect:!1,forceSelection:!0,allowAdditions:!1,hideAdditions:!0,maxSelections:!1,useLabels:!0,delimiter:",",showOnFocus:!0,allowReselection:!1,allowTab:!0,allowCategorySelection:!1,fireOnInit:!1,transition:"auto",duration:200,glyphWidth:1.037,label:{transition:"scale",duration:200,variation:!1},delay:{hide:300,show:200,search:20,touch:50},onChange:function(e,t,n){},onAdd:function(e,t,n){},onRemove:function(e,t,n){},onLabelSelect:function(e){},onLabelCreate:function(t,n){return e(this)},onLabelRemove:function(e){return!0},onNoResults:function(e){return!0},onShow:function(){},onHide:function(){},name:"Dropdown",namespace:"dropdown",message:{addResult:"Add <b>{term}</b>",count:"{count} selected",maxSelections:"Max {maxCount} selections",noResults:"No results found.",serverError:"There was an error contacting the server"},error:{action:"You called a dropdown action that was not defined",alreadySetup:"Once a select has been initialized behaviors must be called on the created ui dropdown",labels:"Allowing user additions currently requires the use of labels.",missingMultiple:"<select> requires multiple property to be set to correctly preserve multiple values",method:"The method you called is not defined.",noAPI:"The API module is required to load resources remotely",noStorage:"Saving remote data requires session storage",noTransition:"This module requires ui transitions <https://github.com/Semantic-Org/UI-Transition>"},regExp:{escape:/[-[\]{}()*+?.,\\^$|#\s]/g,quote:/"/g},metadata:{defaultText:"defaultText",defaultValue:"defaultValue",placeholderText:"placeholder",text:"text",value:"value"},fields:{remoteValues:"results",values:"values",disabled:"disabled",name:"name",value:"value",text:"text"},keys:{backspace:8,delimiter:188,deleteKey:46,enter:13,escape:27,pageUp:33,pageDown:34,leftArrow:37,upArrow:38,rightArrow:39,downArrow:40},selector:{addition:".addition",dropdown:".ui.dropdown",hidden:".hidden",icon:"> .dropdown.icon",input:'> input[type="hidden"], > select',item:".item",label:"> .label",remove:"> .label > .delete.icon",siblingLabel:".label",menu:".menu",message:".message",menuIcon:".dropdown.icon",search:"input.search, .menu > .search > input, .menu input.search",sizer:"> input.sizer",text:"> .text:not(.icon)",unselectable:".disabled, .filtered"},className:{active:"active",addition:"addition",animating:"animating",disabled:"disabled",empty:"empty",dropdown:"ui dropdown",filtered:"filtered",hidden:"hidden transition",item:"item",label:"ui label",loading:"loading",menu:"menu",message:"message",multiple:"multiple",placeholder:"default",sizer:"sizer",search:"search",selected:"selected",selection:"selection",upward:"upward",visible:"visible"}},e.fn.dropdown.settings.templates={dropdown:function(t){var n=t.placeholder||!1,i=(t.values||{},"");return i+='<i class="dropdown icon"></i>',i+=t.placeholder?'<div class="default text">'+n+"</div>":'<div class="text"></div>',i+='<div class="menu">',e.each(t.values,function(e,t){i+=t.disabled?'<div class="disabled item" data-value="'+t.value+'">'+t.name+"</div>":'<div class="item" data-value="'+t.value+'">'+t.name+"</div>"}),i+="</div>"},menu:function(t,n){var i=t[n.values]||{},o="";return e.each(i,function(e,t){var i=t[n.text]?'data-text="'+t[n.text]+'"':"",a=t[n.disabled]?"disabled ":"";o+='<div class="'+a+'item" data-value="'+t[n.value]+'"'+i+">",o+=t[n.name],o+="</div>"}),o},label:function(e,t){return t+'<i class="delete icon"></i>'},message:function(e){return e},addition:function(e){return e}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.embed=function(n){var o,a=e(this),r=a.selector||"",s=(new Date).getTime(),l=[],c=arguments[0],u="string"==typeof c,d=[].slice.call(arguments,1);return a.each(function(){var f,m=e.isPlainObject(n)?e.extend(!0,{},e.fn.embed.settings,n):e.extend({},e.fn.embed.settings),g=m.selector,p=m.className,h=m.sources,v=m.error,b=m.metadata,y=m.namespace,x=m.templates,C="."+y,w="module-"+y,k=(e(t),e(this)),S=k.find(g.placeholder),T=k.find(g.icon),A=k.find(g.embed),R=this,P=k.data(w);f={initialize:function(){f.debug("Initializing embed"),f.determine.autoplay(),f.create(),f.bind.events(),f.instantiate()},instantiate:function(){f.verbose("Storing instance of module",f),P=f,k.data(w,f)},destroy:function(){f.verbose("Destroying previous instance of embed"),f.reset(),k.removeData(w).off(C)},refresh:function(){f.verbose("Refreshing selector cache"),S=k.find(g.placeholder),T=k.find(g.icon),A=k.find(g.embed)},bind:{events:function(){f.has.placeholder()&&(f.debug("Adding placeholder events"),k.on("click"+C,g.placeholder,f.createAndShow).on("click"+C,g.icon,f.createAndShow))}},create:function(){var e=f.get.placeholder();e?f.createPlaceholder():f.createAndShow()},createPlaceholder:function(e){var t=f.get.icon(),n=f.get.url();f.generate.embed(n);e=e||f.get.placeholder(),k.html(x.placeholder(e,t)),f.debug("Creating placeholder for embed",e,t)},createEmbed:function(t){f.refresh(),t=t||f.get.url(),A=e("<div/>").addClass(p.embed).html(f.generate.embed(t)).appendTo(k),m.onCreate.call(R,t),f.debug("Creating embed object",A)},changeEmbed:function(e){A.html(f.generate.embed(e))},createAndShow:function(){f.createEmbed(),f.show()},change:function(e,t,n){f.debug("Changing video to ",e,t,n),k.data(b.source,e).data(b.id,t),n?k.data(b.url,n):k.removeData(b.url),f.has.embed()?f.changeEmbed():f.create()},reset:function(){f.debug("Clearing embed and showing placeholder"),f.remove.active(),f.remove.embed(),f.showPlaceholder(),m.onReset.call(R)},show:function(){f.debug("Showing embed"),f.set.active(),m.onDisplay.call(R)},hide:function(){f.debug("Hiding embed"),f.showPlaceholder()},showPlaceholder:function(){f.debug("Showing placeholder image"),f.remove.active(),m.onPlaceholderDisplay.call(R)},get:{id:function(){return m.id||k.data(b.id)},placeholder:function(){return m.placeholder||k.data(b.placeholder)},icon:function(){return m.icon?m.icon:k.data(b.icon)!==i?k.data(b.icon):f.determine.icon()},source:function(e){return m.source?m.source:k.data(b.source)!==i?k.data(b.source):f.determine.source()},type:function(){var e=f.get.source();return h[e]!==i?h[e].type:!1},url:function(){return m.url?m.url:k.data(b.url)!==i?k.data(b.url):f.determine.url()}},determine:{autoplay:function(){f.should.autoplay()&&(m.autoplay=!0)},source:function(t){var n=!1;return t=t||f.get.url(),t&&e.each(h,function(e,i){return-1!==t.search(i.domain)?(n=e,!1):void 0}),n},icon:function(){var e=f.get.source();return h[e]!==i?h[e].icon:!1},url:function(){var e,t=m.id||k.data(b.id),n=m.source||k.data(b.source);return e=h[n]!==i?h[n].url.replace("{id}",t):!1,e&&k.data(b.url,e),e}},set:{active:function(){k.addClass(p.active)}},remove:{active:function(){k.removeClass(p.active)},embed:function(){A.empty()}},encode:{parameters:function(e){var t,n=[];for(t in e)n.push(encodeURIComponent(t)+"="+encodeURIComponent(e[t]));return n.join("&amp;")}},generate:{embed:function(e){f.debug("Generating embed html");var t,n,i=f.get.source();return e=f.get.url(e),e?(n=f.generate.parameters(i),t=x.iframe(e,n)):f.error(v.noURL,k),t},parameters:function(t,n){var o=h[t]&&h[t].parameters!==i?h[t].parameters(m):{};return n=n||m.parameters,n&&(o=e.extend({},o,n)),o=m.onEmbed(o),f.encode.parameters(o)}},has:{embed:function(){return A.length>0},placeholder:function(){return m.placeholder||k.data(b.placeholder)}},should:{autoplay:function(){return"auto"===m.autoplay?m.placeholder||k.data(b.placeholder)!==i:m.autoplay}},is:{video:function(){return"video"==f.get.type()}},setting:function(t,n){if(f.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,m,t);else{if(n===i)return m[t];e.isPlainObject(m[t])?e.extend(!0,m[t],n):m[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,f,t);else{if(n===i)return f[t];f[t]=n}},debug:function(){!m.silent&&m.debug&&(m.performance?f.performance.log(arguments):(f.debug=Function.prototype.bind.call(console.info,console,m.name+":"),f.debug.apply(console,arguments)))},verbose:function(){!m.silent&&m.verbose&&m.debug&&(m.performance?f.performance.log(arguments):(f.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),f.verbose.apply(console,arguments)))},error:function(){m.silent||(f.error=Function.prototype.bind.call(console.error,console,m.name+":"),f.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;m.performance&&(t=(new Date).getTime(),i=s||t,n=t-i,s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:R,"Execution Time":n})),clearTimeout(f.performance.timer),f.performance.timer=setTimeout(f.performance.display,500)},display:function(){var t=m.name+":",n=0;s=!1,clearTimeout(f.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",r&&(t+=" '"+r+"'"),a.length>1&&(t+=" ("+a.length+")"),(console.group!==i||console.table!==i)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,a){var r,s,l,c=P;return n=n||d,a=R||a,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):(f.error(v.method,t),!1);c=c[o]}})),e.isFunction(s)?l=s.apply(a,n):s!==i&&(l=s),e.isArray(o)?o.push(l):o!==i?o=[o,l]:l!==i&&(o=l),s}},u?(P===i&&f.initialize(),f.invoke(c)):(P!==i&&P.invoke("destroy"),f.initialize())}),o!==i?o:this},e.fn.embed.settings={name:"Embed",namespace:"embed",silent:!1,debug:!1,verbose:!1,performance:!0,icon:!1,source:!1,url:!1,id:!1,autoplay:"auto",color:"#444444",hd:!0,brandedUI:!1,parameters:!1,onDisplay:function(){},onPlaceholderDisplay:function(){},onReset:function(){},onCreate:function(e){},onEmbed:function(e){return e},metadata:{id:"id",icon:"icon",placeholder:"placeholder",source:"source",url:"url"},error:{noURL:"No URL specified",method:"The method you called is not defined"},className:{active:"active",embed:"embed"},selector:{embed:".embed",placeholder:".placeholder",icon:".icon"},sources:{youtube:{name:"youtube",type:"video",icon:"video play",domain:"youtube.com",url:"//www.youtube.com/embed/{id}",parameters:function(e){return{autohide:!e.brandedUI,autoplay:e.autoplay,color:e.color||i,hq:e.hd,jsapi:e.api,modestbranding:!e.brandedUI}}},vimeo:{name:"vimeo",type:"video",icon:"video play",domain:"vimeo.com",url:"//player.vimeo.com/video/{id}",parameters:function(e){return{api:e.api,autoplay:e.autoplay,byline:e.brandedUI,color:e.color||i,portrait:e.brandedUI,title:e.brandedUI}}}},templates:{iframe:function(e,t){var n=e;return t&&(n+="?"+t),'<iframe src="'+n+'" width="100%" height="100%" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'},placeholder:function(e,t){var n="";return t&&(n+='<i class="'+t+' icon"></i>'),e&&(n+='<img class="placeholder" src="'+e+'">'),n}},api:!1,onPause:function(){},onPlay:function(){},onStop:function(){}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.modal=function(o){var a,r=e(this),s=e(t),l=e(n),c=e("body"),u=r.selector||"",d=(new Date).getTime(),f=[],m=arguments[0],g="string"==typeof m,p=[].slice.call(arguments,1),h=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)};return r.each(function(){var r,v,b,y,x,C,w,k,S,T=e.isPlainObject(o)?e.extend(!0,{},e.fn.modal.settings,o):e.extend({},e.fn.modal.settings),A=T.selector,R=T.className,P=T.namespace,E=T.error,F="."+P,O="module-"+P,D=e(this),q=e(T.context),j=D.find(A.close),z=this,I=D.data(O),M=!1;S={initialize:function(){S.verbose("Initializing dimmer",q),S.create.id(),S.create.dimmer(),S.refreshModals(),S.bind.events(),T.observeChanges&&S.observeChanges(),S.instantiate()},instantiate:function(){S.verbose("Storing instance of modal"),I=S,D.data(O,I)},create:{dimmer:function(){var t={debug:T.debug,dimmerName:"modals",duration:{show:T.duration,hide:T.duration}},n=e.extend(!0,t,T.dimmerSettings);return T.inverted&&(n.variation=n.variation!==i?n.variation+" inverted":"inverted"),e.fn.dimmer===i?void S.error(E.dimmer):(S.debug("Creating dimmer with settings",n),y=q.dimmer(n),T.detachable?(S.verbose("Modal is detachable, moving content into dimmer"),y.dimmer("add content",D)):S.set.undetached(),T.blurring&&y.addClass(R.blurring),void(x=y.dimmer("get dimmer")))},id:function(){w=(Math.random().toString(16)+"000000000").substr(2,8),C="."+w,S.verbose("Creating unique id for element",w)}},destroy:function(){S.verbose("Destroying previous modal"),D.removeData(O).off(F),s.off(C),x.off(C),j.off(F),q.dimmer("destroy")},observeChanges:function(){"MutationObserver"in t&&(k=new MutationObserver(function(e){S.debug("DOM tree modified, refreshing"),S.refresh()}),k.observe(z,{childList:!0,subtree:!0}),S.debug("Setting up mutation observer",k))},refresh:function(){S.remove.scrolling(),S.cacheSizes(),S.set.screenHeight(),S.set.type(),S.set.position()},refreshModals:function(){v=D.siblings(A.modal),r=v.add(D)},attachEvents:function(t,n){var i=e(t);n=e.isFunction(S[n])?S[n]:S.toggle,i.length>0?(S.debug("Attaching modal events to element",t,n),i.off(F).on("click"+F,n)):S.error(E.notFound,t)},bind:{events:function(){S.verbose("Attaching events"),D.on("click"+F,A.close,S.event.close).on("click"+F,A.approve,S.event.approve).on("click"+F,A.deny,S.event.deny),s.on("resize"+C,S.event.resize)}},get:{id:function(){return(Math.random().toString(16)+"000000000").substr(2,8)}},event:{approve:function(){return M||T.onApprove.call(z,e(this))===!1?void S.verbose("Approve callback returned false cancelling hide"):(M=!0,void S.hide(function(){M=!1}))},deny:function(){return M||T.onDeny.call(z,e(this))===!1?void S.verbose("Deny callback returned false cancelling hide"):(M=!0,void S.hide(function(){M=!1}))},close:function(){S.hide()},click:function(t){var i=e(t.target),o=i.closest(A.modal).length>0,a=e.contains(n.documentElement,t.target);!o&&a&&(S.debug("Dimmer clicked, hiding all modals"),S.is.active()&&(S.remove.clickaway(),T.allowMultiple?S.hide():S.hideAll()))},debounce:function(e,t){clearTimeout(S.timer),S.timer=setTimeout(e,t)},keyboard:function(e){var t=e.which,n=27;t==n&&(T.closable?(S.debug("Escape key pressed hiding modal"),S.hide()):S.debug("Escape key pressed, but closable is set to false"),e.preventDefault())},resize:function(){y.dimmer("is active")&&h(S.refresh)}},toggle:function(){S.is.active()||S.is.animating()?S.hide():S.show()},show:function(t){t=e.isFunction(t)?t:function(){},S.refreshModals(),S.showModal(t)},hide:function(t){t=e.isFunction(t)?t:function(){},S.refreshModals(),S.hideModal(t)},showModal:function(t){t=e.isFunction(t)?t:function(){},S.is.animating()||!S.is.active()?(S.showDimmer(),S.cacheSizes(),S.set.position(),S.set.screenHeight(),S.set.type(),S.set.clickaway(),!T.allowMultiple&&S.others.active()?S.hideOthers(S.showModal):(T.onShow.call(z),T.transition&&e.fn.transition!==i&&D.transition("is supported")?(S.debug("Showing modal with css animations"),D.transition({debug:T.debug,animation:T.transition+" in",queue:T.queue,duration:T.duration,useFailSafe:!0,onComplete:function(){T.onVisible.apply(z),T.keyboardShortcuts&&S.add.keyboardShortcuts(),S.save.focus(),S.set.active(),T.autofocus&&S.set.autofocus(),t()}})):S.error(E.noTransition))):S.debug("Modal is already visible")},hideModal:function(t,n){return t=e.isFunction(t)?t:function(){},S.debug("Hiding modal"),T.onHide.call(z,e(this))===!1?void S.verbose("Hide callback returned false cancelling hide"):void((S.is.animating()||S.is.active())&&(T.transition&&e.fn.transition!==i&&D.transition("is supported")?(S.remove.active(),D.transition({debug:T.debug,animation:T.transition+" out",queue:T.queue,duration:T.duration,useFailSafe:!0,onStart:function(){S.others.active()||n||S.hideDimmer(),T.keyboardShortcuts&&S.remove.keyboardShortcuts()},onComplete:function(){T.onHidden.call(z),S.restore.focus(),t()}})):S.error(E.noTransition)))},showDimmer:function(){y.dimmer("is animating")||!y.dimmer("is active")?(S.debug("Showing dimmer"),y.dimmer("show")):S.debug("Dimmer already visible")},hideDimmer:function(){return y.dimmer("is animating")||y.dimmer("is active")?void y.dimmer("hide",function(){S.remove.clickaway(),S.remove.screenHeight()}):void S.debug("Dimmer is not visible cannot hide")},hideAll:function(t){var n=r.filter("."+R.active+", ."+R.animating);t=e.isFunction(t)?t:function(){},n.length>0&&(S.debug("Hiding all visible modals"),S.hideDimmer(),n.modal("hide modal",t))},hideOthers:function(t){var n=v.filter("."+R.active+", ."+R.animating);t=e.isFunction(t)?t:function(){},n.length>0&&(S.debug("Hiding other modals",v),n.modal("hide modal",t,!0))},others:{active:function(){return v.filter("."+R.active).length>0},animating:function(){return v.filter("."+R.animating).length>0}},add:{keyboardShortcuts:function(){S.verbose("Adding keyboard shortcuts"),l.on("keyup"+F,S.event.keyboard)}},save:{focus:function(){b=e(n.activeElement).blur()}},restore:{focus:function(){b&&b.length>0&&b.focus()}},remove:{active:function(){D.removeClass(R.active)},clickaway:function(){T.closable&&x.off("click"+C)},bodyStyle:function(){""===c.attr("style")&&(S.verbose("Removing style attribute"),c.removeAttr("style"))},screenHeight:function(){S.debug("Removing page height"),c.css("height","")},keyboardShortcuts:function(){S.verbose("Removing keyboard shortcuts"),l.off("keyup"+F)},scrolling:function(){y.removeClass(R.scrolling),D.removeClass(R.scrolling)}},cacheSizes:function(){var o=D.outerHeight();S.cache!==i&&0===o||(S.cache={pageHeight:e(n).outerHeight(),height:o+T.offset,contextHeight:"body"==T.context?e(t).height():y.height()}),S.debug("Caching modal and container sizes",S.cache)},can:{fit:function(){return S.cache.height+2*T.padding<S.cache.contextHeight}},is:{active:function(){return D.hasClass(R.active)},animating:function(){return D.transition("is supported")?D.transition("is animating"):D.is(":visible")},scrolling:function(){return y.hasClass(R.scrolling)},modernBrowser:function(){return!(t.ActiveXObject||"ActiveXObject"in t)}},set:{autofocus:function(){var e=D.find("[tabindex], :input").filter(":visible"),t=e.filter("[autofocus]"),n=t.length>0?t.first():e.first();n.length>0&&n.focus()},clickaway:function(){T.closable&&x.on("click"+C,S.event.click)},screenHeight:function(){S.can.fit()?c.css("height",""):(S.debug("Modal is taller than page content, resizing page height"),c.css("height",S.cache.height+2*T.padding))},active:function(){D.addClass(R.active)},scrolling:function(){y.addClass(R.scrolling),D.addClass(R.scrolling)},type:function(){S.can.fit()?(S.verbose("Modal fits on screen"),S.others.active()||S.others.animating()||S.remove.scrolling()):(S.verbose("Modal cannot fit on screen setting to scrolling"),S.set.scrolling())},position:function(){S.verbose("Centering modal on page",S.cache),S.can.fit()?D.css({top:"",marginTop:-(S.cache.height/2)}):D.css({marginTop:"",top:l.scrollTop()})},undetached:function(){y.addClass(R.undetached)}},setting:function(t,n){if(S.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,T,t);else{if(n===i)return T[t];e.isPlainObject(T[t])?e.extend(!0,T[t],n):T[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,S,t);else{if(n===i)return S[t];S[t]=n}},debug:function(){!T.silent&&T.debug&&(T.performance?S.performance.log(arguments):(S.debug=Function.prototype.bind.call(console.info,console,T.name+":"),S.debug.apply(console,arguments)))},verbose:function(){!T.silent&&T.verbose&&T.debug&&(T.performance?S.performance.log(arguments):(S.verbose=Function.prototype.bind.call(console.info,console,T.name+":"),S.verbose.apply(console,arguments)))},error:function(){T.silent||(S.error=Function.prototype.bind.call(console.error,console,T.name+":"),S.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;T.performance&&(t=(new Date).getTime(),i=d||t,n=t-i,d=t,f.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:z,"Execution Time":n})),clearTimeout(S.performance.timer),S.performance.timer=setTimeout(S.performance.display,500)},display:function(){var t=T.name+":",n=0;d=!1,clearTimeout(S.performance.timer),e.each(f,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",u&&(t+=" '"+u+"'"),(console.group!==i||console.table!==i)&&f.length>0&&(console.groupCollapsed(t),console.table?console.table(f):e.each(f,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),f=[]}},invoke:function(t,n,o){var r,s,l,c=I;return n=n||p,o=z||o,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):!1;c=c[o]}})),e.isFunction(s)?l=s.apply(o,n):s!==i&&(l=s),e.isArray(a)?a.push(l):a!==i?a=[a,l]:l!==i&&(a=l),s}},g?(I===i&&S.initialize(),S.invoke(m)):(I!==i&&I.invoke("destroy"),S.initialize())}),a!==i?a:this},e.fn.modal.settings={name:"Modal",namespace:"modal",silent:!1,debug:!1,verbose:!1,performance:!0,observeChanges:!1,allowMultiple:!1,detachable:!0,closable:!0,autofocus:!0,inverted:!1,blurring:!1,dimmerSettings:{closable:!1,useCSS:!0},keyboardShortcuts:!0,context:"body",queue:!1,duration:500,offset:0,transition:"scale",padding:50,onShow:function(){},onVisible:function(){},onHide:function(){return!0},onHidden:function(){},onApprove:function(){return!0},onDeny:function(){return!0},selector:{close:"> .close",approve:".actions .positive, .actions .approve, .actions .ok",deny:".actions .negative, .actions .deny, .actions .cancel",modal:".ui.modal"},error:{dimmer:"UI Dimmer, a required component is not included in this page",method:"The method you called is not defined.",notFound:"The element you specified could not be found"},className:{active:"active",animating:"animating",blurring:"blurring",scrolling:"scrolling",undetached:"undetached"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.nag=function(n){var o,a=e(this),r=a.selector||"",s=(new Date).getTime(),l=[],c=arguments[0],u="string"==typeof c,d=[].slice.call(arguments,1);return a.each(function(){var a,f=e.isPlainObject(n)?e.extend(!0,{},e.fn.nag.settings,n):e.extend({},e.fn.nag.settings),m=(f.className,f.selector),g=f.error,p=f.namespace,h="."+p,v=p+"-module",b=e(this),y=(b.find(m.close),e(f.context?f.context:"body")),x=this,C=b.data(v);t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)};a={initialize:function(){a.verbose("Initializing element"),b.on("click"+h,m.close,a.dismiss).data(v,a),f.detachable&&b.parent()[0]!==y[0]&&b.detach().prependTo(y),f.displayTime>0&&setTimeout(a.hide,f.displayTime),a.show()},destroy:function(){a.verbose("Destroying instance"),b.removeData(v).off(h)},show:function(){a.should.show()&&!b.is(":visible")&&(a.debug("Showing nag",f.animation.show),"fade"==f.animation.show?b.fadeIn(f.duration,f.easing):b.slideDown(f.duration,f.easing))},hide:function(){a.debug("Showing nag",f.animation.hide),"fade"==f.animation.show?b.fadeIn(f.duration,f.easing):b.slideUp(f.duration,f.easing)},onHide:function(){a.debug("Removing nag",f.animation.hide),b.remove(),f.onHide&&f.onHide()},dismiss:function(e){f.storageMethod&&a.storage.set(f.key,f.value),a.hide(),e.stopImmediatePropagation(),e.preventDefault()},should:{show:function(){return f.persist?(a.debug("Persistent nag is set, can show nag"),!0):a.storage.get(f.key)!=f.value.toString()?(a.debug("Stored value is not set, can show nag",a.storage.get(f.key)),!0):(a.debug("Stored value is set, cannot show nag",a.storage.get(f.key)),!1)}},get:{storageOptions:function(){var e={};return f.expires&&(e.expires=f.expires),f.domain&&(e.domain=f.domain),f.path&&(e.path=f.path),e}},clear:function(){a.storage.remove(f.key)},storage:{set:function(n,o){var r=a.get.storageOptions();if("localstorage"==f.storageMethod&&t.localStorage!==i)t.localStorage.setItem(n,o),a.debug("Value stored using local storage",n,o);else if("sessionstorage"==f.storageMethod&&t.sessionStorage!==i)t.sessionStorage.setItem(n,o),a.debug("Value stored using session storage",n,o);else{if(e.cookie===i)return void a.error(g.noCookieStorage);e.cookie(n,o,r),a.debug("Value stored using cookie",n,o,r)}},get:function(n,o){var r;return"localstorage"==f.storageMethod&&t.localStorage!==i?r=t.localStorage.getItem(n):"sessionstorage"==f.storageMethod&&t.sessionStorage!==i?r=t.sessionStorage.getItem(n):e.cookie!==i?r=e.cookie(n):a.error(g.noCookieStorage),"undefined"!=r&&"null"!=r&&r!==i&&null!==r||(r=i),r},remove:function(n){var o=a.get.storageOptions();"localstorage"==f.storageMethod&&t.localStorage!==i?t.localStorage.removeItem(n):"sessionstorage"==f.storageMethod&&t.sessionStorage!==i?t.sessionStorage.removeItem(n):e.cookie!==i?e.removeCookie(n,o):a.error(g.noStorage)}},setting:function(t,n){if(a.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,f,t);else{if(n===i)return f[t];e.isPlainObject(f[t])?e.extend(!0,f[t],n):f[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,a,t);else{if(n===i)return a[t];a[t]=n}},debug:function(){!f.silent&&f.debug&&(f.performance?a.performance.log(arguments):(a.debug=Function.prototype.bind.call(console.info,console,f.name+":"),a.debug.apply(console,arguments)))},verbose:function(){!f.silent&&f.verbose&&f.debug&&(f.performance?a.performance.log(arguments):(a.verbose=Function.prototype.bind.call(console.info,console,f.name+":"),a.verbose.apply(console,arguments)))},error:function(){f.silent||(a.error=Function.prototype.bind.call(console.error,console,f.name+":"),a.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;f.performance&&(t=(new Date).getTime(),i=s||t,n=t-i,s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:x,"Execution Time":n})),clearTimeout(a.performance.timer),a.performance.timer=setTimeout(a.performance.display,500)},display:function(){var t=f.name+":",n=0;s=!1,clearTimeout(a.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",r&&(t+=" '"+r+"'"),(console.group!==i||console.table!==i)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,r){var s,l,c,u=C;return n=n||d,r=x||r,"string"==typeof t&&u!==i&&(t=t.split(/[\. ]/),s=t.length-1,e.each(t,function(n,o){var r=n!=s?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(u[r])&&n!=s)u=u[r];else{if(u[r]!==i)return l=u[r],!1;if(!e.isPlainObject(u[o])||n==s)return u[o]!==i?(l=u[o],!1):(a.error(g.method,t),!1);u=u[o]}})),e.isFunction(l)?c=l.apply(r,n):l!==i&&(c=l),e.isArray(o)?o.push(c):o!==i?o=[o,c]:c!==i&&(o=c),l}},u?(C===i&&a.initialize(),a.invoke(c)):(C!==i&&C.invoke("destroy"),a.initialize())}),o!==i?o:this},e.fn.nag.settings={name:"Nag",silent:!1,debug:!1,verbose:!1,performance:!0,namespace:"Nag",persist:!1,displayTime:0,animation:{show:"slide",hide:"slide"},context:!1,detachable:!1,expires:30,domain:!1,path:"/",storageMethod:"cookie",key:"nag",value:"dismiss",error:{noCookieStorage:"$.cookie is not included. A storage solution is required.",noStorage:"Neither $.cookie or store is defined. A storage solution is required for storing state",method:"The method you called is not defined."},className:{bottom:"bottom",fixed:"fixed"},selector:{close:".close.icon"},speed:500,easing:"easeOutQuad",onHide:function(){}},e.extend(e.easing,{easeOutQuad:function(e,t,n,i,o){return-i*(t/=o)*(t-2)+n}})}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.popup=function(o){var a,r=e(this),s=e(n),l=e(t),c=e("body"),u=r.selector||"",d=!0,f=(new Date).getTime(),m=[],g=arguments[0],p="string"==typeof g,h=[].slice.call(arguments,1);return r.each(function(){var r,v,b,y,x,C,w=e.isPlainObject(o)?e.extend(!0,{},e.fn.popup.settings,o):e.extend({},e.fn.popup.settings),k=w.selector,S=w.className,T=w.error,A=w.metadata,R=w.namespace,P="."+w.namespace,E="module-"+R,F=e(this),O=e(w.context),D=e(w.scrollContext),q=e(w.boundary),j=w.target?e(w.target):F,z=0,I=!1,M=!1,L=this,N=F.data(E);C={initialize:function(){C.debug("Initializing",F),C.createID(),C.bind.events(),!C.exists()&&w.preserve&&C.create(),w.observeChanges&&C.observeChanges(),C.instantiate()},instantiate:function(){C.verbose("Storing instance",C),N=C,F.data(E,N)},observeChanges:function(){"MutationObserver"in t&&(b=new MutationObserver(C.event.documentChanged),b.observe(n,{childList:!0,subtree:!0}),C.debug("Setting up mutation observer",b))},refresh:function(){w.popup?r=e(w.popup).eq(0):w.inline&&(r=j.nextAll(k.popup).eq(0),w.popup=r),w.popup?(r.addClass(S.loading),v=C.get.offsetParent(),r.removeClass(S.loading),w.movePopup&&C.has.popup()&&C.get.offsetParent(r)[0]!==v[0]&&(C.debug("Moving popup to the same offset parent as activating element"),r.detach().appendTo(v))):v=w.inline?C.get.offsetParent(j):C.has.popup()?C.get.offsetParent(r):c,v.is("html")&&v[0]!==c[0]&&(C.debug("Setting page as offset parent"),v=c),C.get.variation()&&C.set.variation()},reposition:function(){C.refresh(),C.set.position()},destroy:function(){C.debug("Destroying previous module"),b&&b.disconnect(),r&&!w.preserve&&C.removePopup(),clearTimeout(C.hideTimer),clearTimeout(C.showTimer),C.unbind.close(),C.unbind.events(),F.removeData(E)},event:{start:function(t){var n=e.isPlainObject(w.delay)?w.delay.show:w.delay;clearTimeout(C.hideTimer),M||(C.showTimer=setTimeout(C.show,n))},end:function(){var t=e.isPlainObject(w.delay)?w.delay.hide:w.delay;clearTimeout(C.showTimer),C.hideTimer=setTimeout(C.hide,t)},touchstart:function(e){M=!0,C.show()},resize:function(){C.is.visible()&&C.set.position()},documentChanged:function(t){[].forEach.call(t,function(t){t.removedNodes&&[].forEach.call(t.removedNodes,function(t){(t==L||e(t).find(L).length>0)&&(C.debug("Element removed from DOM, tearing down events"),
C.destroy())})})},hideGracefully:function(t){var i=e(t.target),o=e.contains(n.documentElement,t.target),a=i.closest(k.popup).length>0;t&&!a&&o?(C.debug("Click occurred outside popup hiding popup"),C.hide()):C.debug("Click was inside popup, keeping popup open")}},create:function(){var t=C.get.html(),n=C.get.title(),i=C.get.content();t||i||n?(C.debug("Creating pop-up html"),t||(t=w.templates.popup({title:n,content:i})),r=e("<div/>").addClass(S.popup).data(A.activator,F).html(t),w.inline?(C.verbose("Inserting popup element inline",r),r.insertAfter(F)):(C.verbose("Appending popup element to body",r),r.appendTo(O)),C.refresh(),C.set.variation(),w.hoverable&&C.bind.popup(),w.onCreate.call(r,L)):0!==j.next(k.popup).length?(C.verbose("Pre-existing popup found"),w.inline=!0,w.popup=j.next(k.popup).data(A.activator,F),C.refresh(),w.hoverable&&C.bind.popup()):w.popup?(e(w.popup).data(A.activator,F),C.verbose("Used popup specified in settings"),C.refresh(),w.hoverable&&C.bind.popup()):C.debug("No content specified skipping display",L)},createID:function(){x=(Math.random().toString(16)+"000000000").substr(2,8),y="."+x,C.verbose("Creating unique id for element",x)},toggle:function(){C.debug("Toggling pop-up"),C.is.hidden()?(C.debug("Popup is hidden, showing pop-up"),C.unbind.close(),C.show()):(C.debug("Popup is visible, hiding pop-up"),C.hide())},show:function(e){if(e=e||function(){},C.debug("Showing pop-up",w.transition),C.is.hidden()&&(!C.is.active()||!C.is.dropdown())){if(C.exists()||C.create(),w.onShow.call(r,L)===!1)return void C.debug("onShow callback returned false, cancelling popup animation");w.preserve||w.popup||C.refresh(),r&&C.set.position()&&(C.save.conditions(),w.exclusive&&C.hideAll(),C.animate.show(e))}},hide:function(e){if(e=e||function(){},C.is.visible()||C.is.animating()){if(w.onHide.call(r,L)===!1)return void C.debug("onHide callback returned false, cancelling popup animation");C.remove.visible(),C.unbind.close(),C.restore.conditions(),C.animate.hide(e)}},hideAll:function(){e(k.popup).filter("."+S.visible).each(function(){e(this).data(A.activator).popup("hide")})},exists:function(){return r?w.inline||w.popup?C.has.popup():r.closest(O).length>=1:!1},removePopup:function(){C.has.popup()&&!w.popup&&(C.debug("Removing popup",r),r.remove(),r=i,w.onRemove.call(r,L))},save:{conditions:function(){C.cache={title:F.attr("title")},C.cache.title&&F.removeAttr("title"),C.verbose("Saving original attributes",C.cache.title)}},restore:{conditions:function(){return C.cache&&C.cache.title&&(F.attr("title",C.cache.title),C.verbose("Restoring original attributes",C.cache.title)),!0}},supports:{svg:function(){return typeof SVGGraphicsElement===i}},animate:{show:function(t){t=e.isFunction(t)?t:function(){},w.transition&&e.fn.transition!==i&&F.transition("is supported")?(C.set.visible(),r.transition({animation:w.transition+" in",queue:!1,debug:w.debug,verbose:w.verbose,duration:w.duration,onComplete:function(){C.bind.close(),t.call(r,L),w.onVisible.call(r,L)}})):C.error(T.noTransition)},hide:function(t){return t=e.isFunction(t)?t:function(){},C.debug("Hiding pop-up"),w.onHide.call(r,L)===!1?void C.debug("onHide callback returned false, cancelling popup animation"):void(w.transition&&e.fn.transition!==i&&F.transition("is supported")?r.transition({animation:w.transition+" out",queue:!1,duration:w.duration,debug:w.debug,verbose:w.verbose,onComplete:function(){C.reset(),t.call(r,L),w.onHidden.call(r,L)}}):C.error(T.noTransition))}},change:{content:function(e){r.html(e)}},get:{html:function(){return F.removeData(A.html),F.data(A.html)||w.html},title:function(){return F.removeData(A.title),F.data(A.title)||w.title},content:function(){return F.removeData(A.content),F.data(A.content)||F.attr("title")||w.content},variation:function(){return F.removeData(A.variation),F.data(A.variation)||w.variation},popup:function(){return r},popupOffset:function(){return r.offset()},calculations:function(){var e,n=j[0],i=q[0]==t,o=w.inline||w.popup&&w.movePopup?j.position():j.offset(),a=i?{top:0,left:0}:q.offset(),s={},c=i?{top:l.scrollTop(),left:l.scrollLeft()}:{top:0,left:0};return s={target:{element:j[0],width:j.outerWidth(),height:j.outerHeight(),top:o.top,left:o.left,margin:{}},popup:{width:r.outerWidth(),height:r.outerHeight()},parent:{width:v.outerWidth(),height:v.outerHeight()},screen:{top:a.top,left:a.left,scroll:{top:c.top,left:c.left},width:q.width(),height:q.height()}},w.setFluidWidth&&C.is.fluid()&&(s.container={width:r.parent().outerWidth()},s.popup.width=s.container.width),s.target.margin.top=w.inline?parseInt(t.getComputedStyle(n).getPropertyValue("margin-top"),10):0,s.target.margin.left=w.inline?C.is.rtl()?parseInt(t.getComputedStyle(n).getPropertyValue("margin-right"),10):parseInt(t.getComputedStyle(n).getPropertyValue("margin-left"),10):0,e=s.screen,s.boundary={top:e.top+e.scroll.top,bottom:e.top+e.scroll.top+e.height,left:e.left+e.scroll.left,right:e.left+e.scroll.left+e.width},s},id:function(){return x},startEvent:function(){return"hover"==w.on?"mouseenter":"focus"==w.on?"focus":!1},scrollEvent:function(){return"scroll"},endEvent:function(){return"hover"==w.on?"mouseleave":"focus"==w.on?"blur":!1},distanceFromBoundary:function(e,t){var n,i,o={};return t=t||C.get.calculations(),n=t.popup,i=t.boundary,e&&(o={top:e.top-i.top,left:e.left-i.left,right:i.right-(e.left+n.width),bottom:i.bottom-(e.top+n.height)},C.verbose("Distance from boundaries determined",e,o)),o},offsetParent:function(t){var n=t!==i?t[0]:F[0],o=n.parentNode,a=e(o);if(o)for(var r="none"===a.css("transform"),s="static"===a.css("position"),l=a.is("html");o&&!l&&s&&r;)o=o.parentNode,a=e(o),r="none"===a.css("transform"),s="static"===a.css("position"),l=a.is("html");return a&&a.length>0?a:e()},positions:function(){return{"top left":!1,"top center":!1,"top right":!1,"bottom left":!1,"bottom center":!1,"bottom right":!1,"left center":!1,"right center":!1}},nextPosition:function(e){var t=e.split(" "),n=t[0],i=t[1],o={top:"bottom",bottom:"top",left:"right",right:"left"},a={left:"center",center:"right",right:"left"},r={"top left":"top center","top center":"top right","top right":"right center","right center":"bottom right","bottom right":"bottom center","bottom center":"bottom left","bottom left":"left center","left center":"top left"},s="top"==n||"bottom"==n,l=!1,c=!1,u=!1;return I||(C.verbose("All available positions available"),I=C.get.positions()),C.debug("Recording last position tried",e),I[e]=!0,"opposite"===w.prefer&&(u=[o[n],i],u=u.join(" "),l=I[u]===!0,C.debug("Trying opposite strategy",u)),"adjacent"===w.prefer&&s&&(u=[n,a[i]],u=u.join(" "),c=I[u]===!0,C.debug("Trying adjacent strategy",u)),(c||l)&&(C.debug("Using backup position",u),u=r[e]),u}},set:{position:function(e,t){if(0===j.length||0===r.length)return void C.error(T.notFound);var n,o,a,s,l,c,u,d;if(t=t||C.get.calculations(),e=e||F.data(A.position)||w.position,n=F.data(A.offset)||w.offset,o=w.distanceAway,a=t.target,s=t.popup,l=t.parent,0===a.width&&0===a.height&&!C.is.svg(a.element))return C.debug("Popup target is hidden, no action taken"),!1;switch(w.inline&&(C.debug("Adding margin to calculation",a.margin),"left center"==e||"right center"==e?(n+=a.margin.top,o+=-a.margin.left):"top left"==e||"top center"==e||"top right"==e?(n+=a.margin.left,o-=a.margin.top):(n+=a.margin.left,o+=a.margin.top)),C.debug("Determining popup position from calculations",e,t),C.is.rtl()&&(e=e.replace(/left|right/g,function(e){return"left"==e?"right":"left"}),C.debug("RTL: Popup position updated",e)),z==w.maxSearchDepth&&"string"==typeof w.lastResort&&(e=w.lastResort),e){case"top left":c={top:"auto",bottom:l.height-a.top+o,left:a.left+n,right:"auto"};break;case"top center":c={bottom:l.height-a.top+o,left:a.left+a.width/2-s.width/2+n,top:"auto",right:"auto"};break;case"top right":c={bottom:l.height-a.top+o,right:l.width-a.left-a.width-n,top:"auto",left:"auto"};break;case"left center":c={top:a.top+a.height/2-s.height/2+n,right:l.width-a.left+o,left:"auto",bottom:"auto"};break;case"right center":c={top:a.top+a.height/2-s.height/2+n,left:a.left+a.width+o,bottom:"auto",right:"auto"};break;case"bottom left":c={top:a.top+a.height+o,left:a.left+n,bottom:"auto",right:"auto"};break;case"bottom center":c={top:a.top+a.height+o,left:a.left+a.width/2-s.width/2+n,bottom:"auto",right:"auto"};break;case"bottom right":c={top:a.top+a.height+o,right:l.width-a.left-a.width-n,left:"auto",bottom:"auto"}}if(c===i&&C.error(T.invalidPosition,e),C.debug("Calculated popup positioning values",c),r.css(c).removeClass(S.position).addClass(e).addClass(S.loading),u=C.get.popupOffset(),d=C.get.distanceFromBoundary(u,t),C.is.offstage(d,e)){if(C.debug("Position is outside viewport",e),z<w.maxSearchDepth)return z++,e=C.get.nextPosition(e),C.debug("Trying new position",e),r?C.set.position(e,t):!1;if(!w.lastResort)return C.debug("Popup could not find a position to display",r),C.error(T.cannotPlace,L),C.remove.attempts(),C.remove.loading(),C.reset(),w.onUnplaceable.call(r,L),!1;C.debug("No position found, showing with last position")}return C.debug("Position is on stage",e),C.remove.attempts(),C.remove.loading(),w.setFluidWidth&&C.is.fluid()&&C.set.fluidWidth(t),!0},fluidWidth:function(e){e=e||C.get.calculations(),C.debug("Automatically setting element width to parent width",e.parent.width),r.css("width",e.container.width)},variation:function(e){e=e||C.get.variation(),e&&C.has.popup()&&(C.verbose("Adding variation to popup",e),r.addClass(e))},visible:function(){F.addClass(S.visible)}},remove:{loading:function(){r.removeClass(S.loading)},variation:function(e){e=e||C.get.variation(),e&&(C.verbose("Removing variation",e),r.removeClass(e))},visible:function(){F.removeClass(S.visible)},attempts:function(){C.verbose("Resetting all searched positions"),z=0,I=!1}},bind:{events:function(){C.debug("Binding popup events to module"),"click"==w.on&&F.on("click"+P,C.toggle),"hover"==w.on&&d&&F.on("touchstart"+P,C.event.touchstart),C.get.startEvent()&&F.on(C.get.startEvent()+P,C.event.start).on(C.get.endEvent()+P,C.event.end),w.target&&C.debug("Target set to element",j),l.on("resize"+y,C.event.resize)},popup:function(){C.verbose("Allowing hover events on popup to prevent closing"),r&&C.has.popup()&&r.on("mouseenter"+P,C.event.start).on("mouseleave"+P,C.event.end)},close:function(){(w.hideOnScroll===!0||"auto"==w.hideOnScroll&&"click"!=w.on)&&D.one(C.get.scrollEvent()+y,C.event.hideGracefully),"hover"==w.on&&M&&(C.verbose("Binding popup close event to document"),s.on("touchstart"+y,function(e){C.verbose("Touched away from popup"),C.event.hideGracefully.call(L,e)})),"click"==w.on&&w.closable&&(C.verbose("Binding popup close event to document"),s.on("click"+y,function(e){C.verbose("Clicked away from popup"),C.event.hideGracefully.call(L,e)}))}},unbind:{events:function(){l.off(y),F.off(P)},close:function(){s.off(y),D.off(y)}},has:{popup:function(){return r&&r.length>0}},is:{offstage:function(t,n){var i=[];return e.each(t,function(e,t){t<-w.jitter&&(C.debug("Position exceeds allowable distance from edge",e,t,n),i.push(e))}),i.length>0},svg:function(e){return C.supports.svg()&&e instanceof SVGGraphicsElement},active:function(){return F.hasClass(S.active)},animating:function(){return r!==i&&r.hasClass(S.animating)},fluid:function(){return r!==i&&r.hasClass(S.fluid)},visible:function(){return r!==i&&r.hasClass(S.visible)},dropdown:function(){return F.hasClass(S.dropdown)},hidden:function(){return!C.is.visible()},rtl:function(){return"rtl"==F.css("direction")}},reset:function(){C.remove.visible(),w.preserve?e.fn.transition!==i&&r.transition("remove transition"):C.removePopup()},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,w,t);else{if(n===i)return w[t];w[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,C,t);else{if(n===i)return C[t];C[t]=n}},debug:function(){!w.silent&&w.debug&&(w.performance?C.performance.log(arguments):(C.debug=Function.prototype.bind.call(console.info,console,w.name+":"),C.debug.apply(console,arguments)))},verbose:function(){!w.silent&&w.verbose&&w.debug&&(w.performance?C.performance.log(arguments):(C.verbose=Function.prototype.bind.call(console.info,console,w.name+":"),C.verbose.apply(console,arguments)))},error:function(){w.silent||(C.error=Function.prototype.bind.call(console.error,console,w.name+":"),C.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;w.performance&&(t=(new Date).getTime(),i=f||t,n=t-i,f=t,m.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:L,"Execution Time":n})),clearTimeout(C.performance.timer),C.performance.timer=setTimeout(C.performance.display,500)},display:function(){var t=w.name+":",n=0;f=!1,clearTimeout(C.performance.timer),e.each(m,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",u&&(t+=" '"+u+"'"),(console.group!==i||console.table!==i)&&m.length>0&&(console.groupCollapsed(t),console.table?console.table(m):e.each(m,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),m=[]}},invoke:function(t,n,o){var r,s,l,c=N;return n=n||h,o=L||o,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):!1;c=c[o]}})),e.isFunction(s)?l=s.apply(o,n):s!==i&&(l=s),e.isArray(a)?a.push(l):a!==i?a=[a,l]:l!==i&&(a=l),s}},p?(N===i&&C.initialize(),C.invoke(g)):(N!==i&&N.invoke("destroy"),C.initialize())}),a!==i?a:this},e.fn.popup.settings={name:"Popup",silent:!1,debug:!1,verbose:!1,performance:!0,namespace:"popup",observeChanges:!0,onCreate:function(){},onRemove:function(){},onShow:function(){},onVisible:function(){},onHide:function(){},onUnplaceable:function(){},onHidden:function(){},on:"hover",boundary:t,addTouchEvents:!0,position:"top left",variation:"",movePopup:!0,target:!1,popup:!1,inline:!1,preserve:!1,hoverable:!1,content:!1,html:!1,title:!1,closable:!0,hideOnScroll:"auto",exclusive:!1,context:"body",scrollContext:t,prefer:"opposite",lastResort:!1,delay:{show:50,hide:70},setFluidWidth:!0,duration:200,transition:"scale",distanceAway:0,jitter:2,offset:0,maxSearchDepth:15,error:{invalidPosition:"The position you specified is not a valid position",cannotPlace:"Popup does not fit within the boundaries of the viewport",method:"The method you called is not defined.",noTransition:"This module requires ui transitions <https://github.com/Semantic-Org/UI-Transition>",notFound:"The target or popup you specified does not exist on the page"},metadata:{activator:"activator",content:"content",html:"html",offset:"offset",position:"position",title:"title",variation:"variation"},className:{active:"active",animating:"animating",dropdown:"dropdown",fluid:"fluid",loading:"loading",popup:"ui popup",position:"top left center bottom right",visible:"visible"},selector:{popup:".ui.popup"},templates:{escape:function(e){var t=/[&<>"'`]/g,n=/[&<>"'`]/,i={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},o=function(e){return i[e]};return n.test(e)?e.replace(t,o):e},popup:function(t){var n="",o=e.fn.popup.settings.templates.escape;return typeof t!==i&&(typeof t.title!==i&&t.title&&(t.title=o(t.title),n+='<div class="header">'+t.title+"</div>"),typeof t.content!==i&&t.content&&(t.content=o(t.content),n+='<div class="content">'+t.content+"</div>")),n}}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();e.fn.progress=function(t){var o,a=e(this),r=a.selector||"",s=(new Date).getTime(),l=[],c=arguments[0],u="string"==typeof c,d=[].slice.call(arguments,1);return a.each(function(){var a,f,m=e.isPlainObject(t)?e.extend(!0,{},e.fn.progress.settings,t):e.extend({},e.fn.progress.settings),g=m.className,p=m.metadata,h=m.namespace,v=m.selector,b=m.error,y="."+h,x="module-"+h,C=e(this),w=e(this).find(v.bar),k=e(this).find(v.progress),S=e(this).find(v.label),T=this,A=C.data(x),R=!1;f={initialize:function(){f.debug("Initializing progress bar",m),f.set.duration(),f.set.transitionEvent(),f.read.metadata(),f.read.settings(),f.instantiate()},instantiate:function(){f.verbose("Storing instance of progress",f),A=f,C.data(x,f)},destroy:function(){f.verbose("Destroying previous progress for",C),clearInterval(A.interval),f.remove.state(),C.removeData(x),A=i},reset:function(){f.remove.nextValue(),f.update.progress(0)},complete:function(){(f.percent===i||f.percent<100)&&(f.remove.progressPoll(),f.set.percent(100))},read:{metadata:function(){var e={percent:C.data(p.percent),total:C.data(p.total),value:C.data(p.value)};e.percent&&(f.debug("Current percent value set from metadata",e.percent),f.set.percent(e.percent)),e.total&&(f.debug("Total value set from metadata",e.total),f.set.total(e.total)),e.value&&(f.debug("Current value set from metadata",e.value),f.set.value(e.value),f.set.progress(e.value))},settings:function(){m.total!==!1&&(f.debug("Current total set in settings",m.total),f.set.total(m.total)),m.value!==!1&&(f.debug("Current value set in settings",m.value),f.set.value(m.value),f.set.progress(f.value)),m.percent!==!1&&(f.debug("Current percent set in settings",m.percent),f.set.percent(m.percent))}},bind:{transitionEnd:function(e){var t=f.get.transitionEnd();w.one(t+y,function(t){clearTimeout(f.failSafeTimer),e.call(this,t)}),f.failSafeTimer=setTimeout(function(){w.triggerHandler(t)},m.duration+m.failSafeDelay),f.verbose("Adding fail safe timer",f.timer)}},increment:function(e){var t,n,i;f.has.total()?(n=f.get.value(),e=e||1,i=n+e):(n=f.get.percent(),e=e||f.get.randomValue(),i=n+e,t=100,f.debug("Incrementing percentage by",n,i)),i=f.get.normalizedValue(i),f.set.progress(i)},decrement:function(e){var t,n,i=f.get.total();i?(t=f.get.value(),e=e||1,n=t-e,f.debug("Decrementing value by",e,t)):(t=f.get.percent(),e=e||f.get.randomValue(),n=t-e,f.debug("Decrementing percentage by",e,t)),n=f.get.normalizedValue(n),f.set.progress(n)},has:{progressPoll:function(){return f.progressPoll},total:function(){return f.get.total()!==!1}},get:{text:function(e){var t=f.value||0,n=f.total||0,i=R?f.get.displayPercent():f.percent||0,o=f.total>0?n-t:100-i;return e=e||"",e=e.replace("{value}",t).replace("{total}",n).replace("{left}",o).replace("{percent}",i),f.verbose("Adding variables to progress bar text",e),e},normalizedValue:function(e){if(0>e)return f.debug("Value cannot decrement below 0"),0;if(f.has.total()){if(e>f.total)return f.debug("Value cannot increment above total",f.total),f.total}else if(e>100)return f.debug("Value cannot increment above 100 percent"),100;return e},updateInterval:function(){return"auto"==m.updateInterval?m.duration:m.updateInterval},randomValue:function(){return f.debug("Generating random increment percentage"),Math.floor(Math.random()*m.random.max+m.random.min)},numericValue:function(e){return"string"==typeof e?""!==e.replace(/[^\d.]/g,"")?+e.replace(/[^\d.]/g,""):!1:e},transitionEnd:function(){var e,t=n.createElement("element"),o={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(e in o)if(t.style[e]!==i)return o[e]},displayPercent:function(){var e=w.width(),t=C.width(),n=parseInt(w.css("min-width"),10),i=e>n?e/t*100:f.percent;return m.precision>0?Math.round(i*(10*m.precision))/(10*m.precision):Math.round(i)},percent:function(){return f.percent||0},value:function(){return f.nextValue||f.value||0},total:function(){return f.total||!1}},create:{progressPoll:function(){f.progressPoll=setTimeout(function(){f.update.toNextValue(),f.remove.progressPoll()},f.get.updateInterval())}},is:{complete:function(){return f.is.success()||f.is.warning()||f.is.error()},success:function(){return C.hasClass(g.success)},warning:function(){return C.hasClass(g.warning)},error:function(){return C.hasClass(g.error)},active:function(){return C.hasClass(g.active)},visible:function(){return C.is(":visible")}},remove:{progressPoll:function(){f.verbose("Removing progress poll timer"),f.progressPoll&&(clearTimeout(f.progressPoll),delete f.progressPoll)},nextValue:function(){f.verbose("Removing progress value stored for next update"),delete f.nextValue},state:function(){f.verbose("Removing stored state"),delete f.total,delete f.percent,delete f.value},active:function(){f.verbose("Removing active state"),C.removeClass(g.active)},success:function(){f.verbose("Removing success state"),C.removeClass(g.success)},warning:function(){f.verbose("Removing warning state"),C.removeClass(g.warning)},error:function(){f.verbose("Removing error state"),C.removeClass(g.error)}},set:{barWidth:function(e){e>100?f.error(b.tooHigh,e):0>e?f.error(b.tooLow,e):(w.css("width",e+"%"),C.attr("data-percent",parseInt(e,10)))},duration:function(e){e=e||m.duration,e="number"==typeof e?e+"ms":e,f.verbose("Setting progress bar transition duration",e),w.css({"transition-duration":e})},percent:function(e){e="string"==typeof e?+e.replace("%",""):e,e=m.precision>0?Math.round(e*(10*m.precision))/(10*m.precision):Math.round(e),f.percent=e,f.has.total()||(f.value=m.precision>0?Math.round(e/100*f.total*(10*m.precision))/(10*m.precision):Math.round(e/100*f.total*10)/10,m.limitValues&&(f.value=f.value>100?100:f.value<0?0:f.value)),f.set.barWidth(e),f.set.labelInterval(),f.set.labels(),m.onChange.call(T,e,f.value,f.total)},labelInterval:function(){var t=function(){f.verbose("Bar finished animating, removing continuous label updates"),clearInterval(f.interval),R=!1,f.set.labels()};clearInterval(f.interval),f.bind.transitionEnd(t),R=!0,f.interval=setInterval(function(){var t=e.contains(n.documentElement,T);t||(clearInterval(f.interval),R=!1),f.set.labels()},m.framerate)},labels:function(){f.verbose("Setting both bar progress and outer label text"),f.set.barLabel(),f.set.state()},label:function(e){e=e||"",e&&(e=f.get.text(e),f.verbose("Setting label to text",e),S.text(e))},state:function(e){e=e!==i?e:f.percent,100===e?m.autoSuccess&&!(f.is.warning()||f.is.error()||f.is.success())?(f.set.success(),f.debug("Automatically triggering success at 100%")):(f.verbose("Reached 100% removing active state"),f.remove.active(),f.remove.progressPoll()):e>0?(f.verbose("Adjusting active progress bar label",e),f.set.active()):(f.remove.active(),f.set.label(m.text.active))},barLabel:function(e){e!==i?k.text(f.get.text(e)):"ratio"==m.label&&f.total?(f.verbose("Adding ratio to bar label"),k.text(f.get.text(m.text.ratio))):"percent"==m.label&&(f.verbose("Adding percentage to bar label"),k.text(f.get.text(m.text.percent)))},active:function(e){e=e||m.text.active,f.debug("Setting active state"),m.showActivity&&!f.is.active()&&C.addClass(g.active),f.remove.warning(),f.remove.error(),f.remove.success(),e=m.onLabelUpdate("active",e,f.value,f.total),e&&f.set.label(e),f.bind.transitionEnd(function(){m.onActive.call(T,f.value,f.total)})},success:function(e){e=e||m.text.success||m.text.active,f.debug("Setting success state"),C.addClass(g.success),f.remove.active(),f.remove.warning(),f.remove.error(),f.complete(),m.text.success?(e=m.onLabelUpdate("success",e,f.value,f.total),f.set.label(e)):(e=m.onLabelUpdate("active",e,f.value,f.total),f.set.label(e)),f.bind.transitionEnd(function(){m.onSuccess.call(T,f.total)})},warning:function(e){e=e||m.text.warning,f.debug("Setting warning state"),C.addClass(g.warning),f.remove.active(),f.remove.success(),f.remove.error(),f.complete(),e=m.onLabelUpdate("warning",e,f.value,f.total),e&&f.set.label(e),f.bind.transitionEnd(function(){m.onWarning.call(T,f.value,f.total)})},error:function(e){e=e||m.text.error,f.debug("Setting error state"),C.addClass(g.error),f.remove.active(),f.remove.success(),f.remove.warning(),f.complete(),e=m.onLabelUpdate("error",e,f.value,f.total),e&&f.set.label(e),f.bind.transitionEnd(function(){m.onError.call(T,f.value,f.total)})},transitionEvent:function(){a=f.get.transitionEnd()},total:function(e){f.total=e},value:function(e){f.value=e},progress:function(e){f.has.progressPoll()?(f.debug("Updated within interval, setting next update to use new value",e),f.set.nextValue(e)):(f.debug("First update in progress update interval, immediately updating",e),f.update.progress(e),f.create.progressPoll())},nextValue:function(e){f.nextValue=e}},update:{toNextValue:function(){var e=f.nextValue;e&&(f.debug("Update interval complete using last updated value",e),f.update.progress(e),f.remove.nextValue())},progress:function(e){var t;e=f.get.numericValue(e),e===!1&&f.error(b.nonNumeric,e),e=f.get.normalizedValue(e),f.has.total()?(f.set.value(e),t=e/f.total*100,f.debug("Calculating percent complete from total",t),f.set.percent(t)):(t=e,f.debug("Setting value to exact percentage value",t),f.set.percent(t))}},setting:function(t,n){if(f.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,m,t);else{if(n===i)return m[t];e.isPlainObject(m[t])?e.extend(!0,m[t],n):m[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,f,t);else{if(n===i)return f[t];f[t]=n}},debug:function(){!m.silent&&m.debug&&(m.performance?f.performance.log(arguments):(f.debug=Function.prototype.bind.call(console.info,console,m.name+":"),f.debug.apply(console,arguments)))},verbose:function(){!m.silent&&m.verbose&&m.debug&&(m.performance?f.performance.log(arguments):(f.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),f.verbose.apply(console,arguments)))},error:function(){m.silent||(f.error=Function.prototype.bind.call(console.error,console,m.name+":"),f.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;m.performance&&(t=(new Date).getTime(),i=s||t,n=t-i,s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:T,"Execution Time":n})),clearTimeout(f.performance.timer),f.performance.timer=setTimeout(f.performance.display,500)},display:function(){var t=m.name+":",n=0;s=!1,clearTimeout(f.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",r&&(t+=" '"+r+"'"),(console.group!==i||console.table!==i)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,a){var r,s,l,c=A;return n=n||d,a=T||a,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):(f.error(b.method,t),!1);c=c[o]}})),e.isFunction(s)?l=s.apply(a,n):s!==i&&(l=s),e.isArray(o)?o.push(l):o!==i?o=[o,l]:l!==i&&(o=l),s}},u?(A===i&&f.initialize(),f.invoke(c)):(A!==i&&A.invoke("destroy"),f.initialize())}),o!==i?o:this},e.fn.progress.settings={name:"Progress",namespace:"progress",silent:!1,debug:!1,verbose:!1,performance:!0,random:{min:2,max:5},duration:300,updateInterval:"auto",autoSuccess:!0,showActivity:!0,limitValues:!0,label:"percent",precision:0,framerate:1e3/30,percent:!1,total:!1,value:!1,failSafeDelay:100,onLabelUpdate:function(e,t,n,i){return t},onChange:function(e,t,n){},onSuccess:function(e){},onActive:function(e,t){},onError:function(e,t){},onWarning:function(e,t){},error:{method:"The method you called is not defined.",nonNumeric:"Progress value is non numeric",tooHigh:"Value specified is above 100%",tooLow:"Value specified is below 0%"},regExp:{variable:/\{\$*[A-z0-9]+\}/g},metadata:{percent:"percent",total:"total",value:"value"},selector:{bar:"> .bar",label:"> .label",progress:".bar > .progress"},text:{active:!1,error:!1,success:!1,warning:!1,percent:"{percent}%",ratio:"{value} of {total}"},className:{active:"active",error:"error",success:"success",warning:"warning"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.rating=function(t){var n,o=e(this),a=o.selector||"",r=(new Date).getTime(),s=[],l=arguments[0],c="string"==typeof l,u=[].slice.call(arguments,1);return o.each(function(){var d,f,m=e.isPlainObject(t)?e.extend(!0,{},e.fn.rating.settings,t):e.extend({},e.fn.rating.settings),g=m.namespace,p=m.className,h=m.metadata,v=m.selector,b=(m.error,"."+g),y="module-"+g,x=this,C=e(this).data(y),w=e(this),k=w.find(v.icon);f={initialize:function(){f.verbose("Initializing rating module",m),0===k.length&&f.setup.layout(),m.interactive?f.enable():f.disable(),f.set.initialLoad(),f.set.rating(f.get.initialRating()),f.remove.initialLoad(),f.instantiate()},instantiate:function(){f.verbose("Instantiating module",m),C=f,w.data(y,f)},destroy:function(){f.verbose("Destroying previous instance",C),f.remove.events(),w.removeData(y)},refresh:function(){k=w.find(v.icon)},setup:{layout:function(){var t=f.get.maxRating(),n=e.fn.rating.settings.templates.icon(t);f.debug("Generating icon html dynamically"),w.html(n),f.refresh()}},event:{mouseenter:function(){var t=e(this);t.nextAll().removeClass(p.selected),w.addClass(p.selected),t.addClass(p.selected).prevAll().addClass(p.selected)},mouseleave:function(){w.removeClass(p.selected),k.removeClass(p.selected)},click:function(){var t=e(this),n=f.get.rating(),i=k.index(t)+1,o="auto"==m.clearable?1===k.length:m.clearable;o&&n==i?f.clearRating():f.set.rating(i)}},clearRating:function(){f.debug("Clearing current rating"),f.set.rating(0)},bind:{events:function(){f.verbose("Binding events"),w.on("mouseenter"+b,v.icon,f.event.mouseenter).on("mouseleave"+b,v.icon,f.event.mouseleave).on("click"+b,v.icon,f.event.click)}},remove:{events:function(){f.verbose("Removing events"),w.off(b)},initialLoad:function(){d=!1}},enable:function(){f.debug("Setting rating to interactive mode"),f.bind.events(),w.removeClass(p.disabled)},disable:function(){f.debug("Setting rating to read-only mode"),f.remove.events(),w.addClass(p.disabled)},is:{initialLoad:function(){return d}},get:{initialRating:function(){return w.data(h.rating)!==i?(w.removeData(h.rating),w.data(h.rating)):m.initialRating},maxRating:function(){return w.data(h.maxRating)!==i?(w.removeData(h.maxRating),w.data(h.maxRating)):m.maxRating},rating:function(){var e=k.filter("."+p.active).length;return f.verbose("Current rating retrieved",e),e}},set:{rating:function(e){var t=e-1>=0?e-1:0,n=k.eq(t);w.removeClass(p.selected),k.removeClass(p.selected).removeClass(p.active),e>0&&(f.verbose("Setting current rating to",e),n.prevAll().addBack().addClass(p.active)),f.is.initialLoad()||m.onRate.call(x,e)},initialLoad:function(){d=!0}},setting:function(t,n){if(f.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,m,t);else{if(n===i)return m[t];e.isPlainObject(m[t])?e.extend(!0,m[t],n):m[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,f,t);else{if(n===i)return f[t];f[t]=n}},debug:function(){!m.silent&&m.debug&&(m.performance?f.performance.log(arguments):(f.debug=Function.prototype.bind.call(console.info,console,m.name+":"),f.debug.apply(console,arguments)))},verbose:function(){!m.silent&&m.verbose&&m.debug&&(m.performance?f.performance.log(arguments):(f.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),f.verbose.apply(console,arguments)))},error:function(){m.silent||(f.error=Function.prototype.bind.call(console.error,console,m.name+":"),f.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;m.performance&&(t=(new Date).getTime(),i=r||t,n=t-i,r=t,s.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:x,"Execution Time":n})),clearTimeout(f.performance.timer),f.performance.timer=setTimeout(f.performance.display,500)},display:function(){var t=m.name+":",n=0;r=!1,clearTimeout(f.performance.timer),e.each(s,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",a&&(t+=" '"+a+"'"),o.length>1&&(t+=" ("+o.length+")"),(console.group!==i||console.table!==i)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){
console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,o,a){var r,s,l,c=C;return o=o||u,a=x||a,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):!1;c=c[o]}})),e.isFunction(s)?l=s.apply(a,o):s!==i&&(l=s),e.isArray(n)?n.push(l):n!==i?n=[n,l]:l!==i&&(n=l),s}},c?(C===i&&f.initialize(),f.invoke(l)):(C!==i&&C.invoke("destroy"),f.initialize())}),n!==i?n:this},e.fn.rating.settings={name:"Rating",namespace:"rating",slent:!1,debug:!1,verbose:!1,performance:!0,initialRating:0,interactive:!0,maxRating:4,clearable:"auto",fireOnInit:!1,onRate:function(e){},error:{method:"The method you called is not defined",noMaximum:"No maximum rating specified. Cannot generate HTML automatically"},metadata:{rating:"rating",maxRating:"maxRating"},className:{active:"active",disabled:"disabled",selected:"selected",loading:"loading"},selector:{icon:".icon"},templates:{icon:function(e){for(var t=1,n="";e>=t;)n+='<i class="icon"></i>',t++;return n}}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.search=function(o){var a,r=e(this),s=r.selector||"",l=(new Date).getTime(),c=[],u=arguments[0],d="string"==typeof u,f=[].slice.call(arguments,1);return e(this).each(function(){var m,g=e.isPlainObject(o)?e.extend(!0,{},e.fn.search.settings,o):e.extend({},e.fn.search.settings),p=g.className,h=g.metadata,v=g.regExp,b=g.fields,y=g.selector,x=g.error,C=g.namespace,w="."+C,k=C+"-module",S=e(this),T=S.find(y.prompt),A=S.find(y.searchButton),R=S.find(y.results),P=S.find(y.result),E=S.find(y.category),F=this,O=S.data(k),D=!1,q=!1;m={initialize:function(){m.verbose("Initializing module"),m.determine.searchFields(),m.bind.events(),m.set.type(),m.create.results(),m.instantiate()},instantiate:function(){m.verbose("Storing instance of module",m),O=m,S.data(k,m)},destroy:function(){m.verbose("Destroying instance"),S.off(w).removeData(k)},refresh:function(){m.debug("Refreshing selector cache"),T=S.find(y.prompt),A=S.find(y.searchButton),E=S.find(y.category),R=S.find(y.results),P=S.find(y.result)},refreshResults:function(){R=S.find(y.results),P=S.find(y.result)},bind:{events:function(){m.verbose("Binding events to search"),g.automatic&&(S.on(m.get.inputEvent()+w,y.prompt,m.event.input),T.attr("autocomplete","off")),S.on("focus"+w,y.prompt,m.event.focus).on("blur"+w,y.prompt,m.event.blur).on("keydown"+w,y.prompt,m.handleKeyboard).on("click"+w,y.searchButton,m.query).on("mousedown"+w,y.results,m.event.result.mousedown).on("mouseup"+w,y.results,m.event.result.mouseup).on("click"+w,y.result,m.event.result.click)}},determine:{searchFields:function(){o&&o.searchFields!==i&&(g.searchFields=o.searchFields)}},event:{input:function(){clearTimeout(m.timer),m.timer=setTimeout(m.query,g.searchDelay)},focus:function(){m.set.focus(),g.searchOnFocus&&m.has.minimumCharacters()&&m.query(function(){m.can.show()&&m.showResults()})},blur:function(e){var t=n.activeElement===this,i=function(){m.cancel.query(),m.remove.focus(),m.timer=setTimeout(m.hideResults,g.hideDelay)};t||(q=!1,m.resultsClicked?(m.debug("Determining if user action caused search to close"),S.one("click.close"+w,y.results,function(e){return m.is.inMessage(e)||D?void T.focus():(D=!1,void(m.is.animating()||m.is.hidden()||i()))})):(m.debug("Input blurred without user action, closing results"),i()))},result:{mousedown:function(){m.resultsClicked=!0},mouseup:function(){m.resultsClicked=!1},click:function(n){m.debug("Search result selected");var i=e(this),o=i.find(y.title).eq(0),a=i.is("a[href]")?i:i.find("a[href]").eq(0),r=a.attr("href")||!1,s=a.attr("target")||!1,l=(o.html(),o.length>0?o.text():!1),c=m.get.results(),u=i.data(h.result)||m.get.result(l,c);return e.isFunction(g.onSelect)&&g.onSelect.call(F,u,c)===!1?(m.debug("Custom onSelect callback cancelled default select action"),void(D=!0)):(m.hideResults(),l&&m.set.value(l),void(r&&(m.verbose("Opening search link found in result",a),"_blank"==s||n.ctrlKey?t.open(r):t.location.href=r)))}}},handleKeyboard:function(e){var t,n=S.find(y.result),i=S.find(y.category),o=n.filter("."+p.active),a=n.index(o),r=n.length,s=o.length>0,l=e.which,c={backspace:8,enter:13,escape:27,upArrow:38,downArrow:40};if(l==c.escape&&(m.verbose("Escape key pressed, blurring search field"),m.hideResults(),q=!0),m.is.visible())if(l==c.enter){if(m.verbose("Enter key pressed, selecting active result"),n.filter("."+p.active).length>0)return m.event.result.click.call(n.filter("."+p.active),e),e.preventDefault(),!1}else l==c.upArrow&&s?(m.verbose("Up key pressed, changing active result"),t=0>a-1?a:a-1,i.removeClass(p.active),n.removeClass(p.active).eq(t).addClass(p.active).closest(i).addClass(p.active),e.preventDefault()):l==c.downArrow&&(m.verbose("Down key pressed, changing active result"),t=a+1>=r?a:a+1,i.removeClass(p.active),n.removeClass(p.active).eq(t).addClass(p.active).closest(i).addClass(p.active),e.preventDefault());else l==c.enter&&(m.verbose("Enter key pressed, executing query"),m.query(),m.set.buttonPressed(),T.one("keyup",m.remove.buttonFocus))},setup:{api:function(t,n){var i={debug:g.debug,on:!1,cache:!0,action:"search",urlData:{query:t},onSuccess:function(e){m.parse.response.call(F,e,t),n()},onFailure:function(){m.displayMessage(x.serverError),n()},onAbort:function(e){},onError:m.error};e.extend(!0,i,g.apiSettings),m.verbose("Setting up API request",i),S.api(i)}},can:{useAPI:function(){return e.fn.api!==i},show:function(){return m.is.focused()&&!m.is.visible()&&!m.is.empty()},transition:function(){return g.transition&&e.fn.transition!==i&&S.transition("is supported")}},is:{animating:function(){return R.hasClass(p.animating)},hidden:function(){return R.hasClass(p.hidden)},inMessage:function(t){if(t.target){var i=e(t.target),o=e.contains(n.documentElement,t.target);return o&&i.closest(y.message).length>0}},empty:function(){return""===R.html()},visible:function(){return R.filter(":visible").length>0},focused:function(){return T.filter(":focus").length>0}},get:{inputEvent:function(){var e=T[0],t=e!==i&&e.oninput!==i?"input":e!==i&&e.onpropertychange!==i?"propertychange":"keyup";return t},value:function(){return T.val()},results:function(){var e=S.data(h.results);return e},result:function(t,n){var o=["title","id"],a=!1;return t=t!==i?t:m.get.value(),n=n!==i?n:m.get.results(),"category"===g.type?(m.debug("Finding result that matches",t),e.each(n,function(n,i){return e.isArray(i.results)&&(a=m.search.object(t,i.results,o)[0])?!1:void 0})):(m.debug("Finding result in results object",t),a=m.search.object(t,n,o)[0]),a||!1}},select:{firstResult:function(){m.verbose("Selecting first result"),P.first().addClass(p.active)}},set:{focus:function(){S.addClass(p.focus)},loading:function(){S.addClass(p.loading)},value:function(e){m.verbose("Setting search input value",e),T.val(e)},type:function(e){e=e||g.type,"category"==g.type&&S.addClass(g.type)},buttonPressed:function(){A.addClass(p.pressed)}},remove:{loading:function(){S.removeClass(p.loading)},focus:function(){S.removeClass(p.focus)},buttonPressed:function(){A.removeClass(p.pressed)}},query:function(t){t=e.isFunction(t)?t:function(){};var n=m.get.value(),i=m.read.cache(n);t=t||function(){},m.has.minimumCharacters()?(i?(m.debug("Reading result from cache",n),m.save.results(i.results),m.addResults(i.html),m.inject.id(i.results),t()):(m.debug("Querying for",n),e.isPlainObject(g.source)||e.isArray(g.source)?(m.search.local(n),t()):m.can.useAPI()?m.search.remote(n,t):(m.error(x.source),t())),g.onSearchQuery.call(F,n)):m.hideResults()},search:{local:function(e){var t,n=m.search.object(e,g.content);m.set.loading(),m.save.results(n),m.debug("Returned local search results",n),t=m.generateResults({results:n}),m.remove.loading(),m.addResults(t),m.inject.id(n),m.write.cache(e,{html:t,results:n})},remote:function(t,n){n=e.isFunction(n)?n:function(){},S.api("is loading")&&S.api("abort"),m.setup.api(t,n),S.api("query")},object:function(t,n,o){var a=[],r=[],s=t.toString().replace(v.escape,"\\$&"),l=new RegExp(v.beginsWith+s,"i"),c=function(t,n){var i=-1==e.inArray(n,a),o=-1==e.inArray(n,r);i&&o&&t.push(n)};return n=n||g.source,o=o!==i?o:g.searchFields,e.isArray(o)||(o=[o]),n===i||n===!1?(m.error(x.source),[]):(e.each(o,function(i,o){e.each(n,function(e,n){var i="string"==typeof n[o];i&&(-1!==n[o].search(l)?c(a,n):g.searchFullText&&m.fuzzySearch(t,n[o])&&c(r,n))})}),e.merge(a,r))}},fuzzySearch:function(e,t){var n=t.length,i=e.length;if("string"!=typeof e)return!1;if(e=e.toLowerCase(),t=t.toLowerCase(),i>n)return!1;if(i===n)return e===t;e:for(var o=0,a=0;i>o;o++){for(var r=e.charCodeAt(o);n>a;)if(t.charCodeAt(a++)===r)continue e;return!1}return!0},parse:{response:function(e,t){var n=m.generateResults(e);m.verbose("Parsing server response",e),e!==i&&t!==i&&e[b.results]!==i&&(m.addResults(n),m.inject.id(e[b.results]),m.write.cache(t,{html:n,results:e[b.results]}),m.save.results(e[b.results]))}},cancel:{query:function(){m.can.useAPI()&&S.api("abort")}},has:{minimumCharacters:function(){var e=m.get.value(),t=e.length;return t>=g.minCharacters},results:function(){if(0===R.length)return!1;var e=R.html();return""!=e}},clear:{cache:function(e){var t=S.data(h.cache);e?e&&t&&t[e]&&(m.debug("Removing value from cache",e),delete t[e],S.data(h.cache,t)):(m.debug("Clearing cache",e),S.removeData(h.cache))}},read:{cache:function(e){var t=S.data(h.cache);return g.cache?(m.verbose("Checking cache for generated html for query",e),"object"==typeof t&&t[e]!==i?t[e]:!1):!1}},create:{id:function(e,t){var n,o,a=e+1;return t!==i?(n=String.fromCharCode(97+t),o=n+a,m.verbose("Creating category result id",o)):(o=a,m.verbose("Creating result id",o)),o},results:function(){0===R.length&&(R=e("<div />").addClass(p.results).appendTo(S))}},inject:{result:function(e,t,n){m.verbose("Injecting result into results");var o=n!==i?R.children().eq(n).children(y.result).eq(t):R.children(y.result).eq(t);m.verbose("Injecting results metadata",o),o.data(h.result,e)},id:function(t){m.debug("Injecting unique ids into results");var n=0,o=0;return"category"===g.type?e.each(t,function(t,a){o=0,e.each(a.results,function(e,t){var r=a.results[e];r.id===i&&(r.id=m.create.id(o,n)),m.inject.result(r,o,n),o++}),n++}):e.each(t,function(e,n){var a=t[e];a.id===i&&(a.id=m.create.id(o)),m.inject.result(a,o),o++}),t}},save:{results:function(e){m.verbose("Saving current search results to metadata",e),S.data(h.results,e)}},write:{cache:function(e,t){var n=S.data(h.cache)!==i?S.data(h.cache):{};g.cache&&(m.verbose("Writing generated html to cache",e,t),n[e]=t,S.data(h.cache,n))}},addResults:function(t){return e.isFunction(g.onResultsAdd)&&g.onResultsAdd.call(R,t)===!1?(m.debug("onResultsAdd callback cancelled default action"),!1):void(t?(R.html(t),m.refreshResults(),g.selectFirstResult&&m.select.firstResult(),m.showResults()):m.hideResults(function(){R.empty()}))},showResults:function(t){t=e.isFunction(t)?t:function(){},q||!m.is.visible()&&m.has.results()&&(m.can.transition()?(m.debug("Showing results with css animations"),R.transition({animation:g.transition+" in",debug:g.debug,verbose:g.verbose,duration:g.duration,onComplete:function(){t()},queue:!0})):(m.debug("Showing results with javascript"),R.stop().fadeIn(g.duration,g.easing)),g.onResultsOpen.call(R))},hideResults:function(t){t=e.isFunction(t)?t:function(){},m.is.visible()&&(m.can.transition()?(m.debug("Hiding results with css animations"),R.transition({animation:g.transition+" out",debug:g.debug,verbose:g.verbose,duration:g.duration,onComplete:function(){t()},queue:!0})):(m.debug("Hiding results with javascript"),R.stop().fadeOut(g.duration,g.easing)),g.onResultsClose.call(R))},generateResults:function(t){m.debug("Generating html from response",t);var n=g.templates[g.type],i=e.isPlainObject(t[b.results])&&!e.isEmptyObject(t[b.results]),o=e.isArray(t[b.results])&&t[b.results].length>0,a="";return i||o?(g.maxResults>0&&(i?"standard"==g.type&&m.error(x.maxResults):t[b.results]=t[b.results].slice(0,g.maxResults)),e.isFunction(n)?a=n(t,b):m.error(x.noTemplate,!1)):g.showNoResults&&(a=m.displayMessage(x.noResults,"empty")),g.onResults.call(F,t),a},displayMessage:function(e,t){return t=t||"standard",m.debug("Displaying message",e,t),m.addResults(g.templates.message(e,t)),g.templates.message(e,t)},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,g,t);else{if(n===i)return g[t];g[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,m,t);else{if(n===i)return m[t];m[t]=n}},debug:function(){!g.silent&&g.debug&&(g.performance?m.performance.log(arguments):(m.debug=Function.prototype.bind.call(console.info,console,g.name+":"),m.debug.apply(console,arguments)))},verbose:function(){!g.silent&&g.verbose&&g.debug&&(g.performance?m.performance.log(arguments):(m.verbose=Function.prototype.bind.call(console.info,console,g.name+":"),m.verbose.apply(console,arguments)))},error:function(){g.silent||(m.error=Function.prototype.bind.call(console.error,console,g.name+":"),m.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;g.performance&&(t=(new Date).getTime(),i=l||t,n=t-i,l=t,c.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:F,"Execution Time":n})),clearTimeout(m.performance.timer),m.performance.timer=setTimeout(m.performance.display,500)},display:function(){var t=g.name+":",n=0;l=!1,clearTimeout(m.performance.timer),e.each(c,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",s&&(t+=" '"+s+"'"),r.length>1&&(t+=" ("+r.length+")"),(console.group!==i||console.table!==i)&&c.length>0&&(console.groupCollapsed(t),console.table?console.table(c):e.each(c,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),c=[]}},invoke:function(t,n,o){var r,s,l,c=O;return n=n||f,o=F||o,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):!1;c=c[o]}})),e.isFunction(s)?l=s.apply(o,n):s!==i&&(l=s),e.isArray(a)?a.push(l):a!==i?a=[a,l]:l!==i&&(a=l),s}},d?(O===i&&m.initialize(),m.invoke(u)):(O!==i&&O.invoke("destroy"),m.initialize())}),a!==i?a:this},e.fn.search.settings={name:"Search",namespace:"search",silent:!1,debug:!1,verbose:!1,performance:!0,type:"standard",minCharacters:1,selectFirstResult:!1,apiSettings:!1,source:!1,searchOnFocus:!0,searchFields:["title","description"],displayField:"",searchFullText:!0,automatic:!0,hideDelay:0,searchDelay:200,maxResults:7,cache:!0,showNoResults:!0,transition:"scale",duration:200,easing:"easeOutExpo",onSelect:!1,onResultsAdd:!1,onSearchQuery:function(e){},onResults:function(e){},onResultsOpen:function(){},onResultsClose:function(){},className:{animating:"animating",active:"active",empty:"empty",focus:"focus",hidden:"hidden",loading:"loading",results:"results",pressed:"down"},error:{source:"Cannot search. No source used, and Semantic API module was not included",noResults:"Your search returned no results",logging:"Error in debug logging, exiting.",noEndpoint:"No search endpoint was specified",noTemplate:"A valid template name was not specified.",serverError:"There was an issue querying the server.",maxResults:"Results must be an array to use maxResults setting",method:"The method you called is not defined."},metadata:{cache:"cache",results:"results",result:"result"},regExp:{escape:/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,beginsWith:"(?:s|^)"},fields:{categories:"results",categoryName:"name",categoryResults:"results",description:"description",image:"image",price:"price",results:"results",title:"title",url:"url",action:"action",actionText:"text",actionURL:"url"},selector:{prompt:".prompt",searchButton:".search.button",results:".results",message:".results > .message",category:".category",result:".result",title:".title, .name"},templates:{escape:function(e){var t=/[&<>"'`]/g,n=/[&<>"'`]/,i={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},o=function(e){return i[e]};return n.test(e)?e.replace(t,o):e},message:function(e,t){var n="";return e!==i&&t!==i&&(n+='<div class="message '+t+'">',n+="empty"==t?'<div class="header">No Results</div class="header"><div class="description">'+e+'</div class="description">':' <div class="description">'+e+"</div>",n+="</div>"),n},category:function(t,n){var o="";e.fn.search.settings.templates.escape;return t[n.categoryResults]!==i?(e.each(t[n.categoryResults],function(t,a){a[n.results]!==i&&a.results.length>0&&(o+='<div class="category">',a[n.categoryName]!==i&&(o+='<div class="name">'+a[n.categoryName]+"</div>"),e.each(a.results,function(e,t){o+=t[n.url]?'<a class="result" href="'+t[n.url]+'">':'<a class="result">',t[n.image]!==i&&(o+='<div class="image"> <img src="'+t[n.image]+'"></div>'),o+='<div class="content">',t[n.price]!==i&&(o+='<div class="price">'+t[n.price]+"</div>"),t[n.title]!==i&&(o+='<div class="title">'+t[n.title]+"</div>"),t[n.description]!==i&&(o+='<div class="description">'+t[n.description]+"</div>"),o+="</div>",o+="</a>"}),o+="</div>")}),t[n.action]&&(o+='<a href="'+t[n.action][n.actionURL]+'" class="action">'+t[n.action][n.actionText]+"</a>"),o):!1},standard:function(t,n){var o="";return t[n.results]!==i?(e.each(t[n.results],function(e,t){o+=t[n.url]?'<a class="result" href="'+t[n.url]+'">':'<a class="result">',t[n.image]!==i&&(o+='<div class="image"> <img src="'+t[n.image]+'"></div>'),o+='<div class="content">',t[n.price]!==i&&(o+='<div class="price">'+t[n.price]+"</div>"),t[n.title]!==i&&(o+='<div class="title">'+t[n.title]+"</div>"),t[n.description]!==i&&(o+='<div class="description">'+t[n.description]+"</div>"),o+="</div>",o+="</a>"}),t[n.action]&&(o+='<a href="'+t[n.action][n.actionURL]+'" class="action">'+t[n.action][n.actionText]+"</a>"),o):!1}}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.shape=function(o){var a,r=e(this),s=(e("body"),(new Date).getTime()),l=[],c=arguments[0],u="string"==typeof c,d=[].slice.call(arguments,1),f=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)};return r.each(function(){var t,m,g,p=r.selector||"",h=e.isPlainObject(o)?e.extend(!0,{},e.fn.shape.settings,o):e.extend({},e.fn.shape.settings),v=h.namespace,b=h.selector,y=h.error,x=h.className,C="."+v,w="module-"+v,k=e(this),S=k.find(b.sides),T=k.find(b.side),A=!1,R=this,P=k.data(w);g={initialize:function(){g.verbose("Initializing module for",R),g.set.defaultSide(),g.instantiate()},instantiate:function(){g.verbose("Storing instance of module",g),P=g,k.data(w,P)},destroy:function(){g.verbose("Destroying previous module for",R),k.removeData(w).off(C)},refresh:function(){g.verbose("Refreshing selector cache for",R),k=e(R),S=e(this).find(b.shape),T=e(this).find(b.side)},repaint:function(){g.verbose("Forcing repaint event");var e=S[0]||n.createElement("div");e.offsetWidth},animate:function(e,n){g.verbose("Animating box with properties",e),n=n||function(e){g.verbose("Executing animation callback"),e!==i&&e.stopPropagation(),g.reset(),g.set.active()},h.beforeChange.call(m[0]),g.get.transitionEvent()?(g.verbose("Starting CSS animation"),k.addClass(x.animating),S.css(e).one(g.get.transitionEvent(),n),g.set.duration(h.duration),f(function(){k.addClass(x.animating),t.addClass(x.hidden)})):n()},queue:function(e){g.debug("Queueing animation of",e),S.one(g.get.transitionEvent(),function(){g.debug("Executing queued animation"),setTimeout(function(){k.shape(e)},0)})},reset:function(){g.verbose("Animating states reset"),k.removeClass(x.animating).attr("style","").removeAttr("style"),S.attr("style","").removeAttr("style"),T.attr("style","").removeAttr("style").removeClass(x.hidden),m.removeClass(x.animating).attr("style","").removeAttr("style")},is:{complete:function(){return T.filter("."+x.active)[0]==m[0]},animating:function(){return k.hasClass(x.animating)}},set:{defaultSide:function(){t=k.find("."+h.className.active),m=t.next(b.side).length>0?t.next(b.side):k.find(b.side).first(),A=!1,g.verbose("Active side set to",t),g.verbose("Next side set to",m)},duration:function(e){e=e||h.duration,e="number"==typeof e?e+"ms":e,g.verbose("Setting animation duration",e),(h.duration||0===h.duration)&&S.add(T).css({"-webkit-transition-duration":e,"-moz-transition-duration":e,"-ms-transition-duration":e,"-o-transition-duration":e,"transition-duration":e})},currentStageSize:function(){var e=k.find("."+h.className.active),t=e.outerWidth(!0),n=e.outerHeight(!0);k.css({width:t,height:n})},stageSize:function(){var e=k.clone().addClass(x.loading),t=e.find("."+h.className.active),n=A?e.find(b.side).eq(A):t.next(b.side).length>0?t.next(b.side):e.find(b.side).first(),i="next"==h.width?n.outerWidth(!0):"initial"==h.width?k.width():h.width,o="next"==h.height?n.outerHeight(!0):"initial"==h.height?k.height():h.height;t.removeClass(x.active),n.addClass(x.active),e.insertAfter(k),e.remove(),"auto"!=h.width&&(k.css("width",i+h.jitter),g.verbose("Specifying width during animation",i)),"auto"!=h.height&&(k.css("height",o+h.jitter),g.verbose("Specifying height during animation",o))},nextSide:function(e){A=e,m=T.filter(e),A=T.index(m),0===m.length&&(g.set.defaultSide(),g.error(y.side)),g.verbose("Next side manually set to",m)},active:function(){g.verbose("Setting new side to active",m),T.removeClass(x.active),m.addClass(x.active),h.onChange.call(m[0]),g.set.defaultSide()}},flip:{up:function(){if(g.is.complete()&&!g.is.animating()&&!h.allowRepeats)return void g.debug("Side already visible",m);if(g.is.animating())g.queue("flip up");else{g.debug("Flipping up",m);var e=g.get.transform.up();g.set.stageSize(),g.stage.above(),g.animate(e)}},down:function(){if(g.is.complete()&&!g.is.animating()&&!h.allowRepeats)return void g.debug("Side already visible",m);if(g.is.animating())g.queue("flip down");else{g.debug("Flipping down",m);var e=g.get.transform.down();g.set.stageSize(),g.stage.below(),g.animate(e)}},left:function(){if(g.is.complete()&&!g.is.animating()&&!h.allowRepeats)return void g.debug("Side already visible",m);if(g.is.animating())g.queue("flip left");else{g.debug("Flipping left",m);var e=g.get.transform.left();g.set.stageSize(),g.stage.left(),g.animate(e)}},right:function(){if(g.is.complete()&&!g.is.animating()&&!h.allowRepeats)return void g.debug("Side already visible",m);if(g.is.animating())g.queue("flip right");else{g.debug("Flipping right",m);var e=g.get.transform.right();g.set.stageSize(),g.stage.right(),g.animate(e)}},over:function(){return!g.is.complete()||g.is.animating()||h.allowRepeats?void(g.is.animating()?g.queue("flip over"):(g.debug("Flipping over",m),g.set.stageSize(),g.stage.behind(),g.animate(g.get.transform.over()))):void g.debug("Side already visible",m)},back:function(){return!g.is.complete()||g.is.animating()||h.allowRepeats?void(g.is.animating()?g.queue("flip back"):(g.debug("Flipping back",m),g.set.stageSize(),g.stage.behind(),g.animate(g.get.transform.back()))):void g.debug("Side already visible",m)}},get:{transform:{up:function(){var e={y:-((t.outerHeight(!0)-m.outerHeight(!0))/2),z:-(t.outerHeight(!0)/2)};return{transform:"translateY("+e.y+"px) translateZ("+e.z+"px) rotateX(-90deg)"}},down:function(){var e={y:-((t.outerHeight(!0)-m.outerHeight(!0))/2),z:-(t.outerHeight(!0)/2)};return{transform:"translateY("+e.y+"px) translateZ("+e.z+"px) rotateX(90deg)"}},left:function(){var e={x:-((t.outerWidth(!0)-m.outerWidth(!0))/2),z:-(t.outerWidth(!0)/2)};return{transform:"translateX("+e.x+"px) translateZ("+e.z+"px) rotateY(90deg)"}},right:function(){var e={x:-((t.outerWidth(!0)-m.outerWidth(!0))/2),z:-(t.outerWidth(!0)/2)};return{transform:"translateX("+e.x+"px) translateZ("+e.z+"px) rotateY(-90deg)"}},over:function(){var e={x:-((t.outerWidth(!0)-m.outerWidth(!0))/2)};return{transform:"translateX("+e.x+"px) rotateY(180deg)"}},back:function(){var e={x:-((t.outerWidth(!0)-m.outerWidth(!0))/2)};return{transform:"translateX("+e.x+"px) rotateY(-180deg)"}}},transitionEvent:function(){var e,t=n.createElement("element"),o={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(e in o)if(t.style[e]!==i)return o[e]},nextSide:function(){return t.next(b.side).length>0?t.next(b.side):k.find(b.side).first()}},stage:{above:function(){var e={origin:(t.outerHeight(!0)-m.outerHeight(!0))/2,depth:{active:m.outerHeight(!0)/2,next:t.outerHeight(!0)/2}};g.verbose("Setting the initial animation position as above",m,e),S.css({transform:"translateZ(-"+e.depth.active+"px)"}),t.css({transform:"rotateY(0deg) translateZ("+e.depth.active+"px)"}),m.addClass(x.animating).css({top:e.origin+"px",transform:"rotateX(90deg) translateZ("+e.depth.next+"px)"})},below:function(){var e={origin:(t.outerHeight(!0)-m.outerHeight(!0))/2,depth:{active:m.outerHeight(!0)/2,next:t.outerHeight(!0)/2}};g.verbose("Setting the initial animation position as below",m,e),S.css({transform:"translateZ(-"+e.depth.active+"px)"}),t.css({transform:"rotateY(0deg) translateZ("+e.depth.active+"px)"}),m.addClass(x.animating).css({top:e.origin+"px",transform:"rotateX(-90deg) translateZ("+e.depth.next+"px)"})},left:function(){var e={active:t.outerWidth(!0),next:m.outerWidth(!0)},n={origin:(e.active-e.next)/2,depth:{active:e.next/2,next:e.active/2}};g.verbose("Setting the initial animation position as left",m,n),S.css({transform:"translateZ(-"+n.depth.active+"px)"}),t.css({transform:"rotateY(0deg) translateZ("+n.depth.active+"px)"}),m.addClass(x.animating).css({left:n.origin+"px",transform:"rotateY(-90deg) translateZ("+n.depth.next+"px)"})},right:function(){var e={active:t.outerWidth(!0),next:m.outerWidth(!0)},n={origin:(e.active-e.next)/2,depth:{active:e.next/2,next:e.active/2}};g.verbose("Setting the initial animation position as left",m,n),S.css({transform:"translateZ(-"+n.depth.active+"px)"}),t.css({transform:"rotateY(0deg) translateZ("+n.depth.active+"px)"}),m.addClass(x.animating).css({left:n.origin+"px",transform:"rotateY(90deg) translateZ("+n.depth.next+"px)"})},behind:function(){var e={active:t.outerWidth(!0),next:m.outerWidth(!0)},n={origin:(e.active-e.next)/2,depth:{active:e.next/2,next:e.active/2}};g.verbose("Setting the initial animation position as behind",m,n),t.css({transform:"rotateY(0deg)"}),m.addClass(x.animating).css({left:n.origin+"px",transform:"rotateY(-180deg)"})}},setting:function(t,n){if(g.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,h,t);else{if(n===i)return h[t];e.isPlainObject(h[t])?e.extend(!0,h[t],n):h[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,g,t);else{if(n===i)return g[t];g[t]=n}},debug:function(){!h.silent&&h.debug&&(h.performance?g.performance.log(arguments):(g.debug=Function.prototype.bind.call(console.info,console,h.name+":"),g.debug.apply(console,arguments)))},verbose:function(){!h.silent&&h.verbose&&h.debug&&(h.performance?g.performance.log(arguments):(g.verbose=Function.prototype.bind.call(console.info,console,h.name+":"),g.verbose.apply(console,arguments)))},error:function(){h.silent||(g.error=Function.prototype.bind.call(console.error,console,h.name+":"),g.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;h.performance&&(t=(new Date).getTime(),i=s||t,n=t-i,s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:R,"Execution Time":n})),clearTimeout(g.performance.timer),g.performance.timer=setTimeout(g.performance.display,500)},display:function(){var t=h.name+":",n=0;s=!1,clearTimeout(g.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",p&&(t+=" '"+p+"'"),r.length>1&&(t+=" ("+r.length+")"),(console.group!==i||console.table!==i)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,o){var r,s,l,c=P;return n=n||d,o=R||o,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):!1;c=c[o]}})),e.isFunction(s)?l=s.apply(o,n):s!==i&&(l=s),e.isArray(a)?a.push(l):a!==i?a=[a,l]:l!==i&&(a=l),s}},u?(P===i&&g.initialize(),g.invoke(c)):(P!==i&&P.invoke("destroy"),g.initialize())}),a!==i?a:this},e.fn.shape.settings={name:"Shape",silent:!1,debug:!1,verbose:!1,jitter:0,performance:!0,namespace:"shape",width:"initial",height:"initial",beforeChange:function(){},onChange:function(){},allowRepeats:!1,duration:!1,error:{side:"You tried to switch to a side that does not exist.",method:"The method you called is not defined"},className:{animating:"animating",hidden:"hidden",loading:"loading",active:"active"},selector:{sides:".sides",side:".side"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.sidebar=function(o){var a,r=e(this),s=e(t),l=e(n),c=e("html"),u=e("head"),d=r.selector||"",f=(new Date).getTime(),m=[],g=arguments[0],p="string"==typeof g,h=[].slice.call(arguments,1),v=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)};return r.each(function(){var r,b,y,x,C,w,k=e.isPlainObject(o)?e.extend(!0,{},e.fn.sidebar.settings,o):e.extend({},e.fn.sidebar.settings),S=k.selector,T=k.className,A=k.namespace,R=k.regExp,P=k.error,E="."+A,F="module-"+A,O=e(this),D=e(k.context),q=O.children(S.sidebar),j=D.children(S.fixed),z=D.children(S.pusher),I=this,M=O.data(F);w={initialize:function(){w.debug("Initializing sidebar",o),w.create.id(),C=w.get.transitionEvent(),w.is.ios()&&w.set.ios(),k.delaySetup?v(w.setup.layout):w.setup.layout(),v(function(){w.setup.cache()}),w.instantiate()},instantiate:function(){w.verbose("Storing instance of module",w),M=w,O.data(F,w)},create:{id:function(){y=(Math.random().toString(16)+"000000000").substr(2,8),b="."+y,w.verbose("Creating unique id for element",y)}},destroy:function(){w.verbose("Destroying previous module for",O),O.off(E).removeData(F),w.is.ios()&&w.remove.ios(),D.off(b),s.off(b),l.off(b)},event:{clickaway:function(e){var t=z.find(e.target).length>0||z.is(e.target),n=D.is(e.target);t&&(w.verbose("User clicked on dimmed page"),w.hide()),n&&(w.verbose("User clicked on dimmable context (scaled out page)"),w.hide())},touch:function(e){},containScroll:function(e){I.scrollTop<=0&&(I.scrollTop=1),I.scrollTop+I.offsetHeight>=I.scrollHeight&&(I.scrollTop=I.scrollHeight-I.offsetHeight-1)},scroll:function(t){0===e(t.target).closest(S.sidebar).length&&t.preventDefault()}},bind:{clickaway:function(){w.verbose("Adding clickaway events to context",D),k.closable&&D.on("click"+b,w.event.clickaway).on("touchend"+b,w.event.clickaway)},scrollLock:function(){k.scrollLock&&(w.debug("Disabling page scroll"),s.on("DOMMouseScroll"+b,w.event.scroll)),w.verbose("Adding events to contain sidebar scroll"),l.on("touchmove"+b,w.event.touch),O.on("scroll"+E,w.event.containScroll)}},unbind:{clickaway:function(){w.verbose("Removing clickaway events from context",D),D.off(b)},scrollLock:function(){w.verbose("Removing scroll lock from page"),l.off(b),s.off(b),O.off("scroll"+E)}},add:{inlineCSS:function(){var t,n=w.cache.width||O.outerWidth(),i=w.cache.height||O.outerHeight(),o=w.is.rtl(),a=w.get.direction(),s={left:n,right:-n,top:i,bottom:-i};o&&(w.verbose("RTL detected, flipping widths"),s.left=-n,s.right=n),t="<style>","left"===a||"right"===a?(w.debug("Adding CSS rules for animation distance",n),
t+=" .ui.visible."+a+".sidebar ~ .fixed, .ui.visible."+a+".sidebar ~ .pusher {   -webkit-transform: translate3d("+s[a]+"px, 0, 0);           transform: translate3d("+s[a]+"px, 0, 0); }"):"top"!==a&&"bottom"!=a||(t+=" .ui.visible."+a+".sidebar ~ .fixed, .ui.visible."+a+".sidebar ~ .pusher {   -webkit-transform: translate3d(0, "+s[a]+"px, 0);           transform: translate3d(0, "+s[a]+"px, 0); }"),w.is.ie()&&("left"===a||"right"===a?(w.debug("Adding CSS rules for animation distance",n),t+=" body.pushable > .ui.visible."+a+".sidebar ~ .pusher:after {   -webkit-transform: translate3d("+s[a]+"px, 0, 0);           transform: translate3d("+s[a]+"px, 0, 0); }"):"top"!==a&&"bottom"!=a||(t+=" body.pushable > .ui.visible."+a+".sidebar ~ .pusher:after {   -webkit-transform: translate3d(0, "+s[a]+"px, 0);           transform: translate3d(0, "+s[a]+"px, 0); }"),t+=" body.pushable > .ui.visible.left.sidebar ~ .ui.visible.right.sidebar ~ .pusher:after, body.pushable > .ui.visible.right.sidebar ~ .ui.visible.left.sidebar ~ .pusher:after {   -webkit-transform: translate3d(0px, 0, 0);           transform: translate3d(0px, 0, 0); }"),t+="</style>",r=e(t).appendTo(u),w.debug("Adding sizing css to head",r)}},refresh:function(){w.verbose("Refreshing selector cache"),D=e(k.context),q=D.children(S.sidebar),z=D.children(S.pusher),j=D.children(S.fixed),w.clear.cache()},refreshSidebars:function(){w.verbose("Refreshing other sidebars"),q=D.children(S.sidebar)},repaint:function(){w.verbose("Forcing repaint event"),I.style.display="none";I.offsetHeight;I.scrollTop=I.scrollTop,I.style.display=""},setup:{cache:function(){w.cache={width:O.outerWidth(),height:O.outerHeight(),rtl:"rtl"==O.css("direction")}},layout:function(){0===D.children(S.pusher).length&&(w.debug("Adding wrapper element for sidebar"),w.error(P.pusher),z=e('<div class="pusher" />'),D.children().not(S.omitted).not(q).wrapAll(z),w.refresh()),0!==O.nextAll(S.pusher).length&&O.nextAll(S.pusher)[0]===z[0]||(w.debug("Moved sidebar to correct parent element"),w.error(P.movedSidebar,I),O.detach().prependTo(D),w.refresh()),w.clear.cache(),w.set.pushable(),w.set.direction()}},attachEvents:function(t,n){var i=e(t);n=e.isFunction(w[n])?w[n]:w.toggle,i.length>0?(w.debug("Attaching sidebar events to element",t,n),i.on("click"+E,n)):w.error(P.notFound,t)},show:function(t){if(t=e.isFunction(t)?t:function(){},w.is.hidden()){if(w.refreshSidebars(),k.overlay&&(w.error(P.overlay),k.transition="overlay"),w.refresh(),w.othersActive())if(w.debug("Other sidebars currently visible"),k.exclusive){if("overlay"!=k.transition)return void w.hideOthers(w.show);w.hideOthers()}else k.transition="overlay";w.pushPage(function(){t.call(I),k.onShow.call(I)}),k.onChange.call(I),k.onVisible.call(I)}else w.debug("Sidebar is already visible")},hide:function(t){t=e.isFunction(t)?t:function(){},(w.is.visible()||w.is.animating())&&(w.debug("Hiding sidebar",t),w.refreshSidebars(),w.pullPage(function(){t.call(I),k.onHidden.call(I)}),k.onChange.call(I),k.onHide.call(I))},othersAnimating:function(){return q.not(O).filter("."+T.animating).length>0},othersVisible:function(){return q.not(O).filter("."+T.visible).length>0},othersActive:function(){return w.othersVisible()||w.othersAnimating()},hideOthers:function(e){var t=q.not(O).filter("."+T.visible),n=t.length,i=0;e=e||function(){},t.sidebar("hide",function(){i++,i==n&&e()})},toggle:function(){w.verbose("Determining toggled direction"),w.is.hidden()?w.show():w.hide()},pushPage:function(t){var n,i,o,a=w.get.transition(),r="overlay"===a||w.othersActive()?O:z;t=e.isFunction(t)?t:function(){},"scale down"==k.transition&&w.scrollToTop(),w.set.transition(a),w.repaint(),n=function(){w.bind.clickaway(),w.add.inlineCSS(),w.set.animating(),w.set.visible()},i=function(){w.set.dimmed()},o=function(e){e.target==r[0]&&(r.off(C+b,o),w.remove.animating(),w.bind.scrollLock(),t.call(I))},r.off(C+b),r.on(C+b,o),v(n),k.dimPage&&!w.othersVisible()&&v(i)},pullPage:function(t){var n,i,o=w.get.transition(),a="overlay"==o||w.othersActive()?O:z;t=e.isFunction(t)?t:function(){},w.verbose("Removing context push state",w.get.direction()),w.unbind.clickaway(),w.unbind.scrollLock(),n=function(){w.set.transition(o),w.set.animating(),w.remove.visible(),k.dimPage&&!w.othersVisible()&&z.removeClass(T.dimmed)},i=function(e){e.target==a[0]&&(a.off(C+b,i),w.remove.animating(),w.remove.transition(),w.remove.inlineCSS(),("scale down"==o||k.returnScroll&&w.is.mobile())&&w.scrollBack(),t.call(I))},a.off(C+b),a.on(C+b,i),v(n)},scrollToTop:function(){w.verbose("Scrolling to top of page to avoid animation issues"),x=e(t).scrollTop(),O.scrollTop(0),t.scrollTo(0,0)},scrollBack:function(){w.verbose("Scrolling back to original page position"),t.scrollTo(0,x)},clear:{cache:function(){w.verbose("Clearing cached dimensions"),w.cache={}}},set:{ios:function(){c.addClass(T.ios)},pushed:function(){D.addClass(T.pushed)},pushable:function(){D.addClass(T.pushable)},dimmed:function(){z.addClass(T.dimmed)},active:function(){O.addClass(T.active)},animating:function(){O.addClass(T.animating)},transition:function(e){e=e||w.get.transition(),O.addClass(e)},direction:function(e){e=e||w.get.direction(),O.addClass(T[e])},visible:function(){O.addClass(T.visible)},overlay:function(){O.addClass(T.overlay)}},remove:{inlineCSS:function(){w.debug("Removing inline css styles",r),r&&r.length>0&&r.remove()},ios:function(){c.removeClass(T.ios)},pushed:function(){D.removeClass(T.pushed)},pushable:function(){D.removeClass(T.pushable)},active:function(){O.removeClass(T.active)},animating:function(){O.removeClass(T.animating)},transition:function(e){e=e||w.get.transition(),O.removeClass(e)},direction:function(e){e=e||w.get.direction(),O.removeClass(T[e])},visible:function(){O.removeClass(T.visible)},overlay:function(){O.removeClass(T.overlay)}},get:{direction:function(){return O.hasClass(T.top)?T.top:O.hasClass(T.right)?T.right:O.hasClass(T.bottom)?T.bottom:T.left},transition:function(){var e,t=w.get.direction();return e=w.is.mobile()?"auto"==k.mobileTransition?k.defaultTransition.mobile[t]:k.mobileTransition:"auto"==k.transition?k.defaultTransition.computer[t]:k.transition,w.verbose("Determined transition",e),e},transitionEvent:function(){var e,t=n.createElement("element"),o={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(e in o)if(t.style[e]!==i)return o[e]}},is:{ie:function(){var e=!t.ActiveXObject&&"ActiveXObject"in t,n="ActiveXObject"in t;return e||n},ios:function(){var e=navigator.userAgent,t=e.match(R.ios),n=e.match(R.mobileChrome);return t&&!n?(w.verbose("Browser was found to be iOS",e),!0):!1},mobile:function(){var e=navigator.userAgent,t=e.match(R.mobile);return t?(w.verbose("Browser was found to be mobile",e),!0):(w.verbose("Browser is not mobile, using regular transition",e),!1)},hidden:function(){return!w.is.visible()},visible:function(){return O.hasClass(T.visible)},open:function(){return w.is.visible()},closed:function(){return w.is.hidden()},vertical:function(){return O.hasClass(T.top)},animating:function(){return D.hasClass(T.animating)},rtl:function(){return w.cache.rtl===i&&(w.cache.rtl="rtl"==O.css("direction")),w.cache.rtl}},setting:function(t,n){if(w.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,k,t);else{if(n===i)return k[t];e.isPlainObject(k[t])?e.extend(!0,k[t],n):k[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,w,t);else{if(n===i)return w[t];w[t]=n}},debug:function(){!k.silent&&k.debug&&(k.performance?w.performance.log(arguments):(w.debug=Function.prototype.bind.call(console.info,console,k.name+":"),w.debug.apply(console,arguments)))},verbose:function(){!k.silent&&k.verbose&&k.debug&&(k.performance?w.performance.log(arguments):(w.verbose=Function.prototype.bind.call(console.info,console,k.name+":"),w.verbose.apply(console,arguments)))},error:function(){k.silent||(w.error=Function.prototype.bind.call(console.error,console,k.name+":"),w.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;k.performance&&(t=(new Date).getTime(),i=f||t,n=t-i,f=t,m.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:I,"Execution Time":n})),clearTimeout(w.performance.timer),w.performance.timer=setTimeout(w.performance.display,500)},display:function(){var t=k.name+":",n=0;f=!1,clearTimeout(w.performance.timer),e.each(m,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",d&&(t+=" '"+d+"'"),(console.group!==i||console.table!==i)&&m.length>0&&(console.groupCollapsed(t),console.table?console.table(m):e.each(m,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),m=[]}},invoke:function(t,n,o){var r,s,l,c=M;return n=n||h,o=I||o,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):(w.error(P.method,t),!1);c=c[o]}})),e.isFunction(s)?l=s.apply(o,n):s!==i&&(l=s),e.isArray(a)?a.push(l):a!==i?a=[a,l]:l!==i&&(a=l),s}},p?(M===i&&w.initialize(),w.invoke(g)):(M!==i&&w.invoke("destroy"),w.initialize())}),a!==i?a:this},e.fn.sidebar.settings={name:"Sidebar",namespace:"sidebar",silent:!1,debug:!1,verbose:!1,performance:!0,transition:"auto",mobileTransition:"auto",defaultTransition:{computer:{left:"uncover",right:"uncover",top:"overlay",bottom:"overlay"},mobile:{left:"uncover",right:"uncover",top:"overlay",bottom:"overlay"}},context:"body",exclusive:!1,closable:!0,dimPage:!0,scrollLock:!1,returnScroll:!1,delaySetup:!1,duration:500,onChange:function(){},onShow:function(){},onHide:function(){},onHidden:function(){},onVisible:function(){},className:{active:"active",animating:"animating",dimmed:"dimmed",ios:"ios",pushable:"pushable",pushed:"pushed",right:"right",top:"top",left:"left",bottom:"bottom",visible:"visible"},selector:{fixed:".fixed",omitted:"script, link, style, .ui.modal, .ui.dimmer, .ui.nag, .ui.fixed",pusher:".pusher",sidebar:".ui.sidebar"},regExp:{ios:/(iPad|iPhone|iPod)/g,mobileChrome:/(CriOS)/g,mobile:/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/g},error:{method:"The method you called is not defined.",pusher:"Had to add pusher element. For optimal performance make sure body content is inside a pusher element",movedSidebar:"Had to move sidebar. For optimal performance make sure sidebar and pusher are direct children of your body tag",overlay:"The overlay setting is no longer supported, use animation: overlay",notFound:"There were no elements that matched the specified selector"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.sticky=function(o){var a,r=e(this),s=r.selector||"",l=(new Date).getTime(),c=[],u=arguments[0],d="string"==typeof u,f=[].slice.call(arguments,1);return r.each(function(){var r,m,g,p,h,v=e.isPlainObject(o)?e.extend(!0,{},e.fn.sticky.settings,o):e.extend({},e.fn.sticky.settings),b=v.className,y=v.namespace,x=v.error,C="."+y,w="module-"+y,k=e(this),S=e(t),T=e(v.scrollContext),A=(k.selector||"",k.data(w)),R=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)},P=this;h={initialize:function(){h.determineContainer(),h.determineContext(),h.verbose("Initializing sticky",v,r),h.save.positions(),h.checkErrors(),h.bind.events(),v.observeChanges&&h.observeChanges(),h.instantiate()},instantiate:function(){h.verbose("Storing instance of module",h),A=h,k.data(w,h)},destroy:function(){h.verbose("Destroying previous instance"),h.reset(),g&&g.disconnect(),p&&p.disconnect(),S.off("load"+C,h.event.load).off("resize"+C,h.event.resize),T.off("scrollchange"+C,h.event.scrollchange),k.removeData(w)},observeChanges:function(){"MutationObserver"in t&&(g=new MutationObserver(h.event.documentChanged),p=new MutationObserver(h.event.changed),g.observe(n,{childList:!0,subtree:!0}),p.observe(P,{childList:!0,subtree:!0}),p.observe(m[0],{childList:!0,subtree:!0}),h.debug("Setting up mutation observer",p))},determineContainer:function(){r=v.container?e(v.container):k.offsetParent()},determineContext:function(){return m=v.context?e(v.context):r,0===m.length?void h.error(x.invalidContext,v.context,k):void 0},checkErrors:function(){return h.is.hidden()&&h.error(x.visible,k),h.cache.element.height>h.cache.context.height?(h.reset(),void h.error(x.elementSize,k)):void 0},bind:{events:function(){S.on("load"+C,h.event.load).on("resize"+C,h.event.resize),T.off("scroll"+C).on("scroll"+C,h.event.scroll).on("scrollchange"+C,h.event.scrollchange)}},event:{changed:function(e){clearTimeout(h.timer),h.timer=setTimeout(function(){h.verbose("DOM tree modified, updating sticky menu",e),h.refresh()},100)},documentChanged:function(t){[].forEach.call(t,function(t){t.removedNodes&&[].forEach.call(t.removedNodes,function(t){(t==P||e(t).find(P).length>0)&&(h.debug("Element removed from DOM, tearing down events"),h.destroy())})})},load:function(){h.verbose("Page contents finished loading"),R(h.refresh)},resize:function(){h.verbose("Window resized"),R(h.refresh)},scroll:function(){R(function(){T.triggerHandler("scrollchange"+C,T.scrollTop())})},scrollchange:function(e,t){h.stick(t),v.onScroll.call(P)}},refresh:function(e){h.reset(),v.context||h.determineContext(),e&&h.determineContainer(),h.save.positions(),h.stick(),v.onReposition.call(P)},supports:{sticky:function(){var t=e("<div/>");t[0];return t.addClass(b.supported),t.css("position").match("sticky")}},save:{lastScroll:function(e){h.lastScroll=e},elementScroll:function(e){h.elementScroll=e},positions:function(){var e={height:T.height()},t={margin:{top:parseInt(k.css("margin-top"),10),bottom:parseInt(k.css("margin-bottom"),10)},offset:k.offset(),width:k.outerWidth(),height:k.outerHeight()},n={offset:m.offset(),height:m.outerHeight()};({height:r.outerHeight()});h.is.standardScroll()||(h.debug("Non-standard scroll. Removing scroll offset from element offset"),e.top=T.scrollTop(),e.left=T.scrollLeft(),t.offset.top+=e.top,n.offset.top+=e.top,t.offset.left+=e.left,n.offset.left+=e.left),h.cache={fits:t.height<e.height,scrollContext:{height:e.height},element:{margin:t.margin,top:t.offset.top-t.margin.top,left:t.offset.left,width:t.width,height:t.height,bottom:t.offset.top+t.height},context:{top:n.offset.top,height:n.height,bottom:n.offset.top+n.height}},h.set.containerSize(),h.set.size(),h.stick(),h.debug("Caching element positions",h.cache)}},get:{direction:function(e){var t="down";return e=e||T.scrollTop(),h.lastScroll!==i&&(h.lastScroll<e?t="down":h.lastScroll>e&&(t="up")),t},scrollChange:function(e){return e=e||T.scrollTop(),h.lastScroll?e-h.lastScroll:0},currentElementScroll:function(){return h.elementScroll?h.elementScroll:h.is.top()?Math.abs(parseInt(k.css("top"),10))||0:Math.abs(parseInt(k.css("bottom"),10))||0},elementScroll:function(e){e=e||T.scrollTop();var t=h.cache.element,n=h.cache.scrollContext,i=h.get.scrollChange(e),o=t.height-n.height+v.offset,a=h.get.currentElementScroll(),r=a+i;return a=h.cache.fits||0>r?0:r>o?o:r}},remove:{lastScroll:function(){delete h.lastScroll},elementScroll:function(e){delete h.elementScroll},offset:function(){k.css("margin-top","")}},set:{offset:function(){h.verbose("Setting offset on element",v.offset),k.css("margin-top",v.offset)},containerSize:function(){var e=r.get(0).tagName;"HTML"===e||"body"==e?h.determineContainer():Math.abs(r.outerHeight()-h.cache.context.height)>v.jitter&&(h.debug("Context has padding, specifying exact height for container",h.cache.context.height),r.css({height:h.cache.context.height}))},minimumSize:function(){var e=h.cache.element;r.css("min-height",e.height)},scroll:function(e){h.debug("Setting scroll on element",e),h.elementScroll!=e&&(h.is.top()&&k.css("bottom","").css("top",-e),h.is.bottom()&&k.css("top","").css("bottom",e))},size:function(){0!==h.cache.element.height&&0!==h.cache.element.width&&(P.style.setProperty("width",h.cache.element.width+"px","important"),P.style.setProperty("height",h.cache.element.height+"px","important"))}},is:{standardScroll:function(){return T[0]==t},top:function(){return k.hasClass(b.top)},bottom:function(){return k.hasClass(b.bottom)},initialPosition:function(){return!h.is.fixed()&&!h.is.bound()},hidden:function(){return!k.is(":visible")},bound:function(){return k.hasClass(b.bound)},fixed:function(){return k.hasClass(b.fixed)}},stick:function(e){var t=e||T.scrollTop(),n=h.cache,i=n.fits,o=n.element,a=n.scrollContext,r=n.context,s=h.is.bottom()&&v.pushing?v.bottomOffset:v.offset,e={top:t+s,bottom:t+s+a.height},l=(h.get.direction(e.top),i?0:h.get.elementScroll(e.top)),c=!i,u=0!==o.height;u&&(h.is.initialPosition()?e.top>=r.bottom?(h.debug("Initial element position is bottom of container"),h.bindBottom()):e.top>o.top&&(o.height+e.top-l>=r.bottom?(h.debug("Initial element position is bottom of container"),h.bindBottom()):(h.debug("Initial element position is fixed"),h.fixTop())):h.is.fixed()?h.is.top()?e.top<=o.top?(h.debug("Fixed element reached top of container"),h.setInitialPosition()):o.height+e.top-l>=r.bottom?(h.debug("Fixed element reached bottom of container"),h.bindBottom()):c&&(h.set.scroll(l),h.save.lastScroll(e.top),h.save.elementScroll(l)):h.is.bottom()&&(e.bottom-o.height<=o.top?(h.debug("Bottom fixed rail has reached top of container"),h.setInitialPosition()):e.bottom>=r.bottom?(h.debug("Bottom fixed rail has reached bottom of container"),h.bindBottom()):c&&(h.set.scroll(l),h.save.lastScroll(e.top),h.save.elementScroll(l))):h.is.bottom()&&(e.top<=o.top?(h.debug("Jumped from bottom fixed to top fixed, most likely used home/end button"),h.setInitialPosition()):v.pushing?h.is.bound()&&e.bottom<=r.bottom&&(h.debug("Fixing bottom attached element to bottom of browser."),h.fixBottom()):h.is.bound()&&e.top<=r.bottom-o.height&&(h.debug("Fixing bottom attached element to top of browser."),h.fixTop())))},bindTop:function(){h.debug("Binding element to top of parent container"),h.remove.offset(),k.css({left:"",top:"",marginBottom:""}).removeClass(b.fixed).removeClass(b.bottom).addClass(b.bound).addClass(b.top),v.onTop.call(P),v.onUnstick.call(P)},bindBottom:function(){h.debug("Binding element to bottom of parent container"),h.remove.offset(),k.css({left:"",top:""}).removeClass(b.fixed).removeClass(b.top).addClass(b.bound).addClass(b.bottom),v.onBottom.call(P),v.onUnstick.call(P)},setInitialPosition:function(){h.debug("Returning to initial position"),h.unfix(),h.unbind()},fixTop:function(){h.debug("Fixing element to top of page"),h.set.minimumSize(),h.set.offset(),k.css({left:h.cache.element.left,bottom:"",marginBottom:""}).removeClass(b.bound).removeClass(b.bottom).addClass(b.fixed).addClass(b.top),v.onStick.call(P)},fixBottom:function(){h.debug("Sticking element to bottom of page"),h.set.minimumSize(),h.set.offset(),k.css({left:h.cache.element.left,bottom:"",marginBottom:""}).removeClass(b.bound).removeClass(b.top).addClass(b.fixed).addClass(b.bottom),v.onStick.call(P)},unbind:function(){h.is.bound()&&(h.debug("Removing container bound position on element"),h.remove.offset(),k.removeClass(b.bound).removeClass(b.top).removeClass(b.bottom))},unfix:function(){h.is.fixed()&&(h.debug("Removing fixed position on element"),h.remove.offset(),k.removeClass(b.fixed).removeClass(b.top).removeClass(b.bottom),v.onUnstick.call(P))},reset:function(){h.debug("Resetting elements position"),h.unbind(),h.unfix(),h.resetCSS(),h.remove.offset(),h.remove.lastScroll()},resetCSS:function(){k.css({width:"",height:""}),r.css({height:""})},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,v,t);else{if(n===i)return v[t];v[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,h,t);else{if(n===i)return h[t];h[t]=n}},debug:function(){!v.silent&&v.debug&&(v.performance?h.performance.log(arguments):(h.debug=Function.prototype.bind.call(console.info,console,v.name+":"),h.debug.apply(console,arguments)))},verbose:function(){!v.silent&&v.verbose&&v.debug&&(v.performance?h.performance.log(arguments):(h.verbose=Function.prototype.bind.call(console.info,console,v.name+":"),h.verbose.apply(console,arguments)))},error:function(){v.silent||(h.error=Function.prototype.bind.call(console.error,console,v.name+":"),h.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;v.performance&&(t=(new Date).getTime(),i=l||t,n=t-i,l=t,c.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:P,"Execution Time":n})),clearTimeout(h.performance.timer),h.performance.timer=setTimeout(h.performance.display,0)},display:function(){var t=v.name+":",n=0;l=!1,clearTimeout(h.performance.timer),e.each(c,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",s&&(t+=" '"+s+"'"),(console.group!==i||console.table!==i)&&c.length>0&&(console.groupCollapsed(t),console.table?console.table(c):e.each(c,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),c=[]}},invoke:function(t,n,o){var r,s,l,c=A;return n=n||f,o=P||o,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):!1;c=c[o]}})),e.isFunction(s)?l=s.apply(o,n):s!==i&&(l=s),e.isArray(a)?a.push(l):a!==i?a=[a,l]:l!==i&&(a=l),s}},d?(A===i&&h.initialize(),h.invoke(u)):(A!==i&&A.invoke("destroy"),h.initialize())}),a!==i?a:this},e.fn.sticky.settings={name:"Sticky",namespace:"sticky",silent:!1,debug:!1,verbose:!0,performance:!0,pushing:!1,context:!1,container:!1,scrollContext:t,offset:0,bottomOffset:0,jitter:5,observeChanges:!1,onReposition:function(){},onScroll:function(){},onStick:function(){},onUnstick:function(){},onTop:function(){},onBottom:function(){},error:{container:"Sticky element must be inside a relative container",visible:"Element is hidden, you must call refresh after element becomes visible. Use silent setting to surpress this warning in production.",method:"The method you called is not defined.",invalidContext:"Context specified does not exist",elementSize:"Sticky element is larger than its container, cannot create sticky."},className:{bound:"bound",fixed:"fixed",supported:"native",top:"top",bottom:"bottom"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.tab=function(o){var a,r=e(e.isFunction(this)?t:this),s=r.selector||"",l=(new Date).getTime(),c=[],u=arguments[0],d="string"==typeof u,f=[].slice.call(arguments,1),m=!1;return r.each(function(){var g,p,h,v,b,y,x=e.isPlainObject(o)?e.extend(!0,{},e.fn.tab.settings,o):e.extend({},e.fn.tab.settings),C=x.className,w=x.metadata,k=x.selector,S=x.error,T="."+x.namespace,A="module-"+x.namespace,R=e(this),P={},E=!0,F=0,O=this,D=R.data(A);b={initialize:function(){b.debug("Initializing tab menu item",R),b.fix.callbacks(),b.determineTabs(),b.debug("Determining tabs",x.context,p),x.auto&&b.set.auto(),b.bind.events(),x.history&&!m&&(b.initializeHistory(),m=!0),b.instantiate()},instantiate:function(){b.verbose("Storing instance of module",b),D=b,R.data(A,b)},destroy:function(){b.debug("Destroying tabs",R),R.removeData(A).off(T)},bind:{events:function(){e.isWindow(O)||(b.debug("Attaching tab activation events to element",R),R.on("click"+T,b.event.click))}},determineTabs:function(){var t;"parent"===x.context?(R.closest(k.ui).length>0?(t=R.closest(k.ui),b.verbose("Using closest UI element as parent",t)):t=R,g=t.parent(),b.verbose("Determined parent element for creating context",g)):x.context?(g=e(x.context),b.verbose("Using selector for tab context",x.context,g)):g=e("body"),x.childrenOnly?(p=g.children(k.tabs),b.debug("Searching tab context children for tabs",g,p)):(p=g.find(k.tabs),b.debug("Searching tab context for tabs",g,p))},fix:{callbacks:function(){e.isPlainObject(o)&&(o.onTabLoad||o.onTabInit)&&(o.onTabLoad&&(o.onLoad=o.onTabLoad,delete o.onTabLoad,b.error(S.legacyLoad,o.onLoad)),o.onTabInit&&(o.onFirstLoad=o.onTabInit,delete o.onTabInit,b.error(S.legacyInit,o.onFirstLoad)),x=e.extend(!0,{},e.fn.tab.settings,o))}},initializeHistory:function(){if(b.debug("Initializing page state"),e.address===i)return b.error(S.state),!1;if("state"==x.historyType){if(b.debug("Using HTML5 to manage state"),x.path===!1)return b.error(S.path),!1;e.address.history(!0).state(x.path)}e.address.bind("change",b.event.history.change)},event:{click:function(t){var n=e(this).data(w.tab);n!==i?(x.history?(b.verbose("Updating page state",t),e.address.value(n)):(b.verbose("Changing tab",t),b.changeTab(n)),t.preventDefault()):b.debug("No tab specified")},history:{change:function(t){var n=t.pathNames.join("/")||b.get.initialPath(),o=x.templates.determineTitle(n)||!1;b.performance.display(),b.debug("History change event",n,t),y=t,n!==i&&b.changeTab(n),o&&e.address.title(o)}}},refresh:function(){h&&(b.debug("Refreshing tab",h),b.changeTab(h))},cache:{read:function(e){return e!==i?P[e]:!1},add:function(e,t){e=e||h,b.debug("Adding cached content for",e),P[e]=t},remove:function(e){e=e||h,b.debug("Removing cached content for",e),delete P[e]}},set:{auto:function(){var t="string"==typeof x.path?x.path.replace(/\/$/,"")+"/{$tab}":"/{$tab}";b.verbose("Setting up automatic tab retrieval from server",t),e.isPlainObject(x.apiSettings)?x.apiSettings.url=t:x.apiSettings={url:t}},loading:function(e){var t=b.get.tabElement(e),n=t.hasClass(C.loading);n||(b.verbose("Setting loading state for",t),t.addClass(C.loading).siblings(p).removeClass(C.active+" "+C.loading),t.length>0&&x.onRequest.call(t[0],e))},state:function(t){e.address.value(t)}},changeTab:function(n){var i=t.history&&t.history.pushState,o=i&&x.ignoreFirstLoad&&E,a=x.auto||e.isPlainObject(x.apiSettings),r=a&&!o?b.utilities.pathToArray(n):b.get.defaultPathArray(n);n=b.utilities.arrayToPath(r),e.each(r,function(t,i){var s,l,c,u,d=r.slice(0,t+1),f=b.utilities.arrayToPath(d),m=b.is.tab(f),p=t+1==r.length,k=b.get.tabElement(f);if(b.verbose("Looking for tab",i),m){if(b.verbose("Tab was found",i),h=f,v=b.utilities.filterArray(r,d),p?u=!0:(l=r.slice(0,t+2),c=b.utilities.arrayToPath(l),u=!b.is.tab(c),u&&b.verbose("Tab parameters found",l)),u&&a)return o?(b.debug("Ignoring remote content on first tab load",f),E=!1,b.cache.add(n,k.html()),b.activate.all(f),x.onFirstLoad.call(k[0],f,v,y),x.onLoad.call(k[0],f,v,y)):(b.activate.navigation(f),b.fetch.content(f,n)),!1;b.debug("Opened local tab",f),b.activate.all(f),b.cache.read(f)||(b.cache.add(f,!0),b.debug("First time tab loaded calling tab init"),x.onFirstLoad.call(k[0],f,v,y)),x.onLoad.call(k[0],f,v,y)}else{if(-1!=n.search("/")||""===n)return b.error(S.missingTab,R,g,f),!1;if(s=e("#"+n+', a[name="'+n+'"]'),f=s.closest("[data-tab]").data(w.tab),k=b.get.tabElement(f),s&&s.length>0&&f)return b.debug("Anchor link used, opening parent tab",k,s),k.hasClass(C.active)||setTimeout(function(){b.scrollTo(s)},0),b.activate.all(f),b.cache.read(f)||(b.cache.add(f,!0),b.debug("First time tab loaded calling tab init"),x.onFirstLoad.call(k[0],f,v,y)),x.onLoad.call(k[0],f,v,y),!1}})},scrollTo:function(t){var i=t&&t.length>0?t.offset().top:!1;i!==!1&&(b.debug("Forcing scroll to an in-page link in a hidden tab",i,t),e(n).scrollTop(i))},update:{content:function(t,n,o){var a=b.get.tabElement(t),r=a[0];o=o!==i?o:x.evaluateScripts,"string"==typeof x.cacheType&&"dom"==x.cacheType.toLowerCase()&&"string"!=typeof n?a.empty().append(e(n).clone(!0)):o?(b.debug("Updating HTML and evaluating inline scripts",t,n),a.html(n)):(b.debug("Updating HTML",t,n),r.innerHTML=n)}},fetch:{content:function(t,n){var o,a,r=b.get.tabElement(t),s={dataType:"html",encodeParameters:!1,on:"now",cache:x.alwaysRefresh,headers:{"X-Remote":!0},onSuccess:function(e){"response"==x.cacheType&&b.cache.add(n,e),b.update.content(t,e),t==h?(b.debug("Content loaded",t),b.activate.tab(t)):b.debug("Content loaded in background",t),x.onFirstLoad.call(r[0],t,v,y),x.onLoad.call(r[0],t,v,y),x.loadOnce?b.cache.add(n,!0):"string"==typeof x.cacheType&&"dom"==x.cacheType.toLowerCase()&&r.children().length>0?setTimeout(function(){var e=r.children().clone(!0);e=e.not("script"),b.cache.add(n,e)},0):b.cache.add(n,r.html())},urlData:{tab:n}},l=r.api("get request")||!1,c=l&&"pending"===l.state();n=n||t,a=b.cache.read(n),x.cache&&a?(b.activate.tab(t),b.debug("Adding cached content",n),x.loadOnce||("once"==x.evaluateScripts?b.update.content(t,a,!1):b.update.content(t,a)),x.onLoad.call(r[0],t,v,y)):c?(b.set.loading(t),b.debug("Content is already loading",n)):e.api!==i?(o=e.extend(!0,{},x.apiSettings,s),b.debug("Retrieving remote content",n,o),b.set.loading(t),r.api(o)):b.error(S.api)}},activate:{all:function(e){b.activate.tab(e),b.activate.navigation(e)},tab:function(e){var t=b.get.tabElement(e),n="siblings"==x.deactivate?t.siblings(p):p.not(t),i=t.hasClass(C.active);b.verbose("Showing tab content for",t),i||(t.addClass(C.active),n.removeClass(C.active+" "+C.loading),t.length>0&&x.onVisible.call(t[0],e))},navigation:function(e){var t=b.get.navElement(e),n="siblings"==x.deactivate?t.siblings(r):r.not(t),i=t.hasClass(C.active);b.verbose("Activating tab navigation for",t,e),i||(t.addClass(C.active),n.removeClass(C.active+" "+C.loading))}},deactivate:{all:function(){b.deactivate.navigation(),b.deactivate.tabs()},navigation:function(){r.removeClass(C.active)},tabs:function(){p.removeClass(C.active+" "+C.loading)}},is:{tab:function(e){return e!==i?b.get.tabElement(e).length>0:!1}},get:{initialPath:function(){return r.eq(0).data(w.tab)||p.eq(0).data(w.tab)},path:function(){return e.address.value()},defaultPathArray:function(e){return b.utilities.pathToArray(b.get.defaultPath(e))},defaultPath:function(e){var t=r.filter("[data-"+w.tab+'^="'+e+'/"]').eq(0),n=t.data(w.tab)||!1;if(n){if(b.debug("Found default tab",n),F<x.maxDepth)return F++,b.get.defaultPath(n);b.error(S.recursion)}else b.debug("No default tabs found for",e,p);return F=0,e},navElement:function(e){return e=e||h,r.filter("[data-"+w.tab+'="'+e+'"]')},tabElement:function(e){var t,n,i,o;return e=e||h,i=b.utilities.pathToArray(e),o=b.utilities.last(i),t=p.filter("[data-"+w.tab+'="'+e+'"]'),n=p.filter("[data-"+w.tab+'="'+o+'"]'),t.length>0?t:n},tab:function(){return h}},utilities:{filterArray:function(t,n){return e.grep(t,function(t){return-1==e.inArray(t,n)})},last:function(t){return e.isArray(t)?t[t.length-1]:!1},pathToArray:function(e){return e===i&&(e=h),"string"==typeof e?e.split("/"):[e]},arrayToPath:function(t){return e.isArray(t)?t.join("/"):!1}},setting:function(t,n){if(b.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,x,t);else{if(n===i)return x[t];e.isPlainObject(x[t])?e.extend(!0,x[t],n):x[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,b,t);else{if(n===i)return b[t];b[t]=n}},debug:function(){!x.silent&&x.debug&&(x.performance?b.performance.log(arguments):(b.debug=Function.prototype.bind.call(console.info,console,x.name+":"),b.debug.apply(console,arguments)))},verbose:function(){!x.silent&&x.verbose&&x.debug&&(x.performance?b.performance.log(arguments):(b.verbose=Function.prototype.bind.call(console.info,console,x.name+":"),b.verbose.apply(console,arguments)))},error:function(){x.silent||(b.error=Function.prototype.bind.call(console.error,console,x.name+":"),b.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;x.performance&&(t=(new Date).getTime(),i=l||t,n=t-i,l=t,c.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:O,"Execution Time":n})),clearTimeout(b.performance.timer),b.performance.timer=setTimeout(b.performance.display,500)},display:function(){var t=x.name+":",n=0;l=!1,clearTimeout(b.performance.timer),e.each(c,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",s&&(t+=" '"+s+"'"),(console.group!==i||console.table!==i)&&c.length>0&&(console.groupCollapsed(t),
console.table?console.table(c):e.each(c,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),c=[]}},invoke:function(t,n,o){var r,s,l,c=D;return n=n||f,o=O||o,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):(b.error(S.method,t),!1);c=c[o]}})),e.isFunction(s)?l=s.apply(o,n):s!==i&&(l=s),e.isArray(a)?a.push(l):a!==i?a=[a,l]:l!==i&&(a=l),s}},d?(D===i&&b.initialize(),b.invoke(u)):(D!==i&&D.invoke("destroy"),b.initialize())}),a!==i?a:this},e.tab=function(){e(t).tab.apply(this,arguments)},e.fn.tab.settings={name:"Tab",namespace:"tab",silent:!1,debug:!1,verbose:!1,performance:!0,auto:!1,history:!1,historyType:"hash",path:!1,context:!1,childrenOnly:!1,maxDepth:25,deactivate:"siblings",alwaysRefresh:!1,cache:!0,loadOnce:!1,cacheType:"response",ignoreFirstLoad:!1,apiSettings:!1,evaluateScripts:"once",onFirstLoad:function(e,t,n){},onLoad:function(e,t,n){},onVisible:function(e,t,n){},onRequest:function(e,t,n){},templates:{determineTitle:function(e){}},error:{api:"You attempted to load content without API module",method:"The method you called is not defined",missingTab:"Activated tab cannot be found. Tabs are case-sensitive.",noContent:"The tab you specified is missing a content url.",path:"History enabled, but no path was specified",recursion:"Max recursive depth reached",legacyInit:"onTabInit has been renamed to onFirstLoad in 2.0, please adjust your code.",legacyLoad:"onTabLoad has been renamed to onLoad in 2.0. Please adjust your code",state:"History requires Asual's Address library <https://github.com/asual/jquery-address>"},metadata:{tab:"tab",loaded:"loaded",promise:"promise"},className:{loading:"loading",active:"active"},selector:{tabs:".ui.tab",ui:".ui"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.transition=function(){var o,a=e(this),r=a.selector||"",s=(new Date).getTime(),l=[],c=arguments,u=c[0],d=[].slice.call(arguments,1),f="string"==typeof u;t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)};return a.each(function(t){var m,g,p,h,v,b,y,x,C,w=e(this),k=this;C={initialize:function(){m=C.get.settings.apply(k,c),h=m.className,p=m.error,v=m.metadata,x="."+m.namespace,y="module-"+m.namespace,g=w.data(y)||C,b=C.get.animationEndEvent(),f&&(f=C.invoke(u)),f===!1&&(C.verbose("Converted arguments into settings object",m),m.interval?C.delay(m.animate):C.animate(),C.instantiate())},instantiate:function(){C.verbose("Storing instance of module",C),g=C,w.data(y,g)},destroy:function(){C.verbose("Destroying previous module for",k),w.removeData(y)},refresh:function(){C.verbose("Refreshing display type on next animation"),delete C.displayType},forceRepaint:function(){C.verbose("Forcing element repaint");var e=w.parent(),t=w.next();0===t.length?w.detach().appendTo(e):w.detach().insertBefore(t)},repaint:function(){C.verbose("Repainting element");k.offsetWidth},delay:function(e){var n,o,r=C.get.animationDirection();r||(r=C.can.transition()?C.get.direction():"static"),e=e!==i?e:m.interval,n="auto"==m.reverse&&r==h.outward,o=n||1==m.reverse?(a.length-t)*m.interval:t*m.interval,C.debug("Delaying animation by",o),setTimeout(C.animate,o)},animate:function(e){if(m=e||m,!C.is.supported())return C.error(p.support),!1;if(C.debug("Preparing animation",m.animation),C.is.animating()){if(m.queue)return!m.allowRepeats&&C.has.direction()&&C.is.occurring()&&C.queuing!==!0?C.debug("Animation is currently occurring, preventing queueing same animation",m.animation):C.queue(m.animation),!1;if(!m.allowRepeats&&C.is.occurring())return C.debug("Animation is already occurring, will not execute repeated animation",m.animation),!1;C.debug("New animation started, completing previous early",m.animation),g.complete()}C.can.animate()?C.set.animating(m.animation):C.error(p.noAnimation,m.animation,k)},reset:function(){C.debug("Resetting animation to beginning conditions"),C.remove.animationCallbacks(),C.restore.conditions(),C.remove.animating()},queue:function(e){C.debug("Queueing animation of",e),C.queuing=!0,w.one(b+".queue"+x,function(){C.queuing=!1,C.repaint(),C.animate.apply(this,m)})},complete:function(e){C.debug("Animation complete",m.animation),C.remove.completeCallback(),C.remove.failSafe(),C.is.looping()||(C.is.outward()?(C.verbose("Animation is outward, hiding element"),C.restore.conditions(),C.hide()):C.is.inward()?(C.verbose("Animation is outward, showing element"),C.restore.conditions(),C.show()):(C.verbose("Static animation completed"),C.restore.conditions(),m.onComplete.call(k)))},force:{visible:function(){var e=w.attr("style"),t=C.get.userStyle(),n=C.get.displayType(),o=t+"display: "+n+" !important;",a=w.css("display"),r=e===i||""===e;a!==n?(C.verbose("Overriding default display to show element",n),w.attr("style",o)):r&&w.removeAttr("style")},hidden:function(){var e=w.attr("style"),t=w.css("display"),n=e===i||""===e;"none"===t||C.is.hidden()?n&&w.removeAttr("style"):(C.verbose("Overriding default display to hide element"),w.css("display","none"))}},has:{direction:function(t){var n=!1;return t=t||m.animation,"string"==typeof t&&(t=t.split(" "),e.each(t,function(e,t){t!==h.inward&&t!==h.outward||(n=!0)})),n},inlineDisplay:function(){var t=w.attr("style")||"";return e.isArray(t.match(/display.*?;/,""))}},set:{animating:function(e){var t;C.remove.completeCallback(),e=e||m.animation,t=C.get.animationClass(e),C.save.animation(t),C.force.visible(),C.remove.hidden(),C.remove.direction(),C.start.animation(t)},duration:function(e,t){t=t||m.duration,t="number"==typeof t?t+"ms":t,(t||0===t)&&(C.verbose("Setting animation duration",t),w.css({"animation-duration":t}))},direction:function(e){e=e||C.get.direction(),e==h.inward?C.set.inward():C.set.outward()},looping:function(){C.debug("Transition set to loop"),w.addClass(h.looping)},hidden:function(){w.addClass(h.transition).addClass(h.hidden)},inward:function(){C.debug("Setting direction to inward"),w.removeClass(h.outward).addClass(h.inward)},outward:function(){C.debug("Setting direction to outward"),w.removeClass(h.inward).addClass(h.outward)},visible:function(){w.addClass(h.transition).addClass(h.visible)}},start:{animation:function(e){e=e||C.get.animationClass(),C.debug("Starting tween",e),w.addClass(e).one(b+".complete"+x,C.complete),m.useFailSafe&&C.add.failSafe(),C.set.duration(m.duration),m.onStart.call(k)}},save:{animation:function(e){C.cache||(C.cache={}),C.cache.animation=e},displayType:function(e){"none"!==e&&w.data(v.displayType,e)},transitionExists:function(t,n){e.fn.transition.exists[t]=n,C.verbose("Saving existence of transition",t,n)}},restore:{conditions:function(){var e=C.get.currentAnimation();e&&(w.removeClass(e),C.verbose("Removing animation class",C.cache)),C.remove.duration()}},add:{failSafe:function(){var e=C.get.duration();C.timer=setTimeout(function(){w.triggerHandler(b)},e+m.failSafeDelay),C.verbose("Adding fail safe timer",C.timer)}},remove:{animating:function(){w.removeClass(h.animating)},animationCallbacks:function(){C.remove.queueCallback(),C.remove.completeCallback()},queueCallback:function(){w.off(".queue"+x)},completeCallback:function(){w.off(".complete"+x)},display:function(){w.css("display","")},direction:function(){w.removeClass(h.inward).removeClass(h.outward)},duration:function(){w.css("animation-duration","")},failSafe:function(){C.verbose("Removing fail safe timer",C.timer),C.timer&&clearTimeout(C.timer)},hidden:function(){w.removeClass(h.hidden)},visible:function(){w.removeClass(h.visible)},looping:function(){C.debug("Transitions are no longer looping"),C.is.looping()&&(C.reset(),w.removeClass(h.looping))},transition:function(){w.removeClass(h.visible).removeClass(h.hidden)}},get:{settings:function(t,n,i){return"object"==typeof t?e.extend(!0,{},e.fn.transition.settings,t):"function"==typeof i?e.extend({},e.fn.transition.settings,{animation:t,onComplete:i,duration:n}):"string"==typeof n||"number"==typeof n?e.extend({},e.fn.transition.settings,{animation:t,duration:n}):"object"==typeof n?e.extend({},e.fn.transition.settings,n,{animation:t}):"function"==typeof n?e.extend({},e.fn.transition.settings,{animation:t,onComplete:n}):e.extend({},e.fn.transition.settings,{animation:t})},animationClass:function(e){var t=e||m.animation,n=C.can.transition()&&!C.has.direction()?C.get.direction()+" ":"";return h.animating+" "+h.transition+" "+n+t},currentAnimation:function(){return C.cache&&C.cache.animation!==i?C.cache.animation:!1},currentDirection:function(){return C.is.inward()?h.inward:h.outward},direction:function(){return C.is.hidden()||!C.is.visible()?h.inward:h.outward},animationDirection:function(t){var n;return t=t||m.animation,"string"==typeof t&&(t=t.split(" "),e.each(t,function(e,t){t===h.inward?n=h.inward:t===h.outward&&(n=h.outward)})),n?n:!1},duration:function(e){return e=e||m.duration,e===!1&&(e=w.css("animation-duration")||0),"string"==typeof e?e.indexOf("ms")>-1?parseFloat(e):1e3*parseFloat(e):e},displayType:function(e){return e=e!==i?e:!0,m.displayType?m.displayType:(e&&w.data(v.displayType)===i&&C.can.transition(!0),w.data(v.displayType))},userStyle:function(e){return e=e||w.attr("style")||"",e.replace(/display.*?;/,"")},transitionExists:function(t){return e.fn.transition.exists[t]},animationStartEvent:function(){var e,t=n.createElement("div"),o={animation:"animationstart",OAnimation:"oAnimationStart",MozAnimation:"mozAnimationStart",WebkitAnimation:"webkitAnimationStart"};for(e in o)if(t.style[e]!==i)return o[e];return!1},animationEndEvent:function(){var e,t=n.createElement("div"),o={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"mozAnimationEnd",WebkitAnimation:"webkitAnimationEnd"};for(e in o)if(t.style[e]!==i)return o[e];return!1}},can:{transition:function(t){var n,o,a,r,s,l,c=m.animation,u=C.get.transitionExists(c),d=C.get.displayType(!1);if(u===i||t){if(C.verbose("Determining whether animation exists"),n=w.attr("class"),o=w.prop("tagName"),a=e("<"+o+" />").addClass(n).insertAfter(w),r=a.addClass(c).removeClass(h.inward).removeClass(h.outward).addClass(h.animating).addClass(h.transition).css("animationName"),s=a.addClass(h.inward).css("animationName"),d||(d=a.attr("class",n).removeAttr("style").removeClass(h.hidden).removeClass(h.visible).show().css("display"),C.verbose("Determining final display state",d),C.save.displayType(d)),a.remove(),r!=s)C.debug("Direction exists for animation",c),l=!0;else{if("none"==r||!r)return void C.debug("No animation defined in css",c);C.debug("Static animation found",c,d),l=!1}C.save.transitionExists(c,l)}return u!==i?u:l},animate:function(){return C.can.transition()!==i}},is:{animating:function(){return w.hasClass(h.animating)},inward:function(){return w.hasClass(h.inward)},outward:function(){return w.hasClass(h.outward)},looping:function(){return w.hasClass(h.looping)},occurring:function(e){return e=e||m.animation,e="."+e.replace(" ","."),w.filter(e).length>0},visible:function(){return w.is(":visible")},hidden:function(){return"hidden"===w.css("visibility")},supported:function(){return b!==!1}},hide:function(){C.verbose("Hiding element"),C.is.animating()&&C.reset(),k.blur(),C.remove.display(),C.remove.visible(),C.set.hidden(),C.force.hidden(),m.onHide.call(k),m.onComplete.call(k)},show:function(e){C.verbose("Showing element",e),C.remove.hidden(),C.set.visible(),C.force.visible(),m.onShow.call(k),m.onComplete.call(k)},toggle:function(){C.is.visible()?C.hide():C.show()},stop:function(){C.debug("Stopping current animation"),w.triggerHandler(b)},stopAll:function(){C.debug("Stopping all animation"),C.remove.queueCallback(),w.triggerHandler(b)},clear:{queue:function(){C.debug("Clearing animation queue"),C.remove.queueCallback()}},enable:function(){C.verbose("Starting animation"),w.removeClass(h.disabled)},disable:function(){C.debug("Stopping animation"),w.addClass(h.disabled)},setting:function(t,n){if(C.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,m,t);else{if(n===i)return m[t];e.isPlainObject(m[t])?e.extend(!0,m[t],n):m[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,C,t);else{if(n===i)return C[t];C[t]=n}},debug:function(){!m.silent&&m.debug&&(m.performance?C.performance.log(arguments):(C.debug=Function.prototype.bind.call(console.info,console,m.name+":"),C.debug.apply(console,arguments)))},verbose:function(){!m.silent&&m.verbose&&m.debug&&(m.performance?C.performance.log(arguments):(C.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),C.verbose.apply(console,arguments)))},error:function(){m.silent||(C.error=Function.prototype.bind.call(console.error,console,m.name+":"),C.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;m.performance&&(t=(new Date).getTime(),i=s||t,n=t-i,s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:k,"Execution Time":n})),clearTimeout(C.performance.timer),C.performance.timer=setTimeout(C.performance.display,500)},display:function(){var t=m.name+":",n=0;s=!1,clearTimeout(C.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",r&&(t+=" '"+r+"'"),a.length>1&&(t+=" ("+a.length+")"),(console.group!==i||console.table!==i)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,a){var r,s,l,c=g;return n=n||d,a=k||a,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):!1;c=c[o]}})),e.isFunction(s)?l=s.apply(a,n):s!==i&&(l=s),e.isArray(o)?o.push(l):o!==i?o=[o,l]:l!==i&&(o=l),s!==i?s:!1}},C.initialize()}),o!==i?o:this},e.fn.transition.exists={},e.fn.transition.settings={name:"Transition",silent:!1,debug:!1,verbose:!1,performance:!0,namespace:"transition",interval:0,reverse:"auto",onStart:function(){},onComplete:function(){},onShow:function(){},onHide:function(){},useFailSafe:!0,failSafeDelay:100,allowRepeats:!1,displayType:!1,animation:"fade",duration:!1,queue:!0,metadata:{displayType:"display"},className:{animating:"animating",disabled:"disabled",hidden:"hidden",inward:"in",loading:"loading",looping:"looping",outward:"out",transition:"transition",visible:"visible"},error:{noAnimation:"Element is no longer attached to DOM. Unable to animate.  Use silent setting to surpress this warning in production.",repeated:"That animation is already occurring, cancelling repeated animation",method:"The method you called is not defined",support:"This browser does not support CSS animations"}}}(jQuery,window,document),function(e,t,n,i){"use strict";var t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();e.api=e.fn.api=function(n){var o,a=e(e.isFunction(this)?t:this),r=a.selector||"",s=(new Date).getTime(),l=[],c=arguments[0],u="string"==typeof c,d=[].slice.call(arguments,1);return a.each(function(){var a,f,m,g,p,h,v=e.isPlainObject(n)?e.extend(!0,{},e.fn.api.settings,n):e.extend({},e.fn.api.settings),b=v.namespace,y=v.metadata,x=v.selector,C=v.error,w=v.className,k="."+b,S="module-"+b,T=e(this),A=T.closest(x.form),R=v.stateContext?e(v.stateContext):T,P=this,E=R[0],F=T.data(S);h={initialize:function(){u||h.bind.events(),h.instantiate()},instantiate:function(){h.verbose("Storing instance of module",h),F=h,T.data(S,F)},destroy:function(){h.verbose("Destroying previous module for",P),T.removeData(S).off(k)},bind:{events:function(){var e=h.get.event();e?(h.verbose("Attaching API events to element",e),T.on(e+k,h.event.trigger)):"now"==v.on&&(h.debug("Querying API endpoint immediately"),h.query())}},decode:{json:function(e){if(e!==i&&"string"==typeof e)try{e=JSON.parse(e)}catch(t){}return e}},read:{cachedResponse:function(e){var n;return t.Storage===i?void h.error(C.noStorage):(n=sessionStorage.getItem(e),h.debug("Using cached response",e,n),n=h.decode.json(n))}},write:{cachedResponse:function(n,o){return o&&""===o?void h.debug("Response empty, not caching",o):t.Storage===i?void h.error(C.noStorage):(e.isPlainObject(o)&&(o=JSON.stringify(o)),sessionStorage.setItem(n,o),void h.verbose("Storing cached response for url",n,o))}},query:function(){if(h.is.disabled())return void h.debug("Element is disabled API request aborted");if(h.is.loading()){if(!v.interruptRequests)return void h.debug("Cancelling request, previous request is still pending");h.debug("Interrupting previous request"),h.abort()}return v.defaultData&&e.extend(!0,v.urlData,h.get.defaultData()),v.serializeForm&&(v.data=h.add.formData(v.data)),f=h.get.settings(),f===!1?(h.cancelled=!0,void h.error(C.beforeSend)):(h.cancelled=!1,m=h.get.templatedURL(),m||h.is.mocked()?(m=h.add.urlData(m),m||h.is.mocked()?(f.url=v.base+m,a=e.extend(!0,{},v,{type:v.method||v.type,data:g,url:v.base+m,beforeSend:v.beforeXHR,success:function(){},failure:function(){},complete:function(){}}),h.debug("Querying URL",a.url),h.verbose("Using AJAX settings",a),"local"===v.cache&&h.read.cachedResponse(m)?(h.debug("Response returned from local cache"),h.request=h.create.request(),void h.request.resolveWith(E,[h.read.cachedResponse(m)])):void(v.throttle?v.throttleFirstRequest||h.timer?(h.debug("Throttling request",v.throttle),clearTimeout(h.timer),h.timer=setTimeout(function(){h.timer&&delete h.timer,h.debug("Sending throttled request",g,a.method),h.send.request()},v.throttle)):(h.debug("Sending request",g,a.method),h.send.request(),h.timer=setTimeout(function(){},v.throttle)):(h.debug("Sending request",g,a.method),h.send.request()))):void 0):void h.error(C.missingURL))},should:{removeError:function(){return v.hideError===!0||"auto"===v.hideError&&!h.is.form()}},is:{disabled:function(){return T.filter(x.disabled).length>0},expectingJSON:function(){return"json"===v.dataType||"jsonp"===v.dataType},form:function(){return T.is("form")||R.is("form")},mocked:function(){return v.mockResponse||v.mockResponseAsync||v.response||v.responseAsync},input:function(){return T.is("input")},loading:function(){return h.request?"pending"==h.request.state():!1},abortedRequest:function(e){return e&&e.readyState!==i&&0===e.readyState?(h.verbose("XHR request determined to be aborted"),!0):(h.verbose("XHR request was not aborted"),!1)},validResponse:function(t){return h.is.expectingJSON()&&e.isFunction(v.successTest)?(h.debug("Checking JSON returned success",v.successTest,t),v.successTest(t)?(h.debug("Response passed success test",t),!0):(h.debug("Response failed success test",t),!1)):(h.verbose("Response is not JSON, skipping validation",v.successTest,t),!0)}},was:{cancelled:function(){return h.cancelled||!1},succesful:function(){return h.request&&"resolved"==h.request.state()},failure:function(){return h.request&&"rejected"==h.request.state()},complete:function(){return h.request&&("resolved"==h.request.state()||"rejected"==h.request.state())}},add:{urlData:function(t,n){var o,a;return t&&(o=t.match(v.regExp.required),a=t.match(v.regExp.optional),n=n||v.urlData,o&&(h.debug("Looking for required URL variables",o),e.each(o,function(o,a){var r=-1!==a.indexOf("$")?a.substr(2,a.length-3):a.substr(1,a.length-2),s=e.isPlainObject(n)&&n[r]!==i?n[r]:T.data(r)!==i?T.data(r):R.data(r)!==i?R.data(r):n[r];return s===i?(h.error(C.requiredParameter,r,t),t=!1,!1):(h.verbose("Found required variable",r,s),s=v.encodeParameters?h.get.urlEncodedValue(s):s,t=t.replace(a,s),void 0)})),a&&(h.debug("Looking for optional URL variables",o),e.each(a,function(o,a){var r=-1!==a.indexOf("$")?a.substr(3,a.length-4):a.substr(2,a.length-3),s=e.isPlainObject(n)&&n[r]!==i?n[r]:T.data(r)!==i?T.data(r):R.data(r)!==i?R.data(r):n[r];s!==i?(h.verbose("Optional variable Found",r,s),t=t.replace(a,s)):(h.verbose("Optional variable not found",r),t=-1!==t.indexOf("/"+a)?t.replace("/"+a,""):t.replace(a,""))}))),t},formData:function(t){var n,o=e.fn.serializeObject!==i,a=o?A.serializeObject():A.serialize();return t=t||v.data,n=e.isPlainObject(t),n?o?(h.debug("Extending existing data with form data",t,a),t=e.extend(!0,{},t,a)):(h.error(C.missingSerialize),h.debug("Cant extend data. Replacing data with form data",t,a),t=a):(h.debug("Adding form data",a),t=a),t}},send:{request:function(){h.set.loading(),h.request=h.create.request(),h.is.mocked()?h.mockedXHR=h.create.mockedXHR():h.xhr=h.create.xhr(),v.onRequest.call(E,h.request,h.xhr)}},event:{trigger:function(e){h.query(),"submit"!=e.type&&"click"!=e.type||e.preventDefault()},xhr:{always:function(){},done:function(t,n,i){var o=this,a=(new Date).getTime()-p,r=v.loadingDuration-a,s=e.isFunction(v.onResponse)?h.is.expectingJSON()?v.onResponse.call(o,e.extend(!0,{},t)):v.onResponse.call(o,t):!1;r=r>0?r:0,s&&(h.debug("Modified API response in onResponse callback",v.onResponse,s,t),t=s),r>0&&h.debug("Response completed early delaying state change by",r),setTimeout(function(){h.is.validResponse(t)?h.request.resolveWith(o,[t,i]):h.request.rejectWith(o,[i,"invalid"])},r)},fail:function(e,t,n){var i=this,o=(new Date).getTime()-p,a=v.loadingDuration-o;a=a>0?a:0,a>0&&h.debug("Response completed early delaying state change by",a),setTimeout(function(){h.is.abortedRequest(e)?h.request.rejectWith(i,[e,"aborted",n]):h.request.rejectWith(i,[e,"error",t,n])},a)}},request:{done:function(e,t){h.debug("Successful API Response",e),"local"===v.cache&&m&&(h.write.cachedResponse(m,e),h.debug("Saving server response locally",h.cache)),v.onSuccess.call(E,e,T,t)},complete:function(e,t){var n,i;h.was.succesful()?(i=e,n=t):(n=e,i=h.get.responseFromXHR(n)),h.remove.loading(),v.onComplete.call(E,i,T,n)},fail:function(e,t,n){var o=h.get.responseFromXHR(e),r=h.get.errorFromRequest(o,t,n);return"aborted"==t?(h.debug("XHR Aborted (Most likely caused by page navigation or CORS Policy)",t,n),v.onAbort.call(E,t,T,e),!0):("invalid"==t?h.debug("JSON did not pass success test. A server-side error has most likely occurred",o):"error"==t&&e!==i&&(h.debug("XHR produced a server error",t,n),200!=e.status&&n!==i&&""!==n&&h.error(C.statusMessage+n,a.url),v.onError.call(E,r,T,e)),v.errorDuration&&"aborted"!==t&&(h.debug("Adding error state"),h.set.error(),h.should.removeError()&&setTimeout(h.remove.error,v.errorDuration)),h.debug("API Request failed",r,e),void v.onFailure.call(E,o,T,e))}}},create:{request:function(){return e.Deferred().always(h.event.request.complete).done(h.event.request.done).fail(h.event.request.fail)},mockedXHR:function(){var t,n,i,o=!1,a=!1,r=!1,s=v.mockResponse||v.response,l=v.mockResponseAsync||v.responseAsync;return i=e.Deferred().always(h.event.xhr.complete).done(h.event.xhr.done).fail(h.event.xhr.fail),s?(e.isFunction(s)?(h.debug("Using specified synchronous callback",s),n=s.call(E,f)):(h.debug("Using settings specified response",s),n=s),i.resolveWith(E,[n,o,{responseText:n}])):e.isFunction(l)&&(t=function(e){h.debug("Async callback returned response",e),e?i.resolveWith(E,[e,o,{responseText:e}]):i.rejectWith(E,[{responseText:e},a,r])},h.debug("Using specified async response callback",l),l.call(E,f,t)),i},xhr:function(){var t;return t=e.ajax(a).always(h.event.xhr.always).done(h.event.xhr.done).fail(h.event.xhr.fail),h.verbose("Created server request",t,a),t}},set:{error:function(){h.verbose("Adding error state to element",R),R.addClass(w.error)},loading:function(){h.verbose("Adding loading state to element",R),R.addClass(w.loading),p=(new Date).getTime()}},remove:{error:function(){h.verbose("Removing error state from element",R),R.removeClass(w.error)},loading:function(){h.verbose("Removing loading state from element",R),R.removeClass(w.loading)}},get:{responseFromXHR:function(t){return e.isPlainObject(t)?h.is.expectingJSON()?h.decode.json(t.responseText):t.responseText:!1},errorFromRequest:function(t,n,o){return e.isPlainObject(t)&&t.error!==i?t.error:v.error[n]!==i?v.error[n]:o},request:function(){return h.request||!1},xhr:function(){return h.xhr||!1},settings:function(){var t;return t=v.beforeSend.call(E,v),t&&(t.success!==i&&(h.debug("Legacy success callback detected",t),h.error(C.legacyParameters,t.success),t.onSuccess=t.success),t.failure!==i&&(h.debug("Legacy failure callback detected",t),h.error(C.legacyParameters,t.failure),t.onFailure=t.failure),t.complete!==i&&(h.debug("Legacy complete callback detected",t),h.error(C.legacyParameters,t.complete),t.onComplete=t.complete)),t===i&&h.error(C.noReturnedValue),t===!1?t:t!==i?e.extend(!0,{},t):e.extend(!0,{},v)},urlEncodedValue:function(e){var n=t.decodeURIComponent(e),i=t.encodeURIComponent(e),o=n!==e;return o?(h.debug("URL value is already encoded, avoiding double encoding",e),e):(h.verbose("Encoding value using encodeURIComponent",e,i),i)},defaultData:function(){var t={};return e.isWindow(P)||(h.is.input()?t.value=T.val():h.is.form()||(t.text=T.text())),t},event:function(){return e.isWindow(P)||"now"==v.on?(h.debug("API called without element, no events attached"),!1):"auto"==v.on?T.is("input")?P.oninput!==i?"input":P.onpropertychange!==i?"propertychange":"keyup":T.is("form")?"submit":"click":v.on},templatedURL:function(e){if(e=e||T.data(y.action)||v.action||!1,m=T.data(y.url)||v.url||!1)return h.debug("Using specified url",m),m;if(e){if(h.debug("Looking up url for action",e,v.api),v.api[e]===i&&!h.is.mocked())return void h.error(C.missingAction,v.action,v.api);m=v.api[e]}else h.is.form()&&(m=T.attr("action")||R.attr("action")||!1,h.debug("No url or action specified, defaulting to form action",m));return m}},abort:function(){var e=h.get.xhr();e&&"resolved"!==e.state()&&(h.debug("Cancelling API request"),e.abort())},reset:function(){h.remove.error(),h.remove.loading()},setting:function(t,n){if(h.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,v,t);else{if(n===i)return v[t];e.isPlainObject(v[t])?e.extend(!0,v[t],n):v[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,h,t);else{if(n===i)return h[t];h[t]=n}},debug:function(){!v.silent&&v.debug&&(v.performance?h.performance.log(arguments):(h.debug=Function.prototype.bind.call(console.info,console,v.name+":"),h.debug.apply(console,arguments)))},verbose:function(){!v.silent&&v.verbose&&v.debug&&(v.performance?h.performance.log(arguments):(h.verbose=Function.prototype.bind.call(console.info,console,v.name+":"),h.verbose.apply(console,arguments)))},error:function(){v.silent||(h.error=Function.prototype.bind.call(console.error,console,v.name+":"),h.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;v.performance&&(t=(new Date).getTime(),i=s||t,n=t-i,s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"","Execution Time":n})),clearTimeout(h.performance.timer),h.performance.timer=setTimeout(h.performance.display,500)},display:function(){var t=v.name+":",n=0;s=!1,clearTimeout(h.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",r&&(t+=" '"+r+"'"),(console.group!==i||console.table!==i)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,a){var r,s,l,c=F;return n=n||d,a=P||a,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):(h.error(C.method,t),!1);c=c[o]}})),e.isFunction(s)?l=s.apply(a,n):s!==i&&(l=s),e.isArray(o)?o.push(l):o!==i?o=[o,l]:l!==i&&(o=l),s}},u?(F===i&&h.initialize(),h.invoke(c)):(F!==i&&F.invoke("destroy"),h.initialize())}),o!==i?o:this},e.api.settings={name:"API",namespace:"api",debug:!1,verbose:!1,performance:!0,api:{},cache:!0,interruptRequests:!0,on:"auto",stateContext:!1,loadingDuration:0,hideError:"auto",errorDuration:2e3,encodeParameters:!0,action:!1,url:!1,base:"",urlData:{},defaultData:!0,serializeForm:!1,throttle:0,throttleFirstRequest:!0,method:"get",data:{},dataType:"json",mockResponse:!1,mockResponseAsync:!1,response:!1,responseAsync:!1,beforeSend:function(e){return e},beforeXHR:function(e){},onRequest:function(e,t){},onResponse:!1,onSuccess:function(e,t){},onComplete:function(e,t){},onFailure:function(e,t){},onError:function(e,t){},onAbort:function(e,t){},successTest:!1,error:{beforeSend:"The before send function has aborted the request",error:"There was an error with your request",exitConditions:"API Request Aborted. Exit conditions met",JSONParse:"JSON could not be parsed during error handling",legacyParameters:"You are using legacy API success callback names",method:"The method you called is not defined",missingAction:"API action used but no url was defined",missingSerialize:"jquery-serialize-object is required to add form data to an existing data object",missingURL:"No URL specified for api event",noReturnedValue:"The beforeSend callback must return a settings object, beforeSend ignored.",noStorage:"Caching responses locally requires session storage",parseError:"There was an error parsing your request",requiredParameter:"Missing a required URL parameter: ",statusMessage:"Server gave an error: ",timeout:"Your request timed out"},regExp:{required:/\{\$*[A-z0-9]+\}/g,optional:/\{\/\$*[A-z0-9]+\}/g},className:{loading:"loading",error:"error"},selector:{disabled:".disabled",form:"form"},metadata:{action:"action",url:"url"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.state=function(t){var o,a=e(this),r=a.selector||"",s=("ontouchstart"in n.documentElement,(new Date).getTime()),l=[],c=arguments[0],u="string"==typeof c,d=[].slice.call(arguments,1);return a.each(function(){var n,f=e.isPlainObject(t)?e.extend(!0,{},e.fn.state.settings,t):e.extend({},e.fn.state.settings),m=f.error,g=f.metadata,p=f.className,h=f.namespace,v=f.states,b=f.text,y="."+h,x=h+"-module",C=e(this),w=this,k=C.data(x);n={initialize:function(){n.verbose("Initializing module"),f.automatic&&n.add.defaults(),f.context&&""!==r?e(f.context).on(r,"mouseenter"+y,n.change.text).on(r,"mouseleave"+y,n.reset.text).on(r,"click"+y,n.toggle.state):C.on("mouseenter"+y,n.change.text).on("mouseleave"+y,n.reset.text).on("click"+y,n.toggle.state),n.instantiate()},instantiate:function(){n.verbose("Storing instance of module",n),k=n,C.data(x,n)},destroy:function(){n.verbose("Destroying previous module",k),C.off(y).removeData(x)},refresh:function(){n.verbose("Refreshing selector cache"),C=e(w)},add:{defaults:function(){var o=t&&e.isPlainObject(t.states)?t.states:{};e.each(f.defaults,function(t,a){n.is[t]!==i&&n.is[t]()&&(n.verbose("Adding default states",t,w),e.extend(f.states,a,o))})}},is:{active:function(){return C.hasClass(p.active)},loading:function(){return C.hasClass(p.loading)},inactive:function(){return!C.hasClass(p.active)},state:function(e){return p[e]===i?!1:C.hasClass(p[e])},enabled:function(){return!C.is(f.filter.active)},disabled:function(){return C.is(f.filter.active)},textEnabled:function(){return!C.is(f.filter.text)},button:function(){return C.is(".button:not(a, .submit)")},input:function(){return C.is("input")},progress:function(){return C.is(".ui.progress")}},allow:function(e){n.debug("Now allowing state",e),v[e]=!0},disallow:function(e){n.debug("No longer allowing",e),v[e]=!1},allows:function(e){return v[e]||!1},enable:function(){C.removeClass(p.disabled)},disable:function(){C.addClass(p.disabled)},setState:function(e){n.allows(e)&&C.addClass(p[e])},removeState:function(e){n.allows(e)&&C.removeClass(p[e])},toggle:{state:function(){var t,o;if(n.allows("active")&&n.is.enabled()){
if(n.refresh(),e.fn.api!==i)if(t=C.api("get request"),o=C.api("was cancelled"))n.debug("API Request cancelled by beforesend"),f.activateTest=function(){return!1},f.deactivateTest=function(){return!1};else if(t)return void n.listenTo(t);n.change.state()}}},listenTo:function(t){n.debug("API request detected, waiting for state signal",t),t&&(b.loading&&n.update.text(b.loading),e.when(t).then(function(){"resolved"==t.state()?(n.debug("API request succeeded"),f.activateTest=function(){return!0},f.deactivateTest=function(){return!0}):(n.debug("API request failed"),f.activateTest=function(){return!1},f.deactivateTest=function(){return!1}),n.change.state()}))},change:{state:function(){n.debug("Determining state change direction"),n.is.inactive()?n.activate():n.deactivate(),f.sync&&n.sync(),f.onChange.call(w)},text:function(){n.is.textEnabled()&&(n.is.disabled()?(n.verbose("Changing text to disabled text",b.hover),n.update.text(b.disabled)):n.is.active()?b.hover?(n.verbose("Changing text to hover text",b.hover),n.update.text(b.hover)):b.deactivate&&(n.verbose("Changing text to deactivating text",b.deactivate),n.update.text(b.deactivate)):b.hover?(n.verbose("Changing text to hover text",b.hover),n.update.text(b.hover)):b.activate&&(n.verbose("Changing text to activating text",b.activate),n.update.text(b.activate)))}},activate:function(){f.activateTest.call(w)&&(n.debug("Setting state to active"),C.addClass(p.active),n.update.text(b.active),f.onActivate.call(w))},deactivate:function(){f.deactivateTest.call(w)&&(n.debug("Setting state to inactive"),C.removeClass(p.active),n.update.text(b.inactive),f.onDeactivate.call(w))},sync:function(){n.verbose("Syncing other buttons to current state"),n.is.active()?a.not(C).state("activate"):a.not(C).state("deactivate")},get:{text:function(){return f.selector.text?C.find(f.selector.text).text():C.html()},textFor:function(e){return b[e]||!1}},flash:{text:function(e,t,i){var o=n.get.text();n.debug("Flashing text message",e,t),e=e||f.text.flash,t=t||f.flashDuration,i=i||function(){},n.update.text(e),setTimeout(function(){n.update.text(o),i.call(w)},t)}},reset:{text:function(){var e=b.active||C.data(g.storedText),t=b.inactive||C.data(g.storedText);n.is.textEnabled()&&(n.is.active()&&e?(n.verbose("Resetting active text",e),n.update.text(e)):t&&(n.verbose("Resetting inactive text",e),n.update.text(t)))}},update:{text:function(e){var t=n.get.text();e&&e!==t?(n.debug("Updating text",e),f.selector.text?C.data(g.storedText,e).find(f.selector.text).text(e):C.data(g.storedText,e).html(e)):n.debug("Text is already set, ignoring update",e)}},setting:function(t,o){if(n.debug("Changing setting",t,o),e.isPlainObject(t))e.extend(!0,f,t);else{if(o===i)return f[t];e.isPlainObject(f[t])?e.extend(!0,f[t],o):f[t]=o}},internal:function(t,o){if(e.isPlainObject(t))e.extend(!0,n,t);else{if(o===i)return n[t];n[t]=o}},debug:function(){!f.silent&&f.debug&&(f.performance?n.performance.log(arguments):(n.debug=Function.prototype.bind.call(console.info,console,f.name+":"),n.debug.apply(console,arguments)))},verbose:function(){!f.silent&&f.verbose&&f.debug&&(f.performance?n.performance.log(arguments):(n.verbose=Function.prototype.bind.call(console.info,console,f.name+":"),n.verbose.apply(console,arguments)))},error:function(){f.silent||(n.error=Function.prototype.bind.call(console.error,console,f.name+":"),n.error.apply(console,arguments))},performance:{log:function(e){var t,i,o;f.performance&&(t=(new Date).getTime(),o=s||t,i=t-o,s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:w,"Execution Time":i})),clearTimeout(n.performance.timer),n.performance.timer=setTimeout(n.performance.display,500)},display:function(){var t=f.name+":",o=0;s=!1,clearTimeout(n.performance.timer),e.each(l,function(e,t){o+=t["Execution Time"]}),t+=" "+o+"ms",r&&(t+=" '"+r+"'"),(console.group!==i||console.table!==i)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,a,r){var s,l,c,u=k;return a=a||d,r=w||r,"string"==typeof t&&u!==i&&(t=t.split(/[\. ]/),s=t.length-1,e.each(t,function(o,a){var r=o!=s?a+t[o+1].charAt(0).toUpperCase()+t[o+1].slice(1):t;if(e.isPlainObject(u[r])&&o!=s)u=u[r];else{if(u[r]!==i)return l=u[r],!1;if(!e.isPlainObject(u[a])||o==s)return u[a]!==i?(l=u[a],!1):(n.error(m.method,t),!1);u=u[a]}})),e.isFunction(l)?c=l.apply(r,a):l!==i&&(c=l),e.isArray(o)?o.push(c):o!==i?o=[o,c]:c!==i&&(o=c),l}},u?(k===i&&n.initialize(),n.invoke(c)):(k!==i&&k.invoke("destroy"),n.initialize())}),o!==i?o:this},e.fn.state.settings={name:"State",debug:!1,verbose:!1,namespace:"state",performance:!0,onActivate:function(){},onDeactivate:function(){},onChange:function(){},activateTest:function(){return!0},deactivateTest:function(){return!0},automatic:!0,sync:!1,flashDuration:1e3,filter:{text:".loading, .disabled",active:".disabled"},context:!1,error:{beforeSend:"The before send function has cancelled state change",method:"The method you called is not defined."},metadata:{promise:"promise",storedText:"stored-text"},className:{active:"active",disabled:"disabled",error:"error",loading:"loading",success:"success",warning:"warning"},selector:{text:!1},defaults:{input:{disabled:!0,loading:!0,active:!0},button:{disabled:!0,loading:!0,active:!0},progress:{active:!0,success:!0,warning:!0,error:!0}},states:{active:!0,disabled:!0,error:!0,loading:!0,success:!0,warning:!0},text:{disabled:!1,flash:!1,hover:!1,active:!1,inactive:!1,activate:!1,deactivate:!1}}}(jQuery,window,document),function(e,t,n,i){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.visibility=function(o){var a,r=e(this),s=r.selector||"",l=(new Date).getTime(),c=[],u=arguments[0],d="string"==typeof u,f=[].slice.call(arguments,1),m=r.length,g=0;return r.each(function(){var r,p,h,v,b=e.isPlainObject(o)?e.extend(!0,{},e.fn.visibility.settings,o):e.extend({},e.fn.visibility.settings),y=b.className,x=b.namespace,C=b.error,w=b.metadata,k="."+x,S="module-"+x,T=e(t),A=e(this),R=e(b.context),P=(A.selector||"",A.data(S)),E=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)},F=this,O=!1;v={initialize:function(){v.debug("Initializing",b),v.setup.cache(),v.should.trackChanges()&&("image"==b.type&&v.setup.image(),"fixed"==b.type&&v.setup.fixed(),b.observeChanges&&v.observeChanges(),v.bind.events()),v.save.position(),v.is.visible()||v.error(C.visible,A),b.initialCheck&&v.checkVisibility(),v.instantiate()},instantiate:function(){v.debug("Storing instance",v),A.data(S,v),P=v},destroy:function(){v.verbose("Destroying previous module"),h&&h.disconnect(),p&&p.disconnect(),T.off("load"+k,v.event.load).off("resize"+k,v.event.resize),R.off("scroll"+k,v.event.scroll).off("scrollchange"+k,v.event.scrollchange),"fixed"==b.type&&(v.resetFixed(),v.remove.placeholder()),A.off(k).removeData(S)},observeChanges:function(){"MutationObserver"in t&&(p=new MutationObserver(v.event.contextChanged),h=new MutationObserver(v.event.changed),p.observe(n,{childList:!0,subtree:!0}),h.observe(F,{childList:!0,subtree:!0}),v.debug("Setting up mutation observer",h))},bind:{events:function(){v.verbose("Binding visibility events to scroll and resize"),b.refreshOnLoad&&T.on("load"+k,v.event.load),T.on("resize"+k,v.event.resize),R.off("scroll"+k).on("scroll"+k,v.event.scroll).on("scrollchange"+k,v.event.scrollchange)}},event:{changed:function(e){v.verbose("DOM tree modified, updating visibility calculations"),v.timer=setTimeout(function(){v.verbose("DOM tree modified, updating sticky menu"),v.refresh()},100)},contextChanged:function(t){[].forEach.call(t,function(t){t.removedNodes&&[].forEach.call(t.removedNodes,function(t){(t==F||e(t).find(F).length>0)&&(v.debug("Element removed from DOM, tearing down events"),v.destroy())})})},resize:function(){v.debug("Window resized"),b.refreshOnResize&&E(v.refresh)},load:function(){v.debug("Page finished loading"),E(v.refresh)},scroll:function(){b.throttle?(clearTimeout(v.timer),v.timer=setTimeout(function(){R.triggerHandler("scrollchange"+k,[R.scrollTop()])},b.throttle)):E(function(){R.triggerHandler("scrollchange"+k,[R.scrollTop()])})},scrollchange:function(e,t){v.checkVisibility(t)}},precache:function(t,i){t instanceof Array||(t=[t]);for(var o=t.length,a=0,r=[],s=n.createElement("img"),l=function(){a++,a>=t.length&&e.isFunction(i)&&i()};o--;)s=n.createElement("img"),s.onload=l,s.onerror=l,s.src=t[o],r.push(s)},enableCallbacks:function(){v.debug("Allowing callbacks to occur"),O=!1},disableCallbacks:function(){v.debug("Disabling all callbacks temporarily"),O=!0},should:{trackChanges:function(){return d?(v.debug("One time query, no need to bind events"),!1):(v.debug("Callbacks being attached"),!0)}},setup:{cache:function(){v.cache={occurred:{},screen:{},element:{}}},image:function(){var e=A.data(w.src);e&&(v.verbose("Lazy loading image",e),b.once=!0,b.observeChanges=!1,b.onOnScreen=function(){v.debug("Image on screen",F),v.precache(e,function(){v.set.image(e,function(){g++,g==m&&b.onAllLoaded.call(this),b.onLoad.call(this)})})})},fixed:function(){v.debug("Setting up fixed"),b.once=!1,b.observeChanges=!1,b.initialCheck=!0,b.refreshOnLoad=!0,o.transition||(b.transition=!1),v.create.placeholder(),v.debug("Added placeholder",r),b.onTopPassed=function(){v.debug("Element passed, adding fixed position",A),v.show.placeholder(),v.set.fixed(),b.transition&&e.fn.transition!==i&&A.transition(b.transition,b.duration)},b.onTopPassedReverse=function(){v.debug("Element returned to position, removing fixed",A),v.hide.placeholder(),v.remove.fixed()}}},create:{placeholder:function(){v.verbose("Creating fixed position placeholder"),r=A.clone(!1).css("display","none").addClass(y.placeholder).insertAfter(A)}},show:{placeholder:function(){v.verbose("Showing placeholder"),r.css("display","block").css("visibility","hidden")}},hide:{placeholder:function(){v.verbose("Hiding placeholder"),r.css("display","none").css("visibility","")}},set:{fixed:function(){v.verbose("Setting element to fixed position"),A.addClass(y.fixed).css({position:"fixed",top:b.offset+"px",left:"auto",zIndex:b.zIndex}),b.onFixed.call(F)},image:function(t,n){if(A.attr("src",t),b.transition)if(e.fn.transition!==i){if(A.hasClass(y.visible))return void v.debug("Transition already occurred on this image, skipping animation");A.transition(b.transition,b.duration,n)}else A.fadeIn(b.duration,n);else A.show()}},is:{onScreen:function(){var e=v.get.elementCalculations();return e.onScreen},offScreen:function(){var e=v.get.elementCalculations();return e.offScreen},visible:function(){return v.cache&&v.cache.element?!(0===v.cache.element.width&&0===v.cache.element.offset.top):!1},verticallyScrollableContext:function(){var e=R.get(0)!==t?R.css("overflow-y"):!1;return"auto"==e||"scroll"==e},horizontallyScrollableContext:function(){var e=R.get(0)!==t?R.css("overflow-x"):!1;return"auto"==e||"scroll"==e}},refresh:function(){v.debug("Refreshing constants (width/height)"),"fixed"==b.type&&v.resetFixed(),v.reset(),v.save.position(),b.checkOnRefresh&&v.checkVisibility(),b.onRefresh.call(F)},resetFixed:function(){v.remove.fixed(),v.remove.occurred()},reset:function(){v.verbose("Resetting all cached values"),e.isPlainObject(v.cache)&&(v.cache.screen={},v.cache.element={})},checkVisibility:function(e){v.verbose("Checking visibility of element",v.cache.element),!O&&v.is.visible()&&(v.save.scroll(e),v.save.calculations(),v.passed(),v.passingReverse(),v.topVisibleReverse(),v.bottomVisibleReverse(),v.topPassedReverse(),v.bottomPassedReverse(),v.onScreen(),v.offScreen(),v.passing(),v.topVisible(),v.bottomVisible(),v.topPassed(),v.bottomPassed(),b.onUpdate&&b.onUpdate.call(F,v.get.elementCalculations()))},passed:function(t,n){var o=v.get.elementCalculations();if(t&&n)b.onPassed[t]=n;else{if(t!==i)return v.get.pixelsPassed(t)>o.pixelsPassed;o.passing&&e.each(b.onPassed,function(e,t){o.bottomVisible||o.pixelsPassed>v.get.pixelsPassed(e)?v.execute(t,e):b.once||v.remove.occurred(t)})}},onScreen:function(e){var t=v.get.elementCalculations(),n=e||b.onOnScreen,o="onScreen";return e&&(v.debug("Adding callback for onScreen",e),b.onOnScreen=e),t.onScreen?v.execute(n,o):b.once||v.remove.occurred(o),e!==i?t.onOnScreen:void 0},offScreen:function(e){var t=v.get.elementCalculations(),n=e||b.onOffScreen,o="offScreen";return e&&(v.debug("Adding callback for offScreen",e),b.onOffScreen=e),t.offScreen?v.execute(n,o):b.once||v.remove.occurred(o),e!==i?t.onOffScreen:void 0},passing:function(e){var t=v.get.elementCalculations(),n=e||b.onPassing,o="passing";return e&&(v.debug("Adding callback for passing",e),b.onPassing=e),t.passing?v.execute(n,o):b.once||v.remove.occurred(o),e!==i?t.passing:void 0},topVisible:function(e){var t=v.get.elementCalculations(),n=e||b.onTopVisible,o="topVisible";return e&&(v.debug("Adding callback for top visible",e),b.onTopVisible=e),t.topVisible?v.execute(n,o):b.once||v.remove.occurred(o),e===i?t.topVisible:void 0},bottomVisible:function(e){var t=v.get.elementCalculations(),n=e||b.onBottomVisible,o="bottomVisible";return e&&(v.debug("Adding callback for bottom visible",e),b.onBottomVisible=e),t.bottomVisible?v.execute(n,o):b.once||v.remove.occurred(o),e===i?t.bottomVisible:void 0},topPassed:function(e){var t=v.get.elementCalculations(),n=e||b.onTopPassed,o="topPassed";return e&&(v.debug("Adding callback for top passed",e),b.onTopPassed=e),t.topPassed?v.execute(n,o):b.once||v.remove.occurred(o),e===i?t.topPassed:void 0},bottomPassed:function(e){var t=v.get.elementCalculations(),n=e||b.onBottomPassed,o="bottomPassed";return e&&(v.debug("Adding callback for bottom passed",e),b.onBottomPassed=e),t.bottomPassed?v.execute(n,o):b.once||v.remove.occurred(o),e===i?t.bottomPassed:void 0},passingReverse:function(e){var t=v.get.elementCalculations(),n=e||b.onPassingReverse,o="passingReverse";return e&&(v.debug("Adding callback for passing reverse",e),b.onPassingReverse=e),t.passing?b.once||v.remove.occurred(o):v.get.occurred("passing")&&v.execute(n,o),e!==i?!t.passing:void 0},topVisibleReverse:function(e){var t=v.get.elementCalculations(),n=e||b.onTopVisibleReverse,o="topVisibleReverse";return e&&(v.debug("Adding callback for top visible reverse",e),b.onTopVisibleReverse=e),t.topVisible?b.once||v.remove.occurred(o):v.get.occurred("topVisible")&&v.execute(n,o),e===i?!t.topVisible:void 0},bottomVisibleReverse:function(e){var t=v.get.elementCalculations(),n=e||b.onBottomVisibleReverse,o="bottomVisibleReverse";return e&&(v.debug("Adding callback for bottom visible reverse",e),b.onBottomVisibleReverse=e),t.bottomVisible?b.once||v.remove.occurred(o):v.get.occurred("bottomVisible")&&v.execute(n,o),e===i?!t.bottomVisible:void 0},topPassedReverse:function(e){var t=v.get.elementCalculations(),n=e||b.onTopPassedReverse,o="topPassedReverse";return e&&(v.debug("Adding callback for top passed reverse",e),b.onTopPassedReverse=e),t.topPassed?b.once||v.remove.occurred(o):v.get.occurred("topPassed")&&v.execute(n,o),e===i?!t.onTopPassed:void 0},bottomPassedReverse:function(e){var t=v.get.elementCalculations(),n=e||b.onBottomPassedReverse,o="bottomPassedReverse";return e&&(v.debug("Adding callback for bottom passed reverse",e),b.onBottomPassedReverse=e),t.bottomPassed?b.once||v.remove.occurred(o):v.get.occurred("bottomPassed")&&v.execute(n,o),e===i?!t.bottomPassed:void 0},execute:function(e,t){var n=v.get.elementCalculations(),i=v.get.screenCalculations();e=e||!1,e&&(b.continuous?(v.debug("Callback being called continuously",t,n),e.call(F,n,i)):v.get.occurred(t)||(v.debug("Conditions met",t,n),e.call(F,n,i))),v.save.occurred(t)},remove:{fixed:function(){v.debug("Removing fixed position"),A.removeClass(y.fixed).css({position:"",top:"",left:"",zIndex:""}),b.onUnfixed.call(F)},placeholder:function(){v.debug("Removing placeholder content"),r&&r.remove()},occurred:function(e){if(e){var t=v.cache.occurred;t[e]!==i&&t[e]===!0&&(v.debug("Callback can now be called again",e),v.cache.occurred[e]=!1)}else v.cache.occurred={}}},save:{calculations:function(){v.verbose("Saving all calculations necessary to determine positioning"),v.save.direction(),v.save.screenCalculations(),v.save.elementCalculations()},occurred:function(e){e&&(v.cache.occurred[e]!==i&&v.cache.occurred[e]===!0||(v.verbose("Saving callback occurred",e),v.cache.occurred[e]=!0))},scroll:function(e){e=e+b.offset||R.scrollTop()+b.offset,v.cache.scroll=e},direction:function(){var e,t=v.get.scroll(),n=v.get.lastScroll();return e=t>n&&n?"down":n>t&&n?"up":"static",v.cache.direction=e,v.cache.direction},elementPosition:function(){var e=v.cache.element,t=v.get.screenSize();return v.verbose("Saving element position"),e.fits=e.height<t.height,e.offset=A.offset(),e.width=A.outerWidth(),e.height=A.outerHeight(),v.is.verticallyScrollableContext()&&(e.offset.top+=R.scrollTop()-R.offset().top),v.is.horizontallyScrollableContext()&&(e.offset.left+=R.scrollLeft-R.offset().left),v.cache.element=e,e},elementCalculations:function(){var e=v.get.screenCalculations(),t=v.get.elementPosition();return b.includeMargin?(t.margin={},t.margin.top=parseInt(A.css("margin-top"),10),t.margin.bottom=parseInt(A.css("margin-bottom"),10),t.top=t.offset.top-t.margin.top,t.bottom=t.offset.top+t.height+t.margin.bottom):(t.top=t.offset.top,t.bottom=t.offset.top+t.height),t.topPassed=e.top>=t.top,t.bottomPassed=e.top>=t.bottom,t.topVisible=e.bottom>=t.top&&!t.bottomPassed,t.bottomVisible=e.bottom>=t.bottom&&!t.topPassed,t.pixelsPassed=0,t.percentagePassed=0,t.onScreen=t.topVisible&&!t.bottomPassed,t.passing=t.topPassed&&!t.bottomPassed,t.offScreen=!t.onScreen,t.passing&&(t.pixelsPassed=e.top-t.top,t.percentagePassed=(e.top-t.top)/t.height),v.cache.element=t,v.verbose("Updated element calculations",t),t},screenCalculations:function(){var e=v.get.scroll();return v.save.direction(),v.cache.screen.top=e,v.cache.screen.bottom=e+v.cache.screen.height,v.cache.screen},screenSize:function(){v.verbose("Saving window position"),v.cache.screen={height:R.height()}},position:function(){v.save.screenSize(),v.save.elementPosition()}},get:{pixelsPassed:function(e){var t=v.get.elementCalculations();return e.search("%")>-1?t.height*(parseInt(e,10)/100):parseInt(e,10)},occurred:function(e){return v.cache.occurred!==i?v.cache.occurred[e]||!1:!1},direction:function(){return v.cache.direction===i&&v.save.direction(),v.cache.direction},elementPosition:function(){return v.cache.element===i&&v.save.elementPosition(),v.cache.element},elementCalculations:function(){return v.cache.element===i&&v.save.elementCalculations(),v.cache.element},screenCalculations:function(){return v.cache.screen===i&&v.save.screenCalculations(),v.cache.screen},screenSize:function(){return v.cache.screen===i&&v.save.screenSize(),v.cache.screen},scroll:function(){return v.cache.scroll===i&&v.save.scroll(),v.cache.scroll},lastScroll:function(){return v.cache.screen===i?(v.debug("First scroll event, no last scroll could be found"),!1):v.cache.screen.top}},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,b,t);else{if(n===i)return b[t];b[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,v,t);else{if(n===i)return v[t];v[t]=n}},debug:function(){!b.silent&&b.debug&&(b.performance?v.performance.log(arguments):(v.debug=Function.prototype.bind.call(console.info,console,b.name+":"),v.debug.apply(console,arguments)))},verbose:function(){!b.silent&&b.verbose&&b.debug&&(b.performance?v.performance.log(arguments):(v.verbose=Function.prototype.bind.call(console.info,console,b.name+":"),v.verbose.apply(console,arguments)))},error:function(){b.silent||(v.error=Function.prototype.bind.call(console.error,console,b.name+":"),v.error.apply(console,arguments))},performance:{log:function(e){var t,n,i;b.performance&&(t=(new Date).getTime(),i=l||t,n=t-i,l=t,c.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:F,"Execution Time":n})),clearTimeout(v.performance.timer),v.performance.timer=setTimeout(v.performance.display,500)},display:function(){var t=b.name+":",n=0;l=!1,clearTimeout(v.performance.timer),e.each(c,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",s&&(t+=" '"+s+"'"),(console.group!==i||console.table!==i)&&c.length>0&&(console.groupCollapsed(t),console.table?console.table(c):e.each(c,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),c=[]}},invoke:function(t,n,o){var r,s,l,c=P;return n=n||f,o=F||o,"string"==typeof t&&c!==i&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,o){var a=n!=r?o+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(c[a]!==i)return s=c[a],!1;if(!e.isPlainObject(c[o])||n==r)return c[o]!==i?(s=c[o],!1):(v.error(C.method,t),!1);c=c[o]}})),e.isFunction(s)?l=s.apply(o,n):s!==i&&(l=s),e.isArray(a)?a.push(l):a!==i?a=[a,l]:l!==i&&(a=l),s}},d?(P===i&&v.initialize(),P.save.scroll(),P.save.calculations(),v.invoke(u)):(P!==i&&P.invoke("destroy"),v.initialize())}),a!==i?a:this},e.fn.visibility.settings={name:"Visibility",namespace:"visibility",debug:!1,verbose:!1,performance:!0,observeChanges:!0,initialCheck:!0,refreshOnLoad:!0,refreshOnResize:!0,checkOnRefresh:!0,once:!0,continuous:!1,offset:0,includeMargin:!1,context:t,throttle:!1,type:!1,zIndex:"10",transition:"fade in",duration:1e3,onPassed:{},onOnScreen:!1,onOffScreen:!1,onPassing:!1,onTopVisible:!1,onBottomVisible:!1,onTopPassed:!1,onBottomPassed:!1,onPassingReverse:!1,onTopVisibleReverse:!1,onBottomVisibleReverse:!1,onTopPassedReverse:!1,onBottomPassedReverse:!1,onLoad:function(){},onAllLoaded:function(){},onFixed:function(){},onUnfixed:function(){},onUpdate:!1,onRefresh:function(){},metadata:{src:"src"},className:{fixed:"fixed",placeholder:"placeholder",visible:"visible"},error:{method:"The method you called is not defined.",visible:"Element is hidden, you must call refresh after element becomes visible"}}}(jQuery,window,document);
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var Slick = window.Slick || {};

    Slick = (function() {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this, dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function(slider, i) {
                    return $('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1);
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: false,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                swiping: false,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


            _.registerBreakpoints();
            _.init(true);

        }

        return Slick;

    }());

    Slick.prototype.activateADA = function() {
        var _ = this;

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });

    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }

        _.unload();

        if (typeof(index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function(index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.animateHeight = function() {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function(targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }

        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -(_.currentLeft);
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function() {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    Slick.prototype.getNavTarget = function() {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if ( asNavFor && asNavFor !== null ) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;

    };

    Slick.prototype.asNavFor = function(index) {

        var _ = this,
            asNavFor = _.getNavTarget();

        if ( asNavFor !== null && typeof asNavFor === 'object' ) {
            asNavFor.each(function() {
                var target = $(this).slick('getSlick');
                if(!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }

    };

    Slick.prototype.applyTransition = function(slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.autoPlay = function() {

        var _ = this;

        _.autoPlayClear();

        if ( _.slideCount > _.options.slidesToShow ) {
            _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
        }

    };

    Slick.prototype.autoPlayClear = function() {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    Slick.prototype.autoPlayIterator = function() {

        var _ = this,
            slideTo = _.currentSlide + _.options.slidesToScroll;

        if ( !_.paused && !_.interrupted && !_.focussed ) {

            if ( _.options.infinite === false ) {

                if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {
                    _.direction = 0;
                }

                else if ( _.direction === 0 ) {

                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if ( _.currentSlide - 1 === 0 ) {
                        _.direction = 1;
                    }

                }

            }

            _.slideHandler( slideTo );

        }

    };

    Slick.prototype.buildArrows = function() {

        var _ = this;

        if (_.options.arrows === true ) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if( _.slideCount > _.options.slidesToShow ) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                        .addClass('slick-disabled')
                        .attr('aria-disabled', 'true');
                }

            } else {

                _.$prevArrow.add( _.$nextArrow )

                    .addClass('slick-hidden')
                    .attr({
                        'aria-disabled': 'true',
                        'tabindex': '-1'
                    });

            }

        }

    };

    Slick.prototype.buildDots = function() {

        var _ = this,
            i, dot;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
            }

            _.$dots = dot.appendTo(_.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');

        }

    };

    Slick.prototype.buildOut = function() {

        var _ = this;

        _.$slides =
            _.$slider
                .children( _.options.slide + ':not(.slick-cloned)')
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function(index, element) {
            $(element)
                .attr('data-slick-index', index)
                .data('originalStyling', $(element).attr('style') || '');
        });

        _.$slider.addClass('slick-slider');

        _.$slideTrack = (_.slideCount === 0) ?
            $('<div class="slick-track"/>').appendTo(_.$slider) :
            _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap(
            '<div aria-live="polite" class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }

    };

    Slick.prototype.buildRows = function() {

        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if(_.options.rows > 1) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(
                originalSlides.length / slidesPerSection
            );

            for(a = 0; a < numOfSlides; a++){
                var slide = document.createElement('div');
                for(b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for(c = 0; c < _.options.slidesPerRow; c++) {
                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider.children().children().children()
                .css({
                    'width':(100 / _.options.slidesPerRow) + '%',
                    'display': 'inline-block'
                });

        }

    };

    Slick.prototype.checkResponsive = function(initial, forceUpdate) {

        var _ = this,
            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if ( _.options.responsive &&
            _.options.responsive.length &&
            _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint =
                            targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings,
                                _.breakpointSettings[
                                    targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings,
                            _.breakpointSettings[
                                targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if( !initial && triggerBreakpoint !== false ) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }

    };

    Slick.prototype.changeSlide = function(event, dontAnimate) {

        var _ = this,
            $target = $(event.currentTarget),
            indexOffset, slideOffset, unevenOffset;

        // If target is a link, prevent default action.
        if($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if(!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 :
                    event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }

    };

    Slick.prototype.checkNavigable = function(index) {

        var _ = this,
            navigables, prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function() {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots)
                .off('click.slick', _.changeSlide)
                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

        _.$slider.off('focus.slick blur.slick');

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);

    };

    Slick.prototype.cleanUpSlideEvents = function() {

        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

    };

    Slick.prototype.cleanUpRows = function() {

        var _ = this, originalSlides;

        if(_.options.rows > 1) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }

    };

    Slick.prototype.clickHandler = function(event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }

    };

    Slick.prototype.destroy = function(refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }

        if ( _.$prevArrow && _.$prevArrow.length ) {

            _.$prevArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.prevArrow )) {
                _.$prevArrow.remove();
            }
        }

        if ( _.$nextArrow && _.$nextArrow.length ) {

            _.$nextArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.nextArrow )) {
                _.$nextArrow.remove();
            }
        }


        if (_.$slides) {

            _.$slides
                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
                .removeAttr('aria-hidden')
                .removeAttr('data-slick-index')
                .each(function(){
                    $(this).attr('style', $(this).data('originalStyling'));
                });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if(!refresh) {
            _.$slider.trigger('destroy', [_]);
        }

    };

    Slick.prototype.disableTransition = function(slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.fadeSlide = function(slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function() {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }

        }

    };

    Slick.prototype.fadeSlideOut = function(slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });

        }

    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {

        var _ = this;

        if (filter !== null) {

            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.focusHandler = function() {

        var _ = this;

        _.$slider
            .off('focus.slick blur.slick')
            .on('focus.slick blur.slick',
                '*:not(.slick-arrow)', function(event) {

            event.stopImmediatePropagation();
            var $sf = $(this);

            setTimeout(function() {

                if( _.options.pauseOnFocus ) {
                    _.focussed = $sf.is(':focus');
                    _.autoPlay();
                }

            }, 0);

        });
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {

        var _ = this;
        return _.currentSlide;

    };

    Slick.prototype.getDotCount = function() {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if(!_.options.asNavFor) {
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        }else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;

    };

    Slick.prototype.getLeft = function(slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                verticalOffset = (verticalHeight * _.options.slidesToShow) * -1;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                    } else {
                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
            _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);
        } else if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                } else {
                    targetLeft =  0;
                }
            } else {
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            }

            if (_.options.centerMode === true) {
                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                    } else {
                        targetLeft =  0;
                    }
                } else {
                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;

    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {

        var _ = this;

        return _.options[option];

    };

    Slick.prototype.getNavigableIndexes = function() {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;

    };

    Slick.prototype.getSlick = function() {

        return this;

    };

    Slick.prototype.getSlideCount = function() {

        var _ = this,
            slidesTraversed, swipedSlide, centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function(index, slide) {
                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;

        } else {
            return _.options.slidesToScroll;
        }

    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);

    };

    Slick.prototype.init = function(creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();

        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

        if ( _.options.autoplay ) {

            _.paused = false;
            _.autoPlay();

        }

    };

    Slick.prototype.initADA = function() {
        var _ = this;
        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        _.$slideTrack.attr('role', 'listbox');

        _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
            $(this).attr('role', 'option');

            //Evenly distribute aria-describedby tags through available dots.
            var describedBySlideId = _.options.centerMode ? i : Math.floor(i / _.options.slidesToShow);

            if (_.options.dots === true) {
                $(this).attr('aria-describedby', 'slick-slide' + _.instanceUid + describedBySlideId + '');
            }
        });

        if (_.$dots !== null) {
            _.$dots.attr('role', 'tablist').find('li').each(function(i) {
                $(this).attr({
                    'role': 'presentation',
                    'aria-selected': 'false',
                    'aria-controls': 'navigation' + _.instanceUid + i + '',
                    'id': 'slick-slide' + _.instanceUid + i + ''
                });
            })
                .first().attr('aria-selected', 'true').end()
                .find('button').attr('role', 'button').end()
                .closest('div').attr('role', 'toolbar');
        }
        _.activateADA();

    };

    Slick.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'previous'
               }, _.changeSlide);
            _.$nextArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'next'
               }, _.changeSlide);
        }

    };

    Slick.prototype.initDotEvents = function() {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);
        }

        if ( _.options.dots === true && _.options.pauseOnDotsHover === true ) {

            $('li', _.$dots)
                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initSlideEvents = function() {

        var _ = this;

        if ( _.options.pauseOnHover ) {

            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initializeEvents = function() {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(_.setPosition);

    };

    Slick.prototype.initUI = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();

        }

    };

    Slick.prototype.keyHandler = function(event) {

        var _ = this;
         //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'next' :  'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'previous' : 'next'
                    }
                });
            }
        }

    };

    Slick.prototype.lazyLoad = function() {

        var _ = this,
            loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {

            $('img[data-lazy]', imagesScope).each(function() {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageSrcSet = $(this).attr('data-srcset'),
                    imageSizes  = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function() {

                    image
                        .animate({ opacity: 0 }, 100, function() {

                            if (imageSrcSet) {
                                image
                                    .attr('srcset', imageSrcSet );

                                if (imageSizes) {
                                    image
                                        .attr('sizes', imageSizes );
                                }
                            }

                            image
                                .attr('src', imageSource)
                                .animate({ opacity: 1 }, 200, function() {
                                    image
                                        .removeAttr('data-lazy data-srcset data-sizes')
                                        .removeClass('slick-loading');
                                });
                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                        });

                };

                imageToLoad.onerror = function() {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                };

                imageToLoad.src = imageSource;

            });

        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

        if (_.options.lazyLoad === 'anticipated') {
            var prevSlide = rangeStart - 1,
                nextSlide = rangeEnd,
                $slides = _.$slider.find('.slick-slide');

            for (var i = 0; i < _.options.slidesToScroll; i++) {
                if (prevSlide < 0) prevSlide = _.slideCount - 1;
                loadRange = loadRange.add($slides.eq(prevSlide));
                loadRange = loadRange.add($slides.eq(nextSlide));
                prevSlide--;
                nextSlide++;
            }
        }

        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }

    };

    Slick.prototype.loadSlider = function() {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }

    };

    Slick.prototype.next = Slick.prototype.slickNext = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });

    };

    Slick.prototype.orientationChange = function() {

        var _ = this;

        _.checkResponsive();
        _.setPosition();

    };

    Slick.prototype.pause = Slick.prototype.slickPause = function() {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;

    };

    Slick.prototype.play = Slick.prototype.slickPlay = function() {

        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;

    };

    Slick.prototype.postSlide = function(index) {

        var _ = this;

        if( !_.unslicked ) {

            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            _.setPosition();

            _.swipeLeft = null;

            if ( _.options.autoplay ) {
                _.autoPlay();
            }

            if (_.options.accessibility === true) {
                _.initADA();
            }

        }

    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });

    };

    Slick.prototype.preventDefault = function(event) {

        event.preventDefault();

    };

    Slick.prototype.progressiveLazyLoad = function( tryCount ) {

        tryCount = tryCount || 1;

        var _ = this,
            $imgsToLoad = $( 'img[data-lazy]', _.$slider ),
            image,
            imageSource,
            imageSrcSet,
            imageSizes,
            imageToLoad;

        if ( $imgsToLoad.length ) {

            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageSrcSet = image.attr('data-srcset');
            imageSizes  = image.attr('data-sizes') || _.$slider.attr('data-sizes');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function() {

                if (imageSrcSet) {
                    image
                        .attr('srcset', imageSrcSet );

                    if (imageSizes) {
                        image
                            .attr('sizes', imageSizes );
                    }
                }

                image
                    .attr( 'src', imageSource )
                    .removeAttr('data-lazy data-srcset data-sizes')
                    .removeClass('slick-loading');

                if ( _.options.adaptiveHeight === true ) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);
                _.progressiveLazyLoad();

            };

            imageToLoad.onerror = function() {

                if ( tryCount < 3 ) {

                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout( function() {
                        _.progressiveLazyLoad( tryCount + 1 );
                    }, 500 );

                } else {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                    _.progressiveLazyLoad();

                }

            };

            imageToLoad.src = imageSource;

        } else {

            _.$slider.trigger('allImagesLoaded', [ _ ]);

        }

    };

    Slick.prototype.refresh = function( initializing ) {

        var _ = this, currentSlide, lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if ( _.slideCount <= _.options.slidesToShow ) {
            _.currentSlide = 0;

        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if( !initializing ) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);

        }

    };

    Slick.prototype.registerBreakpoints = function() {

        var _ = this, breakpoint, currentBreakpoint, l,
            responsiveSettings = _.options.responsive || null;

        if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {

            _.respondTo = _.options.respondTo || 'window';

            for ( breakpoint in responsiveSettings ) {

                l = _.breakpoints.length-1;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {
                    currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while( l >= 0 ) {
                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
                            _.breakpoints.splice(l,1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

                }

            }

            _.breakpoints.sort(function(a, b) {
                return ( _.options.mobileFirst ) ? a-b : b-a;
            });

        }

    };

    Slick.prototype.reinit = function() {

        var _ = this;

        _.$slides =
            _.$slideTrack
                .children(_.options.slide)
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);

    };

    Slick.prototype.resize = function() {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function() {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if( !_.unslicked ) { _.setPosition(); }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.setCSS = function(position) {

        var _ = this,
            positionProps = {},
            x, y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }

    };

    Slick.prototype.setDimensions = function() {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();


        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

    };

    Slick.prototype.setFade = function() {

        var _ = this,
            targetLeft;

        _.$slides.each(function(index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });

    };

    Slick.prototype.setHeight = function() {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }

    };

    Slick.prototype.setOption =
    Slick.prototype.slickSetOption = function() {

        /**
         * accepts arguments in format of:
         *
         *  - for changing a single option's value:
         *     .slick("setOption", option, value, refresh )
         *
         *  - for changing a set of responsive options:
         *     .slick("setOption", 'responsive', [{}, ...], refresh )
         *
         *  - for updating multiple values at once (not responsive)
         *     .slick("setOption", { 'option': value, ... }, refresh )
         */

        var _ = this, l, item, option, value, refresh = false, type;

        if( $.type( arguments[0] ) === 'object' ) {

            option =  arguments[0];
            refresh = arguments[1];
            type = 'multiple';

        } else if ( $.type( arguments[0] ) === 'string' ) {

            option =  arguments[0];
            value = arguments[1];
            refresh = arguments[2];

            if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {

                type = 'responsive';

            } else if ( typeof arguments[1] !== 'undefined' ) {

                type = 'single';

            }

        }

        if ( type === 'single' ) {

            _.options[option] = value;


        } else if ( type === 'multiple' ) {

            $.each( option , function( opt, val ) {

                _.options[opt] = val;

            });


        } else if ( type === 'responsive' ) {

            for ( item in value ) {

                if( $.type( _.options.responsive ) !== 'array' ) {

                    _.options.responsive = [ value[item] ];

                } else {

                    l = _.options.responsive.length-1;

                    // loop through the responsive object and splice out duplicates.
                    while( l >= 0 ) {

                        if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {

                            _.options.responsive.splice(l,1);

                        }

                        l--;

                    }

                    _.options.responsive.push( value[item] );

                }

            }

        }

        if ( refresh ) {

            _.unload();
            _.reinit();

        }

    };

    Slick.prototype.setPosition = function() {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);

    };

    Slick.prototype.setProps = function() {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined ||
            bodyStyle.MozTransition !== undefined ||
            bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if ( _.options.fade ) {
            if ( typeof _.options.zIndex === 'number' ) {
                if( _.options.zIndex < 3 ) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
    };


    Slick.prototype.setSlideClasses = function(index) {

        var _ = this,
            centerOffset, allSlides, indexOffset, remainder;

        allSlides = _.$slider
            .find('.slick-slide')
            .removeClass('slick-active slick-center slick-current')
            .attr('aria-hidden', 'true');

        _.$slides
            .eq(index)
            .addClass('slick-current');

        if (_.options.centerMode === true) {

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {

                    _.$slides
                        .slice(index - centerOffset, index + centerOffset + 1)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides
                        .slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

                if (index === 0) {

                    allSlides
                        .eq(allSlides.length - 1 - _.options.slidesToShow)
                        .addClass('slick-center');

                } else if (index === _.slideCount - 1) {

                    allSlides
                        .eq(_.options.slidesToShow)
                        .addClass('slick-center');

                }

            }

            _.$slides
                .eq(index)
                .addClass('slick-center');

        } else {

            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

                _.$slides
                    .slice(index, index + _.options.slidesToShow)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

                    allSlides
                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    allSlides
                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

            }

        }

        if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
            _.lazyLoad();
        }
    };

    Slick.prototype.setupInfinite = function() {

        var _ = this,
            i, slideIndex, infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > (_.slideCount -
                        infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex - _.slideCount)
                        .prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex + _.slideCount)
                        .appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                    $(this).attr('id', '');
                });

            }

        }

    };

    Slick.prototype.interrupt = function( toggle ) {

        var _ = this;

        if( !toggle ) {
            _.autoPlay();
        }
        _.interrupted = toggle;

    };

    Slick.prototype.selectHandler = function(event) {

        var _ = this;

        var targetElement =
            $(event.target).is('.slick-slide') ?
                $(event.target) :
                $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.setSlideClasses(index);
            _.asNavFor(index);
            return;

        }

        _.slideHandler(index);

    };

    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {

        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
            _ = this, navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if ( _.options.autoplay ) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if ( _.options.asNavFor ) {

            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {
                navTarget.setSlideClasses(_.currentSlide);
            }

        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function() {
                    _.postSlide(animSlide);
                });

            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true) {
            _.animateSlide(targetLeft, function() {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }

    };

    Slick.prototype.startLoad = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();

        }

        _.$slider.addClass('slick-loading');

    };

    Slick.prototype.swipeDirection = function() {

        var xDist, yDist, r, swipeAngle, _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return (_.options.rtl === false ? 'right' : 'left');
        }
        if (_.options.verticalSwiping === true) {
            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';

    };

    Slick.prototype.swipeEnd = function(event) {

        var _ = this,
            slideCount,
            direction;

        _.dragging = false;
        _.swiping = false;

        if (_.scrolling) {
            _.scrolling = false;
            return false;
        }

        _.interrupted = false;
        _.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;

        if ( _.touchObject.curX === undefined ) {
            return false;
        }

        if ( _.touchObject.edgeHit === true ) {
            _.$slider.trigger('edge', [_, _.swipeDirection() ]);
        }

        if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {

            direction = _.swipeDirection();

            switch ( direction ) {

                case 'left':
                case 'down':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide + _.getSlideCount() ) :
                            _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide - _.getSlideCount() ) :
                            _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:


            }

            if( direction != 'vertical' ) {

                _.slideHandler( slideCount );
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction ]);

            }

        } else {

            if ( _.touchObject.startX !== _.touchObject.curX ) {

                _.slideHandler( _.currentSlide );
                _.touchObject = {};

            }

        }

    };

    Slick.prototype.swipeHandler = function(event) {

        var _ = this;

        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
            event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options
            .touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options
                .touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }

    };

    Slick.prototype.swipeMove = function(event) {

        var _ = this,
            edgeWasHit = false,
            curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        verticalSwipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

        if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
            _.scrolling = true;
            return false;
        }

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = verticalSwipeLength;
        }

        swipeDirection = _.swipeDirection();

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            _.swiping = true;
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }


        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    Slick.prototype.swipeStart = function(event) {

        var _ = this,
            touches;

        _.interrupted = true;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;

    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unload = function() {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides
            .removeClass('slick-slide slick-active slick-visible slick-current')
            .attr('aria-hidden', 'true')
            .css('width', '');

    };

    Slick.prototype.unslick = function(fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();

    };

    Slick.prototype.updateArrows = function() {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if ( _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow &&
            !_.options.infinite ) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            }

        }

    };

    Slick.prototype.updateDots = function() {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots
                .find('li')
                .removeClass('slick-active')
                .attr('aria-hidden', 'true');

            _.$dots
                .find('li')
                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
                .addClass('slick-active')
                .attr('aria-hidden', 'false');

        }

    };

    Slick.prototype.visibility = function() {

        var _ = this;

        if ( _.options.autoplay ) {

            if ( document[_.hidden] ) {

                _.interrupted = true;

            } else {

                _.interrupted = false;

            }

        }

    };

    $.fn.slick = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slick(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));

!function(){Function&&Function.prototype&&Function.prototype.bind&&(/MSIE [678]/.test(navigator.userAgent)||(window.__twttr&&window.__twttr.widgets&&window.__twttr.widgets.loaded&&window.twttr.widgets.load&&window.twttr.widgets.load(),window.__twttr&&window.__twttr.widgets&&window.__twttr.widgets.init||!function(t){function e(n){if(r[n])return r[n].exports;var i=r[n]={exports:{},id:n,loaded:!1};return t[n].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n=window.__twttrll;window.__twttrll=function(r,o){for(var a,s,u=0,c=[];u<r.length;u++)s=r[u],i[s]&&c.push.apply(c,i[s]),i[s]=0;for(a in o)t[a]=o[a];for(n&&n(r,o);c.length;)c.shift().call(null,null,e)};var r={},i={0:0};return e.e=function(t,e){},e.e=function(t,n){if(0===i[t])return n.call(null,null,e);if(void 0!==i[t])i[t].push(n);else{i[t]=[n];var r=document.getElementsByTagName("head")[0],o=document.createElement("script");o.type="text/javascript",o.charset="utf-8",o.async=!0,o.onerror=function(){var e=i[t];for(o.onerror=null,delete i[t];e.length;)e.shift().call(null,new Error("failed to load chunk"))},o.src=e.p+"js/"+({1:"dm_button",2:"button",3:"grid",4:"moment",5:"periscope_on_air",6:"timeline",7:"tweet"}[t]||t)+"."+{1:"3733ff42632ef21c7251703b97a713dd",2:"b731e6c82269f70f6fc53634e044a4c6",3:"26ff87ca8c644a52f77b9e26799b9466",4:"aa12283a515e15576926dc1c0d9faccc",5:"454b953cf569d605ec3530b6b38b09aa",6:"49f24b3ed4b1be2d087c97aca497c0d1",7:"6352a9eebf6f1aa3bcc0a57d66d2a72d"}[t]+".js",r.appendChild(o)}},e.m=t,e.c=r,e.p="https://platform.twitter.com/",e(0)}([function(t,e,n){var r,i=n(1),o=n(9),a=n(12),s=n(14),u=n(16),c=n(17),d=n(31),f=n(29),l=n(41),h=n(249),p=n(34),m=n(260),v=n(261),g="_e";u.set("widgets.init",!0),s.set("init",!0),v(),r=new i,a.exposeReadyPromise(r.promise,s.base,g),s.set("widgets",h),s.set("widgets.load",l.load),s.set("events",f),u.init("host","platform.twitter.com"),m(function(){r.resolve(s.base),c.attachTo(o),d.start("widgets-js-load"),l.loadPage().then(function(){d.endAndTrack("render","widgets-js-load","page",{widget_origin:p.rootDocumentLocation(),widget_frame:p.isFramed()&&p.currentDocumentLocation()})})})},function(t,e,n){function r(){var t=this;this.promise=new i(function(e,n){t.resolve=e,t.reject=n})}var i=n(2);t.exports=r},function(t,e,n){var r=n(3).Promise,i=n(7),o=n(8);t.exports=o.hasPromiseSupport()?i.Promise:r},function(t,e,n){var r;(function(t){/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   2.3.0
	 */
(function(){"use strict";function i(t){return"function"==typeof t||"object"==typeof t&&null!==t}function o(t){return"function"==typeof t}function a(t){return"object"==typeof t&&null!==t}function s(t){V=t}function u(t){K=t}function c(){var t=process.nextTick,e=process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);return Array.isArray(e)&&"0"===e[1]&&"10"===e[2]&&(t=setImmediate),function(){t(p)}}function d(){return function(){H(p)}}function f(){var t=0,e=new Z(p),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}function l(){var t=new MessageChannel;return t.port1.onmessage=p,function(){t.port2.postMessage(0)}}function h(){return function(){setTimeout(p,1)}}function p(){for(var t=0;t<G;t+=2){var e=et[t],n=et[t+1];e(n),et[t]=void 0,et[t+1]=void 0}G=0}function m(){try{var t=n(5);return H=t.runOnLoop||t.runOnContext,d()}catch(t){return h()}}function v(){}function g(){return new TypeError("You cannot resolve a promise with itself")}function y(){return new TypeError("A promises callback cannot return that same promise.")}function w(t){try{return t.then}catch(t){return ot.error=t,ot}}function b(t,e,n,r){try{t.call(e,n,r)}catch(t){return t}}function _(t,e,n){K(function(t){var r=!1,i=b(n,e,function(n){r||(r=!0,e!==n?A(t,n):T(t,n))},function(e){r||(r=!0,I(t,e))},"Settle: "+(t._label||" unknown promise"));!r&&i&&(r=!0,I(t,i))},t)}function E(t,e){e._state===rt?T(t,e._result):e._state===it?I(t,e._result):P(e,void 0,function(e){A(t,e)},function(e){I(t,e)})}function x(t,e){if(e.constructor===t.constructor)E(t,e);else{var n=w(e);n===ot?I(t,ot.error):void 0===n?T(t,e):o(n)?_(t,e,n):T(t,e)}}function A(t,e){t===e?I(t,g()):i(e)?x(t,e):T(t,e)}function C(t){t._onerror&&t._onerror(t._result),S(t)}function T(t,e){t._state===nt&&(t._result=e,t._state=rt,0!==t._subscribers.length&&K(S,t))}function I(t,e){t._state===nt&&(t._state=it,t._result=e,K(C,t))}function P(t,e,n,r){var i=t._subscribers,o=i.length;t._onerror=null,i[o]=e,i[o+rt]=n,i[o+it]=r,0===o&&t._state&&K(S,t)}function S(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r,i,o=t._result,a=0;a<e.length;a+=3)r=e[a],i=e[a+n],r?j(n,r,i,o):i(o);t._subscribers.length=0}}function R(){this.error=null}function N(t,e){try{return t(e)}catch(t){return at.error=t,at}}function j(t,e,n,r){var i,a,s,u,c=o(n);if(c){if(i=N(n,r),i===at?(u=!0,a=i.error,i=null):s=!0,e===i)return void I(e,y())}else i=r,s=!0;e._state!==nt||(c&&s?A(e,i):u?I(e,a):t===rt?T(e,i):t===it&&I(e,i))}function k(t,e){try{e(function(e){A(t,e)},function(e){I(t,e)})}catch(e){I(t,e)}}function O(t,e){var n=this;n._instanceConstructor=t,n.promise=new t(v),n._validateInput(e)?(n._input=e,n.length=e.length,n._remaining=e.length,n._init(),0===n.length?T(n.promise,n._result):(n.length=n.length||0,n._enumerate(),0===n._remaining&&T(n.promise,n._result))):I(n.promise,n._validationError())}function L(t){return new st(this,t).promise}function z(t){function e(t){A(i,t)}function n(t){I(i,t)}var r=this,i=new r(v);if(!Q(t))return I(i,new TypeError("You must pass an array to race.")),i;for(var o=t.length,a=0;i._state===nt&&a<o;a++)P(r.resolve(t[a]),void 0,e,n);return i}function D(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var n=new e(v);return A(n,t),n}function F(t){var e=this,n=new e(v);return I(n,t),n}function B(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function M(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function q(t){this._id=lt++,this._state=void 0,this._result=void 0,this._subscribers=[],v!==t&&(o(t)||B(),this instanceof q||M(),k(this,t))}function U(){var t;if("undefined"!=typeof global)t=global;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;e&&"[object Promise]"===Object.prototype.toString.call(e.resolve())&&!e.cast||(t.Promise=ht)}var W;W=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var H,V,$,Q=W,G=0,K=({}.toString,function(t,e){et[G]=t,et[G+1]=e,G+=2,2===G&&(V?V(p):$())}),J="undefined"!=typeof window?window:void 0,Y=J||{},Z=Y.MutationObserver||Y.WebKitMutationObserver,X="undefined"!=typeof process&&"[object process]"==={}.toString.call(process),tt="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,et=new Array(1e3);$=X?c():Z?f():tt?l():void 0===J?m():h();var nt=void 0,rt=1,it=2,ot=new R,at=new R;O.prototype._validateInput=function(t){return Q(t)},O.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")},O.prototype._init=function(){this._result=new Array(this.length)};var st=O;O.prototype._enumerate=function(){for(var t=this,e=t.length,n=t.promise,r=t._input,i=0;n._state===nt&&i<e;i++)t._eachEntry(r[i],i)},O.prototype._eachEntry=function(t,e){var n=this,r=n._instanceConstructor;a(t)?t.constructor===r&&t._state!==nt?(t._onerror=null,n._settledAt(t._state,e,t._result)):n._willSettleAt(r.resolve(t),e):(n._remaining--,n._result[e]=t)},O.prototype._settledAt=function(t,e,n){var r=this,i=r.promise;i._state===nt&&(r._remaining--,t===it?I(i,n):r._result[e]=n),0===r._remaining&&T(i,r._result)},O.prototype._willSettleAt=function(t,e){var n=this;P(t,void 0,function(t){n._settledAt(rt,e,t)},function(t){n._settledAt(it,e,t)})};var ut=L,ct=z,dt=D,ft=F,lt=0,ht=q;q.all=ut,q.race=ct,q.resolve=dt,q.reject=ft,q._setScheduler=s,q._setAsap=u,q._asap=K,q.prototype={constructor:q,then:function(t,e){var n=this,r=n._state;if(r===rt&&!t||r===it&&!e)return this;var i=new this.constructor(v),o=n._result;if(r){var a=arguments[r-1];K(function(){j(r,i,a,o)})}else P(n,i,t,e);return i},catch:function(t){return this.then(null,t)}};var pt=U,mt={Promise:ht,polyfill:pt};n(6).amd?(r=function(){return mt}.call(e,n,e,t),!(void 0!==r&&(t.exports=r))):"undefined"!=typeof t&&t.exports&&(t.exports=mt)}).call(this)}).call(e,n(4)(t))},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}},function(t,e){},function(t,e){t.exports=function(){throw new Error("define cannot be used indirect")}},function(t,e){t.exports=window},function(t,e,n){function r(t){return t=t||p,t.devicePixelRatio?t.devicePixelRatio>=1.5:!!t.matchMedia&&t.matchMedia("only screen and (min-resolution: 144dpi)").matches}function i(t){return t=t||v,/(Trident|MSIE|Edge[\/ ]?\d)/.test(t)}function o(t){return t=t||v,/MSIE 9/.test(t)}function a(t){return t=t||v,/(iPad|iPhone|iPod)/.test(t)}function s(t){return t=t||v,/^Mozilla\/5\.0 \(Linux; (U; )?Android/.test(t)}function u(t,e){return t=t||p,e=e||v,t.postMessage&&!(i(e)&&t.opener)}function c(t,e,n){return t=t||p,e=e||h,n=n||v,"ontouchstart"in t||/Opera Mini/.test(n)||e.msMaxTouchPoints>0}function d(){var t=l.body.style;return void 0!==t.transition||void 0!==t.webkitTransition||void 0!==t.mozTransition||void 0!==t.oTransition||void 0!==t.msTransition}function f(){return!!(p.Promise&&p.Promise.resolve&&p.Promise.reject&&p.Promise.all&&p.Promise.race&&function(){var t;return new p.Promise(function(e){t=e}),m.isType("function",t)}())}var l=n(9),h=n(10),p=n(7),m=n(11),v=h.userAgent;t.exports={retina:r,anyIE:i,ie9:o,ios:a,android:s,canPostMessage:u,touch:c,cssTransitions:d,hasPromiseSupport:f}},function(t,e){t.exports=document},function(t,e){t.exports=navigator},function(t,e,n){function r(t){return f(arguments).slice(1).forEach(function(e){o(e,function(e,n){t[e]=n})}),t}function i(t){return o(t,function(e,n){u(n)&&(i(n),c(n)&&delete t[e]),void 0!==n&&null!==n&&""!==n||delete t[e]}),t}function o(t,e){for(var n in t)t.hasOwnProperty&&!t.hasOwnProperty(n)||e(n,t[n]);return t}function a(t){return{}.toString.call(t).match(/\s([a-zA-Z]+)/)[1].toLowerCase()}function s(t,e){return t==a(e)}function u(t){return t===Object(t)}function c(t){if(!u(t))return!1;if(Object.keys)return!Object.keys(t).length;for(var e in t)if(t.hasOwnProperty(e))return!1;return!0}function d(t,e){h.setTimeout(function(){t.call(e||null)},0)}function f(t){return t?Array.prototype.slice.call(t):[]}function l(t,e){return!(!t||!t.indexOf)&&t.indexOf(e)>-1}var h=n(7);t.exports={aug:r,async:d,compact:i,contains:l,forIn:o,isObject:u,isEmptyObject:c,toType:a,isType:s,toRealArray:f}},function(t,e,n){function r(t,e,n){e.ready=i(t.then,t),n&&Array.isArray(e[n])&&(e[n].forEach(i(t.then,t)),delete e[n])}var i=n(13);t.exports={exposeReadyPromise:r}},function(t,e,n){var r=n(11);t.exports=function(t,e){var n=Array.prototype.slice.call(arguments,2);return function(){var i=r.toRealArray(arguments);return t.apply(e,n.concat(i))}}},function(t,e,n){var r=n(15);t.exports=new r("twttr")},function(t,e,n){function r(t){return s.isType("string",t)?t.split("."):s.isType("array",t)?t:[]}function i(t,e){var n=r(e),i=n.slice(0,-1);return i.reduce(function(t,e,n){if(t[e]=t[e]||{},!s.isObject(t[e]))throw new Error(i.slice(0,n+1).join(".")+" is already defined with a value.");return t[e]},t)}function o(t,e){e=e||a,e[t]=e[t]||{},Object.defineProperty(this,"base",{value:e[t]}),Object.defineProperty(this,"name",{value:t})}var a=n(7),s=n(11);s.aug(o.prototype,{get:function(t){var e=r(t);return e.reduce(function(t,e){if(s.isObject(t))return t[e]},this.base)},set:function(t,e,n){var o=r(t),a=i(this.base,t),s=o.slice(-1);return n&&s in a?a[s]:a[s]=e},init:function(t,e){return this.set(t,e,!0)},unset:function(t){var e=r(t),n=this.get(e.slice(0,-1));n&&delete n[e.slice(-1)]},aug:function(t){var e=this.get(t),n=s.toRealArray(arguments).slice(1);if(e="undefined"!=typeof e?e:{},n.unshift(e),!n.every(s.isObject))throw new Error("Cannot augment non-object.");return this.set(t,s.aug.apply(null,n))},call:function(t){var e=this.get(t),n=s.toRealArray(arguments).slice(1);if(!s.isType("function",e))throw new Error("Function "+t+"does not exist.");return e.apply(null,n)},fullPath:function(t){var e=r(t);return e.unshift(this.name),e.join(".")}}),t.exports=o},function(t,e,n){var r=n(15);t.exports=new r("__twttr")},function(t,e,n){function r(t){var e=a.href,n="original_referer="+e;return[t,n].join(t.indexOf("?")==-1?"?":"&")}function i(t){var e,n;t.altKey||t.metaKey||t.shiftKey||(e=u.closest(function(t){return"A"===t.tagName||"AREA"===t.tagName},t.target),e&&d.isIntentURL(e.href)&&(n=r(e.href),n=n.replace(/^http[:]/,"https:"),n=n.replace(/^\/\//,"https://"),c.open(n,e),s.preventDefault(t)))}function o(t){t.addEventListener("click",i,!1)}var a=n(18),s=n(19),u=n(21),c=n(22),d=n(23);t.exports={attachTo:o}},function(t,e){t.exports=location},function(t,e,n){function r(t){var e=t.getAttribute("data-twitter-event-id");return e?e:(t.setAttribute("data-twitter-event-id",++g),g)}function i(t,e,n){var r=0,i=t&&t.length||0;for(r=0;r<i;r++)if(t[r].call(e,n,e),n.ceaseImmediately)return!1}function o(t,e,n){for(var r=n||t.target||t.srcElement,a=m.list(r).map(function(t){return"."+t}),s=a.concat(r.tagName),u=0,c=s.length;u<c;u++)if(i(e[s[u]],r,t)===!1)return;t.cease||r!==this&&o.call(this,t,e,r.parentElement||r.parentNode)}function a(t,e,n,r){function i(r){o.call(t,r,n[e])}s(t,i,e,r),t.addEventListener(e,i,!1)}function s(t,e,n,r){t.id&&(y[t.id]=y[t.id]||[],y[t.id].push({el:t,listener:e,type:n,rootId:r}))}function u(t){var e=y[t];e&&(e.forEach(function(t){t.el.removeEventListener(t.type,t.listener,!1),delete v[t.rootId]}),delete y[t])}function c(t,e,n,i){var o=r(t);v[o]=v[o]||{},v[o][e]||(v[o][e]={},a(t,e,v[o],o)),v[o][e][n]=v[o][e][n]||[],v[o][e][n].push(i)}function d(t,e,n){var i=r(e),a=v[i]&&v[i];o.call(e,{target:n},a[t])}function f(t){return h(t),l(t),!1}function l(t){t&&t.preventDefault?t.preventDefault():t.returnValue=!1}function h(t){t&&(t.cease=!0)&&t.stopPropagation?t.stopPropagation():t.cancelBubble=!0}function p(t){t&&(t.ceaseImmediately=!0,h(t),t.stopImmediatePropagation())}var m=n(20),v={},g=-1,y={};t.exports={stop:f,stopPropagation:h,stopImmediatePropagation:p,preventDefault:l,delegate:c,simulate:d,removeDelegatesForWidget:u}},function(t,e,n){function r(t){return new RegExp("\\b"+t+"\\b","g")}function i(t,e){return t.classList?void t.classList.add(e):void(r(e).test(t.className)||(t.className+=" "+e))}function o(t,e){return t.classList?void t.classList.remove(e):void(t.className=t.className.replace(r(e)," "))}function a(t,e,n){return void 0===n&&t.classList&&t.classList.toggle?t.classList.toggle(e,n):(n?i(t,e):o(t,e),n)}function s(t,e,n){return t.classList&&u(t,e)?(o(t,e),void i(t,n)):void(t.className=t.className.replace(r(e),n))}function u(t,e){return t.classList?t.classList.contains(e):d.contains(c(t),e)}function c(t){return d.toRealArray(t.classList?t.classList:t.className.match(f))}var d=n(11),f=/\b([\w-_]+)\b/g;t.exports={add:i,remove:o,replace:s,toggle:a,present:u,list:c}},function(t,e,n){function r(t){var e=t.charAt(0);return"."===e?function(e){var n=e.className?e.className.split(/\s+/):[];return o.contains(n,t.slice(1))}:"#"===e?function(e){return e.id===t.slice(1)}:function(e){return e.tagName===t.toUpperCase()}}function i(t,e,n){var a;if(e)return n=n||e&&e.ownerDocument,a=o.isType("function",t)?t:r(t),e===n?a(e)?e:void 0:a(e)?e:i(a,e.parentNode,n)}var o=n(11);t.exports={closest:i}},function(t,e,n){function r(t,e){u.open(t,{},e)}function i(t,e){var n=d.decodeURL(e);switch(t){case"favorite":case"like":return{tweet_id:n.tweet_id};case"follow":return{screen_name:n.screen_name,user_id:n.user_id};case"retweet":return{source_tweet_id:n.tweet_id};default:return{}}}function o(t,e,n){var o=(s.intentType(t)||"").toLowerCase();s.isTwitterURL(t)&&(r(t,n),e&&c.trigger("click",{target:e,region:"intent",type:"click",data:{}}),e&&f[o]&&f[o].forEach(function(n){c.trigger(n,{target:e,region:"intent",type:n,data:i(o,t)})}))}function a(t){this.srcEl=[],this.element=t}var s=n(23),u=n(26),c=n(29),d=n(24),f={favorite:["favorite","like"],follow:["follow"],like:["favorite","like"],retweet:["retweet"],tweet:["tweet"]};a.open=o,t.exports=a},function(t,e,n){function r(t){return"string"==typeof t&&_.test(t)&&RegExp.$1.length<=20}function i(t){if(r(t))return RegExp.$1}function o(t,e){var n=b.decodeURL(t);if(e=e||!1,n.screen_name=i(t),n.screen_name)return b.url("https://twitter.com/intent/"+(e?"follow":"user"),n)}function a(t){return o(t,!0)}function s(t){return"string"==typeof t&&C.test(t)}function u(t,e){if(e=void 0===e||e,s(t))return(e?"#":"")+RegExp.$1}function c(t){return"string"==typeof t&&E.test(t)}function d(t){return c(t)&&RegExp.$1}function f(t){return x.test(t)}function l(t){return A.test(t)}function h(t){return T.test(t)}function p(t){return P.test(t)&&RegExp.$1}function m(t){return I.test(t)&&RegExp.$1}function v(t){return T.test(t)&&RegExp.$1}function g(t){return S.test(t)&&RegExp.$1}function y(t){return!!R.test(t)&&{ownerScreenName:RegExp.$1,slug:RegExp.$2}}function w(t){return N.test(t)&&RegExp.$1}var b=n(24),_=/(?:^|(?:https?\:)?\/\/(?:www\.)?twitter\.com(?:\:\d+)?(?:\/intent\/(?:follow|user)\/?\?screen_name=|(?:\/#!)?\/))@?([\w]+)(?:\?|&|$)/i,E=/(?:^|(?:https?\:)?\/\/(?:www\.)?twitter\.com(?:\:\d+)?\/(?:#!\/)?[\w_]+\/status(?:es)?\/)(\d+)/i,x=/^http(s?):\/\/(\w+\.)*twitter\.com([\:\/]|$)/i,A=/^http(s?):\/\/pbs\.twimg\.com\//,C=/^#?([^.,<>!\s\/#\-\(\)\'\"]+)$/,T=/twitter\.com(?:\:\d{2,4})?\/intent\/(\w+)/,I=/^https?:\/\/(?:www\.)?twitter\.com\/\w+\/timelines\/(\d+)/i,P=/^https?:\/\/(?:www\.)?twitter\.com\/i\/moments\/(\d+)/i,S=/^https?:\/\/(?:www\.)?twitter\.com\/(\w+)\/(?:likes|favorites)/i,R=/^https?:\/\/(?:www\.)?twitter\.com\/(\w+)\/lists\/([\w-]+)/i,N=/^https?:\/\/(?:www\.)?twitter\.com\/i\/live\/(\d+)/i;t.exports={isHashTag:s,hashTag:u,isScreenName:r,screenName:i,isStatus:c,status:d,intentForProfileURL:o,intentForFollowURL:a,isTwitterURL:f,isTwimgURL:l,isIntentURL:h,regexen:{profile:_},momentId:p,collectionId:m,intentType:v,likesScreenName:g,listScreenNameAndSlug:y,eventId:w}},function(t,e,n){function r(t){return encodeURIComponent(t).replace(/\+/g,"%2B").replace(/'/g,"%27")}function i(t){return decodeURIComponent(t)}function o(t){var e=[];return d.forIn(t,function(t,n){var i=r(t);d.isType("array",n)||(n=[n]),n.forEach(function(t){c.hasValue(t)&&e.push(i+"="+r(t))})}),e.sort().join("&")}function a(t){var e,n={};return t?(e=t.split("&"),e.forEach(function(t){var e=t.split("="),r=i(e[0]),o=i(e[1]);if(2==e.length)return d.isType("array",n[r])?void n[r].push(o):r in n?(n[r]=[n[r]],void n[r].push(o)):void(n[r]=o)}),n):{}}function s(t,e){var n=o(e);return n.length>0?d.contains(t,"?")?t+"&"+o(e):t+"?"+o(e):t}function u(t){var e=t&&t.split("?");return 2==e.length?a(e[1]):{}}var c=n(25),d=n(11);t.exports={url:s,decodeURL:u,decode:a,encode:o,encodePart:r,decodePart:i}},function(t,e,n){function r(t){return void 0!==t&&null!==t&&""!==t}function i(t){return s(t)&&t%1===0}function o(t){return"string"===m.toType(t)}function a(t){return s(t)&&!i(t)}function s(t){return r(t)&&!isNaN(t)}function u(t){return r(t)&&"array"==m.toType(t)}function c(t){return m.contains(g,t)}function d(t){return m.contains(v,t)}function f(t){return!!r(t)&&(!!d(t)||!c(t)&&!!t)}function l(t){if(s(t))return t}function h(t){if(a(t))return t}function p(t){if(i(t))return parseInt(t,10)}var m=n(11),v=[!0,1,"1","on","ON","true","TRUE","yes","YES"],g=[!1,0,"0","off","OFF","false","FALSE","no","NO"];t.exports={hasValue:r,isInt:i,isFloat:a,isNumber:s,isString:o,isArray:u,isTruthValue:d,isFalseValue:c,asInt:p,asFloat:h,asNumber:l,asBoolean:f}},function(t,e,n){function r(t){var e=[];return m.forIn(t,function(t,n){e.push(t+"="+n)}),e.join(",")}function i(){return v+p.generate()}function o(t,e){function n(t){return Math.round(t/2)}return t>e?{coordinate:0,size:e}:{coordinate:n(e)-n(t),size:t}}function a(t,e,n){var i,a;e=s.parse(e),n=n||{},i=o(e.width,n.width||g),e.left=i.coordinate,e.width=i.size,a=o(e.height,n.height||y),e.top=a.coordinate,e.height=a.size,this.win=t,this.features=r(e)}var s,u=n(7),c=n(27),d=n(19),f=n(21),l=n(8),h=n(23),p=n(28),m=n(11),v="intent_",g=u.screen.width,y=u.screen.height;s=(new c).defaults({width:550,height:520,personalbar:"0",toolbar:"0",location:"1",scrollbars:"1",resizable:"1"}),a.prototype.open=function(t,e){var n=e&&"click"==e.type&&f.closest("a",e.target),r=e&&(e.altKey||e.metaKey||e.shiftKey),o=n&&(l.ios()||l.android());if(h.isTwitterURL(t))return r||o?this:(this.name=i(),this.popup=this.win.open(t,this.name,this.features),e&&d.preventDefault(e),this)},a.open=function(t,e,n){var r=new a(u,e);return r.open(t,n)},t.exports=a},function(t,e,n){function r(t){return function(e){return o.hasValue(e[t])}}function i(){this.assertions=[],this._defaults={}}var o=n(25),a=n(11);i.prototype.assert=function(t,e){return this.assertions.push({fn:t,msg:e||"assertion failed"}),this},i.prototype.defaults=function(t){return this._defaults=t||this._defaults,this},i.prototype.require=function(t){var e=this;return t=Array.isArray(t)?t:a.toRealArray(arguments),t.forEach(function(t){e.assert(r(t),"required: "+t)}),this},i.prototype.parse=function(t){var e,n;if(e=a.aug({},this._defaults,t||{}),n=this.assertions.reduce(function(t,n){return n.fn(e)||t.push(n.msg),t},[]),n.length>0)throw new Error(n.join("\n"));return e},t.exports=i},function(t,e){function n(){return i+String(+new Date)+Math.floor(1e5*Math.random())+o++}function r(){return i+String(a++)}var i="i",o=0,a=0;t.exports={generate:n,deterministic:r}},function(t,e,n){function r(){return i.get("events")||{}}var i=n(14),o=n(30),a=n(11);t.exports=a.aug(r(),o.Emitter)},function(t,e,n){var r=n(11),i=n(13),o={bind:function(t,e){return this._handlers=this._handlers||{},this._handlers[t]=this._handlers[t]||[],this._handlers[t].push(e)},unbind:function(t,e){if(this._handlers&&this._handlers[t])if(e){var n=this._handlers[t].indexOf(e);n>=0&&this._handlers[t].splice(n,1)}else this._handlers[t]=[]},trigger:function(t,e){var n=this._handlers&&this._handlers[t];e=e||{},e.type=t,n&&n.forEach(function(t){r.async(i(t,this,e))})}};t.exports={Emitter:o}},function(t,e,n){function r(t){c[t]=+new Date}function i(t){return c[t]?+new Date-c[t]:null}function o(t,e,n,r,o){var s=i(e);s&&a(t,n,r,s,o)}function a(t,e,n,r,i){var o,a=void 0===i?d:i;100*Math.random()>a||(n=u.aug(n||{},{duration_ms:r}),o={page:e,component:"performance",action:t},s.clientEvent(o,n,!0))}var s=n(32),u=n(11),c={},d=1;t.exports={start:r,end:i,track:a,endAndTrack:o}},function(t,e,n){function r(t,e,n){return i(t,e,n,2)}function i(t,e,n,r){var i=!v.isObject(t),o=!!e&&!v.isObject(e);i||o||a(m.formatClientEventNamespace(t),m.formatClientEventData(e,n,r),m.CLIENT_EVENT_ENDPOINT)}function o(t,e,n,r){var o=m.extractTermsFromDOM(t.target||t.srcElement);o.action=r||"click",i(o,e,n)}function a(t,e,n){var r,i;n&&v.isObject(t)&&v.isObject(e)&&(r=m.flattenClientEventPayload(t,e),i={l:m.stringify(r)},r.dnt&&(i.dnt=1),l(p.url(n,i)))}function s(t,e,n,r){var i,o=!v.isObject(t),a=!!e&&!v.isObject(e);if(!o&&!a)return i=m.flattenClientEventPayload(m.formatClientEventNamespace(t),m.formatClientEventData(e,n,r)),u(i)}function u(t){return y.push(t),y}function c(){var t,e;return y.length>1&&s({page:"widgets_js",component:"scribe_pixel",action:"batch_log"},{}),t=y,y=[],e=t.reduce(function(e,n,r){var i=e.length,o=i&&e[i-1],a=r+1==t.length;return a&&n.event_namespace&&"batch_log"==n.event_namespace.action&&(n.message=["entries:"+r,"requests:"+i].join("/")),d(n).forEach(function(t){var n=f(t);(!o||o.urlLength+n>g)&&(o={urlLength:b,items:[]},e.push(o)),o.urlLength+=n,o.items.push(t)}),e},[]),e.map(function(t){var e={l:t.items};return h.enabled()&&(e.dnt=1),l(p.url(m.CLIENT_EVENT_ENDPOINT,e))})}function d(t){return Array.isArray(t)||(t=[t]),t.reduce(function(t,e){var n,r=m.stringify(e),i=f(r);return b+i<g?t=t.concat(r):(n=m.splitLogEntry(e),n.length>1&&(t=t.concat(d(n)))),t},[])}function f(t){return encodeURIComponent(t).length+3}function l(t){var e=new Image;return e.src=t}var h=n(33),p=n(24),m=n(38),v=n(11),g=2083,y=[],w=p.url(m.CLIENT_EVENT_ENDPOINT,{dnt:0,l:""}),b=encodeURIComponent(w).length;t.exports={_enqueueRawObject:u,scribe:a,clientEvent:i,clientEvent2:r,enqueueClientEvent:s,flushClientEvents:c,interaction:o}},function(t,e,n){function r(){l=!0}function i(t,e){return!!l||(!!d.asBoolean(f.val("dnt"))||(!(!s||1!=s.doNotTrack&&1!=s.msDoNotTrack)||(!!c.isUrlSensitive(e||a.host)||(!(!u.isFramed()||!c.isUrlSensitive(u.rootDocumentLocation()))||(t=h.test(t||o.referrer)&&RegExp.$1,!(!t||!c.isUrlSensitive(t)))))))}var o=n(9),a=n(18),s=n(10),u=n(34),c=n(36),d=n(25),f=n(37),l=!1,h=/https?:\/\/([^\/]+).*/i;t.exports={setOn:r,enabled:i}},function(t,e,n){function r(t){return t&&u.isType("string",t)&&(c=t),c}function i(){return d}function o(){return c!==d}var a=n(18),s=n(35),u=n(11),c=s.getCanonicalURL()||a.href,d=c;t.exports={isFramed:o,rootDocumentLocation:r,currentDocumentLocation:i}},function(t,e,n){function r(t,e){var n,r;return e=e||s,/^https?:\/\//.test(t)?t:/^\/\//.test(t)?e.protocol+t:(n=e.host+(e.port.length?":"+e.port:""),0!==t.indexOf("/")&&(r=e.pathname.split("/"),r.pop(),r.push(t),t="/"+r.join("/")),[e.protocol,"//",n,t].join(""))}function i(){for(var t,e=a.getElementsByTagName("link"),n=0;t=e[n];n++)if("canonical"==t.rel)return r(t.href)}function o(){for(var t,e,n,r=a.getElementsByTagName("a"),i=a.getElementsByTagName("link"),o=[r,i],s=0,c=0,d=/\bme\b/;t=o[s];s++)for(c=0;e=t[c];c++)if(d.test(e.rel)&&(n=u.screenName(e.href)))return n}var a=n(9),s=n(18),u=n(23);t.exports={absolutize:r,getCanonicalURL:i,getScreenNameFromPage:o}},function(t,e,n){function r(t){return t in s?s[t]:s[t]=a.test(t)}function i(){return r(o.host)}var o=n(18),a=/^[^#?]*\.(gov|mil)(:\d+)?([#?].*)?$/i,s={};t.exports={isUrlSensitive:r,isHostPageSensitive:i}},function(t,e,n){function r(t){var e,n,r,i=0;for(o={},t=t||a,e=t.getElementsByTagName("meta");n=e[i];i++)/^twitter:/.test(n.name)&&(r=n.name.replace(/^twitter:/,""),o[r]=n.content)}function i(t){return o[t]}var o,a=n(9);r(),t.exports={init:r,val:i}},function(t,e,n){function r(t,e){var n;return e=e||{},t&&t.nodeType===Node.ELEMENT_NODE?((n=t.getAttribute("data-scribe"))&&n.split(" ").forEach(function(t){var n=t.trim().split(":"),r=n[0],i=n[1];r&&i&&!e[r]&&(e[r]=i)}),r(t.parentNode,e)):e}function i(t){return p.aug({client:"tfw"},t||{})}function o(t,e,n){var r=t&&t.widget_origin||f.referrer;return t=a("tfw_client_event",t,r),t.client_version=v,t.format_version=void 0!==n?n:1,e||(t.widget_origin=r),t}function a(t,e,n){return e=e||{},p.aug({},e,{_category_:t,triggered_on:e.triggered_on||+new Date,dnt:h.enabled(n)})}function s(t,e){var n={};return e=e||{},e.association_namespace=i(t),n[b]=e,n}function u(t,e){return p.aug({},e,{event_namespace:t})}function c(t){var e,n=Array.prototype.toJSON;return delete Array.prototype.toJSON,e=l.stringify(t),n&&(Array.prototype.toJSON=n),e}function d(t){if(t.item_ids&&t.item_ids.length>1){var e=Math.floor(t.item_ids.length/2),n=t.item_ids.slice(0,e),r={},i=t.item_ids.slice(e),o={};n.forEach(function(e){r[e]=t.item_details[e]}),i.forEach(function(e){o[e]=t.item_details[e]});var a=[p.aug({},t,{item_ids:n,item_details:r}),p.aug({},t,{item_ids:i,item_details:o})];return a}return[t]}var f=n(9),l=n(39),h=n(33),p=n(11),m=n(40),v=m.version,g="https://syndication.twitter.com/i/jot",y="https://syndication.twitter.com/i/jot/syndication",w="https://platform.twitter.com/jot.html",b=1;t.exports={extractTermsFromDOM:r,flattenClientEventPayload:u,formatGenericEventData:a,formatClientEventData:o,formatClientEventNamespace:i,formatTweetAssociation:s,splitLogEntry:d,stringify:c,AUDIENCE_ENDPOINT:y,CLIENT_EVENT_ENDPOINT:g,RUFOUS_REDIRECT:w}},function(t,e,n){var r=n(7),i=r.JSON;t.exports={stringify:i.stringify||i.encode,parse:i.parse||i.decode}},function(t,e){t.exports={version:"5b73de7:1496356917666"}},function(t,e,n){function r(t){return t.reduce(function(t,e){return t.concat(g.reduce(function(t,n){return t.concat(n(e))},[]))},[])}function i(){var t=f.val("widgets:autoload")||!0;return!m.isFalseValue(t)&&(m.isTruthValue(t)?c.body:c.querySelectorAll(t))}function o(t){var e;return t=t||c.body,t=t.length?v.toRealArray(t):[t],h.pause(),e=u.allResolved(r(t).map(function(t){return d.addWidget(t)})).then(function(t){p.trigger("loaded",{widgets:t})}),u.always(e,function(){h.resume()}),e}function a(){var t=i();return t===!1?s.resolve():(l.set("widgets.loaded",!0),o(t))}var s=n(2),u=n(42),c=n(9),d=n(43),f=n(37),l=n(16),h=n(50),p=n(29),m=n(25),v=n(11),g=n(73);t.exports={load:o,loadPage:a,_getPageLoadTarget:i}},function(t,e,n){function r(t,e){return t.then(e,e)}function i(t){var e;return t=t||[],e=t.length,t=t.filter(s),e?e!==t.length?u.reject("non-Promise passed to .some"):new u(function(e,n){function r(){i+=1,i===t.length&&n()}var i=0;t.forEach(function(t){t.then(e,r)})}):u.reject("no promises passed to .some")}function o(t){var e;return void 0===t?u.reject(new Error("undefined is not an object")):Array.isArray(t)?(e=t.length,e?new u(function(n,r){function i(){a+=1,a===e&&(0===u.length?r():n(u))}function o(t){u.push(t),i()}var a=0,u=[];t.forEach(function(t){s(t)?t.then(o,i):o(t)})}):u.resolve([])):u.reject(new Error("Type error"))}function a(t){function e(){}return u.all((t||[]).map(function(t){return r(t,e)}))}function s(t){return t instanceof u}var u=n(2);t.exports={always:r,allResolved:o,some:i,isPromise:s,allSettled:a}},function(t,e,n){function r(t){return t.reduce(function(t,e){return t[e.className]=t[e.className]||[],t[e.className].push(e),t},{})}function i(t){var e=t.map(a.fromRawTask),n=r(e);f.forIn(n,function(t,e){c.allSettled(e.map(function(t){return t.initialize()})).then(function(){e.forEach(function(t){u.all([t.hydrate(),t.insertIntoDom()]).then(d(t.render,t)).then(d(t.success,t),d(t.fail,t))})})})}function o(t){return l.add(t)}var a=n(44),s=n(48),u=n(2),c=n(42),d=n(13),f=n(11),l=new s(i);t.exports={addWidget:o}},function(t,e,n){function r(t){var e=t.srcEl||t.targetEl;return e.ownerDocument.defaultView}function i(t,e){this._widget=null,this._sandbox=null,this._hydrated=!1,this._insertedIntoDom=!1,this._Sandbox=t.Sandbox,this._factory=t.factory,this._widgetParams=t.parameters,this._resolve=e,this._className=t.className,this._renderedClassName=t.className+"-rendered",this._errorClassName=t.className+"-error",this._srcEl=t.srcEl,this._targetGlobal=r(t),this._insertionStrategy=function(e){var n=t.srcEl,r=t.targetEl;n?r.insertBefore(e,n):r.appendChild(e)}}var o=n(20),a=n(45),s=n(29),u=n(47),c=n(2),d=n(42);i.fromRawTask=function(t){return new i(t.input,t.taskDoneDeferred.resolve)},i.prototype.initialize=function(){var t=this,e=new this._Sandbox(this._targetGlobal);return this._factory(this._widgetParams,e).then(function(n){return t._widget=n,t._sandbox=e,n})},i.prototype.insertIntoDom=function(){var t=this;return this._widget?this._sandbox.insert(this._widget.id,{class:[this._className,this._renderedClassName].join(" ")},null,this._insertionStrategy).then(function(){t._insertedIntoDom=!0}):c.reject(new Error("cannot insert widget into DOM before it is initialized"))},i.prototype.hydrate=function(){var t=this;return this._widget?this._widget.hydrate().then(function(){t._hydrated=!0}):c.reject(new Error("cannot hydrate widget before it is initialized"))},i.prototype.render=function(){function t(){r._sandbox.onResize(function(){return r._widget.resize().then(function(){s.trigger("resize",{target:r._sandbox.sandboxEl})})})}function e(){return u(r._srcEl).then(function(){return r._sandbox.sandboxEl})}function n(t){return u(r._sandbox.sandboxEl).then(function(){return c.reject(t)})}var r=this;return this._hydrated?this._insertedIntoDom?r._widget.render(r._sandbox).then(function(){return t(),r._widget.show()}).then(e,n):n(new Error("cannot render widget before DOM insertion")):n(new Error("cannot render widget before hydration"))},i.prototype.fail=function(){var t=this;return this._srcEl?d.always(a.write(function(){o.add(t._srcEl,t._errorClassName)}),function(){s.trigger("rendered",{target:t._srcEl}),t._resolve(t._srcEl)}):(t._resolve(),c.resolve())},i.prototype.success=function(){s.trigger("rendered",{target:this._sandbox.sandboxEl}),this._resolve(this._sandbox.sandboxEl)},t.exports=i},function(t,e,n){function r(t,e){return function(){try{e.resolve(t.call(this))}catch(t){e.reject(t)}}}function i(t,e){t.call(e)}function o(t,e){var n=new c;return u.read(r(t,n),e),n.promise}function a(t,e){var n=new c;return u.write(r(t,n),e),n.promise}function s(t,e,n){var i=new c;return d.isType("function",t)&&(n=e,e=t,t=1),u.defer(t,r(e,i),n),i.promise}var u=n(46),c=n(1),d=n(11);t.exports={sync:i,read:o,write:a,defer:s}},function(t,e,n){var r;!function(){"use strict";function i(){this.frames=[],this.lastId=0,this.raf=o,this.batch={hash:{},read:[],write:[],mode:null}}var o=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,1e3/60)};i.prototype.read=function(t,e){var n=this.add("read",t,e),r=n.id;this.batch.read.push(n.id);var i="reading"===this.batch.mode||this.batch.scheduled;return i?r:(this.scheduleBatch(),r)},i.prototype.write=function(t,e){var n=this.add("write",t,e),r=this.batch.mode,i=n.id;this.batch.write.push(n.id);var o="writing"===r||"reading"===r||this.batch.scheduled;return o?i:(this.scheduleBatch(),i)},i.prototype.defer=function(t,e,n){"function"==typeof t&&(n=e,e=t,t=1);var r=this,i=t-1;return this.schedule(i,function(){r.run({fn:e,ctx:n})})},i.prototype.clear=function(t){if("function"==typeof t)return this.clearFrame(t);t=Number(t);var e=this.batch.hash[t];if(e){var n=this.batch[e.type],r=n.indexOf(t);delete this.batch.hash[t],~r&&n.splice(r,1)}},i.prototype.clearFrame=function(t){var e=this.frames.indexOf(t);~e&&this.frames.splice(e,1)},i.prototype.scheduleBatch=function(){var t=this;this.schedule(0,function(){t.batch.scheduled=!1,t.runBatch()}),this.batch.scheduled=!0},i.prototype.uniqueId=function(){return++this.lastId},i.prototype.flush=function(t){for(var e;e=t.shift();)this.run(this.batch.hash[e])},i.prototype.runBatch=function(){try{
this.batch.mode="reading",this.flush(this.batch.read),this.batch.mode="writing",this.flush(this.batch.write),this.batch.mode=null}catch(t){throw this.runBatch(),t}},i.prototype.add=function(t,e,n){var r=this.uniqueId();return this.batch.hash[r]={id:r,fn:e,ctx:n,type:t}},i.prototype.run=function(t){var e=t.ctx||this,n=t.fn;if(delete this.batch.hash[t.id],!this.onError)return n.call(e);try{n.call(e)}catch(t){this.onError(t)}},i.prototype.loop=function(){function t(){var e=n.frames.shift();n.frames.length?r(t):n.looping=!1,e&&e()}var e,n=this,r=this.raf,i=!1,o=500;this.looping||(e=setTimeout(function(){i=!0,t()},o),r(function(){i||(clearTimeout(e),t())}),this.looping=!0)},i.prototype.schedule=function(t,e){return this.frames[t]?this.schedule(t+1,e):(this.loop(),this.frames[t]=e)};var a=new i;"undefined"!=typeof t&&t.exports?t.exports=a:(r=function(){return a}.call(e,n,e,t),!(void 0!==r&&(t.exports=r)))}()},function(t,e,n){function r(t){return i.write(function(){t&&t.parentNode&&t.parentNode.removeChild(t)})}var i=n(45);t.exports=r},function(t,e,n){function r(t){this._inputsQueue=[],this._task=t,this._hasFlushBeenScheduled=!1}var i=n(1),o=n(49),a=n(13);r.prototype.add=function(t){var e=new i;return this._inputsQueue.push({input:t,taskDoneDeferred:e}),this._hasFlushBeenScheduled||(this._hasFlushBeenScheduled=!0,o(a(this._flush,this))),e.promise},r.prototype._flush=function(){try{this._task.call(null,this._inputsQueue)}catch(t){this._inputsQueue.forEach(function(e){e.taskDoneDeferred.reject(t)})}this._inputsQueue=[],this._hasFlushBeenScheduled=!1},t.exports=r},function(t,e,n){var r=n(3).Promise;t.exports=r._asap},function(t,e,n){function r(t){t.forEach(function(t){var e=t.input.namespace,n=t.input.data,r=t.input.offsite,i=t.input.version;d.clientEvent(e,n,r,i),t.taskDoneDeferred.resolve()})}function i(t){function e(){t.forEach(function(t){t.taskDoneDeferred.resolve()})}function n(){t.forEach(function(t){t.taskDoneDeferred.reject()})}c.init(),t.forEach(function(t){var e=t.input.namespace,n=t.input.data,r=t.input.offsite,i=t.input.version;c.clientEvent(e,n,r,i)}),c.flush().then(e,n)}function o(t){(1===t.length?r:i)(t)}function a(t,e,n,r){return l.add({namespace:t,data:e,offsite:n,version:r})}function s(){l.pause()}function u(){l.resume()}var c=n(51),d=n(32),f=n(72),l=new f(o);t.exports={scribe:a,pause:s,resume:u}},function(t,e,n){function r(){function t(t){h.body.appendChild(t)}return T?I.promise:(l=new _(p),l.insert("rufous-sandbox",null,{display:"none"},t).then(function(){l.setTitle("Twitter analytics iframe"),d=u(),f=c(),I.resolve([d,f])}),T=!0,I.promise)}function i(t,e){var n,r,i;b.isObject(t)&&b.isObject(e)&&(i=w.flattenClientEventPayload(t,e),n=d.firstChild,n.value=+(+n.value||i.dnt||0),r=l.createElement("input"),r.type="hidden",r.name="l",r.value=w.stringify(i),d.appendChild(r))}function o(t,e,n){var r=!b.isObject(t),o=!!e&&!b.isObject(e);r||o||I.promise.then(function(){i(w.formatClientEventNamespace(t),w.formatClientEventData(e,n))})}function a(){return I.promise.then(function(){if(d.children.length<=2)return y.reject();var t=y.all([l.doc.body.appendChild(d),l.doc.body.appendChild(f)]).then(function(t){var e=t[0],n=t[1];return n.addEventListener("load",function(){s(e,n)()}),e.submit(),t});return d=u(),f=c(),t})}function s(t,e){return function(){var n=t.parentNode;n&&(n.removeChild(t),n.removeChild(e))}}function u(){var t=l.createElement("form"),e=l.createElement("input"),n=l.createElement("input");return C++,t.action=w.CLIENT_EVENT_ENDPOINT,t.method="POST",t.target=x+C,t.id=A+C,e.type="hidden",e.name="dnt",e.value=v.enabled(),n.type="hidden",n.name="tfw_redirect",n.value=w.RUFOUS_REDIRECT,t.appendChild(e),t.appendChild(n),t}function c(){var t=x+C;return m({id:t,name:t,width:0,height:0,border:0},{display:"none"},l.doc)}var d,f,l,h=n(9),p=n(7),m=n(52),v=n(33),g=n(1),y=n(2),w=n(38),b=n(11),_=n(53),E=Math.floor(1e3*Math.random())+"_",x="rufous-frame-"+E+"-",A="rufous-form-"+E+"-",C=0,T=!1,I=new g;t.exports={clientEvent:o,flush:a,init:r}},function(t,e,n){var r=n(9),i=n(11);t.exports=function(t,e,n){var o;if(n=n||r,t=t||{},e=e||{},t.name){try{o=n.createElement('<iframe name="'+t.name+'"></iframe>')}catch(e){o=n.createElement("iframe"),o.name=t.name}delete t.name}else o=n.createElement("iframe");return t.id&&(o.id=t.id,delete t.id),o.allowtransparency="true",o.scrolling="no",o.setAttribute("frameBorder",0),o.setAttribute("allowTransparency",!0),i.forIn(t,function(t,e){o.setAttribute(t,e)}),i.forIn(e,function(t,e){o.style[t]=e}),o}},function(t,e,n){var r=n(54),i=n(63);t.exports=r.build([i])},function(t,e,n){var r=n(55),i=n(58),o=n(13);r=Object.create(r),r.build=o(r.build,null,i),t.exports=r},function(t,e,n){function r(){return s.toRealArray(arguments)}function i(t,e,n){var r=new t;return e=a(o(e||[])),e.forEach(function(t){t.call(null,r)}),r.build(n)}var o=n(56),a=n(57),s=n(11);t.exports={couple:r,build:i}},function(t,e,n){function r(t){var e=[];return t.forEach(function(t){var n=i.isType("array",t)?r(t):[t];e=e.concat(n)}),e}var i=n(11);t.exports=r},function(t,e){function n(t){return t.filter(function(e,n){return t.indexOf(e)===n})}t.exports=n},function(t,e,n){function r(){i.apply(this,arguments)}var i=n(59),o=n(11),a=n(62);r.prototype=Object.create(i.prototype),o.aug(r.prototype,{factory:a}),t.exports=r},function(t,e,n){function r(t,e,n){var r=this[e];if(!r)throw new Error(e+" does not exist");this[e]=t(r,n)}function i(){this.Component=this.factory(),this._adviceArgs=[],this._lastArgs=[]}var o=n(60),a=n(11),s=n(61);a.aug(i.prototype,{factory:s,build:function(t){var e=this;this.Component;return a.aug(this.Component.prototype.boundParams,t),this._adviceArgs.concat(this._lastArgs).forEach(function(t){r.apply(e.Component.prototype,t)}),delete this._lastArgs,delete this._adviceArgs,this.Component},params:function(t){var e=this.Component.prototype.paramConfigs;t=t||{},this.Component.prototype.paramConfigs=a.aug({},t,e)},define:function(t,e){if(t in this.Component.prototype)throw new Error(t+" has previously been defined");this.override(t,e)},defineStatic:function(t,e){this.Component[t]=e},override:function(t,e){this.Component.prototype[t]=e},defineProperty:function(t,e){if(t in this.Component.prototype)throw new Error(t+" has previously been defined");this.overrideProperty(t,e)},overrideProperty:function(t,e){var n=a.aug({configurable:!0},e);Object.defineProperty(this.Component.prototype,t,n)},before:function(t,e){this._adviceArgs.push([o.before,t,e])},after:function(t,e){this._adviceArgs.push([o.after,t,e])},around:function(t,e){this._adviceArgs.push([o.around,t,e])},last:function(t,e){this._lastArgs.push([o.after,t,e])}}),t.exports=i},function(t,e,n){function r(t,e){return function(){var n,r=this,i=arguments;return n=e.apply(this,arguments),a.isPromise(n)?n.then(function(){return t.apply(r,i)}):t.apply(this,arguments)}}function i(t,e){return function(){function n(t,e){return a.isPromise(e)?e.then(function(){return t}):t}var r,i=this,o=arguments;return r=t.apply(this,arguments),a.isPromise(r)?r.then(function(t){return n(t,e.apply(i,o))}):n(r,e.apply(this,arguments))}}function o(t,e){return function(){var n=s.toRealArray(arguments);return n.unshift(u(t,this)),e.apply(this,n)}}var a=n(42),s=n(11),u=n(13);t.exports={before:r,after:i,around:o}},function(t,e,n){function r(){return!0}function i(t){return t}function o(t,e,n){var r=null;return t.some(function(t){if(t=s.isType("function",t)?t():t,e(t))return r=n(t),!0}),r}function a(){function t(t){var e=this;t=t||{},this.params=Object.keys(this.paramConfigs).reduce(function(n,a){var s=[],u=e.boundParams,c=e.paramConfigs[a],d=c.validate||r,f=c.transform||i;if(a in u&&s.push(u[a]),a in t&&s.push(t[a]),s="fallback"in c?s.concat(c.fallback):s,n[a]=o(s,d,f),c.required&&null==n[a])throw new Error(a+" is a required parameter");return n},{}),this.initialize()}return s.aug(t.prototype,{paramConfigs:{},boundParams:{},initialize:function(){}}),t}var s=n(11);t.exports=a},function(t,e,n){function r(){function t(t){e.apply(this,arguments),Object.defineProperty(this,"targetGlobal",{value:t})}var e=a();return t.prototype=Object.create(e.prototype),u.aug(t.prototype,{id:null,initialized:!1,width:0,height:0,sandboxEl:null,insert:function(){return s.reject()},onResize:function(){},addClass:function(t){var e=this.sandboxEl;return t=Array.isArray(t)?t:[t],o.write(function(){t.forEach(function(t){i.add(e,t)})})},removeClass:function(t){var e=this.sandboxEl;return t=Array.isArray(t)?t:[t],o.write(function(){t.forEach(function(t){i.remove(e,t)})})},styleSelf:function(t){var e=this;return o.write(function(){u.forIn(t,function(t,n){e.sandboxEl.style[t]=n})})}}),t}var i=n(20),o=n(45),a=n(61),s=n(2),u=n(11);t.exports=r},function(t,e,n){function r(t,e,n,r){return e=w.aug({id:t},x,e),n=w.aug({},A,n),m(e,n,r)}function i(t){try{t.contentWindow.document}catch(t){return y.reject(t)}return y.resolve(t)}function o(t,e,n,i,o){var a=new g,u=_.generate(),d=r(t,e,n,o);return b.set(["sandbox",u],function(){var t=d.contentWindow.document,e="<!DOCTYPE html><html><head></head><body></body></html>";c.write(function(){t.write(e)}).then(function(){t.close(),a.resolve(d)})}),d.src=["javascript:",'document.write("");',"try { window.parent.document; }",'catch (e) { document.domain="'+s.domain+'"; }',"window.parent."+b.fullPath(["sandbox",u])+"();"].join(""),d.addEventListener("error",a.reject,!1),c.write(function(){i.parentNode.replaceChild(d,i)}),a.promise}function a(t){t.overrideProperty("id",{get:function(){return this.sandboxEl&&this.sandboxEl.id}}),t.overrideProperty("initialized",{get:function(){return!!this.win}}),t.overrideProperty("width",{get:function(){return this._width}}),t.overrideProperty("height",{get:function(){return this._height}}),t.overrideProperty("sandboxEl",{get:function(){return this.iframeEl}}),t.defineProperty("iframeEl",{get:function(){return this._iframe}}),t.defineProperty("rootEl",{get:function(){return this.doc&&this.doc.documentElement}}),t.defineProperty("widgetEl",{get:function(){return this.doc&&this.doc.body.firstElementChild}}),t.defineProperty("win",{get:function(){return this.iframeEl&&this.iframeEl.contentWindow}}),t.defineProperty("doc",{get:function(){return this.win&&this.win.document}}),t.define("_updateCachedDimensions",function(){var t=this;return c.read(function(){var e,n=v(t.sandboxEl);"visible"==t.sandboxEl.style.visibility?t._width=n.width:(e=v(t.sandboxEl.parentElement).width,t._width=Math.min(n.width,e)),t._height=n.height})}),t.define("_setTargetToBlank",function(){var t=this.createElement("base");t.target="_blank",this.doc.head.appendChild(t)}),t.define("_didResize",function(){var t=this,e=this._resizeHandlers.slice(0);return this._updateCachedDimensions().then(function(){e.forEach(function(e){e(t)})})}),t.define("setTitle",function(t){this.iframeEl.title=t}),t.override("createElement",function(t){return this.doc.createElement(t)}),t.override("createFragment",function(){return this.doc.createDocumentFragment()}),t.override("htmlToElement",function(t){var e;return e=this.createElement("div"),e.innerHTML=t,e.firstElementChild}),t.override("hasSelectedText",function(){return!!d.getSelectedText(this.win)}),t.override("addRootClass",function(t){var e=this.rootEl;return t=Array.isArray(t)?t:[t],this.initialized?c.write(function(){t.forEach(function(t){u.add(e,t)})}):y.reject(new Error("sandbox not initialized"))}),t.override("removeRootClass",function(t){var e=this.rootEl;return t=Array.isArray(t)?t:[t],this.initialized?c.write(function(){t.forEach(function(t){u.remove(e,t)})}):y.reject(new Error("sandbox not initialized"))}),t.override("hasRootClass",function(t){return u.present(this.rootEl,t)}),t.define("addStyleSheet",function(t,e){var n,r=new g;return this.initialized?(n=this.createElement("link"),n.type="text/css",n.rel="stylesheet",n.href=t,n.addEventListener("load",r.resolve,!1),n.addEventListener("error",r.reject,!1),c.write(E(e,null,n)).then(function(){return l(t).then(r.resolve,r.reject),r.promise})):y.reject(new Error("sandbox not initialized"))}),t.override("prependStyleSheet",function(t){var e=this.doc;return this.addStyleSheet(t,function(t){var n=e.head.firstElementChild;return n?e.head.insertBefore(t,n):e.head.appendChild(t)})}),t.override("appendStyleSheet",function(t){var e=this.doc;return this.addStyleSheet(t,function(t){return e.head.appendChild(t)})}),t.define("addCss",function(t,e){var n;return h.inlineStyle()?(n=this.createElement("style"),n.type="text/css",n.appendChild(this.doc.createTextNode(t)),c.write(E(e,null,n))):y.resolve()}),t.override("prependCss",function(t){var e=this.doc;return this.addCss(t,function(t){var n=e.head.firstElementChild;return n?e.head.insertBefore(t,n):e.head.appendChild(t)})}),t.override("appendCss",function(t){var e=this.doc;return this.addCss(t,function(t){return e.head.appendChild(t)})}),t.override("makeVisible",function(){var t=this;return this.styleSelf(C).then(function(){t._updateCachedDimensions()})}),t.override("injectWidgetEl",function(t){var e=this;return this.initialized?this.widgetEl?y.reject(new Error("widget already injected")):c.write(function(){e.doc.body.appendChild(t)}):y.reject(new Error("sandbox not initialized"))}),t.override("matchHeightToContent",function(){var t,e=this;return c.read(function(){t=e.widgetEl?v(e.widgetEl).height:0}),c.write(function(){e.sandboxEl.style.height=t+"px"}).then(function(){return e._updateCachedDimensions()})}),t.override("matchWidthToContent",function(){var t,e=this;return c.read(function(){t=e.widgetEl?v(e.widgetEl).width:0}),c.write(function(){e.sandboxEl.style.width=t+"px"}).then(function(){return e._updateCachedDimensions()})}),t.after("initialize",function(){this._iframe=null,this._width=this._height=0,this._resizeHandlers=[]}),t.override("insert",function(t,e,n,a){var s=this,u=new g,d=this.targetGlobal.document,f=r(t,e,n,d);return c.write(E(a,null,f)),f.addEventListener("load",function(){i(f).then(null,E(o,null,t,e,n,f,d)).then(u.resolve,u.reject)},!1),f.addEventListener("error",u.reject,!1),u.promise.then(function(t){var e=p(s._didResize,P,s);return s._iframe=t,s.win.addEventListener("resize",e,!1),y.all([s._setTargetToBlank(),s.addRootClass(T),s.prependCss(I)])})}),t.override("onResize",function(t){this._resizeHandlers.push(t)}),t.after("styleSelf",function(){return this._updateCachedDimensions()})}var s=n(9),u=n(20),c=n(45),d=n(64),f=n(54),l=n(65),h=n(66),p=n(67),m=n(52),v=(n(68),n(69)),g=n(1),y=n(2),w=n(11),b=n(16),_=n(28),E=n(13),x={allowfullscreen:"true"},A={position:"absolute",visibility:"hidden",display:"block",width:"0px",height:"0px",padding:"0",border:"none"},C={position:"static",visibility:"visible"},T="SandboxRoot",I=".SandboxRoot { display: none; }",P=50;t.exports=f.couple(n(70),a)},function(t,e,n){function r(t){return t=t||o,t.getSelection&&t.getSelection()}function i(t){var e=r(t);return e?e.toString():""}var o=n(7);t.exports={getSelection:r,getSelectedText:i}},function(t,e,n){function r(t){var e=new a,n=i.createElement("img");return n.onload=n.onerror=function(){o.setTimeout(e.resolve,50)},n.src=t,o.setTimeout(e.reject,s),e.promise}var i=n(9),o=n(7),a=n(1),s=2e4;t.exports=r},function(t,e,n){function r(){return h+l.generate()}function i(){var t=r(),e=s.createElement("div"),n=s.createElement("style"),i="."+t+" { visibility: hidden; }";return!!s.body&&(f.asBoolean(c.val("widgets:csp"))&&(o=!1),void 0!==o?o:(e.style.display="none",a.add(e,t),n.type="text/css",n.appendChild(s.createTextNode(i)),s.body.appendChild(n),s.body.appendChild(e),o="hidden"===u.getComputedStyle(e).visibility,d(e),d(n),o))}var o,a=n(20),s=n(9),u=n(7),c=n(37),d=n(47),f=n(25),l=n(28),h="csptest";t.exports={inlineStyle:i}},function(t,e,n){function r(t,e,n){function r(){var s=n||this,u=arguments,c=+new Date;return i.clearTimeout(o),c-a>e?(a=c,void t.apply(s,u)):void(o=i.setTimeout(function(){r.apply(s,u)},e))}var o,a=0;return n=n||null,r}var i=n(7);t.exports=r},function(t,e,n){function r(){c("info",l.toRealArray(arguments))}function i(){c("warn",l.toRealArray(arguments))}function o(){c("error",l.toRealArray(arguments))}function a(t){m&&(p[t]=u())}function s(t){var e;m&&(p[t]?(e=u(),r("_twitter",t,e-p[t])):o("timeEnd() called before time() for id: ",t))}function u(){return f.performance&&+f.performance.now()||+new Date}function c(t,e){if(f[h]&&f[h][t])switch(e.length){case 1:f[h][t](e[0]);break;case 2:f[h][t](e[0],e[1]);break;case 3:f[h][t](e[0],e[1],e[2]);break;case 4:f[h][t](e[0],e[1],e[2],e[3]);break;case 5:f[h][t](e[0],e[1],e[2],e[3],e[4]);break;default:0!==e.length&&f[h].warn&&f[h].warn("too many params passed to logger."+t)}}var d=n(18),f=n(7),l=n(11),h=["con","sole"].join(""),p={},m=l.contains(d.href,"tw_debug=true");t.exports={info:r,warn:i,error:o,time:a,timeEnd:s}},function(t,e){function n(t){var e=t.getBoundingClientRect();return{width:e.width,height:e.height}}t.exports=n},function(t,e,n){function r(t){t.define("createElement",i),t.define("createFragment",i),t.define("htmlToElement",i),t.define("hasSelectedText",i),t.define("addRootClass",i),t.define("removeRootClass",i),t.define("hasRootClass",i),t.define("prependStyleSheet",i),t.define("appendStyleSheet",i),t.define("prependCss",i),t.define("appendCss",i),t.define("makeVisible",i),t.define("injectWidgetEl",i),t.define("matchHeightToContent",i),t.define("matchWidthToContent",i)}var i=n(71);t.exports=r},function(t,e){function n(){throw new Error("unimplemented method")}t.exports=n},function(t,e,n){function r(t,e){this._inputsQueue=[],this._task=t,this._isPaused=!1,this._flushDelay=e&&e.flushDelay||a,this._pauseLength=e&&e.pauseLength||s,this._flushTimeout=void 0}var i=n(1),o=n(13),a=100,s=3e3;r.prototype.add=function(t){var e=new i;return this._inputsQueue.push({input:t,taskDoneDeferred:e}),this._scheduleFlush(),e.promise},r.prototype._scheduleFlush=function(){this._isPaused||(clearTimeout(this._flushTimeout),this._flushTimeout=setTimeout(o(this._flush,this),this._flushDelay))},r.prototype._flush=function(){try{this._task.call(null,this._inputsQueue)}catch(t){this._inputsQueue.forEach(function(e){e.taskDoneDeferred.reject(t)})}this._inputsQueue=[],this._flushTimeout=void 0},r.prototype.pause=function(t){clearTimeout(this._flushTimeout),this._isPaused=!0,!t&&this._pauseLength&&setTimeout(o(this.resume,this),this._pauseLength)},r.prototype.resume=function(){this._isPaused=!1,this._scheduleFlush()},t.exports=r},function(t,e,n){t.exports=[n(74),n(107),n(123),n(156),n(162),n(168),n(218),n(230),n(235)]},function(t,e,n){function r(t){var e=t.getAttribute("data-show-screen-name"),n=u(t),r=t.getAttribute("href"),i=t.getAttribute("data-screen-name"),c=e?a.asBoolean(e):null,d=t.getAttribute("data-size"),f=o.decodeURL(r),l=f.recipient_id,h=t.getAttribute("data-text")||f.text,p=t.getAttribute("data-welcome-message-id")||f.welcomeMessageId;return s.aug(n,{screenName:i,showScreenName:c,size:d,text:h,userId:l,welcomeMessageId:p})}function i(t){var e=c(t,f);return e.map(function(t){return d(r(t),t.parentNode,t)})}var o=n(24),a=n(25),s=n(11),u=n(75),c=n(77)(),d=n(80),f="a.twitter-dm-button";t.exports=i},function(t,e,n){function r(t){var e=t.href&&t.href.split("?")[1],n=e?a.decode(e):{},r={lang:u(t),width:t.getAttribute("data-width")||t.getAttribute("width"),height:t.getAttribute("data-height")||t.getAttribute("height"),related:t.getAttribute("data-related"),partner:t.getAttribute("data-partner")};return o.asBoolean(t.getAttribute("data-dnt"))&&i.setOn(),s.forIn(r,function(t,e){var r=n[t];n[t]=o.hasValue(r)?r:e}),n}var i=n(33),o=n(25),a=n(24),s=n(11),u=n(76);t.exports=r},function(t,e,n){function r(t){var e;if(t)return e=t.lang||t.getAttribute("data-lang"),i.isType("string",e)?e:r(t.parentElement)}var i=n(11);t.exports=r},function(t,e,n){var r=n(78),i=n(28);t.exports=function(){var t="data-twitter-extracted-"+i.generate();return function(e,n){function i(e){return!e.hasAttribute(t)}function o(e){return e.setAttribute(t,"true"),e}return r(e,n).filter(i).map(o)}}},function(t,e,n){function r(t,e){return o(t,e)?[t]:i.toRealArray(t.querySelectorAll(e))}var i=n(11),o=n(79);t.exports=r},function(t,e,n){function r(t,e){if(a)return a.call(t,e)}var i=n(7),o=i.HTMLElement,a=o.prototype.matches||o.prototype.matchesSelector||o.prototype.webkitMatchesSelector||o.prototype.mozMatchesSelector||o.prototype.msMatchesSelector||o.prototype.oMatchesSelector;t.exports=r},function(t,e,n){function r(t,e,n){return new i(o,a,"twitter-dm-button",t,e,n)}var i=n(81),o=n(82),a=n(103);t.exports=r},function(t,e){function n(t,e,n,r,i,o){this.factory=t,this.Sandbox=e,this.srcEl=o,this.targetEl=i,this.parameters=r,this.className=n}n.prototype.destroy=function(){this.srcEl=this.targetEl=null},t.exports=n},function(t,e,n){function r(t,e){var r=new i;return n.e(1,function(i,o){var a;if(i)return r.reject(i);try{a=n(83),r.resolve(new a(t,e))}catch(t){r.reject(t)}}),r.promise}var i=n(1);t.exports=r},,function(t,e,n){var r=n(55),i=n(85),o=n(13);r=Object.create(r),r.build=o(r.build,null,i),t.exports=r},function(t,e,n){function r(){i.apply(this,arguments),this.Widget=this.Component}var i=n(59),o=n(11),a=n(86);r.prototype=Object.create(i.prototype),o.aug(r.prototype,{factory:a,build:function(){var t=i.prototype.build.apply(this,arguments);return t},selectors:function(t){var e=this.Widget.prototype.selectors;t=t||{},this.Widget.prototype.selectors=o.aug({},t,e)}}),t.exports=r},function(t,e,n){function r(){function t(t,n){e.apply(this,arguments),this.id=d+c(),this.sandbox=n}var e=a();return t.prototype=Object.create(e.prototype),s.aug(t.prototype,{selectors:{},hydrate:function(){return i.resolve()},prepForInsertion:function(){},render:function(){return i.resolve()},show:function(){return i.resolve()},resize:function(){return i.resolve()},select:function(t,e){return 1===arguments.length&&(e=t,t=this.el),t?(e=this.selectors[e]||e,s.toRealArray(t.querySelectorAll(e))):[]},selectOne:function(){return this.select.apply(this,arguments)[0]},selectLast:function(){return this.select.apply(this,arguments).pop()},on:function(t,e,n){function r(t){s.addEventListener(t,n,!1)}function i(t){o.delegate(s,t,a,n)}var a,s=this.el;this.el&&(t=(t||"").split(/\s+/),2===arguments.length?n=e:a=e,a=this.selectors[a]||a,n=u(n,this),t.forEach(a?i:r))}}),t}var i=n(2),o=n(19),a=n(61),s=n(11),u=n(13),c=n(87),d="twitter-widget-";t.exports=r},function(t,e){function n(){return String(r++)}var r=0;t.exports=n},,function(t,e,n){function r(t){return"dark"===t?"dark":"light"}function i(t,e,n){var i,o;return n=r(n),i=s.isRtlLang(e)?"rtl":"ltr",o=[t,c.css,n,i,"css"].join("."),u.base()+"/css/"+o}function o(){return u.base()+"/css/"+["periscope_on_air",c.css,"css"].join(".")}function a(){return u.base()+"/css/"+["dm_button",c.css,"css"].join(".")}var s=n(90),u=n(93),c=n(94),d=n(13);t.exports={dmButton:a,tweet:d(i,null,"tweet"),timeline:d(i,null,"timeline"),video:d(i,null,"video"),moment:d(i,null,"moment"),grid:d(i,null,"grid"),periscopeOnAir:o}},function(t,e,n){function r(t){return t=String(t).toLowerCase(),o.contains(s,t)}function i(t){return t=(t||"").toLowerCase(),t=t.replace("_","-"),a(t)?t:(t=t.replace(/\-.*/,""),a(t)?t:"en")}var o=n(11),a=n(91),s=["ar","fa","he","ur"];t.exports={isRtlLang:r,matchLanguage:i}},function(t,e,n){function r(t){return"en"===t||i.contains(o,t)}var i=n(11),o=n(92);t.exports=r},function(t,e){t.exports=["hi","zh-cn","fr","zh-tw","msa","fil","fi","sv","pl","ja","ko","de","it","pt","es","ru","id","tr","da","no","nl","hu","fa","ar","ur","he","th","cs","uk","vi","ro","bn","el","en-gb","gu","kn","mr","ta","bg","ca","hr","sr","sk"]},function(t,e,n){function r(t){var e=o.get("host");return a(t)+"://"+e}var i=n(18),o=n(16),a=function(){return/^http\:$/.test(i.protocol)?function(t){return t?"https":"http"}:function(){return"https"}}();t.exports={base:r}},function(t,e){t.exports={css:"617c78967784cf8638fa20f3423757ac"}},,function(t,e,n){function r(t){t.define("injectRefUrlParams",function(t){t.getAttribute(a)||(t.setAttribute(a,!0),t.href=i(t.href))}),t.after("render",function(){this.on("click","A",function(t,e){o.isTwitterURL(e.href)&&this.injectRefUrlParams(e)})})}var i=n(97),o=n(23),a="data-url-ref-attrs-injected";t.exports=r},function(t,e,n){function r(t){return i.url(t,{ref_src:a,ref_url:o.rootDocumentLocation()})}var i=n(24),o=n(34),a="twsrc^tfw";t.exports=r},function(t,e,n){function r(t){t.define("scribeNamespace",function(){return{client:"tfw"}}),t.define("scribeData",function(){return{widget_origin:a.rootDocumentLocation(),widget_frame:a.isFramed()&&a.currentDocumentLocation()}}),t.define("scribe",function(t,e,n){t=s.aug(this.scribeNamespace(),t||{}),e=s.aug(this.scribeData(),e||{}),i.scribe(t,e,!1,n)}),t.define("scribeInteraction",function(t,e,n){var r=o.extractTermsFromDOM(t.target);r.action=t.type,this.scribe(r,e,n)})}var i=n(50),o=n(38),a=n(34),s=n(11);t.exports=r},,function(t,e,n){function r(t){var e;if(t)return e=s([t]),{item_ids:Object.keys(e),item_details:e}}function i(t){t.selectors({tweetIdInfo:".js-tweetIdInfo"}),t.define("scribeClickInteraction",function(t,e){var n=o.closest(this.selectors.tweetIdInfo,e,this.el);this.scribeInteraction(t,r(n))}),t.after("render",function(){this.on("click","A",this.scribeClickInteraction),this.on("click","BUTTON",this.scribeClickInteraction)})}var o=n(21),a=n(84),s=n(101);t.exports=a.couple(n(98),i)},function(t,e,n){function r(t){return t?(t=Array.isArray(t)?t:[t],t.reduce(function(t,e){var n=e.getAttribute("data-tweet-id"),r=e.getAttribute("data-rendered-tweet-id")||n;return n===r?t[r]={item_type:i.TWEET}:n&&(t[r]={item_type:i.RETWEET,target_type:i.TWEET,target_id:n}),t},{})):{}}var i=n(102);t.exports=r},function(t,e){t.exports={TWEET:0,RETWEET:10,CUSTOM_TIMELINE:17,LIVE_VIDEO_EVENT:28}},function(t,e,n){var r=n(104),i=n(53);t.exports=r.isSupported()?r:i},function(t,e,n){var r=n(54),i=n(105);t.exports=r.build([i])},function(t,e,n){function r(t){t.defineStatic("isSupported",function(){return!!o.HTMLElement.prototype.createShadowRoot&&l.inlineStyle()&&!h.android()}),t.overrideProperty("id",{get:function(){return this.sandboxEl&&this.sandboxEl.id}}),t.overrideProperty("initialized",{get:function(){return!!this._shadowHost}}),t.overrideProperty("width",{get:function(){return this._width}}),t.overrideProperty("height",{get:function(){return this._height}}),t.overrideProperty("sandboxEl",{get:function(){return this._shadowHost}}),t.define("_updateCachedDimensions",function(){var t=this;return u.read(function(){var e,n=p(t.sandboxEl);"visible"==t.sandboxEl.style.visibility?t._width=n.width:(e=p(t.sandboxEl.parentElement).width,t._width=Math.min(n.width,e)),t._height=n.height})}),t.define("_didResize",function(){var t=this,e=this._resizeHandlers.slice(0);return this._updateCachedDimensions().then(function(){e.forEach(function(e){e(t)})})}),t.override("createElement",function(t){return this.targetGlobal.document.createElement(t)}),t.override("createFragment",function(){return this.targetGlobal.document.createDocumentFragment()}),t.override("htmlToElement",function(t){var e;return e=this.createElement("div"),e.innerHTML=t,e.firstElementChild}),t.override("hasSelectedText",function(){return!!c.getSelectedText(this.targetGlobal)}),t.override("addRootClass",function(t){var e=this._shadowRootBody;return t=Array.isArray(t)?t:[t],this.initialized?u.write(function(){t.forEach(function(t){a.add(e,t)})}):g.reject(new Error("sandbox not initialized"))}),t.override("removeRootClass",function(t){var e=this._shadowRootBody;return t=Array.isArray(t)?t:[t],this.initialized?u.write(function(){t.forEach(function(t){a.remove(e,t)})}):g.reject(new Error("sandbox not initialized"))}),t.override("hasRootClass",function(t){return a.present(this._shadowRootBody,t)}),t.override("addStyleSheet",function(t,e){return this.addCss('@import url("'+t+'");',e).then(function(){return f(t)})}),t.override("prependStyleSheet",function(t){var e=this._shadowRoot;return this.addStyleSheet(t,function(t){var n=e.firstElementChild;return n?e.insertBefore(t,n):e.appendChild(t)})}),t.override("appendStyleSheet",function(t){var e=this._shadowRoot;return this.addStyleSheet(t,function(t){return e.appendChild(t)})}),t.override("addCss",function(t,e){var n;return this.initialized?l.inlineStyle()?(n=this.createElement("style"),n.type="text/css",n.appendChild(this.targetGlobal.document.createTextNode(t)),u.write(m(e,null,n))):g.resolve():g.reject(new Error("sandbox not initialized"))}),t.override("prependCss",function(t){var e=this._shadowRoot;return this.addCss(t,function(t){var n=e.firstElementChild;return n?e.insertBefore(t,n):e.appendChild(t)})}),t.override("appendCss",function(t){var e=this._shadowRoot;return this.addCss(t,function(t){return e.appendChild(t)})}),t.override("makeVisible",function(){return this.styleSelf(_)}),t.override("injectWidgetEl",function(t){function e(){var t=v(n._didResize,w,n);new i(n._shadowRootBody,t)}var n=this;return this.initialized?this._shadowRootBody.firstElementChild?g.reject(new Error("widget already injected")):u.write(function(){n._shadowRootBody.appendChild(t)}).then(function(){return n._updateCachedDimensions()}).then(e):g.reject(new Error("sandbox not initialized"))}),t.override("matchHeightToContent",function(){return g.resolve()}),t.override("matchWidthToContent",function(){return g.resolve()}),t.override("insert",function(t,e,n,r){var i=this.targetGlobal.document,o=this._shadowHost=i.createElement(E),a=this._shadowRoot=o.createShadowRoot(),c=this._shadowRootBody=i.createElement("div");return y.forIn(e||{},function(t,e){o.setAttribute(t,e)}),o.id=t,a.appendChild(c),s.delegate(c,"click","A",function(t,e){e.hasAttribute("target")||e.setAttribute("target","_blank")}),g.all([this.styleSelf(b),this.addRootClass(x),this.prependCss(A),u.write(r.bind(null,o))])}),t.override("onResize",function(t){this._resizeHandlers.push(t)}),t.after("initialize",function(){this._shadowHost=this._shadowRoot=this._shadowRootBody=null,this._width=this._height=0,this._resizeHandlers=[]}),t.after("styleSelf",function(){return this._updateCachedDimensions()})}var i=n(106),o=n(7),a=n(20),s=n(19),u=n(45),c=n(64),d=n(54),f=n(65),l=n(66),h=n(8),p=n(69),m=n(13),v=n(67),g=n(2),y=n(11),w=50,b={position:"absolute",visibility:"hidden",display:"block",transform:"rotate(0deg)"},_={position:"static",visibility:"visible"},E="twitterwidget",x="SandboxRoot",A=".SandboxRoot { display: none; }";t.exports=d.couple(n(70),r)},function(t,e){!function(){var e=function(t,n){function r(){this.q=[],this.add=function(t){this.q.push(t)};var t,e;this.call=function(){for(t=0,e=this.q.length;t<e;t++)this.q[t].call()}}function i(t,e){return t.currentStyle?t.currentStyle[e]:window.getComputedStyle?window.getComputedStyle(t,null).getPropertyValue(e):t.style[e]}function o(t,e){if(t.resizedAttached){if(t.resizedAttached)return void t.resizedAttached.add(e)}else t.resizedAttached=new r,t.resizedAttached.add(e);t.resizeSensor=document.createElement("div"),t.resizeSensor.className="resize-sensor";var n="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;",o="position: absolute; left: 0; top: 0; transition: 0s;";t.resizeSensor.style.cssText=n,t.resizeSensor.innerHTML='<div class="resize-sensor-expand" style="'+n+'"><div style="'+o+'"></div></div><div class="resize-sensor-shrink" style="'+n+'"><div style="'+o+' width: 200%; height: 200%"></div></div>',t.appendChild(t.resizeSensor),{fixed:1,absolute:1}[i(t,"position")]||(t.style.position="relative");var a,s,u=t.resizeSensor.childNodes[0],c=u.childNodes[0],d=t.resizeSensor.childNodes[1],f=(d.childNodes[0],function(){c.style.width=u.offsetWidth+10+"px",c.style.height=u.offsetHeight+10+"px",u.scrollLeft=u.scrollWidth,u.scrollTop=u.scrollHeight,d.scrollLeft=d.scrollWidth,d.scrollTop=d.scrollHeight,a=t.offsetWidth,s=t.offsetHeight});f();var l=function(){t.resizedAttached&&t.resizedAttached.call()},h=function(t,e,n){t.attachEvent?t.attachEvent("on"+e,n):t.addEventListener(e,n)},p=function(){t.offsetWidth==a&&t.offsetHeight==s||l(),f()};h(u,"scroll",p),h(d,"scroll",p)}var a=Object.prototype.toString.call(t),s="[object Array]"===a||"[object NodeList]"===a||"[object HTMLCollection]"===a||"undefined"!=typeof jQuery&&t instanceof jQuery||"undefined"!=typeof Elements&&t instanceof Elements;
if(s)for(var u=0,c=t.length;u<c;u++)o(t[u],n);else o(t,n);this.detach=function(){if(s)for(var n=0,r=t.length;n<r;n++)e.detach(t[n]);else e.detach(t)}};e.detach=function(t){t.resizeSensor&&(t.removeChild(t.resizeSensor),delete t.resizeSensor,delete t.resizedAttached)},"undefined"!=typeof t&&"undefined"!=typeof t.exports?t.exports=e:window.ResizeSensor=e}()},function(t,e,n){function r(t){var e=s(t),n={screenName:o.screenName(t.href),showScreenName:"false"!==t.getAttribute("data-show-screen-name"),showCount:"false"!==t.getAttribute("data-show-count"),size:t.getAttribute("data-size"),count:t.getAttribute("data-count"),preview:t.getAttribute("data-preview")};return a.forIn(n,function(t,n){var r=e[t];e[t]=d.hasValue(r)?r:n}),e.screenName=e.screenName||e.screen_name,e}function i(t){var e=u(t,f);return e.map(function(t){return c(r(t),t.parentNode,t)})}var o=n(23),a=n(11),s=n(75),u=n(77)(),c=n(108),d=n(25),f="a.twitter-follow-button";t.exports=i},function(t,e,n){function r(t,e,n){return new i(o,a,"twitter-follow-button",t,e,n)}var i=n(81),o=n(109),a=n(115);t.exports=r},function(t,e,n){function r(t,e){var r=new i;return n.e(2,function(i,o){var a;if(i)return r.reject(i);try{a=n(110),r.resolve(new a(t,e))}catch(t){r.reject(t)}}),r.promise}var i=n(1);t.exports=r},,,,,function(t,e,n){function r(t){t.define("widgetDataAttributes",function(){return{}}),t.define("setDataAttributes",function(){var t=this.sandbox.sandboxEl;o.forIn(this.widgetDataAttributes(),function(e,n){i.hasValue(n)&&t.setAttribute("data-"+e,n)})}),t.after("render",function(){this.setDataAttributes()})}var i=n(25),o=n(11);t.exports=r},function(t,e,n){var r=n(54),i=n(116);t.exports=r.build([i])},function(t,e,n){function r(t){t.overrideProperty("id",{get:function(){return this.sandboxEl&&this.sandboxEl.id}}),t.overrideProperty("initialized",{get:function(){return!!this.iframeEl}}),t.overrideProperty("width",{get:function(){return this._width}}),t.overrideProperty("height",{get:function(){return this._height}}),t.overrideProperty("sandboxEl",{get:function(){return this.iframeEl}}),t.defineProperty("iframeEl",{get:function(){return this._iframe}}),t.define("updateCachedDimensions",function(){var t=this;return this.initialized?i.read(function(){t._width=t.sandboxEl.offsetWidth,t._height=t.sandboxEl.offsetHeight}):c.resolve()}),t.define("setTitle",function(t){this.iframeEl.title=t}),t.define("makeVisible",function(){return this.styleSelf(h)}),t.define("didResize",function(){var t=this,e=t._resizeHandlers.length>0;return this.updateCachedDimensions().then(function(){e&&t._resizeHandlers.forEach(function(e){e(t)})})}),t.define("loadDocument",function(t){var e=new u;return this.initialized?this.iframeEl.src?c.reject(new Error("widget already loaded")):(this.iframeEl.addEventListener("load",e.resolve,!1),this.iframeEl.addEventListener("error",e.reject,!1),this.iframeEl.src=t,e.promise):c.reject(new Error("sandbox not initialized"))}),t.after("initialize",function(){this._iframe=null,this._width=this._height=0,this._resizeHandlers=[]}),t.override("insert",function(t,e,n,r){var o=this;return e=f.aug({id:t},e),n=f.aug({},l,n),this._iframe=s(e,n),p[t]=this,this.onResize(a(function(){o.makeVisible()})),i.write(d(r,null,this._iframe))}),t.override("onResize",function(t){this._resizeHandlers.push(t)}),t.after("styleSelf",function(){return this.updateCachedDimensions()})}var i=n(45),o=n(117),a=n(122),s=n(52),u=n(1),c=n(2),d=n(13),f=n(11),l={position:"absolute",visibility:"hidden",width:"0px",height:"0px"},h={position:"static",visibility:"visible"},p={};o(function(t,e,n){var r=p[t];if(r)return r.styleSelf({width:e+"px",height:n+"px"}).then(function(){r.didResize()})}),t.exports=r},function(t,e,n){function r(t){(new o).attachReceiver(new a.Receiver(i,"twttr.button")).bind("twttr.private.trigger",function(t,e){var n=c(this);s.trigger(t,{target:n,region:e,type:t,data:{}})}).bind("twttr.private.resizeButton",function(e){var n=c(this),r=n&&n.id,i=u.asInt(e.width),o=u.asInt(e.height);r&&i&&o&&t(r,i,o)})}var i=n(7),o=n(118),a=n(120),s=n(29),u=n(25),c=n(121);t.exports=r},function(t,e,n){function r(t){this.registry=t||{}}function i(t){return h.isType("string",t)?f.parse(t):t}function o(t){var e,n,r;return!!h.isObject(t)&&(e=t.jsonrpc===v,n=h.isType("string",t.method),r=!("id"in t)||a(t.id),e&&n&&r)}function a(t){var e,n,r;return e=h.isType("string",t),n=h.isType("number",t),r=null===t,e||n||r}function s(t){return h.isObject(t)&&!h.isType("function",t)}function u(t,e){return{jsonrpc:v,id:t,result:e}}function c(t,e){return{jsonrpc:v,id:a(t)?t:null,error:e}}function d(t){return p.all(t).then(function(t){return t=t.filter(function(t){return void 0!==t}),t.length?t:void 0})}var f=n(39),l=n(119),h=n(11),p=n(2),m=n(42),v="2.0";r.prototype._invoke=function(t,e){var n,r,i;n=this.registry[t.method],r=t.params||[],r=h.isType("array",r)?r:[r];try{i=n.apply(e.source||null,r)}catch(t){i=p.reject(t.message)}return m.isPromise(i)?i:p.resolve(i)},r.prototype._processRequest=function(t,e){function n(e){return u(t.id,e)}function r(){return c(t.id,l.INTERNAL_ERROR)}var i;return o(t)?(i="params"in t&&!s(t.params)?p.resolve(c(t.id,l.INVALID_PARAMS)):this.registry[t.method]?this._invoke(t,{source:e}).then(n,r):p.resolve(c(t.id,l.METHOD_NOT_FOUND)),null!=t.id?i:p.resolve()):p.resolve(c(t.id,l.INVALID_REQUEST))},r.prototype.attachReceiver=function(t){return t.attachTo(this),this},r.prototype.bind=function(t,e){return this.registry[t]=e,this},r.prototype.receive=function(t,e){var n,r,o,a=this;try{t=i(t)}catch(t){return p.resolve(c(null,l.PARSE_ERROR))}return e=e||null,n=h.isType("array",t),r=n?t:[t],o=r.map(function(t){return a._processRequest(t,e)}),n?d(o):o[0]},t.exports=r},function(t,e){t.exports={PARSE_ERROR:{code:-32700,message:"Parse error"},INVALID_REQUEST:{code:-32600,message:"Invalid Request"},INVALID_PARAMS:{code:-32602,message:"Invalid params"},METHOD_NOT_FOUND:{code:-32601,message:"Method not found"},INTERNAL_ERROR:{code:-32603,message:"Internal error"}}},function(t,e,n){function r(t,e,n){var r;t&&t.postMessage&&(g?r=(n||"")+f.stringify(e):n?(r={},r[n]=e):r=e,t.postMessage(r,"*"))}function i(t){return p.isType("string",t)?t:"JSONRPC"}function o(t,e){return e?p.isType("string",t)&&0===t.indexOf(e)?t.substring(e.length):t[e]?t[e]:void 0:t}function a(t,e){var n=t.document;this.filter=i(e),this.server=null,this.isTwitterFrame=m.isTwitterURL(n.location.href),t.addEventListener("message",v(this._onMessage,this),!1)}function s(t,e){this.pending={},this.target=t,this.isTwitterHost=m.isTwitterURL(c.href),this.filter=i(e),d.addEventListener("message",v(this._onMessage,this),!1)}function u(t){return arguments.length>0&&(g=!!t),g}var c=n(18),d=n(7),f=n(39),l=n(1),h=n(8),p=n(11),m=n(23),v=n(13),g=h.ie9();p.aug(a.prototype,{_onMessage:function(t){var e,n=this;this.server&&(this.isTwitterFrame&&!m.isTwitterURL(t.origin)||(e=o(t.data,this.filter),e&&this.server.receive(e,t.source).then(function(e){e&&r(t.source,e,n.filter)})))},attachTo:function(t){this.server=t},detach:function(){this.server=null}}),p.aug(s.prototype,{_processResponse:function(t){var e=this.pending[t.id];e&&(e.resolve(t),delete this.pending[t.id])},_onMessage:function(t){var e;if((!this.isTwitterHost||m.isTwitterURL(t.origin))&&(e=o(t.data,this.filter))){if(p.isType("string",e))try{e=f.parse(e)}catch(t){return}e=p.isType("array",e)?e:[e],e.forEach(v(this._processResponse,this))}},send:function(t){var e=new l;return t.id?this.pending[t.id]=e:e.resolve(),r(this.target,t,this.filter),e.promise}}),t.exports={Receiver:a,Dispatcher:s,_stringifyPayload:u}},function(t,e,n){function r(t){for(var e,n=i.getElementsByTagName("iframe"),r=0;e=n[r];r++)if(e.contentWindow===t)return e}var i=n(9);t.exports=r},function(t,e){function n(t){var e,n=!1;return function(){return n?e:(n=!0,e=t.apply(this,arguments))}}t.exports=n},function(t,e,n){function r(t){var e=u(t),n={collectionId:s.collectionId(t.href),chrome:t.getAttribute("data-chrome"),limit:t.getAttribute("data-limit")};return a.forIn(n,function(t,n){var r=e[t];e[t]=o.hasValue(r)?r:n}),e}function i(t){var e=c(t,f);return e.map(function(t){return d(r(t),t.parentNode,t)})}var o=n(25),a=n(11),s=n(23),u=n(75),c=n(77)(),d=n(124),f="a.twitter-grid";t.exports=i},function(t,e,n){function r(t,e,n){return new i(o,a,"twitter-grid",t,e,n)}var i=n(81),o=n(125),a=n(53);t.exports=r},function(t,e,n){function r(t,e){var r=new i;return n.e(3,function(i,o){var a;if(i)return r.reject(i);try{a=n(126),r.resolve(new a(t,e))}catch(t){r.reject(t)}}),r.promise}var i=n(1);t.exports=r},,,,function(t,e,n){function r(t){if(t)return t.replace(/[^\w\$]/g,"_")}function i(){return f+l++}function o(t,e,n,o){var f,l,h;return o=r(o||i()),f=s.fullPath(["callbacks",o]),l=a.createElement("script"),h=new u,e=c.aug({},e,{callback:f,suppress_response_codes:!0}),s.set(["callbacks",o],function(t){var e,r;e=n(t||!1),t=e.resp,r=e.success,r?h.resolve(t):h.reject(t),l.onload=l.onreadystatechange=null,l.parentNode&&l.parentNode.removeChild(l),s.unset(["callbacks",o])}),l.onerror=function(){h.reject(new Error("failed to fetch "+l.src))},l.src=d.url(t,e),l.async="async",a.body.appendChild(l),h.promise}var a=n(9),s=n(16),u=n(1),c=n(11),d=n(24),f="cb",l=0;t.exports={fetch:o}},function(t,e,n){function r(t){var e,n;return e=t.headers&&t.headers.status,n=t&&!t.error&&200===e,!n&&t.headers&&t.headers.message&&i.warn(t.headers.message),{success:n,resp:t}}var i=n(68);t.exports=r},function(t,e){function n(){var t=9e5;return Math.floor(+new Date/t)}t.exports=n},function(t,e,n){function r(t){var e=t||[];return e.unshift("cookie/consent"),l(b,e)}function i(t){var e=t||[];return e.unshift("settings"),l(b,e)}function o(t){var e=t||[];return e.unshift("video/event"),l(w,e)}function a(t){var e=t||[];return e.unshift("grid/collection"),l(w,e)}function s(t){var e=t||[];return e.unshift("moments"),l(w,e)}function u(t){var e=t||[];return e.unshift("timeline"),l(w,e)}function c(t){var e=t||[];return e.unshift("widgets/timelines"),l(w,e)}function d(t){var e=t||[];return e.unshift("tweets.json"),l(w,e)}function f(t){var e=t||[];return e.unshift("widgets/video"),l(w,e)}function l(t,e){var n=[t];return e.forEach(function(t){n.push(h(t))}),n.join("/")}function h(t){var e=(t||"").toString(),n=p(e)?1:0,r=m(e)?-1:void 0;return e.slice(n,r)}function p(t){return"/"===t.slice(0,1)}function m(t){return"/"===t.slice(-1)}var v=n(16),g="https://cdn.syndication.twimg.com",y="https://syndication.twitter.com",w=v.get("backendHost")||g,b=v.get("settingsSvcHost")||y;t.exports={cookieConsent:r,eventVideo:o,grid:a,moment:s,settings:i,timeline:u,timelinePreconfigured:c,tweetBatch:d,video:f}},function(t,e,n){var r=n(9),i=n(25),o=r.createElement("div");t.exports=function(t){return i.isNumber(t)&&(t+="px"),o.style.width="",o.style.width=t,o.style.width||null}},function(t,e,n){function r(t){var e=t.getBoundingClientRect(),n=i.innerWidth,r=i.innerHeight,o=e.top>r,a=e.bottom<0,s=e.left>n,u=e.right<0;return!(o||a||s||u)}var i=n(7);t.exports=r},function(t,e,n){function r(t){t.after("prepForInsertion",function(t){o.sizeIframes(t,this.sandbox.width,a,i.sync)}),t.after("resize",function(){o.sizeIframes(this.el,this.sandbox.width,a,i.write)})}var i=n(45),o=n(136),a=375;t.exports=r},function(t,e,n){function r(t){var e=t.split(" ");this.url=decodeURIComponent(e[0].trim()),this.width=+e[1].replace(/w$/,"").trim()}function i(t,e,n){var i,o,a,s;if(t=h.devicePixelRatio?t*h.devicePixelRatio:t,o=e.split(",").map(function(t){return new r(t.trim())}),n)for(s=0;s<o.length;s++)o[s].url===n&&(i=o[s]);return a=o.reduce(function(e,n){return n.width<e.width&&n.width>=t?n:e},o[0]),i&&i.width>a.width?i:a}function o(t,e){var n,r=t.getAttribute("data-srcset"),o=t.src;r&&(n=i(e,r,o),t.src=n.url)}function a(t,e){e=void 0!==e?!!e:v.retina(),p.toRealArray(t.getElementsByTagName("IMG")).forEach(function(t){var n=t.getAttribute("data-src-1x")||t.getAttribute("src"),r=t.getAttribute("data-src-2x");e&&r?t.src=r:n&&(t.src=n)})}function s(t,e,n){t&&(p.toRealArray(t.querySelectorAll(".NaturalImage-image")).forEach(function(t){n(function(){o(t,e)})}),p.toRealArray(t.querySelectorAll(".CroppedImage-image")).forEach(function(t){n(function(){o(t,e/2)})}),p.toRealArray(t.querySelectorAll("img.autosized-media")).forEach(function(t){n(function(){o(t,e),t.removeAttribute("width"),t.removeAttribute("height")})}))}function u(t,e,n,r){t&&p.toRealArray(t.querySelectorAll("iframe.autosized-media, .wvp-player-container")).forEach(function(t){var i=d(t.getAttribute("data-width"),t.getAttribute("data-height"),g.effectiveWidth(t.parentElement)||e,n);r(function(){t.setAttribute("width",i.width),t.setAttribute("height",i.height),y.present(t,"wvp-player-container")?(t.style.width=i.width,t.style.height=i.height):(t.width=i.width,t.height=i.height)})})}function c(t,e,n,r){s(t,e,r),u(t,e,n,r)}function d(t,e,n,r,i,o){return n=n||t,r=r||e,i=i||0,o=o||0,t>n&&(e*=n/t,t=n),e>r&&(t*=r/e,e=r),t<i&&(e*=i/t,t=i),e<o&&(t*=o/e,e=o),{width:Math.floor(t),height:Math.floor(e)}}function f(t,e,n,r){p.toRealArray(t.querySelectorAll(e)).forEach(function(t){var e=t.getAttribute("style")||t.getAttribute("data-style"),i=r.test(e)&&RegExp.$1;i&&(t.setAttribute("data-csp-fix",!0),t.style[n]=i)})}function l(t){m.inlineStyle()||(f(t,".MediaCard-widthConstraint","maxWidth",w),f(t,".MediaCard-mediaContainer","paddingBottom",E),f(t,".CroppedImage-image","top",b),f(t,".CroppedImage-image","left",_))}var h=n(7),p=n(11),m=n(66),v=n(8),g=n(137),y=n(20),w=/max-width:\s*([\d\.]+px)/,b=/top:\s*(\-?[\d\.]+%)/,_=/left:\s*(\-?[\d\.]+%)/,E=/padding-bottom:\s*([\d\.]+%)/;t.exports={scaleDimensions:d,retinize:a,setSrcForImgs:s,sizeIframes:u,constrainMedia:c,fixMediaCardLayout:l,__setSrcFromSet:o}},function(t,e){function n(t){return t&&1===t.nodeType?t.offsetWidth||n(t.parentNode):0}t.exports={effectiveWidth:n}},function(t,e,n){function r(t){return t.replace(/-(.)/g,function(t,e){return e.toUpperCase()})}function i(t){return(t||"").split(";").reduce(function(t,e){var n,i;return c.test(e.trim())&&(n=RegExp.$1,i=RegExp.$2,t[r(n)]=i),t},{})}function o(t){var e=i(t.getAttribute("data-style"));0!==Object.keys(e).length&&(t.setAttribute("data-csp-fix","true"),u.forIn(e,function(e,n){t.style[e]=n}))}function a(t){t.selectors({cspForcedStyle:".js-cspForcedStyle"}),t.after("prepForInsertion",function(t){s.inlineStyle()||this.select(t,"cspForcedStyle").forEach(o)})}var s=n(66),u=(n(68),n(11)),c=/^([a-zA-Z-]+):\s*(.+)$/;t.exports=a},function(t,e,n){function r(t){t.after("prepForInsertion",function(t){i.retinize(t)})}var i=n(136);t.exports=r},function(t,e,n){function r(t){t.after("prepForInsertion",function(t){o.setSrcForImgs(t,this.sandbox.width,i.sync)}),t.after("resize",function(){o.setSrcForImgs(this.el,this.sandbox.width,i.write)})}var i=n(45),o=n(136);t.exports=r},function(t,e){function n(t){t.after("render",function(){var t=this.el.getAttribute(r);t&&this.sandbox.setTitle&&this.sandbox.setTitle(t)})}var r="data-iframe-title";t.exports=n},function(t,e,n){function r(t){return t.every(s.isInt)}function i(t){var e=t.map(function(t){return{size:+t,className:u+t}}).sort(function(t,e){return t.size-e.size});return e.unshift({size:0,className:c}),e}function o(t){t.params({breakpoints:{required:!0,validate:r,transform:i}}),t.define("getClassForWidth",function(t){var e,n,r;for(n=this.params.breakpoints.length-1;n>=0;n--)if(r=this.params.breakpoints[n],t>r.size){e=r.className;break}return e}),t.after("initialize",function(){this.allBreakpoints=this.params.breakpoints.map(function(t){return t.className})}),t.define("recalculateBreakpoints",function(){var t=this.getClassForWidth(this.sandbox.width);return t&&this.sandbox.hasRootClass(t)?a.resolve():a.all([this.sandbox.removeRootClass(this.allBreakpoints),this.sandbox.addRootClass(t)])}),t.after("render",function(){return this.recalculateBreakpoints()}),t.after("resize",function(){return this.recalculateBreakpoints()})}var a=n(2),s=n(25),u="env-bp-",c=u+"min";t.exports=o},,function(t,e,n){function r(t,e,n,r,i){var o=new u,a=s(t,n,r,i);if(a){var c=d.createPlayerForTweet(a.element,e,a.options);return c?(o.resolve(c),o.promise):o.reject(new Error("unable to create tweet video player"))}}function i(t,e,n,r,i){var o=new u,a=s(t,n,r,i);if(!a)return o.reject(new Error("unable to initialize event video player"));var c=d.createPlayerForLiveVideo(a.element,e,a.options);return c.on("ready",function(){c.playPreview(),o.resolve(c)}),o.promise}function o(t){var e=t.querySelector(".wvp-player-container"),n=e&&d.findPlayerForElement(e);if(n)return n.teardown()}function a(t){return d.findPlayerForElement(t)}function s(t,e,n,r){var i;r=r||{};var o={scribeContext:{client:"tfw",page:e},languageCode:n,hideControls:r.hideControls||!1,addTwitterBranding:r.addBranding||!1,widgetOrigin:r.widgetOrigin};if(i=c(t,".wvp-player-container"),i.length>0)return f&&d.setBaseUrl(f),{element:i[0],options:o}}var u=n(1),c=n(78),d=n(145),f=null;t.exports={insertForTweet:r,insertForEvent:i,remove:o,find:a}},function(t,e,n){var r;!function(i,o){r=function(){return i.TwitterVideoPlayer=o()}.call(e,n,e,t),!(void 0!==r&&(t.exports=r))}(this,function(){function t(t){if(t&&t.data&&t.data.params&&t.data.params[0]){var e=t.data.params[0],n=t.data.id;if(e&&e.context&&"TwitterVideoPlayer"===e.context){var r=e.playerId;delete e.playerId,delete e.context;var i=s[r];i&&i.processMessage(t.data.method,e,n)}}}function e(t,e,n){var r=Object.keys(n).filter(function(t){return null!=n[t]}).map(function(t){var e=n[t];return encodeURIComponent(t)+"="+encodeURIComponent(e)}).join("&");return r&&(r="?"+r),t+e+r}function n(n,i,o,u,c){var d=n.ownerDocument,f=d.defaultView;f.addEventListener("message",t),this.playerId=a++;var l={embed_source:"clientlib",player_id:this.playerId,rpc_init:1};if(this.scribeParams={},this.scribeParams.suppressScribing=u&&u.suppressScribing,!this.scribeParams.suppressScribing){if(!u.scribeContext)throw"video_player: Missing scribe context";if(!u.scribeContext.client)throw"video_player: Scribe context missing client property";this.scribeParams.client=u.scribeContext.client,this.scribeParams.page=u.scribeContext.page,this.scribeParams.section=u.scribeContext.section,this.scribeParams.component=u.scribeContext.component}this.scribeParams.debugScribe=u&&u.scribeContext&&u.scribeContext.debugScribing,this.scribeParams.scribeUrl=u&&u.scribeContext&&u.scribeContext.scribeUrl,this.promotedLogParams=u.promotedContext,this.adRequestCallback=u.adRequestCallback,u.languageCode&&(l.language_code=u.languageCode),"tfw"===this.scribeParams.client&&(l.use_syndication_guest_id=!0);var h=e(r,i,l);return this.videoIframe=document.createElement("iframe"),this.videoIframe.setAttribute("src",h),this.videoIframe.setAttribute("allowfullscreen",""),this.videoIframe.setAttribute("id",o),this.videoIframe.setAttribute("style","width: 100%; height: 100%; position: absolute; top: 0; left: 0;"),this.domElement=n,this.domElement.appendChild(this.videoIframe),s[this.playerId]=this,this.eventCallbacks={},this.emitEvent=function(t,e){var n=this.eventCallbacks[t];"undefined"!=typeof n&&n.forEach(function(t){t.apply(this.playerInterface,[e])}.bind(this))},this.jsonRpc=function(t){var e=this.videoIframe.contentWindow;t.jsonrpc="2.0",e&&e.postMessage&&e.postMessage(JSON.stringify(t),"*")},this.jsonRpcCall=function(t,e){this.jsonRpc({method:t,params:e})},this.jsonRpcResult=function(t,e){this.jsonRpc({result:t,id:e})},this.processMessage=function(t,e,n){switch(t){case"requestPlayerConfig":this.jsonRpcResult({scribeParams:this.scribeParams,promotedLogParams:this.promotedLogParams,squareCorners:u.squareCorners,borderRadius:u.borderRadius,hideControls:u.hideControls,embedded:u.addTwitterBranding,widgetOrigin:u.widgetOrigin,ignoreFineGrainGeoblocking:u.ignoreFineGrainGeoblocking},n);break;case"videoPlayerAdStart":this.emitEvent("adStart",e);break;case"videoPlayerAdEnd":this.emitEvent("adEnd",e);break;case"videoPlayerPlay":this.emitEvent("play",e);break;case"videoPlayerPause":this.emitEvent("pause",e);break;case"videoPlayerMute":this.emitEvent("mute",e);break;case"videoPlayerUnmute":this.emitEvent("unmute",e);break;case"videoPlayerPlaybackComplete":this.emitEvent("playbackComplete",e);break;case"videoPlayerReady":this.emitEvent("ready",e);break;case"videoView":this.emitEvent("view",e);break;case"debugLoggingEvent":this.emitEvent("logged",e);break;case"requestDynamicAd":"function"==typeof this.adRequestCallback?this.jsonRpcResult(this.adRequestCallback(),n):this.jsonRpcResult({},n);break;case"videoPlayerError":e&&"NO_COOKIES_ERROR"===e.error_category?this.emitEvent("noCookiesError",e):e&&"GEOBLOCK_ERROR"===e.error_category&&this.emitEvent("geoblockError",e)}},this.playerInterface={on:function(t,e){return"undefined"==typeof this.eventCallbacks[t]&&(this.eventCallbacks[t]=[]),this.eventCallbacks[t].push(e),this.playerInterface}.bind(this),off:function(t,e){if("undefined"==typeof e)delete this.eventCallbacks[t];else{var n=this.eventCallbacks[t];if("undefined"!=typeof n){var r=n.indexOf(e);r>-1&&n.splice(r,1)}}return this.playerInterface}.bind(this),play:function(){return this.jsonRpcCall("play"),this.playerInterface}.bind(this),pause:function(){return this.jsonRpcCall("pause"),this.playerInterface}.bind(this),mute:function(){return this.jsonRpcCall("mute"),this.playerInterface}.bind(this),unmute:function(){return this.jsonRpcCall("unmute"),this.playerInterface}.bind(this),playPreview:function(){return this.jsonRpcCall("autoPlayPreview"),this.playerInterface}.bind(this),pausePreview:function(){return this.jsonRpcCall("autoPlayPreviewStop"),this.playerInterface}.bind(this),updatePosition:function(t){return this.jsonRpcCall("updatePosition",[t]),this.playerInterface}.bind(this),updateLayoutBreakpoint:function(t){return this.jsonRpcCall("updateLayoutBreakpoint",[t]),this.playerInterface}.bind(this),enterFullScreen:function(){return this.jsonRpcCall("enterFullScreen"),this.playerInterface}.bind(this),exitFullScreen:function(){return this.jsonRpcCall("exitFullScreen"),this.playerInterface}.bind(this),teardown:function(){this.eventCallbacks={},n.removeChild(this.videoIframe),this.videoIframe=void 0,delete s[this.playerId]}.bind(this)},this.playerInterface}var r="https://twitter.com",i=/^https?:\/\/([a-zA-Z0-9]+\.)*twitter.com(:\d+)?$/,o={suppressScribing:!1,squareCorners:!1,hideControls:!1,addTwitterBranding:!1},a=0,s={};return{setBaseUrl:function(t){i.test(t)?r=t:window.console.error("newBaseUrl "+t+" not allowed")},createPlayerForTweet:function(t,e,r){var i="/i/videos/tweet/"+e,a="player_tweet_"+e;return new n(t,i,a,r||o)},createPlayerForDm:function(t,e,r){var i="/i/videos/dm/"+e,a="player_dm_"+e;return new n(t,i,a,r||o)},createPlayerForLiveVideo:function(t,e,r){var i="/i/videos/live_video/"+e,a="player_live_video_"+e;return new n(t,i,a,r||o)},findPlayerForElement:function(t){for(var e in s)if(s.hasOwnProperty(e)){var n=s[e];if(n&&n.domElement===t)return n.playerInterface}return null}}})},function(t,e,n){function r(t){t.selectors({clickToOpen:".js-clickToOpenTarget"}),t.define("shouldOpenTarget",function(t){var e=i.closest("A",t.target,this.el),n=i.closest("BUTTON",t.target,this.el),r=this.sandbox.hasSelectedText();return!e&&!n&&!r}),t.define("openTarget",function(t,e){var n=e&&e.getAttribute(u);n&&(o(n),this.scribeOpenClick(t))}),t.define("attemptToOpenTarget",function(t,e){this.shouldOpenTarget(t)&&this.openTarget(t,e)}),t.define("scribeOpenClick",function(t){var e=s.extractTermsFromDOM(t.target),n={associations:s.formatTweetAssociation(e)};this.scribe({section:"chrome",action:"click"},n)}),t.after("render",function(){this.on("click","clickToOpen",this.attemptToOpenTarget)})}var i=n(21),o=n(147),a=n(84),s=n(38),u="data-click-to-open-target";t.exports=a.couple(n(98),r)},function(t,e,n){function r(t){a.isTwitterURL(t)&&(t=o(t)),i.open(t)}var i=n(7),o=n(97),a=n(23);t.exports=r},function(t,e,n){function r(t){t.params({productName:{required:!0},dataSource:{required:!1},related:{required:!1},partner:{fallback:d(o.val,o,"partner")}}),t.selectors({timeline:".timeline",tweetIdInfo:".js-tweetIdInfo"}),t.define("injectWebIntentParams",function(t){var e=i.closest(this.selectors.timeline,t,this.el),n=i.closest(this.selectors.tweetIdInfo,t,this.el);t.getAttribute(f)||(t.setAttribute(f,!0),t.href=u.url(t.href,{tw_w:this.params.dataSource&&this.params.dataSource.id,tw_i:n&&n.getAttribute("data-tweet-id"),tw_p:this.params.productName,related:this.params.related,partner:this.params.partner,query:e&&e.getAttribute("data-search-query"),profile_id:e&&e.getAttribute("data-profile-id"),original_referer:s.rootDocumentLocation()}))}),t.after("render",function(){this.on("click","A",function(t,e){c.isIntentURL(e.href)&&(this.injectWebIntentParams(e),a.open(e.href,this.sandbox.sandboxEl,t))})})}var i=n(21),o=n(37),a=n(22),s=n(34),u=n(24),c=n(23),d=n(13),f="data-url-params-injected";t.exports=r},function(t,e,n){function r(t){t.before("render",function(){i.ios()&&this.sandbox.addRootClass("env-ios"),i.ie9()&&this.sandbox.addRootClass("ie9"),i.touch()&&this.sandbox.addRootClass("is-touch")})}var i=n(8);t.exports=r},function(t,e,n){function r(t){t.params({pageForAudienceImpression:{required:!0}}),t.before("hydrate",function(){i.scribeAudienceImpression(this.params.pageForAudienceImpression)})}var i=n(151);t.exports=r},function(t,e,n){function r(){return d.formatGenericEventData("syndicated_impression",{})}function i(){u("tweet")}function o(){u("timeline")}function a(){u("video")}function s(){u("partnertweet")}function u(t){f.isHostPageSensitive()||l[t]||(l[t]=!0,c.scribe(d.formatClientEventNamespace({page:t,action:"impression"}),r(),d.AUDIENCE_ENDPOINT))}var c=n(32),d=n(38),f=n(36),l={};t.exports={scribeAudienceImpression:u,scribePartnerTweetAudienceImpression:s,scribeTweetAudienceImpression:i,scribeTimelineAudienceImpression:o,scribeVideoAudienceImpression:a}},function(t,e,n){function r(t){var e={action:"dimensions"},n=new o(a);t.after("show",function(){if(n.nextBoolean()){var t=this.sandbox.width,r=this.sandbox.height,i={context:t+","+r};this.scribe(e,i)}})}var i=n(84),o=n(153),a=1;t.exports=i.couple(n(98),r)},function(t,e){function n(t){this.percentage=t}n.prototype.nextBoolean=function(){return 100*Math.random()<this.percentage},t.exports=n},,function(t,e,n){function r(t){var e={transparent:!1,hideBorder:!1,hideHeader:!1,hideFooter:!1,hideScrollBar:!1};return t=t||"",i.contains(t,"transparent")&&(e.transparent=!0),i.contains(t,"noborders")&&(e.hideBorder=!0),i.contains(t,"noheader")&&(e.hideHeader=!0),i.contains(t,"nofooter")&&(e.hideFooter=!0),i.contains(t,"noscrollbar")&&(e.hideScrollBar=!0),e}var i=n(11);t.exports=r},function(t,e,n){function r(t){var e=u(t),n={momentId:s.momentId(t.href),chrome:t.getAttribute("data-chrome"),limit:t.getAttribute("data-limit")};return a.forIn(n,function(t,n){var r=e[t];e[t]=o.hasValue(r)?r:n}),e}function i(t){var e=c(t,f);return e.map(function(t){return d(r(t),t.parentNode,t)})}var o=n(25),a=n(11),s=n(23),u=n(75),c=n(77)(),d=n(157),f="a.twitter-moment";t.exports=i},function(t,e,n){function r(t,e,n){return new i(o,a,"twitter-moment",t,e,n)}var i=n(81),o=n(158),a=n(53);t.exports=r},function(t,e,n){function r(t,e){var r=new i;return n.e(4,function(i,o){var a;if(i)return r.reject(i);try{a=n(159),r.resolve(new a(t,e))}catch(t){r.reject(t)}}),r.promise}var i=n(1);t.exports=r},,,,function(t,e,n){function r(t){var e=a(t),n=t.getAttribute("href"),r=t.getAttribute("data-size"),i=d.exec(n)[1];return o.aug(e,{username:i,size:r})}function i(t){var e=s(t,c);return e.map(function(t){return u(r(t),t.parentNode,t)})}var o=n(11),a=n(75),s=n(77)(),u=n(163),c="a.periscope-on-air",d=/^https?:\/\/(?:www\.)?(?:periscope|pscp)\.tv\/@?([a-zA-Z0-9_]+)\/?$/i;t.exports=i},function(t,e,n){function r(t,e,n){return new i(o,a,"periscope-on-air",t,e,n)}var i=n(81),o=n(164),a=n(53);t.exports=r},function(t,e,n){function r(t,e){var r=new i;return n.e(5,function(i,o){var a;if(i)return r.reject(i);try{a=n(165),r.resolve(new a(t,e))}catch(t){r.reject(t)}}),r.promise}var i=n(1);t.exports=r},,,,function(t,e,n){function r(t){var e=c(t),n=t.getAttribute("data-show-replies"),r={widgetId:t.getAttribute("data-widget-id"),chrome:t.getAttribute("data-chrome"),tweetLimit:t.getAttribute("data-tweet-limit"),ariaLive:t.getAttribute("data-aria-polite"),theme:t.getAttribute("data-theme"),linkColor:t.getAttribute("data-link-color"),borderColor:t.getAttribute("data-border-color"),showReplies:n?o.asBoolean(n):null,profileScreenName:t.getAttribute("data-screen-name"),profileUserId:t.getAttribute("data-user-id"),favoritesScreenName:t.getAttribute("data-favorites-screen-name"),favoritesUserId:t.getAttribute("data-favorites-user-id"),likesScreenName:t.getAttribute("data-likes-screen-name"),likesUserId:t.getAttribute("data-likes-user-id"),listOwnerScreenName:t.getAttribute("data-list-owner-screen-name"),listOwnerUserId:t.getAttribute("data-list-owner-id"),listId:t.getAttribute("data-list-id"),listSlug:t.getAttribute("data-list-slug"),customTimelineId:t.getAttribute("data-custom-timeline-id"),staticContent:t.getAttribute("data-static-content"),url:t.href};return r=a.aug(r,a.compact(e)),r.dataSource=s(r),r.useLegacyDefaults=r.dataSource instanceof u,r}function i(t){var e=d(t,l);return e.map(function(t){return f(r(t),t.parentNode,t)})}var o=n(25),a=n(11),s=n(169),u=n(185),c=n(75),d=n(77)(),f=n(187),l="a.twitter-timeline,div.twitter-timeline";t.exports=i},function(t,e,n){function r(t){var e,n;return e=(t.sourceType+"").toLowerCase(),n=p[e],n?new n(t):null}function i(t){return a(m,function(e){try{return new e(t)}catch(t){}})}function o(t){return t?r(t)||i(t):null}var a=n(170),s=n(171),u=n(175),c=n(177),d=n(179),f=n(181),l=n(183),h=n(185),p={collection:s,event:u,likes:c,list:d,profile:l,widget:h,url:i},m=[h,l,c,s,d,u,f];t.exports=o},function(t,e){t.exports=function(t,e,n){for(var r,i=0;i<t.length;i++)if(r=e.call(n,t[i],i,t))return r}},function(t,e,n){var r=n(172);t.exports=r.build([n(173),n(174)])},function(t,e,n){var r=n(55),i=n(59),o=n(13);r=Object.create(r),r.build=o(r.build,null,i),t.exports=r},function(t,e,n){function r(t){if(!t||!t.headers)throw new Error("unexpected response schema");return{html:t.body,config:t.config,pollInterval:1e3*parseInt(t.headers.xPolling,10)||null,maxCursorPosition:t.headers.maxPosition,minCursorPosition:t.headers.minPosition}}function i(t){if(t&&t.headers)throw new Error(t.headers.status);throw t instanceof Error?t:new Error(t)}function o(t){t.params({instanceId:{required:!0,fallback:h.deterministic},lang:{required:!0,transform:d.matchLanguage,fallback:"en"},tweetLimit:{transform:l.asInt}}),t.defineProperty("endpoint",{get:function(){throw new Error("endpoint not specified")}}),t.defineProperty("pollEndpoint",{get:function(){return this.endpoint}}),t.define("cbId",function(t){var e=t?"_new":"_old";return"tl_"+this.params.instanceId+"_"+this.id+e}),t.define("queryParams",function(){return{lang:this.params.lang,t:a(),domain:c.host,tweet_limit:this.params.tweetLimit,dnt:f.enabled()}}),t.define("fetch",function(){return s.fetch(this.endpoint,this.queryParams(),u,this.cbId()).then(r,i)}),t.define("poll",function(t,e){var n,o;return t=t||{},n={since_id:t.sinceId,max_id:t.maxId,min_position:t.minPosition,max_position:t.maxPosition},o=p.aug(this.queryParams(),n),s.fetch(this.pollEndpoint,o,u,this.cbId(e)).then(r,i)})}var a=n(131),s=n(129),u=n(130),c=n(18),d=n(90),f=n(33),l=n(25),h=n(28),p=n(11);t.exports=o},function(t,e,n){function r(t,e){return o.collectionId(t)||e}function i(t){t.params({id:{},url:{}}),t.overrideProperty("id",{get:function(){var t=r(this.params.url,this.params.id);return u+t}}),t.overrideProperty("endpoint",{get:function(){return s.timeline(["collection"])}}),t.around("queryParams",function(t){return a.aug(t(),{collection_id:r(this.params.url,this.params.id)})}),t.before("initialize",function(){if(!r(this.params.url,this.params.id))throw new Error("one of url or id is required")})}var o=n(23),a=n(11),s=n(132),u="collection:";t.exports=i},function(t,e,n){var r=n(172);t.exports=r.build([n(173),n(176)])},function(t,e,n){function r(t,e){return o.eventId(t)||e}function i(t){
t.params({id:{},url:{}}),t.overrideProperty("id",{get:function(){var t=r(this.params.url,this.params.id);return u+t}}),t.overrideProperty("endpoint",{get:function(){return s.timeline(["event"])}}),t.around("queryParams",function(t){return a.aug(t(),{event_id:r(this.params.url,this.params.id)})}),t.before("initialize",function(){if(!r(this.params.url,this.params.id))throw new Error("one of url or id is required")})}var o=n(23),a=n(11),s=n(132),u="event:";t.exports=i},function(t,e,n){var r=n(172);t.exports=r.build([n(173),n(178)])},function(t,e,n){function r(t){return o.likesScreenName(t.url)||t.screenName}function i(t){t.params({screenName:{},userId:{},url:{}}),t.overrideProperty("id",{get:function(){var t=r(this.params)||this.params.userId;return u+t}}),t.overrideProperty("endpoint",{get:function(){return s.timeline(["likes"])}}),t.define("_getLikesQueryParam",function(){var t=r(this.params);return t?{screen_name:t}:{user_id:this.params.userId}}),t.around("queryParams",function(t){return a.aug(t(),this._getLikesQueryParam())}),t.before("initialize",function(){if(!r(this.params)&&!this.params.userId)throw new Error("screen name or user id is required")})}var o=n(23),a=n(11),s=n(132),u="likes:";t.exports=i},function(t,e,n){var r=n(172);t.exports=r.build([n(173),n(180)])},function(t,e,n){function r(t){var e=o.listScreenNameAndSlug(t.url)||t;return a.compact({screen_name:e.ownerScreenName,user_id:e.ownerUserId,list_slug:e.slug})}function i(t){t.params({id:{},ownerScreenName:{},ownerUserId:{},slug:{},url:{}}),t.overrideProperty("id",{get:function(){var t,e,n;return this.params.id?u+this.params.id:(t=r(this.params),e=t&&t.list_slug.replace(/-/g,"_"),n=t&&(t.screen_name||t.user_id),u+(n+":"+e))}}),t.overrideProperty("endpoint",{get:function(){return s.timeline(["list"])}}),t.define("_getListQueryParam",function(){return this.params.id?{list_id:this.params.id}:r(this.params)}),t.around("queryParams",function(t){return a.aug(t(),this._getListQueryParam())}),t.before("initialize",function(){var t=r(this.params);if(a.isEmptyObject(t)&&!this.params.id)throw new Error("qualified slug or list id required")})}var o=n(23),a=n(11),s=n(132),u="list:";t.exports=i},function(t,e,n){var r=n(172);t.exports=r.build([n(173),n(182)])},function(t,e,n){function r(t){t.params({previewParams:{required:!0,validate:i.isObject}}),t.overrideProperty("id",{get:function(){return"preview"}}),t.overrideProperty("endpoint",{get:function(){return o.timelinePreconfigured(["preview"])}}),t.override("queryParams",function(){return this.params.previewParams})}var i=n(25),o=n(132);t.exports=r},function(t,e,n){var r=n(172);t.exports=r.build([n(173),n(184)])},function(t,e,n){function r(t,e){return o.screenName(t)||e}function i(t){t.params({showReplies:{fallback:!1,transform:a.asBoolean},screenName:{},userId:{},url:{}}),t.overrideProperty("id",{get:function(){var t=r(this.params.url,this.params.screenName);return c+(t||this.params.userId)}}),t.overrideProperty("endpoint",{get:function(){return u.timeline(["profile"])}}),t.define("_getProfileQueryParam",function(){var t=r(this.params.url,this.params.screenName),e=t?{screen_name:t}:{user_id:this.params.userId};return s.aug(e,{with_replies:this.params.showReplies?"true":"false"})}),t.around("queryParams",function(t){return s.aug(t(),this._getProfileQueryParam())}),t.before("initialize",function(){var t=r(this.params.url,this.params.screenName);if(!t&&!this.params.userId)throw new Error("screen name or user id is required")})}var o=n(23),a=n(25),s=n(11),u=n(132),c="profile:";t.exports=i},function(t,e,n){var r=n(172);t.exports=r.build([n(173),n(186)])},function(t,e,n){function r(t){t.params({widgetId:{required:!0},profileShowReplies:{fallback:!1,transform:i.asBoolean},showReplies:{fallback:!1,transform:i.asBoolean},profileScreenName:{},screenName:{},profileUserId:{},userId:{},favoritesScreenName:{},favoritesUserId:{},listOwnerScreenName:{},listOwnerUserId:{},listOwnerId:{},listId:{},listSlug:{},customTimelineId:{},previewParams:{}}),t.overrideProperty("id",{get:function(){return this.params.widgetId}}),t.overrideProperty("endpoint",{get:function(){return a.timelinePreconfigured([this.params.widgetId])}}),t.overrideProperty("pollEndpoint",{get:function(){return a.timelinePreconfigured(["paged",this.params.widgetId])}}),t.define("_getWidgetQueryParams",function(){var t=this.params.profileScreenName||this.params.screenName,e=this.params.profileUserId||this.params.userId,n=this.params.profileShowReplies||this.params.showReplies,r=this.params.listOwnerUserId||this.params.listOwnerId;return t||e?{override_type:"user",override_id:e,override_name:t,with_replies:n?"true":"false"}:this.params.favoritesScreenName||this.params.favoritesUserId?{override_type:"favorites",override_id:this.params.favoritesUserId,override_name:this.params.favoritesScreenName}:this.params.listOwnerScreenName||r||this.params.listId||this.params.listSlug?{override_type:"list",override_owner_id:r,override_owner_name:this.params.listOwnerScreenName,override_id:this.params.listId,override_name:this.params.listSlug}:this.params.customTimelineId?{override_type:"custom",override_id:this.params.customTimelineId}:void 0}),t.around("queryParams",function(t){return o.aug(t(),this._getWidgetQueryParams())})}var i=n(25),o=n(11),a=n(132);t.exports=r},function(t,e,n){function r(t,e,n){return new i(o,a,"twitter-timeline",t,e,n)}var i=n(81),o=n(188),a=n(53);t.exports=r},function(t,e,n){function r(t,e){var r=new i;return n.e(6,function(i,o){var a;if(i)return r.reject(i);try{a=n(189),r.resolve(new a(t,e))}catch(t){r.reject(t)}}),r.promise}var i=n(1);t.exports=r},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e,n){function r(t){var e=u(t),n=t.getElementsByTagName("A"),r=n&&n[n.length-1],i=r&&a.status(r.href),c=t.getAttribute("data-conversation"),d="none"==c||"hidden"==c||o.present(t,"tw-hide-thread"),f=t.getAttribute("data-cards"),h="none"==f||"hidden"==f||o.present(t,"tw-hide-media"),p=t.getAttribute("data-align")||t.getAttribute("align"),m=t.getAttribute("data-link-color"),v=t.getAttribute("data-theme");return!p&&l.test(t.className)&&(p=RegExp.$1),s.aug(e,{tweetId:i,hideThread:d,hideCard:h,align:p,linkColor:m,theme:v})}function i(t){var e=c(t,f);return e.map(function(t){return d(r(t),t.parentNode,t)})}var o=n(20),a=n(23),s=n(11),u=n(75),c=n(77)(),d=n(219),f="blockquote.twitter-tweet",l=/\btw-align-(left|right|center)\b/;t.exports=i},function(t,e,n){function r(t,e,n){return new i(o,a,"twitter-tweet",t,e,n)}var i=n(81),o=n(220),a=n(103);t.exports=r},function(t,e,n){function r(t,e){var r=new i;return n.e(7,function(i,o){var a;if(i)return r.reject(i);try{a=n(221),r.resolve(new a(t,e))}catch(t){r.reject(t)}}),r.promise}var i=n(1);t.exports=r},,,,function(t,e,n){function r(t){return t.input.lang||m}function i(t,e){var n={ids:[],lang:t};return n=e.reduce(function(t,e){return t.ids.push(e.input.id),t},n),n.ids=n.ids.sort().join(","),n}function o(t,e){t.forEach(function(t){var n=e[t.input.id];n?t.taskDoneDeferred.resolve(n):t.taskDoneDeferred.reject(new Error("not found"))})}function a(t){t.forEach(function(t){t.taskDoneDeferred.reject(new Error("request failed"))})}function s(t,e){var n=f(e,r);h.forIn(n,function(e,n){var r=i(e,n),s=p(o,null,n),u=p(a,null,n);d.fetch(t,r,c).then(s,u)})}function u(t){this.requestQueue=new l(p(s,null,t))}var c=n(225),d=n(129),f=n(226),l=n(48),h=n(11),p=n(13),m="en";u.prototype.fetch=function(t,e){return this.requestQueue.add({id:t,lang:e})},t.exports=u},function(t,e){function n(t){return{success:!0,resp:t}}t.exports=n},function(t,e){function n(t,e){return t.reduce(function(t,n){var r=e(n);return t[r]=t[r]||[],t[r].push(n),t},{})}t.exports=n},,,,function(t,e,n){function r(t){var e=s(t),n={screenName:t.getAttribute("data-button-screen-name"),text:t.getAttribute("data-text"),type:t.getAttribute("data-type"),size:t.getAttribute("data-size"),url:t.getAttribute("data-url"),hashtags:t.getAttribute("data-hashtags"),via:t.getAttribute("data-via"),buttonHashtag:t.getAttribute("data-button-hashtag")};return a.forIn(n,function(t,n){var r=e[t];e[t]=d.hasValue(r)?r:n}),e.screenName=e.screenName||e.screen_name,e.buttonHashtag=e.buttonHashtag||e.button_hashtag||e.hashtag,o.present(t,l)&&(e.type="hashtag"),o.present(t,h)&&(e.type="mention"),e}function i(t){var e=u(t,f);return e.map(function(t){return c(r(t),t.parentNode,t)})}var o=n(20),a=n(11),s=n(75),u=n(77)(),c=n(231),d=n(25),f="a.twitter-share-button, a.twitter-mention-button, a.twitter-hashtag-button",l="twitter-hashtag-button",h="twitter-mention-button";t.exports=i},function(t,e,n){function r(t,e,n){var r=t&&t.type||"share",s="hashtag"==r?"twitter-hashtag-button":"mention"==r?"twitter-mention-button":"twitter-share-button";return new i(o,a,s,t,e,n)}var i=n(81),o=n(232),a=n(115);t.exports=r},function(t,e,n){function r(t,e){var r=new i;return n.e(2,function(i,o){var a;if(i)return r.reject(i);try{a=n(233),r.resolve(new a(t,e))}catch(t){r.reject(t)}}),r.promise}var i=n(1);t.exports=r},,,function(t,e,n){function r(t){var e=a(t),n=t.getElementsByTagName("A"),r=n&&n[n.length-1],i={url:r.href};return i=o.aug({},i,o.compact(e)),i.dataSource=c(i),i}function i(t){var e=s(t,d);return e.map(function(t){return u(r(t),t.parentNode,t)})}var o=n(11),a=n(75),s=n(77)(),u=n(236),c=n(241),d="blockquote.twitter-video";t.exports=i},function(t,e,n){function r(t,e,n){return new i(o,a,"twitter-video",t,e,n)}var i=n(81),o=n(237),a=n(240);t.exports=r},function(t,e,n){function r(t,e){var r=new i;return n.e(7,function(i,o){var a;if(i)return r.reject(i);try{a=n(238),r.resolve(new a(t,e))}catch(t){r.reject(t)}}),r.promise}var i=n(1);t.exports=r},,,function(t,e,n){function r(t){t.overrideProperty("sandboxEl",{get:function(){return this._constrainingWrapper}}),t.override("makeVisible",function(){var t=this.iframeEl;return i.write(function(){t.style.visibility="visible"})}),t.define("setWrapperSize",function(t,e){var n=this,r=t/e,o=100/r+"%",a=u*r+"px";return i.write(function(){n._constrainingWrapper.style.maxWidth=a,n._iframeWrapper.style.paddingBottom=o})}),t.after("initialize",function(){this._constrainingWrapper=this._iframeWrapper=null}),t.around("insert",function(t,e,n,r,i){var o=this.targetGlobal.document,a=this._constrainingWrapper=o.createElement("div"),u=this._iframeWrapper=o.createElement("div");return a.id=e,a.className=(n||{}).class,a.style.minWidth=s+"px",a.style.position="relative",a.style.margin=c,u.style.position="relative",u.style.height="0px",a.appendChild(u),t(void 0,null,null,function(t){t.style.position="absolute",t.style.top="0px",t.style.bottom="0px",t.style.width="100%",t.style.height="100%",u.appendChild(t),i(a)})})}var i=n(45),o=n(54),a=n(63),s=320,u=500,c="10px 0px";t.exports=o.build([a,r])},function(t,e,n){function r(t){var e,n;return e=(t.sourceType+"").toLowerCase(),n=s[e],n?new n(t):null}function i(t){return a(Object.keys(s),function(e){var n=s[e];try{return new n(t)}catch(t){}})}function o(t){return t?r(t)||i(t):null}var a=n(170),s=n(242);t.exports=o},function(t,e,n){var r=n(243),i=n(246);t.exports={tweet:r,event:i}},function(t,e,n){var r=n(172);t.exports=r.build([n(244),n(245)])},function(t,e,n){function r(t){t.params({lang:{required:!0,transform:i.matchLanguage,fallback:"en"}}),t.defineProperty("identifier",{get:function(){throw new Error("identifier not specified")}}),t.defineProperty("name",{get:function(){throw new Error("name not specified")}}),t.defineProperty("scribeItemType",{get:function(){throw new Error("scribeItemType not specified")}}),t.define("fetch",function(){throw new Error("fetch not specified")})}var i=n(90);t.exports=r},function(t,e,n){function r(t,e){return e||o.status(t)}function i(t){t.params({id:{},url:{}}),t.overrideProperty("identifier",{get:function(){return r(this.params.url,this.params.id)}}),t.override("fetch",function(){return u.fetch(this.identifier,this.params.lang)}),t.overrideProperty("scribeItemType",{get:function(){return c.TWEET}}),t.overrideProperty("name",{get:function(){return"tweet"}}),t.before("initialize",function(){if(!r(this.params.url,this.params.id))throw new Error("one of url or id is required")})}var o=n(23),a=n(132),s=n(224),u=new s(a.video()),c=n(102);t.exports=i},function(t,e,n){var r=n(172);t.exports=r.build([n(244),n(247)])},function(t,e,n){function r(t,e){return o.eventId(t)||e}function i(t){t.params({id:{},url:{}}),t.overrideProperty("identifier",{get:function(){return r(this.params.url,this.params.id)}}),t.override("fetch",function(){var t={lang:this.params.lang,event_id:this.identifier};return a.fetch(s.eventVideo(),t)}),t.overrideProperty("scribeItemType",{get:function(){return u.LIVE_VIDEO_EVENT}}),t.overrideProperty("name",{get:function(){return"event"}}),t.before("initialize",function(){if(!r(this.params.url,this.params.id))throw new Error("one of url or id is required")})}var o=n(23),a=n(248),s=n(132),u=n(102);t.exports=i},function(t,e,n){function r(t,e){return s.fetch(t,e,i).then(o,a)}function i(t){return{success:!t.error,resp:t}}function o(t){return t.data.html}function a(t){return u.reject(t.error.detail)}var s=n(129),u=n(2);t.exports={fetch:r}},function(t,e,n){var r=n(11);t.exports=r.aug({},n(250),n(252),n(253),n(254),n(255),n(256),n(257),n(258),n(259))},function(t,e,n){var r=n(80),i=n(251),o=i(["userId"],{},r);t.exports={createDMButton:o}},function(t,e,n){function r(t,e,n){t=t||[],e=e||{};var r="ƒ("+t.join(", ")+", target, [options]);";return function(){var c,d,f,l,h=Array.prototype.slice.apply(arguments,[0,t.length]),p=Array.prototype.slice.apply(arguments,[t.length]);return p.forEach(function(t){if(t)return t.nodeType===Node.ELEMENT_NODE?void(f=t):u.isType("function",t)?void(c=t):void(u.isType("object",t)&&(d=t))}),h.length!==t.length||0===p.length?(c&&u.async(function(){c(!1)}),i.reject(new Error("Not enough parameters. Expected: "+r))):f?(d=u.aug({},d||{},e),t.forEach(function(t){d[t]=h.shift()}),s.asBoolean(d.dnt)&&a.setOn(),l=o.addWidget(n(d,f)),c&&l.then(c,function(){c(!1)}),l):(c&&u.async(function(){c(!1)}),i.reject(new Error("No target element specified. Expected: "+r)))}}var i=n(2),o=n(43),a=n(33),s=n(25),u=n(11);t.exports=r},function(t,e,n){var r=n(108),i=n(251),o=i(["screenName"],{},r);t.exports={createFollowButton:o}},function(t,e,n){var r=n(124),i=n(251),o=i(["collectionId"],{},r);t.exports={createGridFromCollection:o}},function(t,e,n){var r=n(157),i=n(251),o=i(["momentId"],{},r);t.exports={createMoment:o}},function(t,e,n){var r=n(163),i=n(251),o=i(["username"],{},r);t.exports={createPeriscopeOnAirButton:o}},function(t,e,n){function r(t){var e,n=s.toRealArray(arguments).slice(1);return t=t||{},n.forEach(function(t){s.isType("object",t)&&(e=t,i(e))}),e||(e={},n.push(e)),u.isString(t)&&(t=s.aug({},e,{sourceType:"widget",widgetId:t})),t.lang=e.lang,t.tweetLimit=e.tweetLimit,t.showReplies=e.showReplies,e.dataSource=c(t),e.useLegacyDefaults=e.dataSource instanceof d,h.apply(this,n)}function i(t){t.ariaLive=t.ariaPolite}var o=n(18),a=n(23),s=n(11),u=n(25),c=n(169),d=n(185),f=n(187),l=n(251),h=l([],{},f),p={createTimeline:r};a.isTwitterURL(o.href)&&(p.createTimelinePreview=function(t,e,n){var r={previewParams:t,useLegacyDefaults:!0,isPreviewTimeline:!0};return r.dataSource=c(r),h(e,r,n)}),t.exports=p},function(t,e,n){function r(t){return function(){return i.toRealArray(arguments).slice(1).forEach(function(t){i.isType("object",t)&&(t.hideCard="none"==t.cards||"hidden"==t.cards,t.hideThread="none"==t.conversation||"hidden"==t.conversation)}),t.apply(this,arguments)}}var i=n(11),o=n(219),a=n(251),s=r(a(["tweetId"],{},o));t.exports={createTweet:s,createTweetEmbed:s}},function(t,e,n){function r(t){return function(){return i.toRealArray(arguments).slice(1).forEach(function(t){i.isType("object",t)&&(t.screenName=t.screenName||t.screen_name,t.buttonHashtag=t.buttonHashtag||t.button_hashtag||t.hashtag)}),t.apply(this,arguments)}}var i=n(11),o=n(231),a=n(251),s=a(["url"],{type:"share"},o),u=a(["buttonHashtag"],{type:"hashtag"},o),c=a(["screenName"],{type:"mention"},o);t.exports={createShareButton:r(s),createHashtagButton:r(u),createMentionButton:r(c)}},function(t,e,n){function r(t){var e,n=a.toRealArray(arguments).slice(1),r=t||{};return n.forEach(function(t){a.isType("object",t)&&(e=t)}),e||(e={},n.push(e)),(s.isString(t)||s.isNumber(t))&&(r={sourceType:"tweet",id:t}),r.lang=e.lang,e.dataSource=u(r),c.apply(this,n)}var i=n(236),o=n(251),a=n(11),s=n(25),u=n(241),c=o([],{},i);t.exports={createVideo:r}},function(t,e,n){function r(){c=1;for(var t=0,e=d.length;t<e;t++)d[t]()}var i,o,a,s=n(9),u=n(7),c=0,d=[],f=!1,l=s.createElement("a");/^loade|c/.test(s.readyState)&&(c=1),s.addEventListener&&s.addEventListener("DOMContentLoaded",o=function(){s.removeEventListener("DOMContentLoaded",o,f),r()},f),l.doScroll&&s.attachEvent("onreadystatechange",i=function(){/^c/.test(s.readyState)&&(s.detachEvent("onreadystatechange",i),r())}),a=l.doScroll?function(t){u.self!=u.top?c?t():d.push(t):!function(){try{l.doScroll("left")}catch(e){return setTimeout(function(){a(t)},50)}t()}()}:function(t){c?t():d.push(t)},t.exports=a},function(t,e,n){var r=n(40),i=n(16);t.exports=function(){i.set("buildVersion",r.version)}}])))}();