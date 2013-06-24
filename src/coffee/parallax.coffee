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
		parallaxableIntro = $ ".parallax_intro"

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

			# parallax backgrounds. As soon as these elements come into account 
			# on the page (i.e are shown, increase the height by the amount they 
			# scroll up to the given maximum (destheight).
			parallaxableHeight.each (i, elem)->
				# destheight is the target height when the element hits the top
				destHeight = $(elem).data('parallax-destheight') || winHeight

				# if destHeight is a percentage, convert to a px size
				if destHeight.substr(-1) == "%"
					destHeight = (parseInt(destHeight.replace(/%/, '')) / 100) * winHeight

				# speed 
				speed = $(elem).data('parallax-speed') || 0.3

				top = $(elem).position().top
				scrolled = $(window).scrollTop()
				amountScrolledToView = top - winHeight;
				viewable = top < (scrolled + winHeight)
				past = (top + $(elem).height()) < scrolled
				backgroundMove = false

				startScrollingAt = (top - winHeight)

				if startScrollingAt < 0 then startScrollingAt = 0

				if viewable and not past
					difference = scrolled - startScrollingAt

					# if the parallax is the top of the page then the difference
					if top < 1 then difference = destHeight

					# change is the px between the height and the dest height
					imageChange = (difference - destHeight) / 2;

					if difference > destHeight 
						difference = destHeight

					$(elem).css(
						height: Math.ceil(difference)
					).find('.parallax-background').css(
						top: imageChange
					)

			# parallaxable intro sections, these are designed to not have a lot
			# of content so can experience the full parallax effect.
			parallaxableIntro.each (i, elem)->
				# calculate the new height the for scrolled amount. The last
				# scrolled amount is stored as a data value. 
				lastScrolled = $(elem).data 'last_scrolled'
				if not lastScrolled then lastScrolled = 0

				$(elem).data 'last_scrolled', scrolledY

				scrollDifference = lastScrolled - scrolledY
				currentHeight = parseInt($(elem).css('height').replace(/%/, ''))
				pixelToPercentRatio = currentHeight / $(elem).height()

				latestHeight = currentHeight + (scrollDifference * pixelToPercentRatio)


				$(elem).siblings("section").first().css(
					'paddingTop': latestHeight
				)

		$(".parallax-background").css(
			height: $(window).height(),
			width: $(window).width
		)

		$(window).resize ()->
			$(".parallax-background").css(
				height: $(window).height(),
				width: $(window).width
			)

		$(window).scroll ()->
			if scrollTimeout?
				clearTimeout(scrollTimeout)

				scrollTimeout = null
			
			# scrollTimeout = setTimeout(scrollHandler, 1);
			scrollHandler();

		scrollHandler()