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


		# fix body scrolling
		winHeight = $(window).height()
		body.css('height', body.height());

		parallax.each (i, elem)->
			wrapper = $(elem).find('.parallax_layer')
			wrapperLength = wrapper.height();

			outer = $(elem).outerHeight()
			height = $(elem).height()

			if wrapperLength > winHeight
				css  = 
					'height': wrapperLength,

				wrapper.css('height', wrapperLength)

			else 
				difference = (winHeight - outer)

				css =
					'height': winHeight - Math.min(difference, 120),


				# set the margin-top of the following one so we can see that at the
				# bottom of the page
				$(elem).next('.parallax').css(
					'top': (winHeight - Math.min(difference, 120))
				)

			css['position'] = 'fixed'
			css['z-index'] = parallax.length - i

			$(elem).css(css).data('original_height', height)


		scrollParallaxBackground = ()->
			scrolledY = $(window).scrollTop()
			winHeight = $(window).height();

			if currentParallax
				elem = currentParallax.get(0)

				lastScrolled = $(elem).data 'last_scrolled'
				if not lastScrolled then lastScrolled = $(elem).data 'scroll_offset'
				if not lastScrolled then lastScrolled = 0
				
				scrollOffset = $(elem).data 'scroll_offset'
				if not scrollOffset then scrollOffset = 0

				$(elem).data 'last_scrolled', scrolledY

				scrollDifference = lastScrolled - scrolledY

				# if the wrapper is currently off the page then lets start by
				# moving that before changing any heights here.
				parallaxed = $(elem).find('.parallax_layer')
				scrollLayer = $(elem).find('.wrapper')

				# inward scroll is 0 - yd, but stored in the DOM as a negative
				# margin
				currentInwardScroll = -1 * parseInt(scrollLayer.css('marginTop').replace(/px/, ''))
				
				scrollLength = scrollLayer.height()
				parallaxedHeight = parallaxed.height()

				inwardScroll = (scrollLayer.outerHeight() - currentInwardScroll)
				###
				if scrollLayer and scrollLength > parallaxedHeight
					# current layer has a scroll length that is longer than
					# the div. There are 3 cases for this:
					# - i the inner div if margin top doesn't equal the
					# distance between the heights an
					# - s
					if scrollDifference < 0
						# they have scrolled down the page, therefore increasing
						# our negative marginTop till we hit the difference.
						targetDifference = (scrollLength - parallaxedHeight);
						changeMargin = Math.min(targetDifference, scrollDifference)

						if(currentInwardScroll < targetDifference)
							changeScroll = currentInwardScroll - scrollDifference

							# prevent scrolling too far
							if changeScroll > targetDifference then changeScroll = targetDifference
							scrollLayer.css(
								marginTop: changeScroll * -1
							)

							return
					else
						# the user has scrolled up, we need to decrease the 
						# margintop till it hits 0. If it's 0 then we don't 
						# need to worry
						if currentInwardScroll > 0
							changeScroll = (currentInwardScroll - scrollDifference) 
							if(changeScroll < 0) then changeScroll = 0

							scrollLayer.css(
								marginTop: changeScroll * -1
							)

							return
				###

				actualHeight = $(elem).height()
				latestHeight = actualHeight + scrollDifference

				$(elem).css('height', latestHeight)
						.find('.parallax_layer').css('height', latestHeight)	

				# update the following parallax
				next = $(elem).next('.parallax')
				if next.length > 0 
					# calculate the top for the following
					next.css(
						'top': latestHeight
					)

				if(latestHeight < 1)
					# move the next current parallax to the following sibling
					# and add class for this to be hidden
					next = currentParallax.next('.parallax')

					if next.length > 0
						currentParallax
							.addClass('past_parallax_frame')
							.removeClass('current_parallax_frame')

						currentParallax = next
						currentParallax
							.addClass('current_parallax_frame')
							.data('scroll_offset', scrolledY)

				else if(latestHeight >= $(elem).data('original_height'))
					latestHeight = $(elem).data('original_height')

					# if the window is back to the original height then perhaps
					# we need to start parallaxing the previous element then.
					prev = currentParallax.prev(".parallax")

					if prev.length > 0
						currentParallax
							.removeClass('current_parallax_frame')

						currentParallax = prev
							.addClass('current_parallax_frame')

		# remove the loading screen
		$("#loading").fadeOut(()->
			$(this).remove()


			$(window).scroll ()->
				if scrollTimeout?
					clearTimeout(scrollTimeout)

					scrollTimeout = null
				
				# scrollTimeout = setTimeout(scrollHandler, 1);
				scrollHandler()
				scrollParallaxBackground()

			scrollHandler()
			scrollParallaxBackground()
		)