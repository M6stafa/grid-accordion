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
		var ga_object_width = ga_object.width();
		var ga_object_height = rows * settings.margin * 2;
		var topOffset = settings.margin + ga_object.offset().top;
		var leftOffset = settings.margin + ga_object.offset().left;
		ga_object.attr('ga-current-mouseover-index', 0);

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

		ga_object.find('.ga-description').css('color', settings.briefFontColor); // TODO: add specified variable
		ga_object.find('.ga-description').css('background-color', settings.briefBGColor); // TODO: add specified variable

		var firstRowImgsWidth = 0; // resize all images depend on this

		ga_object.find(".ga-item").each(function(index) {
			// Set index on divs to easily access them in later
			$(this).attr('ga-index', index + 1);
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
			ga_object_height += divHeight;

			// set top
			$('[ga-row="' + row + '"]').css('top', top + 'px');

			// set the top position of brief
			var brief_obj = $('[ga-row="' + row + '"]').find('.ga-brief');
			brief_obj.css('top', divHeight - brief_obj.height() - briefOffset + 'px');

			top += divHeight + (2 * settings.margin);
		});

		// Set main div width and height for keep its space
		ga_object.css({
			width: ga_object_width + 'px',
			height: ga_object_height + 'px'
		});


		// Animates
		ga_object.find('.ga-item').mouseover(function(event) {
			var current_mouseover_index = ga_object.attr('ga-current-mouseover-index');
			if ($(this).attr('ga-index') != current_mouseover_index)
			{
				current_mouseover_index = $(this).attr('ga-index');
				ga_object.attr('ga-current-mouseover-index', current_mouseover_index);

				var effectedRow = $(this).attr('ga-row');
				var effectedCol = $(this).attr('ga-col');

				var top = topOffset;
				var left = leftOffset;

				var divsHeight	= [];
				var divsWidth	= [];
				var divsTop		= [];
				var divsLeft	= [];

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

					// brief_obj.css('left', briefOffset + 'px');

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

					var description_height = 0;
					var description_obj = $(this).find('.ga-description');
					if (description_obj.length > 0)
					{
						description_obj.clearQueue();
						description_obj.stop();

						if (col + 1 == effectedCol && row + 1 == effectedRow)
						{
							description_height = description_obj.height();
							description_obj.slideDown(settings.speed);
						}
						else {
							description_obj.slideUp(settings.speed);
						}	
					}

					var brief_obj = $(this).find('.ga-brief');
					if (brief_obj.length > 0)
					{
						// Animate of briefs
						var briefTop = parseInt(divsHeight[row]) - brief_obj.height() - description_height - briefOffset + 'px';

						brief_obj.clearQueue();
						brief_obj.stop();

						brief_obj.animate({
							top: briefTop
						}, settings.speed);
					}
				});
			}
		});

		return ga_object;
	}

}(jQuery));