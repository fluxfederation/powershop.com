do ($ = jQuery, window) -> 
	return

	# old code
	$(document).ready ->	
		# standard DOM node that parallaxs on a separate layer
		parallaxableElements = $ "[data-parallax-speed]"

		# full page frames
		parallax = $ ".parallax"
		body = $ "body"

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
			scrolledY = $(window).scrollTop()
			parallaxableElements.each (i, elem)->
				offset = $(elem).data('parallax-offset-y')
				speed = $(elem).data('parallax-speed')
				stop = $(elem).data('parallax-stop-y')
				maxY = $(elem).data('parallax-max-y')
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

		# set a default size and shape on each of the parallax sections on the
		# story board. Each story board is the height of the browser window.
		#
		# We have an internal parallax layer object which has the texture of the
		# parallax and the content layer.
		#
		# This helper sets up all the look ups so that the actual scroll handler
		# is much faster to process
		winScrollY = $(window).scrollTop()

		setupSceneForScroll = ()->
			body.css('height', body.outerHeight(true));

			# amount of scrolling to hit this given parallax at the bottom 
			# of the page. The amount of scrolling is the sum of all the 
			# scrolling done 
			givenScrollForParallax = 0

			# Each parallax will be the height of the window.
			winHeight = $(window).outerHeight()

			parallax.each( (i, elem)->
				self = $(elem)
				background = self.find('.parallax_background_layer')
				content = self.find('.parallax_content_layer')
				contentHeight = content.outerHeight()
				requiresInternalScroll = contentHeight > winHeight
				elemHeight = if (contentHeight > winHeight) then contentHeight else winHeight

				$(elem).css(
					'position': 'fixed',
					'height': elemHeight
					'top': givenScrollForParallax,
					'z-index': parallax.length - i
				)

				$(elem).data('scroll_for_parallax', givenScrollForParallax)

				# Mark the scroll position for the following parallax to come 
				# into play. 
				givenScrollForParallax += elemHeight
			)


		# Logic for drawing the scene for a given scroll value. We have to look
		# at the full window since scrolling next and previous is unreliable and
		# changes in speed scrolling can result in height changes.
		drawSceneForScroll = (scrollY, callback)->
			winHeight = $(window).height()

			# disable inertia scrolling
			if scrollY < 0 then scrollY = 0

			# will be positive when the user scrolled down the page. 
			# negative if the user has scrolled up.
			scrollDifference = scrollY - winScrollY


			parallax.each( (i, elem)->
				self = $(elem)
				minScroll = self.data('scroll_for_parallax')
				background = self.find('.parallax_background_layer')
				content = self.find('.parallax_content_layer')
				contentHeight = content.outerHeight();
				maxInternalScroll = 0
				
				if self.data('requires_internal_scroll')
					maxInternalScroll = contentHeight - winHeight

				# Handle rendering a single parallax frame onto the scene for
				# a given scroll value. Their are 5 positions that a parallax
				# may be in
				#
				# 	1 - off and above
				#		all we want is to ensure this is 0, 0 and hidden
				#	2 - sliding off the top
				#		then we just need to move the height by the scroll
				#	3 - full height
				#		at top 0, full height and we may need to scroll internally
				#	4 - sliding up off the bottom
				#		the previous slide height needs to change
				#	5 - completely off the radar
				#		not close to it yet.

				# The parallax changes 3 variables, height, position and margin
				# of the internal content. Height is used to story board the
				# content away or in, positioning is used to bring the next 
				# story up, or take it down and margin used to scroll content
				# inside the frame without affecting the height.
				if scrollY > (minScroll - winHeight)
					if scrollY > (minScroll + contentHeight)
						# 1, off the top
						heightForFrame = 0
						positionForFrame = 0
						marginTopForContent = (maxInternalScroll > 0) ? maxInternalScroll : 0
						debugFlag = 1
						self.addClass('past_frame').removeClass('future_frame current_frame')
					else 
						self.addClass('current_frame').removeClass('future_frame past_frame')

						if minScroll > scrollY
							# 4, We haven't quite scrolled enough to have the frame
							# fill the page, so we need to alter the height of the
							# element. Use the height of the previous frame to give
							# an indication on behaviour
							bottomOfBrowser = scrollY + winHeight
							heightForFrame = bottomOfBrowser - self.data('scroll_for_parallax')
							positionForFrame = winHeight - heightForFrame
							marginTopForContent = 0
							debugFlag = 4
						else
							positionForFrame = 0

							heightForFrame = winHeight - (scrollY - minScroll)
							marginTopForContent = 0
							debugFlag = 2
				else 
					# 5 scroll Y is less than the minimum to trigger our interests
					heightForFrame = winHeight
					positionForFrame = minScroll
					debugFlag = 5
					marginTopForContent = 0

					self.addClass('future_frame').removeClass('current_frame past_frame')
				
				# safety check
				if heightForFrame < 0
					heightForFrame = 0

				if positionForFrame < 0
					positionForFrame = 0

				self.attr('data-parallax-frame-debug', debugFlag)

				# some layers need to sit over the previous
				if self.data('parallax-offset-height')
					heightForFrame += self.data('parallax-offset-height')

				self.css(
					'height': heightForFrame
					'top': positionForFrame
				)

				background.css(
					'height': heightForFrame
				)

				content.css(
					'marginTop': marginTopForContent * -1
				)
		 	)

			# update the last scroll value
			winScrollY = scrollY;

			if callback?
				callback()

		# remove the loading screen
		# setupSceneForScroll()

		# draw the initial scene
		###
		drawSceneForScroll($(window).scrollTop(), ()->
			scrollHandler()

			$("#loading").fadeOut(()->
				$(window).scroll ()->
					scrollHandler()
					drawSceneForScroll($(window).scrollTop())
			)
		)
		###
		