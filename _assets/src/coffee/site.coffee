do ($ = jQuery, window) ->
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
  $.path.bezier = (params, rotate)->
    params.start = $.extend( {angle: 0, length: 0.3333}, params.start )
    params.end = $.extend( {angle: 0, length: 0.3333}, params.end )
    this.p1 = [params.start.x, params.start.y]
    this.p4 = [params.end.x, params.end.y]

    v14 = $.vector.minus( this.p4, this.p1 )
    v12 = $.vector.scale( v14, params.start.length )
    v41 = $.vector.scale( v14, -1 )
    v43 = $.vector.scale( v41, params.end.length )

    v12 = $.vector.rotate( v12, params.start.angle )
    this.p2 = $.vector.add( this.p1, v12 )

    v43 = $.vector.rotate(v43, params.end.angle )
    this.p3 = $.vector.add( this.p4, v43 )

    # p from 0 to 1
    this.css = (t)->
      f1 = (t*t*t)
      f2 = (3*t*t*(1-t))
      f3 = (3*t*(1-t)*(1-t))
      f4 = ((1-t)*(1-t)*(1-t))

      css = 
        x: this.p1[0] * f1 + this.p2[0] * f2 + this.p3[0] * f3 + this.p4[0] * f4 + 0.5
        y: this.p1[1] * f1 + this.p2[1] * f2 + this.p3[1] * f3 + this.p4[1] * f4 + 0.5

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
    # Helper function for getting the background color of the header for the
    # current window scroll. By default, no background color is needed, but by
    # the time we hit the first text (~180px) we need to have it up.
    #
    getHeaderBackground = ()->
      if menuOpen
        return 'rgba(0, 0, 0, 0.8)'

      scroll = $(window).scrollTop()

      if onHomePage
        if scroll > 4
          if  not headerGone
            headerGone = true 
            $(".logo strong").animate({top: '-80px'}, 'easeInOutBack')
        else if headerGone
          headerGone = false
          $(".logo strong").animate({top: '10px'}, 'easeInOutBack')

      if scroll >= 140 
        return 'rgba(0, 0, 0, 0.2)'
      else if scroll < 1 
        return 'rgba(0, 0, 0, 0)'
      
      op = (scroll/140) / 5; 

      return 'rgba(0, 0, 0, '+ op + ')'


    # 
    # Once the user has started to scroll down the page, or, if they have jumped
    # to a particular point in the page, fade in the header bar.
    #
    scrollHandlers.push fadeInHeaderBar = (scrollY, winHeight, winWidth)->
      current = header.css('background')
      latest = getHeaderBackground()

      if current != latest
        header.css(
          background: latest
        ) 

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

        header.animate(
          height: '50px',
          ()->
            page.css(
              'overflow': 'auto'
            )

            header.css(
             'overflow-y': 'hidden',
             'background': getHeaderBackground()
            )
        )
      else
        $(this).addClass('close')
        menuOpen = true;

        page.css(
          'overflow': 'hidden'
        )

        header.css(
          'background': getHeaderBackground(),
          'overflow-y': 'auto'
        )

        header.animate({
          height: $(window).height()
        }, ()->
          header.css('height', '100%')
        )

        $("#nav").fadeIn()
        
      return false

    
    #
    # Swiping the office images allows the user to manipulate the office 
    # photos. The user can swipe till there are no more photos to unvisible
    # on the page.
    #
    officePhotos = $ "#office_photos"
    officePhotoScroller = $ "ul", officePhotos

    #
    # Office images shouldn't load on the page till the users scroll to the 
    # section
    #
    if officePhotos.length > 0
      loadImages = ()->
        $("[data-image]", officePhotos).each (i, elem)->
            if $(elem).data('img-loaded') == true
              return

            currentScroll = parseInt(officePhotoScroller.css('marginLeft').replace(/px/, ''))

            # if the image is to the left or the right, don't both loading
            dom = $(elem).get(0)
            
            if $.rightofscreen(dom, {threshold: (currentScroll * -0.5) + $(window).width()}) 
              return
            else if $.leftofscreen(dom, {threshold: (currentScroll * -0.5) - $(window).width()})
              return

            $(elem).data('img-loaded', true)

            path = $(elem).data('image')
            img = $("<img />").attr('src', path).hide().on 'dragstart', (e) ->
              e.preventDefault()

            setTimeout(()->
              $(elem).append(img).imagesLoaded().always (instance)->
                $(elem).animate(
                  opacity: 0.8
                ).addClass('loaded')

                img.fadeIn()

                $(elem).parents("li").animate(
                  opacity: 1
                )

              , Math.random() * 80
            )

      loadedOfficePics = false

      officePhotoScroller.swipe(
        swipe: (event, direction, distance, duration, fingerCount)->
          winWidth = $(window).width()
          scrollDistance = winWidth / 1.2
          currentScroll = parseInt(officePhotoScroller.css('marginLeft').replace(/px/, ''))
          
          maximumPosition = (winWidth / 2) * -1
          minimumPosition = winWidth - officePhotoScroller.width()

          if direction == "right"
            if (currentScroll + scrollDistance) > maximumPosition
              officePhotoScroller.animate(
                'marginLeft': maximumPosition + "px",
                loadImages
              )
            else 
              officePhotoScroller.animate(
                'marginLeft': (currentScroll + scrollDistance) + "px", 
                loadImages
              )


            return
          
          if direction == "left"
            # animate to the right, we can increase the background position till
            # the last photo is visible. Calculating the max vx is done by 
            # taking into account.
            if (currentScroll - scrollDistance) <  minimumPosition
              officePhotoScroller.animate(
                'marginLeft': minimumPosition + "px",
                loadImages
              )
            else 
              officePhotoScroller.animate(
                'marginLeft': (currentScroll - scrollDistance) + "px",
                loadImages
              )
      )

      scrollHandlers.push (scrollY, winHeight, winWidth)->
        if loadedOfficePics then return

        if (scrollY + winHeight) > officePhotos.offset().top
          loadedOfficePics = true

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
          $(this).addClass('open')
          vard.slideUp()
        else
          $(this).removeClass('open');
          vard.slideDown()

      google.maps.event.addDomListener(window, 'load', ()->
        maps.each (i, elem)->

          options =
            center: new google.maps.LatLng($(elem).data('center-lat'), $(elem).data('center-lng')),
            zoom: 15,
            disableDefaultUI: true,
            scrollwheel: false,
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
    # 
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
 
    #
    # On the about page, animate in stuff
    #
    product = $("#product")

    if product.length > 0
      right = $(".product_3", product)
      left = $(".product_1", product)

      scrollHandlers.push animationForProduct = (scrollY, winHeight, winWidth)->
        # So product animation is 3 screens. Center one says fixed, the outside
        # two come in. The animation goes from off the screen to under the 
        # center in the process of scrolling from the top, till the bottom of
        # the section is visible
        bottomIsVisibleAt = product.offset().top + product.outerHeight();
        currentBottom = winHeight + scrollY

        # maxDiff
        targetScroll = (bottomIsVisibleAt + 100) - winHeight

        r = scrollY / targetScroll

        if r > 1
          r = 1

        left.css 'marginLeft', -500 - ((1 - r) * (winWidth + left.outerWidth()))
        right.css 'marginLeft', 100 + ((1 - r) * (winWidth + right.outerWidth()))


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

        paths[i] = new $.path.bezier(params)

      scrollHandlers.push animationForDesign = (scrollY, winHeight, winWidth)->
        # animate the design thinking banner. Each element comes in on a 
        # different path and the distance along that path is determined by the
        # ratio of the users scrolling (much like the other pages)
        targetTop = designs.offset().top

        if targetTop > winHeight 
          ignoredScroll = Math.abs(targetTop - winHeight)
          targetScroll = targetTop - ignoredScroll

          p = (scrollY - ignoredScroll) / targetScroll;
          if p > 1 then p = 1;

        else 
          p = 1

        

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

      # hide the current testimonial animation.
      hideCurrentTestimonial = (back)->
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
          marginTop: '-300px',
          opacity: 0
        }, 600, 'easeInOutBack')

        txt.css(
         width: txtWidth,
         position: 'absolute',
         left: posLeft
        )

        takeOffToLeft = $(window).width();
        takeOffToLeft = -1 * $(window).width() unless back

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
            'marginTop': '-300px',
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
                # animate the container to the height of
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
      $(".close", people).click (e)->
        e.preventDefault();

        # determine what group to hide
        container = $(this).parents('.people_popup')

        # hide nav
        $(".popup_nav", container).fadeOut()

        # hide any open ones
        container.animate(
          top: '-1500px',
          ()->
            container
              .find('.reveal_content').removeClass('.reveal_content').hide()

        )

      $(".face", people).click (e)->
        e.preventDefault()

        # close any of the existing ones
        $(".people_content .close:visible").trigger('click');

        # determine what group we want to trigger
        container = $(this).parents(".people_group")
        peopleNav = container.find('.popup_nav')

        # fade in the correct staff member from the top of the page
        details = $($(this).find('a').attr('href')).show()

        # animate it down
        $(".people_popup", container).animate(
          top: 0,
          ()->
            # load the background image 
            if details.data('background')
              details.css('background-image', 'url('+details.data('background') + ")")

            # bring in content
            details.addClass('reveal_content')

            # show navigation
            peopleNav.find('a').css(
              top: details.height() / 2
            )

            # update the thumbnails in the people nav
            peopleNav.fadeIn()
        )

      #
      # Navigating between the staff members while the popup is open
      #
      $(".popup_nav a").click (e)->
        e.preventDefault()
        container = $(this).parents('people_group')
        takeNext = true unless $(this).hasClass('prev')
        current = $(".reveal_content", container)

        if not takeNext
          next = current.prev('.person_detail')

          if next.length < 1
            next = $(".person_detail").last()
        else
          next = current.next('.person_detail')

          if next.length < 1
            next = $(".person_detail").first()


        current.removeClass('reveal_content')

        setTimeout( ()->
          next.show()

          # load the background image 
          if next.data('background')
              next.css('background-image', 'url('+next.data('background') + ")")

          next.addClass('reveal_content')
          current.hide()
        , 300)


    # 
    # Load parallax backgrounded sections. For other parallax uses (like quotes)
    # use the parallax_background
    #
    $('.parallax_section').parallax(
      scroll_factor: 0.5
    )

    #
    # Parallax backgrounds
    #
    parallaxBackgrounds = $(".parallax_background")

    if parallaxBackgrounds.length > 0
       scrollHandlers.push parallaxBackground = (scrollY, winHeight, winWidth)->
        parallaxBackgrounds.each (i, elem)->
          pos = "0% " + (scrollY * 0.5) + "px"

          $(elem).css('background-position', pos)

    #
    # Count up statistics. Stats that count up when they start to be visible
    #
    count = $(".count_up")

    if count.length > 0
      animationLength = 2000;

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
            delay = Math.random() * 400
            speed = Math.random() * 80

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

          if percentage >= 0.8
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
            if top < -120 then top = -120

            # rotate from 0, -50 over the percentage 0.8 - 1.3
            rotate = parseInt(((percentage - 0.75) * 10) * -10)
            if rotate < -50 then rotate = -50

            # left can go over the page as much as want
            left = parseInt(50 - ((percentage - 0.8) * winWidth))

            if top < 10
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
    # Now we can actually do something useful.
    # 
    renderFrame = (onLoad)->
      winHeight = $(window).height();
      winWidth = $(window).width();
      scrollY = $(window).scrollTop();

      $.each scrollHandlers, (i, callback)->
        if scrollY < 0
          scrollY = 0

        callback(scrollY, winHeight, winWidth)
    

    # 
    # On scroll, rerender the frame
    #
    $(window).scroll ()->
      renderFrame(false)


    # render the initial frame
    renderFrame(true)

    useWink = onHomePage

    # trigger the removal of the loading page
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

    # 
    $("#pow").addClass('show');