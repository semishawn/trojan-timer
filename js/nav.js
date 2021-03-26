// Show or hide menus based on pseudo-radio button system
$('input[name="menu"]').click(function() {
	var input = $(this);
	var menuId = input.attr('id').replace('menu-', '');

	// If menu HAS been opened recently
	if (input.data('waschecked') == true) {
		input.prop('checked', false);
		input.data('waschecked', false);
		$('.menu').removeClass('menu-show');
	}
	// If menu HASN'T been opened recently
	else {
		input.data('waschecked', true);
		$('.menu').removeClass('menu-show');
		$('.' + menuId + '-menu').addClass('menu-show');
	}

	// Reset opened/closed history
	input.siblings('input[name="menu"]').data('waschecked', false);
});



// Close menu if click on timer
$(document).click(function(e) {
	if ($(e.target).closest('.timer-container').length) {
		$('input[name="menu"]').prop('checked', false);
		$('input[name="menu"]').data('waschecked', false);
		$('.menu').removeClass('menu-show');
	}
});



/**
 * If schedule is changed.
 * Relies on session storage as apposed to local storage, because session storage
 * clears on session close (closing the browser).
 * Schedule changes are usually only for one day, and because most students will
 * close their browser at the end of each school day, the schedule will then be appropriately
 * set back to normal for the new school day without having to manually changing it back.
 */
$('input[name="schedule"').change(function() {
	var scheduleId = $(this).attr('id');
	sessionStorage.setItem('schedule', scheduleId);
	$('.period').attr('class', 'period yet-to-start');
	initialize();
	tiktok();
});



// If theme is changed
$('input[name="theme"]').change(function() {
	var theme = $(this).attr('id').replace('-theme', '');
	localStorage.setItem('theme', theme);
	initialize();
	tiktok();
});



// Assign divider types to their respective arrays
var colons = [':', ':', ':', ''];
var letters = ['d ', 'h ', 'm ', 's'];

// If unit divider is changed
$('input[name="unit-divider"').change(function() {
	var dividerType = $(this).attr('id').replace('-divider', '');
	localStorage.setItem('dividerType', dividerType);
	initialize();
	tiktok();
});



// If tab context is changed
$('input[name="tab"]').change(function() {
	var tabContext = $(this).attr('id').replace('-tab', '');
	localStorage.setItem('tabContext', tabContext);
	initialize();
	tiktok();
});