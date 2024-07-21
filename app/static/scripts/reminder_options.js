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


	/*** Toggle visibility */

	$('main').on('click', '.toggle_visibility', function (event) {
		/**
		 * get article to remove it,
		 * GEt the id of it to atalk tothe aip
		 * get hte token
		 * url
		 * token
		 * artickel
		 * data
		 * if text. is public
		 */

		event.stopPropagation();

		const reminder = $(this).closest('article');
		const id = reminder.data('reminder-id');
		const url = 'http://localhost:5001/api/v1/reminders/' + id;
		const token = getCookie('access_token_cookie');

		const visibility = reminder.data('visibility') === 'public' ? 'private' : 'public';
		console.log(visibility);
		$.ajax({
			url: url,
			method: 'PUT',
			contentType: 'application/json',
			headers: {
				'Authorization': `Bearer ${token}`
			},
			data: JSON.stringify({
				'public': visibility === 'public'
			}),
			success: function () {
				console.log('1')
				console.log(reminder.data('visibility'));
				reminder.data('visibility', visibility);
				console.log(visibility);
				if (visibility === "public") {
					console.log('1')
					reminder.find('.lock_icon').remove()
					console.log('2')

					reminder.find('.toggle_visibility span').text('visibility');
				} else {
					console.log('3')

					reminder.find('.shown').prepend(`<span class="material-symbols-outlined lock_icon">visibility_lock</span>`);
					reminder.find('.toggle_visibility span').text('visibility_lock');
				}
			},
			error: function (error) {
				console.log(error);
				// if (error.status === 401) {
				// 	// window.location.href = '/login';
				// } else {
				// 	alert('Failed to toggle visibility now, sorry for that!');
				// }
			}
		});
	});

	/***Abit trecky one!
	 * 
	 * use the add_reminder form to edit a reminder
	 * 
	 * let me see!
	 */
	
})
