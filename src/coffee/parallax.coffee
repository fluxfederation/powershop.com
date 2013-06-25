do ($ = jQuery, window) -> 
	$(document).ready ->
		# standard DOM node that parallaxs on a separate layer
		parallaxableElements = $ "[data-parallax-speed]"
		parallaxableHeight = $ ".parallax-height"
		parallax = $ ".parallax"
		body = $ "body"
		currentParallax = parallax.first().addClass('current_parallax_frame')

		#
		# Basic way to parallax elements in the DOM.
		#
		# Has a main loop for the users scroll. Elements which have the parallax
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
		scrollHandler = () ->
			scrolledY = $(window).scrollTop

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

		#
		# Powershop Storyboard
		#
		# Each section on the page is a fixed element the the following script
		# flicks through each of the sections. If the content within the the
		# section is taller than the window then the script will move the
		# content by a given speed and leave the height done
		#

		# Lock the body height, since we're converting everything to fixed we
		# need to leave the scrollbar in tack
		winHeight = $(window).height()
		body.css('height', body.height());

		# set a default size and shape on each of the parallax sections on the
		# story board. Each story board is the height of the browser window.
		#
		# We have an internal parallax layer object which has the texture of the
		# parallax and the override.
		parallax.each (i, elem)->
			elemHeight = $(elem).height()

			if elemHeight < winHeight
				height = elemHeight

				# allow specific pages (i.e home) to specify the maximum gap
				# under the element. For instance we only want solid color.
				if gap = $(elem).data('parallax-maxgap')
					if elemHeight < (winHeight - gap)
						height = winHeight - gap
			else
				height = winHeight

			$(elem).css(
				'position': 'fixed',
				'height': height
				'z-index': parallax.length - i
			)


		# The content within the parallax may potentially be longer than the
		# browser, so to account for that, any scrolling first takes care of that
		# at a given speed. Once that has been expended, we go back to swiping
		# the height.
		#
		# The converse is when scrolling up, we translate the height to the full
		# browser size then target the margin of the wrapper inside the div.
		#
		# @param func callback
		scrollParallaxBackground = (callback)->
			scrolledY = $(window).scrollTop()
			winHeight = $(window).height();

			if currentParallax
				self = $(currentParallax.get(0))

				# disable inertia scrolling
				if scrolledY < 0 then scrolledY = 0

				# keep track of the value we last scrolled
				lastScrolled = parseInt(self.data 'last_scrolled')
				if not lastScrolled then lastScrolled = 0

				# sometimes we really want a gap
				gap = self.data('parallax-maxgap')
				if not gap then gap = 0

				# store our last scroll and calculate the distance traveled so
				# we can alter the frame as required
				self.data 'last_scrolled', scrolledY

				scrollDifference = lastScrolled - scrolledY

				layer = self.find('.parallax_layer')
				wrapper = self.find('.wrapper')

				actualHeight = self.height()
				latestHeight = actualHeight + scrollDifference

				# max height is window original_height
				if latestHeight > winHeight then latestHeight = winHeight - gap
				if latestHeight < 0 then latestHeight = 0

				# determine if we need to scroll the internal content or the
				# story board. If the content on the story board fits on a single
				# screen then we don't need to waste cycles.
				wrapperHeight = wrapper.outerHeight()
				scrollInternal = (wrapperHeight > winHeight)
				alterHeight = true

				if scrollInternal
					maxScrollInternal = wrapperHeight - winHeight

					# calculate the amount of current scroll and what we have to
					# change there. The scroll is represented in the CSS as a
					# negative value (-yd tends to 0) to replace scroll
					currentScroll = parseInt(wrapper.css('marginTop').replace(/px/, ''))
					if not currentScroll then currentScroll = 0

					# scroll difference comes from the users scroll, ratioise
					# this to have a gentle parallax. The value will be positive
					# if the user has scrolled down
					scrollInternalMargin = currentScroll + (scrollDifference * 0.4)

					# the previous check only checked to see if we may need to
					# scroll this internal wrapper, it didn't do any more complex
					# checks on the top of scroll.
					#
					# Things we need to check:
					#	- scroll must be
					#	- we can only scroll to the maximum scroll defined
					#	- we can only scroll
					#
					# If the current scroll is 0 and this will make the scroll
					# positive (e.g > 0) then we have hit the top of the story
					# frame and can revert back to height. (scrolling up)
					if currentScroll >= 0 and scrollInternalMargin >= 0
						alterHeight = true

						if currentScroll != 0
							wrapper.css(
								'marginTop': 0
							)

					# If the current scroll is at or greater than the maximum
					# and the scroll value would make this even greater
					# (remember margin will be a negative value) then we have
					# hit the end of the frame and can go back to height
					# (scrolling down)
					else if Math.abs(currentScroll) >= maxScrollInternal and scrollInternalMargin < 0
						alterHeight = true
						ensureNegative = Math.abs(maxScrollInternal) * -1

						if currentScroll != ensureNegative
							wrapper.css(
								'marginTop': ensureNegative
							)

					# if we're scrolling internally then we don't need to worry
					# about any of the following behaviour
					else
						alterHeight = false
						wrapper.css(
							'marginTop': scrollInternalMargin
						)

						return

				if alterHeight
					# redraw the height of the element *except* in the case that
					# it is the last parallax screen. On the last screen we
					# don't touch the height.
					if not self.is(".last")
						self.css('height', latestHeight)
						layer.css('height', latestHeight)

						# if we're altering the height, alter the top of the
						# following section. By default, we want to keep the
						# next section at the bottom to allow the background to
						# peak through
						self.next('.parallax').css(
							top: latestHeight
						)

				# If the latest height of the current parallax is less than 0
				# then the user has moved onto the next story frame. So move the
				# internal references.
				#
				# Moving down the page
				movePrevious = false

				if latestHeight < 1
					next = currentParallax.next('.parallax')

					if next.length > 0
						currentParallax
							.addClass('past_parallax_frame')
							.removeClass('current_parallax_frame')

						currentParallax = next
						currentParallax
							.addClass('current_parallax_frame')
							.removeClass('past_parallax_frame')
							.data('last_scrolled', scrolledY)

						next = currentParallax.next('.parallax')
						next.css(
							top: currentParallax.height()
						)

				else if currentParallax.data('parallax-maxgap')
					if latestHeight >= (winHeight - currentParallax.data('parallax-maxgap'))
						movePrevious = true

				else if latestHeight >= winHeight
					# if the window is back to the original height then perhaps
					# we need to start parallaxing the previous element then.
					#
					#
					# Moving up the page
					movePrevious = true

				if movePrevious
					prev = currentParallax.prev(".parallax")

					if prev.length > 0
						currentParallax
							.removeClass('current_parallax_frame')
							.removeClass('past_parallax_frame') # just in case
						currentParallax = prev
							.addClass('current_parallax_frame')
							.removeClass('past_parallax_frame')

			if callback?
				callback()

		# remove the loading screen
		scrollHandler()
		scrollParallaxBackground(()->
			$("#loading").fadeOut(()->
				$(this).remove()

				$(window).scroll ()->
					if scrollTimeout?
						clearTimeout(scrollTimeout)

						scrollTimeout = null

					# scrollTimeout = setTimeout(scrollHandler, 1);
					scrollHandler()
					scrollParallaxBackground()
			)
		)