/**
 * To Get the access_token_cookie for JWT
 */
function getCookie(name) {
	let value = "; " + document.cookie;
	let parts = value.split("; " + name + "=");
	if (parts.length === 2) return parts.pop().split(";").shift();
}


$(document).ready(function () {
	/***** Different remidner intactions ...... Edit, delete, toggle visibility to public */

	/**Delete a reminder */
	$('main').on('click', '.delete_reminder', function (event) {
		event.stopPropagation();
		const reminder = $(this).closest('article');
		const id = reminder.data('reminder-id');
		const token = getCookie('access_token_cookie');
		const url = `http://localhost:5001/api/v1/reminders/${id}`;

		
		if (confirm('You are deleting one of your reminders now!') === false) {
			return;
		}

		$.ajax({
			type: 'DELETE',
			url: url,
			headers: {
				'Authorization': `Bearer ${token}`
			},
			success: function () {
				reminder.remove();
			},
			error: function (error) {
				if (error.status === 401) {
					window.location.href = '/login';
				} else {
					alert('Failed to delete reminder, sorry for that!');
				}
			}
		});
	})

})
