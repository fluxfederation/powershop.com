(function() {
  (function($, window) {
    return $(document).ready(function() {
      var parallaxableElements, parallaxableHeight, scrollHandler;
      parallaxableElements = $("[data-parallax-speed]");
      parallaxableHeight = $("[data-parallax-destheight]");
      scrollHandler = function() {
        var scrolledY;
        scrolledY = $(window).scrollTop();
        parallaxableElements.each(function(i, elem) {
          var debug, maxY, minY, offset, reverseScale, speed, stop, top;
          offset = $(elem).data('parallax-offset-y');
          speed = $(elem).data('parallax-speed');
          stop = $(elem).data('parallax-stop-y');
          maxY = $(elem).data('parallax-max-y');
          debug = $(elem).data('debug');
          minY = $(elem).data('parallax-min-y');
          reverseScale = $(elem).data('parallax-reverse-speed');
          if (stop && stop <= (scrolledY - 1)) {
            if (reverseScale == null) {
              reverseScale = 1;
            }
            $(elem).addClass('stopped');
            top = maxY - (Math.abs(stop - scrolledY) * reverseScale);
          } else {
            $(elem).removeClass('stopped');
            if (offset) {
              top = offset - (scrolledY * speed);
            } else {
              top = -(scrolledY * speed);
            }
          }
          if (debug != null) {
            console.log('minY ' + minY);
            console.log('top ' + top);
            console.log(stop);
            console.log(scrolledY);
            console.log(maxY);
            console.log('speed reverse: ' + reverseScale);
          }
          if (minY && top < minY) {
            top = minY;
          }
          return $(elem).css({
            'top': top
          }).trigger('parallaxed', [
            {
              'top': top,
              'scrolledY': scrolledY
            }
          ]);
        });
        return parallaxableHeight.each(function(i, elem) {
          var amountScrolledToView, backgroundMove, changed, destHeight, past, scrolled, startHeight, top, viewable, winHeight;
          destHeight = $(elem).data('parallax-destheight');
          startHeight = $(elem).data('parallax-startheight');
          top = $(elem).position().top;
          scrolled = $(window).scrollTop();
          winHeight = $(window).height();
          amountScrolledToView = top - winHeight;
          viewable = top < (scrolled + winHeight);
          past = (top + $(elem).height()) < scrolled;
          changed = startHeight + (scrolled - amountScrolledToView);
          backgroundMove = false;
          return;
          if (viewable && !past) {
            backgroundMove = (changed - destHeight) * -0.3;
            $(elem).css({
              'backgroundPosition': 'center ' + backgroundMove + "px"
            });
          }
          if (changed >= destHeight) {
            changed = destHeight;
          }
          if (viewable) {
            if ($(elem).height() !== changed && changed >= startHeight) {
              return $(elem).css({
                height: changed
              });
            }
          }
        });
      };
      $(window).scroll(function() {
        var scrollTimeout;
        if (typeof scrollTimeout !== "undefined" && scrollTimeout !== null) {
          clearTimeout(scrollTimeout);
          scrollTimeout = null;
        }
        return scrollHandler();
      });
      return scrollHandler();
    });
  })(jQuery, window);

  (function($, window) {
    return $(document).ready(function() {
      var content, fadeIn, getHeaderBackground, header, isLocalScrolling, loadImages, loadedOfficePics, nav, officePhotoScroller, officePhotos, page, sections;
      sections = $(".section");
      content = $("#content");
      nav = $("#nav");
      header = $("#header");
      page = $("html");
      officePhotos = $("#office_photos");
      isLocalScrolling = false;
      fadeIn = $(".fade-in");
      getHeaderBackground = function() {
        var op, scroll;
        scroll = $(window).scrollTop();
        if (scroll >= 140) {
          return 'rgba(0, 0, 0, 0.2)';
        } else if (scroll < 1) {
          return 'rgba(0, 0, 0, 0)';
        } else {
          op = (scroll / 140) / 5;
          return 'rgba(0, 0, 0, ' + op + ')';
        }
      };
      $(window).scroll(function() {
        var current, latest;
        current = header.css('background');
        latest = getHeaderBackground();
        if (current !== latest) {
          return header.css({
            background: latest
          });
        }
      });
      $(".show_nav").click(function(e) {
        e.preventDefault();
        page.css({
          overflow: 'hidden'
        });
        header.css({
          background: 'rgba(0, 0, 0, 0.8)',
          height: '100%'
        });
        return $(this).fadeOut(function() {
          return $(".close_nav").fadeIn();
        });
      });
      $(".close_nav").click(function(e) {
        e.preventDefault();
        page.css({
          'overflow-y': 'scroll'
        });
        header.css({
          background: getHeaderBackground(),
          height: '50px'
        });
        $(this).fadeOut();
        return $(".show_nav").fadeIn();
      });
      if (officePhotos.length > 0) {
        loadImages = function() {
          return $("[data-image]", officePhotos).each(function(i, elem) {
            var img, path;
            if ($(elem).data('img-loaded') === true) {
              return;
            }
            if ($(elem).is(":right-of-screen") || $(elem).is(":left-of-screen")) {
              return;
            }
            $(elem).data('img-loaded', true);
            path = $(elem).data('image');
            img = $("<img />").attr('src', path).hide().on('dragstart', function(event) {
              return event.preventDefault();
            });
            return setTimeout(function() {
              return $(elem).append(img).imagesLoaded().always(function(instance) {
                $(elem).animate({
                  opacity: 1
                });
                img.fadeIn();
                return $(elem).parents("li").animate({
                  opacity: 1
                });
              }, Math.random() * 80);
            });
          });
        };
        loadedOfficePics = false;
        officePhotoScroller = $("ul", officePhotos);
        officePhotoScroller.swipe({
          swipe: function(event, direction, distance, duration, fingerCount) {
            var currentScroll, maximumPosition, minimumPosition, scrollDistance, winWidth;
            winWidth = $(window).width();
            scrollDistance = winWidth / 1.2;
            currentScroll = parseInt(officePhotoScroller.css('marginLeft').replace(/px/, ''));
            maximumPosition = (winWidth / 2) * -1;
            minimumPosition = winWidth - officePhotoScroller.width();
            if (direction === "right") {
              if ((currentScroll + scrollDistance) > maximumPosition) {
                officePhotoScroller.animate({
                  'marginLeft': maximumPosition + "px"
                });
              } else {
                officePhotoScroller.animate({
                  'marginLeft': (currentScroll + scrollDistance) + "px"
                });
              }
              loadImages();
              return;
            }
            if (direction === "left") {
              if ((currentScroll - scrollDistance) < minimumPosition) {
                officePhotoScroller.animate({
                  'marginLeft': minimumPosition + "px"
                });
              } else {
                officePhotoScroller.animate({
                  'marginLeft': (currentScroll - scrollDistance) + "px"
                });
              }
              return loadImages();
            }
          }
        });
        return $(window).scroll(function() {
          if (loadedOfficePics) {
            return;
          }
          if (($(window).scrollTop() + $(window).height()) > officePhotos.offset().top) {
            loadedOfficePics = true;
            return loadImages();
          }
        });
      }
    });
  })(jQuery, window);

  (function($, window) {
    return $(document).ready(function() {
      var highlightJump, isLocalScrolling, sections;
      isLocalScrolling = false;
      sections = $("section.anchor");
      highlightJump = function(anchor) {
        var id;
        $("#jumper li").removeClass('active');
        id = $(anchor).attr('id');
        id = "[href=#" + id;
        id = id + "]";
        return $("#jumper li").find(id).parents("li").addClass('active');
      };
      $.localScroll.hash({
        queue: true,
        duration: 700,
        onBefore: function(e, anchor, target) {
          isLocalScrolling = true;
          return highlightJump(anchor);
        },
        onAfter: function(anchor, settings) {
          return isLocalScrolling = false;
        }
      });
      $.localScroll({
        queue: true,
        duration: 700,
        hash: true,
        onBefore: function(e, anchor, target) {
          isLocalScrolling = true;
          return highlightJump(anchor);
        },
        onAfter: function(anchor, settings) {
          return isLocalScrolling = false;
        }
      });
      $("#jumper").localScroll();
      return $(document).scroll(function() {
        var active, height, offset, scroll;
        if (isLocalScrolling) {
          return;
        }
        height = $("body").height();
        scroll = $(document).scrollTop();
        offset = 120;
        if (sections.length > 0) {
          active = sections.first();
          sections.each(function(i, elem) {
            if ($(elem).position().top < (scroll + offset)) {
              return active = $(elem);
            }
          });
          return highlightJump(active);
        }
      });
    });
  })(jQuery, window);

}).call(this);
