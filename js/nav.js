// Show or hide menus based on pseudo-radio button system
$('input[name="menu"]').click(function() {
	var menuId = $(this).attr('id').replace('menu-', '');
	$('.menu').removeClass('menu-show');

	if ($(this).attr('is-checked') == 'yes') {
		$(this).attr('is-checked', 'no');
		$(this).prop('checked', false);
	} else {
		$('input[name="menu"]').attr('is-checked', 'no');
		$(this).attr('is-checked', 'yes');
		$('.' + menuId + '-menu').addClass('menu-show');
	}
});



// Nav-based initializations that only need to be run once
$(document).ready(function() {
	// Set today's week day and date
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var otherNow = new Date();
	var day = days[otherNow.getDay()];
	var month = months[otherNow.getMonth()];
	$('.today-date').html(`${day}, ${month} ${otherNow.getDate()}, ${otherNow.getFullYear()}`);

	// Calculate end time of each extra timer in seconds
	$('.extra-timer').each(function(i) {
		var endTime = extraTimers[i];
		var endEpoch = parseInt(endTime.getTime().toString().slice(0, -3));
		$(this).attr('end', endEpoch);
	});
});



// Close menu if click on timer
$(document).click(function(e) {
	if ($(e.target).closest('.timer-container').length) {
		$('input[name="menu"]').attr('is-checked', 'no');
		$('input[name="menu"]').prop('checked', false);
		$('.menu').removeClass('menu-show');
	}
});



/**
 * If schedule is changed.
 * Relies on session storage as apposed to local storage, because session storage
 * clears on session close (closing the browser).
 * Schedule changes are usually only for one day, and because most students will
 * close their browser at the end of each school day, the schedule will then be appropriately
 * set back to normal for the new school day without having to manually change it back.
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