/**
 * Get the access_token_cookie for JWT
 */
function getCookie(name) {
	let value = '; ' + document.cookie;
	let parts = value.split('; ' + name + '=');
	if (parts.length === 2) return parts.pop().split(';').shift();
}


$(document).ready(function () {
	$('.add_reflection').submit(function (event) {
		event.preventDefault();
		event.stopPropagation();
		/**
		 * get the data from the form.
		 * usubmit with token to api/v1/users/user_id/reflections
		 * 
		 * neded data is
		 * caption
		 * usr_id
		 * token
		 * 
		 * endpoint
		 * remnder_id
		 * content
		 */

		//  get data
		const reminderID = $('main').data('reminder-id');
		const url = `http://localhost:5001/api/v1/reminders/${reminderID}/reflections`;
		const token = getCookie('access_token_cookie');

		const form = new FormData(this);
		const content = form.get('reflection_text');	
		// call api with token
		$.ajax({
			url: url,
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
			},
			data: {'content': content},
			success: function (data) {
				const reflection = makeReflectionElement(data);
				$('.reflections').prepend(reminder);
				$(this).reset();
			},
			error: function (error) {
				if (error.status === 401) {
					// TODO: Get user back here agian.. Search when network is back
					window.location.href = '/login';
				} else {
					console.error(error);
					alert('Failed to upload your reflection now. Sorry for that!');
				}
			}
		})
	})
})
