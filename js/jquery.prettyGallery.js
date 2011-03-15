/* ------------------------------------------------------------------------
	Class: prettyGallery
	Use: Gallery plugin for jQuery
	Author: Stephane Caron (http://www.no-margin-for-errors.com)
	Version: 1.1.1
------------------------------------------------------------------------- */

jQuery.fn.prettyGallery = function(settings) {
	settings = jQuery.extend({
		itemsPerPage : 2,
		animationSpeed : 'normal', /* fast/normal/slow */
		navigation : 'top',  /* top/bottom/both */
		of_label: ' of ', /* The content in the page "1 of 2" */
		previous_title_label: 'Previous page', /* The title of the previous link */
		next_title_label: 'Next page', /* The title of the next link */
		previous_label: 'Previous', /* The content of the previous link */
		next_label: 'Next' /* The content of the next link */
	}, settings);
	return this.each(function(){
		// Global variables needed in multiple functions.	
		var currentPage = 1,
			itemWidth = 0,
			itemMargin = 0,
			itemHeight = 0,
			galleryWidth = 0,
			pageCount = 0,
			animated = false,
			$gallery = $(this);
		
		var prettyGalleryPrevious = function(caller) {
			// Make sure not to double animate, and not animate of the button is disabled
			if(animated || $(caller).hasClass('disabled')) return;
			animated = true;

			$gallery.find('li:lt('+(currentPage * settings.itemsPerPage)+')').each(function(i){
				$(this).animate({'left': parseFloat($(this).css('left')) + (galleryWidth + itemMargin) }, settings.animationSpeed, function(){
					animated = false;
				});
			});

			$gallery.find('li:gt('+ ((currentPage * settings.itemsPerPage) - 1) +')').each(function(i){
				$(this).animate({'left': parseFloat($(this).css('left')) + (galleryWidth + itemMargin) }, settings.animationSpeed);
			});

			currentPage--;

			_displayPaging();
		};

		var prettyGalleryNext = function(caller) {
			// Make sure not to double animate, and not animate of the button is disabled
			if(animated || $(caller).hasClass('disabled')) return;
			animated = true;

			$gallery.find('li:lt('+(currentPage * settings.itemsPerPage)+')').each(function(i){
				$(this).animate({'left': parseFloat($(this).css('left')) - (galleryWidth + itemMargin) }, settings.animationSpeed, function(){
					animated = false;
				});
			});

			$gallery.find('li:gt('+ ((currentPage * settings.itemsPerPage) - 1) +')').each(function(i){
				$(this).animate({'left': parseFloat($(this).css('left')) - (galleryWidth + itemMargin) }, settings.animationSpeed);
			});

			currentPage++;

			_displayPaging();
		};

		var _formatGallery = function() {
			itemWidth = $gallery.find('li:first').css('position','absolute').width();
			
			itemMargin += ($gallery.find('li:first').css('margin-right') == 'auto') ? 0 : parseFloat($gallery.find('li:first').css('margin-right'));
			itemMargin += ($gallery.find('li:first').css('margin-left') == 'auto') ? 0 : parseFloat($gallery.find('li:first').css('margin-left'));
			itemMargin += ($gallery.find('li:first').css('padding-right') == 'auto') ? 0 : parseFloat($gallery.find('li:first').css('padding-right'));
			itemMargin += ($gallery.find('li:first').css('padding-left') == 'auto') ? 0 : parseFloat($gallery.find('li:first').css('padding-left'));

			var itemSpacingTopBottom = 0;
				itemSpacingTopBottom += ($gallery.find('li:first').css('margin-top') == 'auto') ? 0 : parseFloat($gallery.find('li:first').css('margin-top'));
				itemSpacingTopBottom += ($gallery.find('li:first').css('margin-bottom') == 'auto') ? 0 : parseFloat($gallery.find('li:first').css('margin-bottom'));
				itemSpacingTopBottom += ($gallery.find('li:first').css('padding-top') == 'auto') ? 0 : parseFloat($gallery.find('li:first').css('padding-top'));
				itemSpacingTopBottom += ($gallery.find('li:first').css('padding-bottom') == 'auto') ? 0 : parseFloat($gallery.find('li:first').css('padding-bottom'));

			var itemHeight = $gallery.find('li:first').height() + itemSpacingTopBottom;
			var marginRight = ($gallery.find('li:first').css('margin-right') == 'auto') ? 0 : parseFloat($gallery.find('li:first').css('margin-right'));
			galleryWidth = (itemWidth + itemMargin) * settings.itemsPerPage - marginRight; // We don't want the margin of the last item, that's why we remove it.

			$gallery.css({
				'width': galleryWidth,
				'height': itemHeight,
				'overflow': 'hidden',
				'position': 'relative',
				'clear': 'left'
			});
			$gallery.find('li').each(function(i){
				$(this).css({
					'position':'absolute',
					'top':0,
					'left':i * (itemWidth + itemMargin)
				});
			});

			$gallery.wrap('<div class="prettyGalleryContainer"></div>');
		};

		var _displayPaging = function() {
			$cg = $gallery.parents('div.prettyGalleryContainer:first'); // The containing gallery

			$cg.find('ul.pg_paging span.current').text(currentPage);
			$cg.find('ul.pg_paging span.total').text(pageCount);

			// Make sur all the links are enabled
			$cg.find('ul.pg_paging li a').removeClass('disabled');

			// Display the proper nav
			if(currentPage == 1){
				// Hide the previous button
				$cg.find('ul.pg_paging li.pg_previous a').addClass('disabled');
			} else if(currentPage == pageCount) {
				// Hide the next button
				$cg.find('ul.pg_paging li.pg_next a').addClass('disabled');
			};
		};

		var _applyNav = function() {
			var template = '';
				template +='<ul class="pg_paging">';
				template += '<li class="pg_previous"><a href="#" title="'+settings.previous_title_label+'">'+settings.previous_label+'</a></li>';
				template += '<li><span class="current">1</span>'+settings.of_label+'<span class="total">1</span></li>';
				template += '<li class="pg_next"><a href="#" title="'+settings.next_title_label+'">'+settings.next_label+'</a></li>';
				template += '</ul>';

			switch(settings.navigation){
				case 'top':
					$gallery.before(template);
					break;
				case 'bottom':
					$gallery.after(template);
					break;
				case 'both':
					$gallery.before(template);
					$gallery.after(template);
					break;
			};

			// Adjust the nav to the gallery width
			var $theNav = $gallery.parent('div.prettyGalleryContainer:first').find('ul.pg_paging');
			galleryBorderWidth = parseFloat($theNav.css('border-left-width')) + parseFloat($theNav.css('border-right-width'));
			$theNav.width(galleryWidth - galleryBorderWidth);
			$theNav.each(function(){
				$(this).find('li:eq(1)').width(galleryWidth - galleryBorderWidth - parseFloat($(this).parent().find('ul.prettyNavigation li:first').width()) - parseFloat($(this).parent().find('ul.prettyNavigation li:last').width()));
			});

			// Apply the functions to the buttons
			$theNav.find('li.pg_previous a').click(function(){
				prettyGalleryPrevious(this);
				return false;
			});

			$theNav.find('li.pg_next a').click(function(){
				prettyGalleryNext(this);
				return false;
			});
		};
		
		// Check if we need the gallery
		if($(this).find('li').size() > settings.itemsPerPage) {		
			// Set the number of pages
			pageCount = Math.ceil($(this).find('li').size() / settings.itemsPerPage);
			
			// Format the gallery properly
			_formatGallery();
			
			// Build and display the nav
			_applyNav();
			
			// Display the proper paging
			_displayPaging(this);
			currentPage = 1;
		};
	});
};