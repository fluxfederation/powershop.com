(function() {
  (function($, window) {
    return $(document).ready(function() {
      var body, currentParallax, parallax, parallaxableElements, parallaxableHeight, scrollHandler, winHeight;
      parallaxableElements = $("[data-parallax-speed]");
      parallaxableHeight = $(".parallax-height");
      parallax = $(".parallax");
      body = $("body");
      currentParallax = parallax.first().addClass('current_parallax_frame');
      scrollHandler = function() {
        var actualHeight, elem, lastScrolled, latestHeight, scrollDifference, scrolled, scrolledY, winHeight;
        scrolledY = $(window).scrollTop();
        winHeight = $(window).height();
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
        if (currentParallax) {
          elem = currentParallax.get(0);
          if (scrolled < 0) {
            scrolled = 0;
          }
          lastScrolled = $(elem).data('last_scrolled');
          if (!lastScrolled) {
            lastScrolled = 0;
          }
          $(elem).data('last_scrolled', scrolledY);
          scrollDifference = lastScrolled - scrolledY;
          actualHeight = $(elem).height();
          latestHeight = actualHeight + scrollDifference;
          return $(elem).css('height', latestHeight).find('.wrapper').css('height', latestHeight);
        }
      };
      winHeight = $(window).height();
      body.css('height', body.height());
      parallax.each(function(i, elem) {
        var wrapper;
        wrapper = $(elem).find('.wrapper');
        if ($(elem).outerHeight() > winHeight) {
          $(elem).css({
            'height': $(elem).height(),
            'position': 'fixed',
            'z-index': parallax.length - i
          });
          return wrapper.css('height', wrapper.height());
        } else {
          return $(elem).css({
            'height': winHeight - 30,
            'position': 'fixed',
            'z-index': parallax.length - i
          });
        }
      });
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
      var content, fadeIn, getHeaderBackground, header, isLocalScrolling, loadImages, loadedOfficePics, nav, officePhotoScroller, officePhotos, onHomePage, page, sections;
      sections = $(".section");
      content = $("#content");
      nav = $("#nav");
      header = $("#header");
      page = $("html");
      officePhotos = $("#office_photos");
      isLocalScrolling = false;
      onHomePage = $(".home").length > 0;
      fadeIn = $(".fade-in");
      fadeIn.css({
        opacity: 0
      });
      getHeaderBackground = function() {
        var endWelcome, op, scroll;
        scroll = $(window).scrollTop();
        if (onHomePage) {
          if (scroll > 0) {
            $(".logo em").fadeOut();
          } else {
            $(".logo em").fadeIn();
          }
          if (scroll >= ($("#make_things").position().top)) {
            return 'rgba(0, 0, 0, 0.2)';
          } else {
            endWelcome = $("#welcome").offset().top + $("#welcome").height();
            return 'rgba(0, 0, 0, 0)';
          }
        } else {
          if (scroll >= 140) {
            return 'rgba(0, 0, 0, 0.2)';
          } else if (scroll < 1) {
            return 'rgba(0, 0, 0, 0)';
          }
          op = (scroll / 140) / 5;
          return 'rgba(0, 0, 0, ' + op + ')';
        }
      };
      $(window).scroll(function() {
        var current, latest, scroll;
        scroll = $(window).scrollTop();
        current = header.css('background');
        latest = getHeaderBackground();
        if (current !== latest) {
          header.css({
            background: latest
          });
        }
        return fadeIn.each(function(i, elem) {
          if ($(elem).data('fade-in-at') >= scroll) {
            if (!$(elem).data('showing')) {
              return $(elem).data('showing', true).animate({
                opacity: 1
              });
            }
          }
        });
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
        $(window).scroll(function() {
          if (loadedOfficePics) {
            return;
          }
          if (($(window).scrollTop() + $(window).height()) > officePhotos.offset().top) {
            loadedOfficePics = true;
            return loadImages();
          }
        });
      }
      if ($("#map").length > 0) {
        return google.maps.event.addDomListener(window, 'load', function() {
          var image, map, marker, options;
          options = {
            center: new google.maps.LatLng(-41.287997, 174.781469),
            zoom: 16,
            disableDefaultUI: true,
            draggable: false,
            panControl: false,
            scaleControl: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: window.map_styles
          };
          map = new google.maps.Map($("#map").get(0), options);
          image = {
            url: '/img/face.png',
            size: new google.maps.Size(62, 62),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(31, 31)
          };
          return marker = new google.maps.Marker({
            position: new google.maps.LatLng(-41.287622, 174.776166),
            map: map,
            icon: image,
            animation: google.maps.Animation.DROP
          });
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
