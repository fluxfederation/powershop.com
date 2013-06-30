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

      return $("#loading").fadeOut();
    });
  })(jQuery, window);

  (function($, window) {
    $.vector = {
      rotate: function(p, degrees) {
        var c, radians, s;
        radians = degrees * Math.PI / 180;
        c = Math.cos(radians);
        s = Math.sin(radians);
        return [c * p[0] - s * p[1], s * p[0] + c * p[1]];
      },
      scale: function(p, n) {
        return [n * p[0], n * p[1]];
      },
      add: function(a, b) {
        return [a[0] + b[0], a[1] + b[1]];
      },
      minus: function(a, b) {
        return [a[0] - b[0], a[1] - b[1]];
      }
    };
    $.path.bezier = function(params, rotate) {
      var v12, v14, v41, v43;
      params.start = $.extend({
        angle: 0,
        length: 0.3333
      }, params.start);
      params.end = $.extend({
        angle: 0,
        length: 0.3333
      }, params.end);
      this.p1 = [params.start.x, params.start.y];
      this.p4 = [params.end.x, params.end.y];
      v14 = $.vector.minus(this.p4, this.p1);
      v12 = $.vector.scale(v14, params.start.length);
      v41 = $.vector.scale(v14, -1);
      v43 = $.vector.scale(v41, params.end.length);
      v12 = $.vector.rotate(v12, params.start.angle);
      this.p2 = $.vector.add(this.p1, v12);
      v43 = $.vector.rotate(v43, params.end.angle);
      this.p3 = $.vector.add(this.p4, v43);
      this.css = function(t) {
        var css, f1, f2, f3, f4;
        f1 = t * t * t;
        f2 = 3 * t * t * (1 - t);
        f3 = 3 * t * (1 - t) * (1 - t);
        f4 = (1 - t) * (1 - t) * (1 - t);
        css = {
          x: this.p1[0] * f1 + this.p2[0] * f2 + this.p3[0] * f3 + this.p4[0] * f4 + 0.5,
          y: this.p1[1] * f1 + this.p2[1] * f2 + this.p3[1] * f3 + this.p4[1] * f4 + 0.5
        };
        return css;
      };
      return this;
    };
    return $(document).ready(function() {
      var animationForDesign, animationForProduct, animationForRoles, content, designs, faces, fadeIn, fadeInContent, fadeInHeaderBar, getHeaderBackground, header, left, loadImages, loadedOfficePics, maps, median, nav, officePhotoScroller, officePhotos, onHomePage, page, paths, product, renderFrame, right, roles, scrollHandlers, sections;
      sections = $(".section");
      content = $("#content");
      nav = $("#nav");
      header = $("#header");
      page = $("html");
      officePhotos = $("#office_photosw");
      onHomePage = $(".home").length > 0;
      scrollHandlers = [];
      fadeIn = $(".fadeIn");
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
      scrollHandlers.push(fadeInHeaderBar = function(scrollY, winHeight, winWidth) {
        var current, latest;
        current = header.css('background');
        latest = getHeaderBackground();
        if (current !== latest) {
          return header.css({
            background: latest
          });
        }
      });
      scrollHandlers.push(fadeInContent = function(scrollY, winHeight, winWidth) {
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
      officePhotoScroller = $("ul", officePhotos);
      if (officePhotos.length > 0) {
        loadImages = function() {
          return $("[data-image]", officePhotos).each(function(i, elem) {
            var currentScroll, dom, img, path;
            if ($(elem).data('img-loaded') === true) {
              return;
            }
            currentScroll = parseInt(officePhotoScroller.css('marginLeft').replace(/px/, ''));
            dom = $(elem).get(0);
            if ($.rightofscreen(dom, {
              threshold: (currentScroll * -0.5) + $(window).width()
            })) {
              return;
            } else if ($.leftofscreen(dom, {
              threshold: (currentScroll * -0.5) - $(window).width()
            })) {
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
                  opacity: 0.8
                }).addClass('loaded');
                img.fadeIn();
                return $(elem).parents("li").animate({
                  opacity: 1
                });
              }, Math.random() * 80);
            });
          });
        };
        loadedOfficePics = false;
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
                }, loadImages);
              } else {
                officePhotoScroller.animate({
                  'marginLeft': (currentScroll + scrollDistance) + "px"
                }, loadImages);
              }
              return;
            }
            if (direction === "left") {
              if ((currentScroll - scrollDistance) < minimumPosition) {
                return officePhotoScroller.animate({
                  'marginLeft': minimumPosition + "px"
                }, loadImages);
              } else {
                return officePhotoScroller.animate({
                  'marginLeft': (currentScroll - scrollDistance) + "px"
                }, loadImages);
              }
            }
          }
        });
        scrollHandlers.push(function(scrollY, winHeight, winWidth) {
          if (loadedOfficePics) {
            return;
          }
          if ((scrollY + winHeight) > officePhotos.offset().top) {
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
      }
      $('.parallax_section').parallax({
        scroll_factor: 0.5
      });
      roles = $("#current_roles");
      if (roles.length > 0) {
        faces = $(".faces li", roles);
        median = faces.length / 2;
        scrollHandlers.push(animationForRoles = function(scrollY, winHeight, winWidth) {
          var amountScrolledWithinBox, comesIntoFocus, diff, endScrollFocus, r, startScrollForFocus;
          comesIntoFocus = $(".faces", roles).offset().top;
          startScrollForFocus = comesIntoFocus - winHeight;
          endScrollFocus = startScrollForFocus + (winHeight / 2);
          if (scrollY > startScrollForFocus) {
            diff = endScrollFocus - startScrollForFocus;
            amountScrolledWithinBox = scrollY - startScrollForFocus;
            if (amountScrolledWithinBox > diff) {
              amountScrolledWithinBox = diff;
            }
            r = amountScrolledWithinBox / diff;
            return faces.each(function(i, elem) {
              var offset;
              offset = i - median;
              return $(elem).css('left', (i + (offset - (offset * r))) * 86);
            });
          } else {
            return faces.each(function(i, elem) {
              var offset;
              offset = i - median;
              return $(elem).css('left', (offset + (offset * Math.PI)) * 86);
            });
          }
        });
      }
      product = $("#product");
      if (product.length > 0) {
        right = $(".product_3", product);
        left = $(".product_1", product);
        scrollHandlers.push(animationForProduct = function(scrollY, winHeight, winWidth) {
          var bottomIsVisibleAt, currentBottom, r, targetScroll;
          bottomIsVisibleAt = product.offset().top + product.outerHeight();
          currentBottom = winHeight + scrollY;
          targetScroll = bottomIsVisibleAt - winHeight;
          r = scrollY / targetScroll;
          if (r > 1) {
            r = 1;
          }
          left.css('marginLeft', -500 - ((1 - r) * (winWidth + left.outerWidth())));
          return right.css('marginLeft', 100 + ((1 - r) * (winWidth + right.outerWidth())));
        });
      }
      designs = $("#design_thinking");
      if (designs.length > 0) {
        paths = [];
        $(".icons li").each(function(i, elem) {
          var params;
          params = {
            start: {
              x: $(elem).data('fx'),
              y: $(elem).data('fy')
            },
            end: {
              x: $(elem).data('sx'),
              y: $(elem).data('sy')
            },
            angle: $(elem).data('a')
          };
          return paths[i] = new $.path.bezier(params);
        });
        scrollHandlers.push(animationForDesign = function(scrollY, winHeight, winWidth) {
          var ignoredScroll, p, targetScroll, targetTop;
          targetTop = designs.offset().top;
          if (targetTop > winHeight) {
            ignoredScroll = Math.abs(targetTop - winHeight);
            targetScroll = targetTop - ignoredScroll;
            p = (scrollY - ignoredScroll) / targetScroll;
            if (p > 1) {
              p = 1;
            }
          } else {
            p = 1;
          }
          return $(".icons li", designs).each(function(i, elem) {
            var o, path, position;
            path = paths[i];
            position = path.css(p);
            if (p < 0.6) {
              o = 0;
            } else {
              o = (p - 0.6) * 5;
            }
            return $(elem).css({
              top: position.y,
              opacity: o,
              marginLeft: position.x
            });
          });
        });
      }
      renderFrame = function() {
        var scrollY, winHeight, winWidth;
        winHeight = $(window).height();
        winWidth = $(window).width();
        scrollY = $(window).scrollTop();
        return $.each(scrollHandlers, function(i, callback) {
          return callback(scrollY, winHeight, winWidth);
        });
      };
      $(window).scroll(function() {
        return renderFrame();
      });
      $(window).resize(function() {
        return $("#loading").fadeIn(function() {
          return renderFrame();
        });
      });
      return renderFrame();
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
