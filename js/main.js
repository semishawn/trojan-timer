// Function to pad front of number set with zeros
pad = (num) => ('0' + parseInt(num)).substr(-2);



// Function to run on page load and on style changes
// ONLY actions that need to be initialized or user-changed, not every action for page load
function initialize() {
	// Set schedule
	if (sessionStorage.getItem('schedule') === null) schedule = scheduleA;
	else {
		schedule = window[sessionStorage.getItem('schedule')];
		$('#' + sessionStorage.getItem('schedule')).prop('checked', true);
	}

	// Set theme
	if (localStorage.getItem('theme') !== null) {
		$('body').attr('id', localStorage.getItem('theme'));
		$(`input[id="theme-${localStorage.getItem('theme')}"]`).prop('checked', 'true');
	}

	// Set divider
	if (localStorage.getItem('dividerType') === null) divider = colons;
	else {
		divider = window[localStorage.getItem('dividerType')];
		$(`#divider-${localStorage.getItem('dividerType')}`).prop('checked', true);
		if (divider == words) $('.timer-container').css('font-size', '2vw');
		else $('.timer-container').css('font-size', 'var(--timer-font-size)');
	}

	// Set tab context
	if (localStorage.getItem('tabContext') === null) tabContext = 'context';
	else {
		tabContext = localStorage.getItem('tabContext');
		$(`#tab-${localStorage.getItem('tabContext')}`).prop('checked', true);
	}

	$('.period').each(function(i) {
		// Calculate start time of each period in seconds (based on schedule)
		var startTime = schedule[i].start.split(':');
		var startHour = startTime[0];
		var startMin = startTime[1];
		var startEpoch = new Date;
			startEpoch.setHours(startHour, startMin, 0);
		var startEpoch = parseInt(startEpoch.getTime().toString().slice(0, -3));
		$(this).attr('start', startEpoch);
	
		// Calculate end time of each period in seconds (based on schedule)
		var endTime = schedule[i].end.split(':');
		var endHour = endTime[0];
		var endMin = endTime[1];
		var endEpoch = new Date;
			endEpoch.setHours(endHour, endMin, 0);
		var endEpoch = parseInt(endEpoch.getTime().toString().slice(0, -3));
		$(this).attr('end', endEpoch);
	});

	var firstPeriodEndMM = schedule[0].end.split(':')[1];
	var secondPeriodStartMM = schedule[1].start.split(':')[1];
	betweenM = secondPeriodStartMM - firstPeriodEndMM;
}
initialize();



/**
 * Known as the "engine".
 * Runs every millisecond (actually about every 4 milliseconds because of browser limitations).
 * Triggers tiktok function on every ACCURATE second change.
 * The idea is to maintain accuracy to the millisecond without actually running tiktok function
 * every millisecond.
 */
setInterval(function() {
	/**
	 * Get current time in milliseconds, convert to seconds, then add one second due to epoch delay.
	 * The method used below proved fastest and most accurate compared to
	 * other millisecond-to-second conversions that I've tested.
	 */
	now = Math.round(Date.now() / 1000) + 1;

	//* Edit current time programmatically (DEV PURPOSES ONLY)
	if (typeof customNowDifference !== 'undefined') now += customNowDifference;

	// Check if last millisecond time has been established or if it caused a second increase
	// If yes, run tiktok function
	if (typeof oldNow == 'undefined' || now > oldNow) tiktok();

	// Rewrite "last" current time as new current time
	oldNow = now;
}, 1);



// Function that handles all period-based calculations
function tiktok() {
	$('.period').each(function(i) {
		// Calculate difference in time from now until start of period
		var start = $(this).attr('start');
		var startRemain = start - now;
		var startHH = pad((startRemain / 60 / 60) % 60);
		var startMM = pad((startRemain / 60) % 60);
		var startSS = pad(startRemain % 60);
		var untilStart = startHH + divider[1] + startMM + divider[2] + startSS + divider[3];
		$(this).find('.period-until-start').html(untilStart);

		// Start of school timer
		if (i == 0) $('.school-until-start').html(untilStart);

		// Calculate between timer for each period
		var startM = startMM.substring(1);
		var betweenStart = startM + divider[2] + startSS + divider[3];
		$(this).prev().find('.between-timer').html(betweenStart);

		// Calculate difference in time from now until end of period
		var end = $(this).attr('end');
		var endRemain = end - now;
		var endHH = pad((endRemain / 60 / 60) % 24);
		var endMM = pad((endRemain / 60) % 60);
		var endSS = pad(endRemain % 60);
		var untilEnd = endHH + divider[1] + endMM + divider[2] + endSS + divider[3];
		$(this).find('.period-until-end').html(untilEnd);

		// If no periods have started (aka school hasn't started)
		if (i == 0 && now < start && now < end) $('.school-start').addClass('current');

		// If period ends
		if (now > start && now > end && !$(this).is('.ended')) {
			$('*').removeClass('current');
			$(this).attr('class', 'period ended');
			$(this).next().addClass('current');
		}

		// If period starts
		if (now > start && now < end && !$(this).is('.started')) {
			$('*').removeClass('current');
			$(this).attr('class', 'period started current');
		}
	});

	// Change page title to whatever is going on
	var current = $('.current').attr('class').split(' ')[0];
	switch (current) {
		case 'school-start':
			if (tabContext == 'context') tabTitle = $('.school-start').text();
			else tabTitle = $('.school-until-start').html();
			break;
		case 'period':
			var untilPeriodEnd = $('.current').find('.period-until-end').html();
			if (tabContext == 'context') {
				var periodIndex = $('.timer-container').children('.period').index($('.current')) + 1;
				tabTitle = 'P' + periodIndex + ' ends in ' + untilPeriodEnd;
			} else tabTitle = untilPeriodEnd;
			break;
		case 'between':
			var untilNextPeriodStart = $('.current').find('.between-timer').html();
			if (tabContext == 'context') {
				var nextPeriod = $('.timer-container').children('.period').index($('.current').next()) + 1;
				tabTitle = untilNextPeriodStart + ' until P' + nextPeriod;
			} else tabTitle = untilNextPeriodStart;
			break;
		case 'school-end':
			tabTitle = $('.school-end').html();
			break;
	}
	$('title').html(tabTitle);

	$('.extra-timer').each(function() {
		// Calculate difference in time from now until end of timer
		var end = $(this).attr('end');
		var endRemain = end - now;
		var endD = Math.round(endRemain / 60 / 60 / 24);
		var endH = pad((endRemain / 60 / 60) % 24);
		var endM = pad((endRemain / 60) % 60);
		var endS = pad(endRemain % 60);
		var untilEnd = endD + divider[0] + endH + divider[1] + endM + divider[2] + endS + divider[3];
		$(this).find('.extra-timer-until-end').html(untilEnd);

		// If timer ends
		if (now > end) $(this).attr('class', 'extra-timer ended');
	});
}



//* Keyboard shortcuts (DEV PURPOSES ONLY)
$(document).keydown(function(e) {
	switch (e.which) {
		case 190:
			var customNowInput = prompt('Enter your desired time (24 hour):');
			if (customNowInput !== null) {
				var customNowTime = customNowInput.split(':');
				var customNowHour = customNowTime[0];
				var customNowMin = customNowTime[1];
				var customNow = new Date;
					customNow.setHours(customNowHour, customNowMin, 0);
					customNow = Math.round(customNow.getTime() / 1000) + 1;
					customNowDifference = customNow - now;
			}
			break;
		case 8:
			sessionStorage.clear();
			localStorage.clear();
			location.reload();
			break;
	}
});