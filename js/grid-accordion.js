/*!Grid Accordion*/
/**
 *
 * Version: 0.0.2
 * Requires: jQuery v1.9+
 *
 * Copyright (c) 2015 Mostafa Najafi (m6stafa.com)
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 */
(function($) {

	$.fn.GridAccordion = function( options ) {

		// Establish our default settings
		var settings = $.extend({
			cols:	2,
			speed: 600,
			margin: 2,

			baseWindowSize: 1400, // your settings are equal to their value if window's width equal to this value

			baseFontSize: 14,

			briefOffset: 2,
			briefFontColor: "rgba(0, 0, 0, 1.0)",
			briefBGColor: "rgba(127, 127, 127, 0.8)", // background-color

		}, options);

		var ga_object = this;
		var rows = Math.floor(ga_object.find('.ga-item').size() / settings.cols);
		var totalWidth = ga_object.width() - (settings.cols * settings.margin * 2); // The total width that we have
		var totalHeight = -1 * (rows * settings.margin * 2);
		var topOffset = settings.margin + ga_object.offset().top;
		var leftOffset = settings.margin + ga_object.offset().left;

		// Scale the settings
		var settingsScale = totalWidth / settings.baseWindowSize;
		var baseFontSize = (settings.baseFontSize * settingsScale).toFixed(3);
		var briefOffset = (settings.briefOffset * settingsScale).toFixed(3);

		ga_object.css('font-size', baseFontSize + 'px');

		// brief settings
		ga_object.find('.ga-brief').css('color', settings.briefFontColor);
		ga_object.find('.ga-brief').css('background-color', settings.briefBGColor);

		// description settings
		$(this).find('.ga-description').css('display', 'none');

		var firstRowImgsWidth = 0; // resize all images depend on this

		ga_object.find(".ga-item").each(function(index) {
			// Set index on divs to easily access them in later
			row = Math.floor(index / settings.cols) + 1;
			col = (index % settings.cols) + 1;
			$(this).attr('ga-row', row);
			$(this).attr('ga-col', col);

			// Add settings.margin
			$(this).css('settings.margin', settings.margin + 'px');

			// calculate firstRowImgsWidth
			if (row == 1) { 
				firstRowImgsWidth += $(this).find('img').width();
			}
		});

		// Scale images' and divs' size & position that must be
		var smallScale = 0.8;// 0.625;
		var divsScale	= totalWidth / firstRowImgsWidth;
		var imgaesScale	= divsScale * (1 / smallScale);
		var top = topOffset;
		var left = leftOffset;

		ga_object.find('[ga-row="1"]').each(function(index) {
			// Set width
			var imgObj = $(this).find('img');
			var divWidth = imgObj.width() * divsScale;
			var imgWidth = imgObj.width() * imgaesScale;
			var col = $(this).attr('ga-col');
			$('[ga-col="' + col + '"]').width(divWidth);
			$('[ga-col="' + col + '"]').attr('ga-base-width', divWidth);
			$('[ga-col="' + col + '"]').attr('ga-larg-width', imgWidth);
			$('[ga-col="' + col + '"]').find('img').width(imgWidth);

			// set left
			$('[ga-col="' + col + '"]').css('left', left + 'px');

			// set the left position of brief
			var brief_obj = $('[ga-col="' + col + '"]').find('.ga-brief');
			brief_obj.css('left', briefOffset + 'px');

			left += divWidth + (2 * settings.margin);
		});
		ga_object.find('[ga-col="1"]').each(function(index) {
			// Set height
			var imgObj = $(this).find('img');
			var divHeight = imgObj.height() * divsScale;
			var imgHeight = imgObj.height() * imgaesScale;
			var row = $(this).attr('ga-row');
			$('[ga-row="' + row + '"]').height(divHeight);
			$('[ga-row="' + row + '"]').attr('ga-base-height', divHeight);
			$('[ga-row="' + row + '"]').attr('ga-larg-height', imgHeight);
			$('[ga-row="' + row + '"]').find('img').height(imgHeight);

			// Calculate totalHeight
			totalHeight += divHeight;

			// set top
			$('[ga-row="' + row + '"]').css('top', top + 'px');

			// set the top position of brief
			var brief_obj = $('[ga-row="' + row + '"]').find('.ga-brief');
			console.log(brief_obj.height());
			brief_obj.css('top', divHeight - brief_obj.height() - briefOffset + 'px');

			top += divHeight + (2 * settings.margin);
		});


		// Animates
		ga_object.find('.ga-item').mouseover(function(event) {
			var effectedRow = $(this).attr('ga-row');
			var effectedCol = $(this).attr('ga-col');
			var top = topOffset;
			var left = leftOffset;

			var divsHeight	= [];
			var divsWidth	= [];
			var divsTop		= [];
			var divsLeft	= [];

			var briefsTop	= []; // save by item index
			var briefsLeft	= []; // save by item index
			var descriptionTop	= 0; // only opened div has it
			var descriptionLeft	= 0; // only opened div has it

			var largWidth	= parseInt($(this).attr('ga-larg-width'));
			var largHeight	= parseInt($(this).attr('ga-larg-height'));

			var divsWidthScale	= (totalWidth - largWidth) / (totalWidth - parseInt($(this).attr('ga-base-width')));
			var divsHeightScale	= (totalHeight - largHeight) / (totalHeight - parseInt($(this).attr('ga-base-height')));

			ga_object.find('[ga-row="1"]').each(function(index) {
				// Set width
				var col = $(this).attr('ga-col');
				var divWidth = 0;

				if (col == effectedCol) {
					divWidth = largWidth;
				}
				else {
					var baseWidth = parseInt($(this).attr('ga-base-width'));
					divWidth = baseWidth * divsWidthScale;
				}

				divsWidth[index] = divWidth;
				divsLeft[index] = left;

				// Set Left
				left += divWidth + (2 * settings.margin);
			});

			ga_object.find('[ga-col="1"]').each(function(index) {
				// Set Height
				var row = $(this).attr('ga-row');
				var divHeight = 0;

				if (row == effectedRow) {
					divHeight = largHeight;
				}
				else {
					var baseHeight = parseInt($(this).attr('ga-base-height'));
					divHeight = baseHeight * divsHeightScale;
				}

				divsHeight[index] = divHeight;
				divsTop[index] = top;

				// Set top
				top += divHeight + (2 * settings.margin);
			});

			ga_object.find('.ga-item').each(function(index) {
				var col = $(this).attr('ga-col') - 1;
				var row = $(this).attr('ga-row') - 1;

				$(this).clearQueue();
				$(this).stop();

				$(this).animate({
					width:	divsWidth[col],
					height:	divsHeight[row],
					left:	divsLeft[col],
					top:	divsTop[row]
				}, settings.speed);

				var brief_obj = $(this).find('.ga-brief');
				if (brief_obj != null)
				{
					brief_obj.clearQueue();
					brief_obj.stop();

					brief_obj.animate({
						top: briefsTop[index],
						left: briefsLeft[index]
					}, settings.speed);
				}
			});
		});

		return ga_object;
	}

}(jQuery));