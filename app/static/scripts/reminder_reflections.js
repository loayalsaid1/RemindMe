/**
 * Get the access_token_cookie for JWT
 */
function getCookie(name) {
	let value = '; ' + document.cookie;
	let parts = value.split('; ' + name + '=');
	if (parts.length === 2) return parts.pop().split(';').shift();
}

function makeReflectionElement(data) {
	const reflection = `
	<article data-user-id="${data.user_id}" data-reflection-id="${data.id}" class="reflection">
			<div class="options">
				<span class="material-symbols-outlined delete_icon">
					delete
				</span>
				<span class="material-symbols-outlined edit_icon">
					edit
				</span>
			</div>
			<div class="reflection_head">
				<img src="${data.user_img_url}" alt="">
				<div class="reflection_user_data">
					<div class="user_name">
						<p class="name">${data.user_full_name}</p>
						<p class="username">@${data.username}</p>
					</div>
					<p class="date">${data.updated_at}</p>
				</div>
			</div>
			<p class="reflection_text">
				${data.content}
			</p>
		</article>
	`
}

$(document).ready(function () {
	$('.add_reflection').submit(function (event) {
		event.preventDefault();
		event.stopPropagation();


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
