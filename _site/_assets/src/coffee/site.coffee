do ($ = jQuery, window) ->  
  $(document).ready ->  
    sections = $ ".section"
    content = $ "#content"
    nav = $ "#nav"
    header = $ "#header"
    page = $ "html"
    officePhotos = $ "#office_photos"
    isLocalScrolling = false
    onHomePage = $(".home").length > 0
    # fade in elements as the user goes down the page
    fadeIn = $ ".fade-in"

    fadeIn.css(
      opacity: 0
    )

    # 
    # Helper function for getting the background color of the header for the
    # current window scroll. By default, no background color is needed, but by
    # the time we hit the first text (~180px) we need to have it up.
    #
    getHeaderBackground = ()->
      scroll = $(window).scrollTop()

      # the homepage starts on white, so don't fade background in till they go
      # past the second section. One thing we do need to do on the homepage is
      # if scroll > 0.
      if onHomePage
        if scroll > 0 
          $(".logo em").fadeOut()
        else
          $(".logo em").fadeIn()

        if scroll >= ($("#make_things").position().top)
          return 'rgba(0, 0, 0, 0.2)';
        else
          # still on the white. the bar should be solid 
          endWelcome = $("#welcome").offset().top + $("#welcome").height()

          return 'rgba(0, 0, 0, 0)';
      else
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
    $(window).scroll ()->
      scroll = $(window).scrollTop()

      current = header.css('background')
      latest = getHeaderBackground()

      if current != latest
        header.css(
          background: latest
        ) 

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

      # lock scrolling the page. Scrolling is now for inside the navigation
      # rather than the whole body
      page.css
        overflow: 'hidden'

      header.css(
        background: 'rgba(0, 0, 0, 0.8)',
        height: '100%'
      )

      $(this).fadeOut(()->
        $(".close_nav").fadeIn()
      )
        

    # 
    # Clicking the close navigation button should undo changes performed to the
    # page when opening the navigation
    #
    $(".close_nav").click (e)->
      e.preventDefault()
      
      page.css({
       'overflow-y': 'scroll'
      })
      
      header.css(
        background: getHeaderBackground()
        height: '50px'
      )

      $(this).fadeOut()
      $(".show_nav").fadeIn()


    
    #
    # Office images shouldn't load on the page till the users scroll to the 
    # section
    #
    if officePhotos.length > 0
      loadImages = ()->
        $("[data-image]", officePhotos).each (i, elem)->
            if $(elem).data('img-loaded') == true
              return

            # if the image is to the left or the right, don't both loading
            if $(elem).is(":right-of-screen") or $(elem).is(":left-of-screen")
              return

            $(elem).data('img-loaded', true)

            path = $(elem).data('image')
            img = $("<img />").attr('src', path).hide().on 'dragstart', (event) ->
              event.preventDefault()

            setTimeout(()->
              $(elem).append(img).imagesLoaded().always (instance)->
                $(elem).animate(
                  opacity: 1
                )

                img.fadeIn()

                $(elem).parents("li").animate(
                  opacity: 1
                )

              , Math.random() * 80
            )

      loadedOfficePics = false

      #
      # Swiping the office images allows the user to manipulate the office 
      # photos. The user can swipe till there are no more photos to unvisible
      # on the page.
      #
      officePhotoScroller = $ "ul", officePhotos

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
                'marginLeft': maximumPosition + "px"
              )
            else 
              officePhotoScroller.animate(
                'marginLeft': (currentScroll + scrollDistance) + "px"
              )

            loadImages()

            return
          
          if direction == "left"
            # animate to the right, we can increase the background position till
            # the last photo is visible. Calculating the max vx is done by 
            # taking into account.
            if (currentScroll - scrollDistance) <  minimumPosition
              officePhotoScroller.animate(
                'marginLeft': minimumPosition + "px"
              )
            else 
              officePhotoScroller.animate(
                'marginLeft': (currentScroll - scrollDistance) + "px"
              )

            loadImages()
      )

      $(window).scroll ()->
        if loadedOfficePics then return

        if ($(window).scrollTop() + $(window).height()) > officePhotos.offset().top
          loadedOfficePics = true

          loadImages()

    #
    # On the homepage we have a google map for the office location.
    #
    if $("#map").length > 0
      google.maps.event.addDomListener(window, 'load', ()->
        options =
          center: new google.maps.LatLng(-41.287997, 174.781469),
          zoom: 16,
          disableDefaultUI: true,
          draggable: false, 
          panControl: false, 
          scaleControl: false,
          scrollwheel: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: window.map_styles

        map = new google.maps.Map( $("#map").get(0), options)

        image = 
          url: '/_assets/img/face.png',
          size: new google.maps.Size(62, 62),
          origin: new google.maps.Point(0,0)
          anchor: new google.maps.Point(31, 31)

        marker = new google.maps.Marker(
          position: new google.maps.LatLng(-41.287622, 174.776166),
          map: map,
          icon: image,
          animation: google.maps.Animation.DROP,
        )
      )
