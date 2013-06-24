do ($ = jQuery, window) -> 
	#
	# Parallax elements in the DOM.
	#
	# Main Loop for the users scrolling. Elements which have the parallax 
	# behaviour attached are moved with the page. Each parallax item can use 
	# HTML5 data attributes to configure their individual behavior while 
	# scrolling:
	#
	# - parallax-offset-y: used to define the y position of the element.
	# - parallax-speed: speed of the parallax as a ratio of the user scroll
	# - parallax-stop-y: 
	# - parallax-max-y: absolute max y coord
	# - parallax-reverse-speed: 
	#
	$(document).ready ->
		# standard DOM node that parallaxs on a separate layer
		parallaxableElements = $ "[data-parallax-speed]"
		parallaxableHeight = $ ".parallax-height"
		parallax = $ ".parallax"
		body = $ "body"
		currentParallax = parallax.first().addClass('current_parallax_frame')

		scrollHandler = () ->
			scrolledY = $(window).scrollTop()
			winHeight = $(window).height();

			# parallax DOM elements
			parallaxableElements.each (i, elem)->
				offset = $(elem).data('parallax-offset-y')
				speed = $(elem).data('parallax-speed')
				stop = $(elem).data('parallax-stop-y')
				maxY = $(elem).data('parallax-max-y')
				debug = $(elem).data('debug')
				minY = $(elem).data('parallax-min-y')
				reverseScale = $(elem).data('parallax-reverse-speed')

				if stop && stop <= (scrolledY - 1)
					if not reverseScale? 
						reverseScale = 1

					$(elem).addClass 'stopped'

					top = maxY - (Math.abs(stop - scrolledY) * reverseScale)
				else
					$(elem).removeClass 'stopped'

					if offset
						top = (offset - (scrolledY * speed)) 
					else
					  top = -(scrolledY * speed)

				if debug?
					console.log 'minY ' + minY
					console.log 'top '+ top
					console.log stop
					console.log scrolledY
					console.log maxY
					console.log 'speed reverse: '+ reverseScale
				
				if minY && top < minY
					top = minY


				$(elem).css({
					'top': top
				}).trigger('parallaxed', [{
					'top': top,
					'scrolledY': scrolledY
				}])

			if currentParallax
				elem = currentParallax.get(0)

				if scrolled < 0 then scrolled = 0

				lastScrolled = $(elem).data 'last_scrolled'
				if not lastScrolled then lastScrolled = 0

				$(elem).data 'last_scrolled', scrolledY

				scrollDifference = lastScrolled - scrolledY

				# percent to start with
				actualHeight = $(elem).height()
				latestHeight = actualHeight + scrollDifference 

				$(elem).css('height', latestHeight)
					.find('.wrapper').css('height', latestHeight)	


		# fix body scrolling
		winHeight = $(window).height()
		body.css('height', body.height());

		parallax.each (i, elem)->
			wrapper = $(elem).find('.wrapper')

			if $(elem).outerHeight() > winHeight
				$(elem).css(
					'height': $(elem).height(),
					'position': 'fixed'
					'z-index': parallax.length - i
				)

				wrapper.css('height', wrapper.height())

			else 
				$(elem).css(
					'height': winHeight - 30,
					'position': 'fixed'
					'z-index': parallax.length - i
				)

		$(window).scroll ()->
			if scrollTimeout?
				clearTimeout(scrollTimeout)

				scrollTimeout = null
			
			# scrollTimeout = setTimeout(scrollHandler, 1);
			scrollHandler();

		scrollHandler()