do ($ = jQuery, window) ->

  # 
  # Grid alignment helper
  #
  $(this).griddit({vertical: 5});

  #
  # Operations to help with Vector manipulation which we use for bézier curves.
  #
  $.vector =
    rotate: (p, degrees)->
      radians = degrees * Math.PI / 180
      c = Math.cos(radians)
      s = Math.sin(radians)
      
      [c*p[0] - s*p[1], s*p[0] + c*p[1]]

    scale: (p, n)->
      [n*p[0], n*p[1]]
    
    add: (a, b)->
      [a[0]+b[0], a[1]+b[1]]
    
    minus: (a, b)->
      [a[0]-b[0], a[1]-b[1]]
  
  # 
  # Draw a bézier line. Supports mapping a given point along the curve. 
  #
  # > $.path.bezier.css(p)
  #
  # Where P is a percentage (0 to 1) of the drawing along the line
  #
  $.bezier = (params, rotate)->
    params.start = $.extend( {angle: 0, length: 0.3333}, params.start )
    params.end = $.extend( {angle: 0, length: 0.3333}, params.end )
    @p1 = [params.start.x, params.start.y]
    @p4 = [params.end.x, params.end.y]

    v14 = $.vector.minus( this.p4, this.p1 )
    v12 = $.vector.scale( v14, params.start.length )
    v41 = $.vector.scale( v14, -1 )
    v43 = $.vector.scale( v41, params.end.length )

    v12 = $.vector.rotate( v12, params.start.angle )
    @p2 = $.vector.add( @p1, v12 )

    v43 = $.vector.rotate(v43, params.end.angle )
    @p3 = $.vector.add( @p4, v43 )

    # p from 0 to 1
    this.css = (t)->
      f1 = (t*t*t)
      f2 = (3*t*t*(1-t))
      f3 = (3*t*(1-t)*(1-t))
      f4 = ((1-t)*(1-t)*(1-t))

      css = 
        x: this.p1[0] * f1 + this.p2[0] * f2 + @p3[0] * f3 + @p4[0] * f4 + 0.5
        y: this.p1[1] * f1 + this.p2[1] * f2 + @p3[1] * f3 + @p4[1] * f4 + 0.5

      css

    this

  $(document).ready ->  
    sections = $ ".section"
    content = $ "#content"
    nav = $ "#nav"
    header = $ "#header"
    page = $ "html"
    officePhotos = $ "#office_photosw"
    onHomePage = $(".home").length > 0
    scrollHandlers = []
    fadeIn = $ ".fadeIn"
    menuOpen = false
    headerGone = false
    body = $ "body"


    #
    # Calculate whether the device supports the animation on the users page.
    # The default positioning on the page should be the animated view. For
    # browsers that support it, they have a frame render.
    #
    supportsAnimation = true unless (/android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent.toLowerCase()))

    # 
    # If the browser is a touch device, add a helper class.
    #
    if Modernizr.touch
      page.addClass 'touch'

    # 
    # Once the user has started to scroll down the page, or, if they have jumped
    # to a particular point in the page, fade in the header bar.
    #
    scrollHandlers.push updateHeaderBar = (scrollY, winHeight, winWidth)->
      if onHomePage
        if scrollY > 4
          if  not headerGone
            headerGone = true

            $(".logo strong").animate({top: '-80px'}, 'easeInOutBack')

        else if headerGone
          headerGone = false
          $(".logo strong").animate({top: '10px'}, 'easeInOutBack')

    #
    # Fade in content as you move up and down the page.
    #
    scrollHandlers.push fadeInContent = (scrollY, winHeight, winWidth)->
      fadeIn.each (i, elem)->
        # if the scroll is past the fade in point and we haven't shown
        # the element yet, fade it in
        if $(elem).data('fade-in-at') >= scroll
          if not $(elem).data('showing')
            $(elem).data('showing', true).animate(
              opacity: 1
            )
    

    #
    # Clicking show navigation reveals the site wide navigation reveals over
    # the webpage.
    #
    $(".show_nav").click (e)->
      e.preventDefault()

      if $(this).hasClass('close')
        $(this).removeClass('close')

        menuOpen = false;

        nav.animate(
          height: '0',
          opacity: 0
          ()->
            nav.hide()

            page.css(
              'overflow': 'auto'
            )
        )
      else
        # hide powershop text
        $(".logo strong").animate({top: '-80px'}, 'easeInOutBack')

        # close the people popup (if it's open)
        $("#our_people .close").click();

        $(this).addClass('close')
        menuOpen = true;

        page.css(
          'overflow': 'hidden'
        )

        nav.show().animate({
          height: $(window).height(),
          opacity: 1
        }, ()->
          nav.css('height', '100%')
        )
        
      return false

    #
    # Ensure that we close the navigation when the user clicks a link within the
    # navigation, since it could be a part of the same page
    #
    $(".nav_wrapper a", nav).click( (e)->
      $(".show_nav").click()
    )

    #
    # Swiping the office images allows the user to manipulate the office 
    # photos. The user can swipe till there are no more photos to unvisible
    # on the page.
    #
    officePhotos = $ "#office_photos"
    officePhotoScroller = $ "ul", officePhotos

    #
    # Office images shouldn't load on the page till the users scroll to the 
    # section.
    #
    # Was going to load individual images on demand but now, just load them once
    # the user has got to them (or originally if animation isn't supported) since
    # iScroll doesn't have a scroll event to capture the information
    #
    if officePhotos.length > 0
      loadImages = ()->
        $("[data-image]", officePhotos).each (i, elem)->
            if $(elem).data('img-loaded') == true
              return

            currentScroll = parseInt(officePhotoScroller.css('marginLeft').replace(/px/, ''))

            # if the image is to the left or the right, don't both loading
            dom = $(elem).get(0)
            $(elem).data('img-loaded', true)

            path = $(elem).data('image')
            img = $("<img />").attr('src', path).hide().on 'dragstart', (e) ->
              e.preventDefault()

            setTimeout(()->
              $(elem).append(img).imagesLoaded().always (instance)->
                $(elem).animate(
                  opacity: 1
                ).addClass('loaded')

                img.fadeIn()

                $(elem).parents("li").animate(
                  opacity: 1
                )

              , Math.random() * 80
            )

      loadedOfficePics = false
      scroller = new iScroll('office_photos', {
        momentum: false,
        snap: false,
        vScroll: true,
        scrollbarClass: 'photo_scrollbar',
        hScrollbar: true
      })

      if supportsAnimation
        scrollHandlers.push (scrollY, winHeight, winWidth)->
          if loadedOfficePics then return

          if (scrollY + winHeight) > officePhotos.offset().top
            loadedOfficePics = true

            loadImages()
      else
        loadImages()

    #
    # On the homepage we have a google map for the office location.
    #
    maps = $(".google_map")

    if maps.length > 0
      $('.map .vcard').hide();

      $('.map h3').click ()->
        vard = $(this).siblings('.vcard')

        if vard.is(':visible')
          $(this).removeClass('open')
          vard.slideUp()
        else
          $(this).addClass('open')
          vard.slideDown()

      google.maps.event.addDomListener(window, 'load', ()->
        maps.each (i, elem)->

          options =
            center: new google.maps.LatLng($(elem).data('center-lat'), $(elem).data('center-lng')),
            zoom: 15,
            disableDefaultUI: true,
            scrollwheel: false,
            draggable: false,
            scrollwheel: false,
            panControl: false,
            disableDoubleClickZoom: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: window.map_styles

          map = new google.maps.Map($(elem).get(0), options)

          image = 
            url: $(elem).data('marker'),
            size: new google.maps.Size(30, 30),
            origin: new google.maps.Point(0,0)
            anchor: new google.maps.Point(15, 15)

          marker = new google.maps.Marker(
            position: new google.maps.LatLng($(elem).data('marker-lat'), $(elem).data('marker-lng')),
            map: map,
            icon: image
          )
      )


    #
    # The icons on the roles section come in as the users scroll into the 
    # page.
    ###
    roles = $("#current_roles")

    if roles.length > 0
      faces = $(".faces li", roles);
      median = faces.length / 2

      scrollHandlers.push animationForRoles = (scrollY, winHeight, winWidth)->
        comesIntoFocus = $(".faces", roles).offset().top
        startScrollForFocus = comesIntoFocus - winHeight
        endScrollFocus = startScrollForFocus + (winHeight / 2)

        # we want to know how how the user is through that scrolling
        # period

        if scrollY > startScrollForFocus
          diff = endScrollFocus - startScrollForFocus
          amountScrolledWithinBox = scrollY - startScrollForFocus

          if amountScrolledWithinBox > diff 
            amountScrolledWithinBox = diff

          # 0 - 1. 1 being they have scrolled the whole thing and we should be
          # at i + 0
          r = amountScrolledWithinBox / diff

          faces.each (i, elem)->
            offset = i - median
            $(elem).css 'left', (i + (offset - (offset * r))) * 86
        else 
          # before the animation so they should be all the way out
          faces.each (i, elem)->
            offset = i - median
            $(elem).css 'left', (offset + (offset * Math.PI)) * 86
    ###
    
    #
    # On the about page, animate in stuff
    #
    product = $("#product")

    if product.length > 0
      right = $(".product_3", product)
      left = $(".product_1", product)

      scrollHandlers.push animationForProduct = (scrollY, winHeight, winWidth)->
        # So product animation is 3 screens. Center one says fixed, the outside
        # two come in. The animation goes from a scroll position of 0 till a
        # scroll position of the offset of the bottom
        maxScroll = $(".product_images").offset().top - 200;

        r = scrollY / maxScroll

        if r > 1
          r = 1

        r = $.easing.easeOutQuint(undefined, r, 0, 1, 1);

        left.css 'marginLeft', -500 - ((1 - r) * ((winWidth / 2) + left.outerWidth()))
        right.css 'marginLeft', 100 + ((1 - r) * (winWidth / 2))


    designs = $("#design_thinking")
    if designs.length > 0
      paths = []

      $(".icons li").each (i, elem)->
        params =
          start:
            x: $(elem).data('fx'),
            y: $(elem).data('fy')
          end:
            x: $(elem).data('sx'),
            y: $(elem).data('sy')
          angle: $(elem).data('a')

        paths[i] = new $.bezier(params)

      scrollHandlers.push animationForDesign = (scrollY, winHeight, winWidth)->
        # animate the design thinking banner. Each element comes in on a 
        # different path and the distance along that path is determined by the
        # ratio of the users scrolling (much like the other pages)
        targetScroll = designs.offset().top

        p = (scrollY) / targetScroll;
        if p > 1 then p = 1;
        

        $(".icons li", designs).each (i, elem)->
          path = paths[i];
          position = path.css(p);

          # opacity starts at 0.5 probability and scales up at twice the rate
          if p < 0.6
            o = 0
          else 
            # 0 - 2
            o = (p - 0.6) * 5

          $(elem).css
            top: position.y
            opacity : o
            marginLeft: position.x

    #
    # Customer testimonials scroller
    #
    say = $("#customers_say")

    if say.length > 0
      # user can cycle through some of the testimonials on the page. The scroll
      # is endless, so last item is added to the start
      $("li:first", say).addClass('showing').siblings().hide()
      
      animatingTestimonial = false

      # hide the current testimonial animation.
      hideCurrentTestimonial = (back)->
        if animatingTestimonial
          return false


        animatingTestimonial = true

        current = $(".showing", say)
        grid = $(".grid-55", current)
        height = current.outerHeight(true)

        say.css('height', height)
        grid.css(
          'height': height
        )

        img = current.find('img')
        txt = current.find('.padd-off')

        posLeft = txt.position().left
        txtWidth = txt.width()

        img.animate({ 
          marginTop: '-200px',
          opacity: 0
        }, 300, 'easeInOutBack', ()->

          txt.css(
           width: txtWidth,
           position: 'absolute',
           left: posLeft
          )

          takeOffToLeft = $(window).width();
          takeOffToLeft = -0.5 * $(window).width() unless back

          txt.animate({ 
            opacity: 0
            left: takeOffToLeft
          }, 600, 'easeOutQuint', ()->
            # hide the testimonial
            current.hide().removeClass('showing');

            # clean up
            img.css('marginTop', 0)
            txt.css(
              'width': 'auto',
              'position': 'static'
            )

            grid.css(
              'height': 'auto'
            )

            # bring in the next element to focus
            if back
              next = current.prev('li')

              if next.length < 1
                next = $("li", say).last()

            else
              next = current.next('li')

              if next.length < 1
                next = $("li", say).first()

            next.addClass('showing')

            say.animate({
              height: next.outerHeight(true)
            })

            nextImg = next.find('img')
            nextTxt = next.find('.padd-off')
            nextGrid = next.find('.grid-55')

            nextGrid.css(
              height: height
            )

            # determine where to start the next block, if moving back we start
            # off to the left, otherwise moving next starts from the right
            startLeft = -1 * $(window).width()
            startLeft = $(window).width() unless back

            nextTxt.css(
              opacity: 0,
              left: startLeft,
              position: 'absolute',
              width: txtWidth
            )
            
            nextImg.css(
              'marginTop': '-200px',
              'opacity': 0
            )

            next.show();

            nextTxt.animate({
              'opacity': 1,
              'left': posLeft
            }, 'easeOutQuint', ()->
                nextImg.animate({
                  'marginTop': 0,
                  'opacity': 1
                }, 'easeInOutBack', ()->
                  # clear explict heights
                  say.css('height', '')
                  nextTxt.css('position', 'static')
                  nextGrid.css(
                    height: ''
                  )

                  animatingTestimonial = false
                )
            )
          )
        )

      prev = $("<a></a>").addClass('prev_test')
      prev.click (e)->
        # prev
        e.preventDefault()
        hideCurrentTestimonial(true)

      next = $("<a></a>").addClass('next_test')
      next.click (e)->
        # next
        e.preventDefault()
        hideCurrentTestimonial()


      say.append(prev);
      say.append(next);

    # 
    # Our peoples page. Clicking the users face should reveal the content popup
    #
    people = $("#our_people")

    if people.length > 0
      #
      # close icon on the popup
      #
      peoplePopup = $('.people_popup')
      peoplePopupBackground = $(".people_popup_bg")
      peopleNav = $('.popup_nav')
      peopleNavLeft = $(".popup_nav.prev")
      peopleNavRight = $(".popup_nav.next")

      #
      # Helper for getting the next staff member to show.
      #
      # Params:
      # {DomElement} current currentItem in scope
      # {Boolean} boolean take previous item
      #
      # Returns:
      # {DomElement}
      #
      getNextStaffMember = (currentStaff, prev)->
        nextStaff = false

        if prev == true
          nextStaff = currentStaff.prev('.person_detail')
        else
          nextStaff = currentStaff.next('.person_detail')

        if nextStaff.length < 1
          # it doesn't exist
          if prev == true
            nextStaff = $(".person_detail").last()
          else
            nextStaff = $(".person_detail").first()

        nextStaff

      #
      # Close the people popup. 
      #
      $(".close", people).click (e)->
        e.preventDefault();

        # hide nav
        peopleNav.fadeOut()

        $("#jumper").fadeIn()
        $(".people_group h3").animate(
          opacity: 1
        )

        #peoplePopupBackground.css('background-image', 'none')
        peoplePopupBackground.attr('class', 'people_popup_bg')

        # remove the reveal_content from everything
        $('.person_detail').hide().removeClass('reveal_content')

        # hide any open ones
        peoplePopup.show().animate(
          height: 0
          opacity: 0
        , ()->
          $(this).hide()
        )

      #
      # Click on the face to load a popup
      #
      $(".face", people).click (e)->
        
        # make sure the user is at the top of the viewable space
        parent = $('.people_group').first()
        top = parent.offset().top

        if $(window).scrollTop() > top 
          $(window).scrollTo({ top:top, left:0}, 500);

        details = $($(this).find('a').attr('href'))
      
        # set the next and previous sta
        prev = getNextStaffMember(details, true)

        peopleNavLeft.attr('class', "popup_nav prev #{prev.attr('id')}_bg_small")
        next = getNextStaffMember(details, false)

        peopleNavRight.attr('class', "popup_nav next #{next.attr('id')}_bg_small")

        #
        # Bring the popup down if it isn't visible already
        #
        if peoplePopup.is(":not(:visible)")
          # animate it down
          peoplePopup.css
            opacity: 1,
            height: 0
            display: 'block'

          $("#jumper").fadeOut()
          $(".people_group h3").animate(
            opacity: 0
          )
          
          peopleNav.fadeIn()
        else
          #peoplePopupBackground.css('background-image', 'none')
          peoplePopupBackground.attr('class', 'people_popup_bg')

          # remove the reveal_content from everything
          $('.person_detail').hide().removeClass('reveal_content')


        peoplePopup.animate(
          height: if ($(window).width() > 580) then 780 else details.height() + 360,
          ()->
            # load the background image 
            #peoplePopupBackground.css(
            #  'background-image': 'url(/_assets/img/staff_pics/large/'+ details.attr('id') + ".jpg)"
            #)
            peoplePopupBackground.attr('class', "people_popup_bg #{details.attr('id')}_bg_large")

            details.css(
              'left': 0,
              'opacity': 1
            )

            # bring in content
            details.addClass('reveal_content')
            details.find('.people_content').animate(
              opacity: 1,
              left: 0
            )

            details.show()
        )

      #
      # Navigating between the staff members while the popup is open
      #
      $(".popup_nav").click (e)->
        e.preventDefault()

        current = $(".reveal_content")
        currentContent = current.find('.people_content')

        prev = $(this).hasClass('prev')
        next = getNextStaffMember(current, prev)
        nextContent = next.find('.people_content')

        next.show()

        if prev
          nextContent.css(
            left: next.outerWidth() * -1,
            opacity: 0.5,
            display: 'block'
          )
        else
          nextContent.css(
            left: next.outerWidth(),
            opacity: 0.5,
            display: 'block'
          )

        current.removeClass('reveal_content')

        #
        # Once we've finished animating out we need to bring in the next piece 
        # of content
        #
        onPopupContentDone = ()->
          currentContent.css(
            'width': '90.909090%',
            'left': 0,
            'opacity': 0,
            'display: block'
          )

          # swap the nav thumbs
          prev = getNextStaffMember(next, true)
          future = getNextStaffMember(next, false)

          # peopleNavLeft.css('background-image', 'url(/_assets/img/staff_pics/small/'+ prev.attr('id') + ".jpg)")
          # peopleNavRight.css('background-image', 'url(/_assets/img/staff_pics/small/'+ future.attr('id') + ".jpg)")

          peoplePopupBackground.animate(
            'opacity': 0
          , ()->

            #peoplePopupBackground.css(
            #  'background-image': 'url(/_assets/img/staff_pics/large/'+ next.attr('id') + ".jpg)"
            #)
            peoplePopupBackground.attr('class', "people_popup_bg #{next.attr('id')}_bg_large")

            peoplePopupBackground.animate(
              'opacity': 1
            , ()->
              next.addClass('reveal_content')

              nextContent.animate(
                left: 0,
                opacity: 1
              )
            )
          )
          

        # animate current off the page. Right for previous, left for next
        currentContent.css('width', currentContent.width())

        if prev
          currentContent.animate(
            left: current.width()
          , ()->
              onPopupContentDone()
          )
        else
          currentContent.animate(
            left: current.width() * -1
          , ()->
              onPopupContentDone()
          )


    # 
    # Load parallax backgrounded sections. For other parallax uses (like quotes)
    # use the parallax_background
    #
    if supportsAnimation
      parallaxBackgrounds = $(".parallax_background")

      if parallaxBackgrounds.length > 0
         scrollHandlers.push parallaxBackground = (scrollY, winHeight, winWidth)->
          parallaxBackgrounds.each (i, elem)->
            if $(elem).data('reverse')
              # reverse parallax, determine the amount of change that would be
              # required for that size. We start at the negative value and end
              # at zero once the user has scrolled past
              scrollPast = $(elem).height() + $(elem).offset().top

              # size of translation is the width of the browser vs the 
              dy = winWidth / $(elem).data('ratio-to-width') - $(elem).data('hy')
              percentage = scrollY / scrollPast
              percentage = 1 unless percentage < 1
              
              pos = "0% "+ parseInt(((-1 * dy) * (1 - percentage)))
              $(elem).css('background-position', pos + "px")
            else   
              pos = "0% " + (scrollY * 0.5) + "px"
              $(elem).css('background-position', pos)

    #
    # Count up statistics. Stats that count up when they start to be visible
    #
    count = $(".count_up")

    if count.length > 0
      animationLength = 2000;

      if supportsAnimation
        count.each (i, elem)->
          if not $(elem).is(":in-viewport")
            text = "0"

            if $(elem).data('count-up-percentage')
              text += "%"

            $(elem).data('count-up', parseInt($(elem).text().replace('%', '')))
            $(elem).data('count-up-value', 0)
            $(elem).text(text)
          else
            $(elem).data('counted-up', true)
          
      scrollHandlers.push countUpNumbers = (scrollY, winHeight, winWidth)->
        count.each (i, elem)->
          self = $(elem)

          # now in viewport so count
          if not self.data('counted-up') and self.is(":in-viewport")
            self.data('counted-up', true);

            value = self.data('count-up-value');
            expectedValue = self.data('count-up');
            percentage = self.data('count-up-percentage')
            delay = Math.random() * 300
            speed = Math.random() * 30

            setTimeout( ()->
              countValue = setInterval( ()->
                if value >= expectedValue
                  clearInterval(countValue)

                  if percentage
                    expectedValue += "%"

                  self.text(expectedValue)
                else
                  value += 1;
                  
                  text = value;

                  if percentage
                    text += "%"

                  self.text(text)
              , speed
              )
            , delay
            )

    #
    # Home page animate parallaxed illustrations.
    # 
    if onHomePage
      ill1 = $("#ill1")
      ill1_section = $("#make_things")
      ill1_fire = $("#ill1_fire")

      ill2 = $("#ill2")
      ill2_section = $("#give")
      ill2_cone = $(".cone", ill2)
      ill2_scoopes = $(".scoop", ill2)

      ill3 = $("#ill3")
      ill3_section = $("#weird")
      ill3_hat = $(".bike_hat")
      ill3_hatshadow = $(".bike_hat_shadow")

      showingIcecream = false
      animationInProgress = false

      #
      # Code for showing an icecream on the page.
      #
      showIcecreamAnimation = ()->
        # show each of icecream scoops
        ill2_scoopes.each((i, elem)->
          setTimeout( ()->
            $(elem).animate(
              'opacity': 1
            )
          , i * 100
          )
        )

        setTimeout( ()->
          # add sauce to the icecream
          $(".sauce", ill2).transition(
            'y': '0',
            'scale': 1,
            'duration': 900
          )

          setTimeout( ()->
            # add sprinkles 
            $(".sprinkles", ill2).transition(
              'y': '0',
              'scale': 1
            )

            # add the cherry
            $(".cherry, .cherry_shadow", ill2).transition(
              'rotate': '0deg',
              'y': '0',
              'duration': 1000
            )

          , 1100)
        , 1800)

      # 
      # Code for hiding icecream on the page.
      #
      # Optionally takes a 'quick' parameter to indicate we shouldn't bother
      # animating it in any particular way
      #
      hideIcecreamAnimation = (quick)->
        if quick
          # sprinkles
          $(".sprinkles", ill2).css(
            'y': '-400px',
            'scale': 0.8
          )

          # remove the cherry
          $(".cherry, .cherry_shadow", ill2).css(
            'rotate': '30deg',
            'y': '-200px'
          )

          # take the sauce off
          $(".sauce", ill2).css(
              'y': '-400px',
              'scale': 0.5
            )

          # remove the scoops of icecream
          ill2_scoopes.css('opacity', 0)

        else
          # take sprinkles off
          $(".sprinkles", ill2).transition(
            'y': '-400px',
            'scale': 0.8
          )

          # remove the cherry
          $(".cherry, .cherry_shadow", ill2).transition(
            'rotate': '30deg',
            'y': '-200px'
          )

          setTimeout(()->
            # take sauce off from the top
            $(".sauce", ill2).transition(
              'y': '-400px',
              'scale': 0.5,
              'duration': 900
            )

            setTimeout( ()->
              # trigger other animations
              ill2_scoopes.each((i, elem)->
                setTimeout( ()->
                  $(elem).animate(
                    'opacity': 0
                  )

                , (ill2_scoopes - i) * 50)
              )
            , 1100
            )
          , 400)

      #
      # Trigger the hide operation on load. We call animate when the page is 
      # loaded.
      #
      if supportsAnimation
        hideIcecreamAnimation(true)

      # 
      # On scroll handle all the animation logic
      #
      scrollHandlers.push animateHomePage = (scrollY, winHeight, winWidth)->
        #
        # If we're at a size any smaller than the desktop view, just ignore this
        # since the illustrations will be gone
        # 

        #
        # Illustration 1. Make things. This guy comes up from the bottom left as
        # the user scrolls on the page to sit at the final position of 20,520. The
        # driver of this vehicle is a little drunk so as he comes across, he moves
        # up and down. 
        #
        restingPlaceX = 530 
        restingPlaceY = 50
        amountOfScrollToFullAnimation = ill1_section.offset().top
        percentageScroll = scrollY/amountOfScrollToFullAnimation

        if percentageScroll >= 1
          placeY = restingPlaceY
          placeX = restingPlaceX
          ill1.addClass('swing')

        else
          placeX = winWidth - ((winWidth - restingPlaceX) * percentageScroll)
          placeY = restingPlaceY + 200 - (200 * percentageScroll);
          ill1.removeClass('swing')

        ill1.css(
          'top': placeY,
          'left': placeX
        )

        #
        # Illustration 2. Give a shit. The ice cream cone comes up from the 
        # bottom of the users screen while the ice cream parts pop up as if 
        # magic
        #
        amountOfScrollForIcecreamToTrigger = ill2_section.offset().top;

        if scrollY >= (amountOfScrollForIcecreamToTrigger - 100)
          #
          # Show Icecream
          #
          # User has scrolled far enough for the animation to take place so fade
          # in the icecreams
          #
          ill2_cone.css('top', 400)

          if not showingIcecream
            # animate in the icecream parts
            showingIcecream = true
            
            showIcecreamAnimation()
        else
          #
          # Hide Icecream
          #
          # hideIcecreamAnimation();
          #
          if not showingIcecream
            ill2_cone.css('top' , 400 + ((amountOfScrollForIcecreamToTrigger - 100) - scrollY))


        #
        # Illustration 3. The man on the bike, the bike comes across the page,
        # and sits on the right hand side. The position of the bike goes from
        # 0 to 550 based on the users scroll. We start the migration when the
        # section gets into focus and hits the end once the page has made the
        # whole thing visible.
        #
        # When the bike is half way the hat starts to lift off and go away to
        # the left, whew he's gaining pace
        #
        startMoving = ill3_section.offset().top - winHeight
        stopMoving = startMoving + 500;

        if scrollY > startMoving
          # calculate the percentage
          percentage = (scrollY - startMoving) / (stopMoving - startMoving)

          if percentage >= 0.85
            # I wish that I could fly 
            # Into the sky 
            # So very high 
            # Just like a dragonfly 

            # I'd fly above the trees 
            # Over the seas in all degrees 
            # To anywhere I please 

            # Oh I want to get away 
            # I want to fly away 
            # Yeah yeah yeah

            # top goes down to 120 pretty quick, starts at 30
            top = parseInt(30 - ((percentage - 0.75) * 200))
            if top < -90 then top = -90

            # rotate from 0, -50 over the percentage 0.8 - 1.3
            rotate = parseInt(((percentage - 0.75) * 10) * -10)
            if rotate < -50 then rotate = -50

            # left can go over the page as much as want
            left = parseInt(50 - ((percentage - 0.8) * winWidth))

            if top < -50
              ill3.addClass('shock')

            # rotate c
            ill3_hat.css
              'left': left,
              'rotate': rotate,
              'top': top

            ill3_hatshadow.css
              'left': left + 4,
              'rotate': rotate,
              'top': top
          else
            ill3.removeClass('shock')

            ill3_hat.css
              left: 50,
              top: 30
              rotate: 0

            ill3_hatshadow.css
              left: 55,
              top: 30,
              rotate: 0

          percentage = 1 unless percentage < 1

          ill3.css
            left: (520 * percentage)

        else
          # reset back to the original positions
          ill3.removeClass('shock').css
            left: 0

          ill3_hat.css
            left: 50,
            top: 30
            rotate: 0

          ill3_hatshadow.css
            left: 55,
            top: 30,
            rotate: 0

    #
    # Growth arrow on the about page. As the user scrolls the arrow moves north
    # back to the full height
    #
    growth = $("#growth_arrow")

    if growth.length > 0
      scrollHandlers.push animateGrowthArrow = (scrollY, winHeight, winWidth)->
        maxScroll = (growth.offset().top + growth.height()) - (winHeight / 1.5)
        minScroll = (growth.offset().top - winHeight) - 100

        percentage = ((scrollY - minScroll) / (maxScroll - minScroll))
        percentage = 0 unless percentage > 0
        percentage = 1 unless percentage <= 1

        growth.css
          'bottom': -268 + (percentage * 268)

    #
    # On the products page, as the user scrolls down open up the laptop display
    #
    laptop = $("#shop .laptop-top")

    if laptop.length > 0
      powerpacks = $(".animate-line")
      packs = $("li", powerpacks)

      scrollHandlers.push animateProductsPage = (scrollY, winHeight, winWidth)->
        shopSection = laptop.parents("#shop")
        minScroll =  shopSection.offset().top - 200
        maxScroll = minScroll + 200

        percentage = ((scrollY - minScroll) / (maxScroll - minScroll))
        percentage = 0 unless percentage > 0
        percentage = 1 unless percentage <= 1
        amount = (-45 + (45 * percentage))
        amount += 'deg)'

        laptop.css
          'transform': 'rotateX('+ amount

        # when the user hits the packs section and they haven't cycled through
        # yet.
        packMinScroll = powerpacks.offset().top - winHeight

        if packMinScroll < scrollY and not powerpacks.hasClass('animated')
          powerpacks.addClass('animated')

          # for each of the powerpacks, start the value at a random value that
          # is either negative or positive and set a timer so that they all
          # rotate around
          packs.each (i, elem)->
            neg = if (i % 2) then 2 else -2
            amount = Math.round(Math.random() * 500) + 1000 * neg
            rotate = amount + 'deg)'

            $(elem)
              .data
                'rotate': amount
                'backwards': if neg > 0 then 'true' else 'false'
              .css
                'transform': 'rotateX('+ rotate

          # Now that each has a position to start, set a timer to count it down
          # to 0.
          degreesPerMillisecond = 5

          countPacks = setInterval( ()->
            allFinished = true

            packs.each (i, elem)->
              current = $(elem).data('rotate')

              if current == 0
                return
              else if current < 0
                current = current + degreesPerMillisecond

                if current > 0 then current = 0

              else if current > 0
                current = current - degreesPerMillisecond

                if current < 0 then current = 0

              if current != 0
                allFinished = false

              rotate = current + 'deg)'

              $(elem)
                .data
                  'rotate': current
                .css
                  'transform': 'rotateX('+ rotate

            if allFinished
              clearInterval(countPacks)

          , 1
          )

    # On the products page, animate the mail items out of the envelope once the
    # user can see the envelope. Animate the first one out to -490 then begin
    # the second mail item. The speed of the animation is determined by the
    # amount of space to scroll. Animate starts when the top of the envelope is
    # on the screen and finishes when the user scrolls past the top of the same
    # mark.
    envelope = $(".envelope")

    if envelope.length > 0
      open = $("#informed .open-envelope")
      mailItem1 = $('.mail-month', envelope)
      mailItem1Pos = mailItem1.data 'min-position'
      mailItem2 = $('.mail-week', envelope)
      mailItem2Pos = mailItem2.data 'min-position'

      scrollHandlers.push animateMailItems = (scrollY, winHeight, winWidth)->
        offsetPos = open.offset().top
        startScroll = (open.offset().top - winHeight) - 300
        r = ((scrollY - startScroll) / ((offsetPos - 300) - startScroll))
        r = 0 unless r > 0
        r = 1 unless r <= 1
        r = $.easing.easeOutQuint(undefined, r, 0, 1, 1);

        mailItem1.css(
          bottom: (mailItem1Pos * r)
        )

        mailItem2.css(
          bottom:  (mailItem2Pos * r)
        )

    #
    # Finally on the products page, animates the payment methods section. The
    # laptop stays fixed on the left hand side, the mobile methods ease in to
    # the right hand side of the page.
    #
    paymentsAnimation = $('#payments')

    if paymentsAnimation.length > 0
      tablet = $('.payments-tablet', paymentsAnimation)
      phone = $('.payments-phone', paymentsAnimation)
      minTablet = tablet.data('min-position')
      minPhone = phone.data('min-position')

      scrollHandlers.push animateMailItems = (scrollY, winHeight, winWidth)->
        stopScroll = $("body").height() - winHeight
        startScroll = paymentsAnimation.offset().top

        r = (scrollY - startScroll) / (stopScroll - startScroll)
        r = 0 unless r > 0
        r = 1 unless r <= 1
        r = $.easing.easeOutQuint(undefined, r, 0, 1, 1);

        tablet.css(
          marginLeft: ((winWidth / 2) - (r * (winWidth / 2))) + minTablet + (minTablet * (2 - (r * 2)))
        )

        phone.css(
          marginLeft: ((winWidth / 2) - (r * (winWidth / 2))) + minPhone + (minPhone * (2 - (r * 2)))
        )

    #
    # If the device supports animation then render the frame.
    #
    if supportsAnimation
      renderFrame = (onLoad)->
        winHeight = $(window).height();
        winWidth = $(window).width();
        scrollY = $(window).scrollTop();
      
        $.each scrollHandlers, (i, callback)->
          if scrollY < 0
           scrollY = 0

          callback(scrollY, winHeight, winWidth)

      #
      # disable animations on screens that are on tablet devices
      # 
      # On scroll, rerender the frame. iPad's don't fire onscroll till the user
      # has completed the scroll resulting in odd chunky behaviour so we just
      # leave the animations are they were
      #

      $(window).scroll ()->
        renderFrame(false)

      $(window).resize ()->
        renderFrame(false)

      renderFrame(true)


    #
    # Wink animation.
    #
    useWink = false

    if useWink
      $("#loading").addClass('done wink');

      setTimeout(()->
        $("#loading").removeClass('wink');

        setTimeout(()->
          $(".loading_icon").fadeOut(()->
            $("#loading").fadeOut()
          )
        , 1000
        )

      , 2000
      )
    else
      $("#loading").fadeOut()
