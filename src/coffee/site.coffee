do ($ = jQuery, window) ->  
  $(document).ready ->  
    sections = $ ".section"
    content = $ "#content"
    nav = $ "#nav"
    header = $ "#header"
    page = $ "html"
    officePhotos = $ "#office_photos"
    isLocalScrolling = false
    fadeIn = $ ".fade-in"
    # --------------------------------------------------------------------------

    # 
    # Helper function for getting the background color of the header for the
    # current window scroll. By default, no background color is needed, but by
    # the time we hit the first text (~180px) we need to have it up.
    #
    getHeaderBackground = ()->
      scroll = $(window).scrollTop()

      if scroll >= 140 
        return 'rgba(0, 0, 0, 0.2)'
      else if scroll < 1 
        return 'rgba(0, 0, 0, 0)'
      else
        op = (scroll/140) / 5; 

        return 'rgba(0, 0, 0, '+ op + ')'


    # 
    # Once the user has started to scroll down the page, or, if they have jumped
    # to a particular point in the page, fade in the header bar.
    #
    $(window).scroll ()->
      current = header.css('background')
      latest = getHeaderBackground()

      if current != latest
        header.css(
          background: latest
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
