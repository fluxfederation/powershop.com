(function() {
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
      var animationForDesign, animationForProduct, animationForRoles, animationLength, content, count, countUpNumbers, designs, faces, fadeIn, fadeInContent, fadeInHeaderBar, getHeaderBackground, header, hideCurrentTestimonial, left, loadImages, loadedOfficePics, maps, median, nav, next, officePhotoScroller, officePhotos, onHomePage, page, parallaxBackground, parallaxBackgrounds, paths, people, prev, product, renderFrame, right, roles, say, scrollHandlers, sections;
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
      officePhotos = $("#office_photos");
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
            img = $("<img />").attr('src', path).hide().on('dragstart', function(e) {
              return e.preventDefault();
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
      say = $("#customers_say");
      if (say.length > 0) {
        $("li:first", say).addClass('showing').siblings().hide();
        hideCurrentTestimonial = function(back) {
          var current, grid, height, img, posLeft, takeOffToLeft, txt, txtWidth;
          current = $(".showing", say);
          grid = $(".grid-55", current);
          height = current.outerHeight(true);
          say.css('height', height);
          grid.css({
            'height': height
          });
          img = current.find('img');
          txt = current.find('.padd-off');
          posLeft = txt.position().left;
          txtWidth = txt.width();
          img.animate({
            marginTop: '-300px',
            opacity: 0
          }, 600, 'easeInOutBack');
          txt.css({
            width: txtWidth,
            position: 'absolute',
            left: posLeft
          });
          takeOffToLeft = $(window).width();
          if (!back) {
            takeOffToLeft = -1 * $(window).width();
          }
          return txt.animate({
            opacity: 0,
            left: takeOffToLeft
          }, 600, 'easeOutQuint', function() {
            var next, nextGrid, nextImg, nextTxt, startLeft;
            current.hide().removeClass('showing');
            img.css('marginTop', 0);
            txt.css({
              'width': 'auto',
              'position': 'static'
            });
            grid.css({
              'height': 'auto'
            });
            if (back) {
              next = current.prev('li');
              if (next.length < 1) {
                next = $("li", say).last();
              }
            } else {
              next = current.next('li');
              if (next.length < 1) {
                next = $("li", say).first();
              }
            }
            next.addClass('showing');
            say.animate({
              height: next.outerHeight(true)
            });
            nextImg = next.find('img');
            nextTxt = next.find('.padd-off');
            nextGrid = next.find('.grid-55');
            nextGrid.css({
              height: height
            });
            startLeft = -1 * $(window).width();
            if (!back) {
              startLeft = $(window).width();
            }
            nextTxt.css({
              opacity: 0,
              left: startLeft,
              position: 'absolute',
              width: txtWidth
            });
            nextImg.css({
              'marginTop': '-300px',
              'opacity': 0
            });
            next.show();
            return nextTxt.animate({
              'opacity': 1,
              'left': posLeft
            }, 'easeOutQuint', function() {
              return nextImg.animate({
                'marginTop': 0,
                'opacity': 1
              }, 'easeInOutBack', function() {
                say.css('height', '');
                nextTxt.css('position', 'static');
                return nextGrid.css({
                  height: ''
                });
              });
            });
          });
        };
        prev = $("<a></a>").addClass('prev_test');
        prev.click(function(e) {
          e.preventDefault();
          return hideCurrentTestimonial(true);
        });
        next = $("<a></a>").addClass('next_test');
        next.click(function(e) {
          e.preventDefault();
          return hideCurrentTestimonial();
        });
        say.append(prev);
        say.append(next);
      }
      people = $("#our_people");
      if (people.length > 0) {
        $(".close", people).click(function(e) {
          e.preventDefault();
          $(".popup_nav", people).fadeOut();
          return $(".people_popup").animate({
            top: '-1200px'
          }, function() {
            return $(".people_popup").find('.reveal_content').removeClass('.reveal_content').hide();
          });
        });
        $(".face", people).click(function(e) {
          var details;
          e.preventDefault();
          details = $($(this).find('a').attr('href')).show();
          return $(".people_popup").animate({
            top: 0
          }, function() {
            details.addClass('reveal_content');
            return $(".popup_nav", people).fadeIn();
          });
        });
        $(".popup_nav a").click(function(e) {
          var current, takeNext;
          e.preventDefault();
          if (!$(this).hasClass('prev')) {
            takeNext = true;
          }
          current = $(".reveal_content");
          if (!takeNext) {
            next = current.prev('.person_detail');
            if (next.length < 1) {
              next = $(".person_detail").last();
            }
          } else {
            next = current.next('.person_detail');
            if (next.length < 1) {
              next = $(".person_detail").first();
            }
          }
          current.removeClass('reveal_content');
          return setTimeout(function() {
            next.show();
            next.addClass('reveal_content');
            return current.hide();
          }, 300);
        });
      }
      $('.parallax_section').parallax({
        scroll_factor: 0.5
      });
      parallaxBackgrounds = $(".parallax_background");
      if (parallaxBackgrounds.length > 0) {
        scrollHandlers.push(parallaxBackground = function(scrollY, winHeight, winWidth) {
          return parallaxBackgrounds.each(function(i, elem) {
            var pos;
            pos = "0% " + (scrollY * 0.5) + "px";
            return $(elem).css('background-position', pos);
          });
        });
      }
      count = $(".count_up");
      if (count.length > 0) {
        animationLength = 1000;
        count.each(function(i, elem) {
          var text;
          if (!$(elem).is(":in-viewport")) {
            text = "0";
            if ($(elem).data('count-up-percentage')) {
              text += "%";
            }
            $(elem).data('count-up', parseInt($(elem).text().replace('%', '')));
            $(elem).data('count-up-value', 0);
            return $(elem).text(text);
          } else {
            return $(elem).data('counted-up', true);
          }
        });
        scrollHandlers.push(countUpNumbers = function(scrollY, winHeight, winWidth) {
          return count.each(function(i, elem) {
            var countValue, expectedValue, percentage, self, value;
            self = $(elem);
            if (!self.data('counted-up') && self.is(":in-viewport")) {
              self.data('counted-up', true);
              value = self.data('count-up-value');
              expectedValue = self.data('count-up');
              percentage = self.data('count-up-percentage');
              return countValue = setInterval(function() {
                var text;
                if (value >= expectedValue) {
                  clearInterval(countValue);
                  if (percentage) {
                    expectedValue += "%";
                  }
                  return self.text(expectedValue);
                } else {
                  value += 1;
                  text = value;
                  if (percentage) {
                    text += "%";
                  }
                  return self.text(text);
                }
              }, 15);
            }
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
      renderFrame();
      $("#loading").fadeOut();
      return $("#pow").addClass('show');
    });
  })(jQuery, window);

  (function($, window) {
    return $(document).ready(function() {
      var highlightJump, isLocalScrolling, sections;
      isLocalScrolling = false;
      sections = $(".anchor");
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
          isLocalScrolling = true;
          return $("html, body").animate({
            scrollTop: scroll
          }, 2000, function() {
            return isLocalScrolling = false;
          });
        }
      });
      return $(document).scroll(function() {
        var active, offset, scroll;
        if (isLocalScrolling) {
          return;
        }
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
