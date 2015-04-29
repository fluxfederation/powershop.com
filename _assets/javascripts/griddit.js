(function($) {
jQuery.fn.griddit = function(options){
	/*
	Purpose: uses Canvas to draw a reference grid over the page, toggled with the ESC key
	usage: $(this).griddit({options});
	*/
	
	// defaults ===========================
	var defaults = {  
		width: 1100,
		height: Math.max($(window).height(), $('html').height()),
		cols: 12,
		gutterwidth: 20,
		colColour: "rgba(255,0,0,0.2)",
		vertical: 20
	};
	var options = $.extend(defaults, options);
	
	var left		= ($(window).width() / 2) - (defaults.width / 2);
	var html 		= '<canvas id="grid-cols" width="' + defaults.width + '" height="' + defaults.height + '" style="position: absolute; top: 0; left: ' + left + 'px"></canvas>';
	$('body').append(html);
	var canvas 		= document.getElementById("grid-cols");
	var ctx 		= canvas.getContext("2d");
	
	// vertical grid columns ===========================
	var colour;
	var col_w		= ( defaults.width - ((defaults.cols - 1) * defaults.gutterwidth) ) / defaults.cols;
	/*
	if( window.console && console.log ) console.log("GRIDDIT column width is " + col_w + "px with a gutterwidth of " + defaults.gutterwidth);
	if( (col_w % 1) == 0) {
		for (var i = 0; i < defaults.cols; i++) {
			colour 							= defaults.colColour;
			if(colour == 'random') colour 	= 'rgba(' + RandRange(0, 255) + ',' + RandRange(0, 255) + ',' + RandRange(0, 255) + ',' + '0.2)';
			ctx.fillStyle 					= colour;
			ctx.fillRect (i * (col_w + defaults.gutterwidth), 0, col_w, defaults.height);
		};
	}
	*/
	// horizontal grid lines ===========================
	ctx.strokeStyle 	= colour;
	ctx.lineWidth 		= 1;
	ctx.beginPath();
	ctx.beginPath();
	for (var i = 0; i < (defaults.height / defaults.vertical); i++) {
		var y = (i * defaults.vertical) + 0.5;
		ctx.moveTo(0, y);
		ctx.lineTo(defaults.width, y);
	};
	ctx.stroke();
	
	$(canvas).hide();
	
	// The code below shouldnt be on production
	// If you need to see the grid uncomment it
	// $('html').keyup(function(event) {
	// 	if(event.keyCode == 27){
	// 		if( $(canvas).is(':visible') ){
	// 			$(canvas).hide();
	// 		}else{
	// 			$(canvas).show();
	// 		}
	// 	}
	// });
	
}
})(jQuery);
 