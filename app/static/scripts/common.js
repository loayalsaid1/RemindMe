/**
 * Get the access_token_cookie for JWT
 */
function getCookie(name) {
	let value = '; ' + document.cookie;
	let parts = value.split('; ' + name + '=');
	if (parts.length === 2) return parts.pop().split(';').shift();
}


/**
 * blur main section except for the froms
 */
function blurMain() {
	$('main > *')
	  .not('.add_image_reminder')
	  .not('.add_text_reminder')
	  .css('filter', 'blur(5px)');
}

$(document).ready(function () {
	$('main').on('click', '.show_reminder', function (event) {
		event.stopPropagation();
		const reminderID = $(this).closest('article').data('reminder-id');

		window.location.href = `/reminders/${reminderID}`;
	})
})

clear
