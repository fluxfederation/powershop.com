(function() {
  (function($, window) {
    return $(document).ready(function() {
      var body, drawSceneForScroll, parallax, parallaxableElements, scrollHandler, setupSceneForScroll, winScrollY;
      parallaxableElements = $("[data-parallax-speed]");
      parallax = $(".parallax");
      body = $("body");
      scrollHandler = function() {
        var scrolledY;
        scrolledY = $(window).scrollTop();
        return parallaxableElements.each(function(i, elem) {
          var maxY, minY, offset, reverseScale, speed, stop, top;
          offset = $(elem).data('parallax-offset-y');
          speed = $(elem).data('parallax-speed');
          stop = $(elem).data('parallax-stop-y');
          maxY = $(elem).data('parallax-max-y');
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
      };
      winScrollY = $(window).scrollTop();
      setupSceneForScroll = function() {
        var givenScrollForParallax, winHeight;
        body.css('height', body.outerHeight(true));
        givenScrollForParallax = 0;
        winHeight = $(window).outerHeight();
        return parallax.each(function(i, elem) {
          var background, content, contentHeight, elemHeight, requiresInternalScroll, self;
          self = $(elem);
          background = self.find('.parallax_background_layer');
          content = self.find('.parallax_content_layer');
          contentHeight = content.outerHeight();
          requiresInternalScroll = contentHeight > winHeight;
          elemHeight = contentHeight > winHeight ? contentHeight : winHeight;
          $(elem).css({
            'position': 'fixed',
            'height': elemHeight,
            'top': givenScrollForParallax,
            'z-index': parallax.length - i
          });
          $(elem).data('scroll_for_parallax', givenScrollForParallax);
          return givenScrollForParallax += elemHeight;
        });
      };
      drawSceneForScroll = function(scrollY, callback) {
        var scrollDifference, winHeight;
        winHeight = $(window).height();
        if (scrollY < 0) {
          scrollY = 0;
        }
        scrollDifference = scrollY - winScrollY;
        parallax.each(function(i, elem) {
          var background, bottomOfBrowser, content, contentHeight, debugFlag, heightForFrame, marginTopForContent, maxInternalScroll, minScroll, positionForFrame, self, _ref;
          self = $(elem);
          minScroll = self.data('scroll_for_parallax');
          background = self.find('.parallax_background_layer');
          content = self.find('.parallax_content_layer');
          contentHeight = content.outerHeight();
          maxInternalScroll = 0;
          if (self.data('requires_internal_scroll')) {
            maxInternalScroll = contentHeight - winHeight;
          }
          if (scrollY > (minScroll - winHeight)) {
            if (scrollY > (minScroll + contentHeight)) {
              heightForFrame = 0;
              positionForFrame = 0;
              marginTopForContent = (_ref = maxInternalScroll > 0) != null ? _ref : {
                maxInternalScroll: 0
              };
              debugFlag = 1;
              self.addClass('past_frame').removeClass('future_frame current_frame');
            } else {
              self.addClass('current_frame').removeClass('future_frame past_frame');
              if (minScroll > scrollY) {
                bottomOfBrowser = scrollY + winHeight;
                heightForFrame = bottomOfBrowser - self.data('scroll_for_parallax');
                positionForFrame = winHeight - heightForFrame;
                marginTopForContent = 0;
                debugFlag = 4;
              } else {
                positionForFrame = 0;
                heightForFrame = winHeight - (scrollY - minScroll);
                marginTopForContent = 0;
                debugFlag = 2;
              }
            }
          } else {
            heightForFrame = winHeight;
            positionForFrame = minScroll;
            debugFlag = 5;
            marginTopForContent = 0;
            self.addClass('future_frame').removeClass('current_frame past_frame');
          }
          if (heightForFrame < 0) {
            heightForFrame = 0;
          }
          if (positionForFrame < 0) {
            positionForFrame = 0;
          }
          self.attr('data-parallax-frame-debug', debugFlag);
          if (self.data('parallax-offset-height')) {
            heightForFrame += self.data('parallax-offset-height');
          }
          self.css({
            'height': heightForFrame,
            'top': positionForFrame
          });
          background.css({
            'height': heightForFrame
          });
          return content.css({
            'marginTop': marginTopForContent * -1
          });
        });
        winScrollY = scrollY;
        if (callback != null) {
          return callback();
        }
      };
      /*
      		drawSceneForScroll($(window).scrollTop(), ()->
      			scrollHandler()
      
      			$("#loading").fadeOut(()->
      				$(window).scroll ()->
      					scrollHandler()
      					drawSceneForScroll($(window).scrollTop())
      			)
      		)
      */

      $("#loading").fadeOut();
      return $("#nav .show_nav").click();
    });
  })(jQuery, window);

  (function($, window) {
    return $(document).ready(function() {
      var content, fadeIn, getHeaderBackground, header, isLocalScrolling, loadImages, loadedOfficePics, maps, nav, officePhotoScroller, officePhotos, onHomePage, page, sections;
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
        var op, scroll;
        scroll = $(window).scrollTop();
        if (scroll >= 140) {
          return 'rgba(0, 0, 0, 0.2)';
        } else if (scroll < 1) {
          return 'rgba(0, 0, 0, 0)';
        }
        op = (scroll / 140) / 5;
        return 'rgba(0, 0, 0, ' + op + ')';
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
      maps = $(".google_map");
      if (maps.length > 0) {
        $('.map .vcard').hide();
        $('.map h3').click(function() {
          var vard;
          vard = $(this).siblings('.vcard');
          if (vard.is(':visible')) {
            return vard.slideUp();
          } else {
            return vard.slideDown();
          }
        });
        google.maps.event.addDomListener(window, 'load', function() {
          return maps.each(function(i, elem) {
            var image, map, marker, options;
            options = {
              center: new google.maps.LatLng($(elem).data('center-lat'), $(elem).data('center-lng')),
              zoom: 15,
              disableDefaultUI: true,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              styles: window.map_styles
            };
            map = new google.maps.Map($(elem).get(0), options);
            image = {
              url: $(elem).data('marker'),
              size: new google.maps.Size(30, 30),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(15, 15)
            };
            return marker = new google.maps.Marker({
              position: new google.maps.LatLng($(elem).data('marker-lat'), $(elem).data('marker-lng')),
              map: map,
              icon: image
            });
          });
        });
        return $();
      }
    });
  })(jQuery, window);

  (function($, window) {
    return $(document).ready(function() {
      var highlightJump, sections;
      sections = $(".anchor");
      highlightJump = function(anchor) {
        var id;
        $("#jumper li").removeClass('active');
        id = $(anchor).attr('id');
        id = "[href=#" + id;
        id = id + "]";
        return $("#jumper li").find(id).parents("li").addClass('active');
      };
      $("#jumper a").click(function(e) {
        var hash, scroll, target;
        e.preventDefault();
        hash = $(this).attr('href');
        target = $(hash);
        if (target.length > 0) {
          highlightJump($(this));
          scroll = target.data('scroll_for_parallax');
          return $("html, body").animate({
            scrollTop: scroll
          }, 2000);
        }
      });
      return $(document).scroll(function() {
        var active, offset, scroll;
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
