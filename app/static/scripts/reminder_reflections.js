
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
	return reflection;
}

$(document).ready(function () {
	/**
	 * Add a reflection from the text bar in reminder.html
	 * 
	 * What is this comment here?
	 * Am I ok?
	 * any way... If anyone is reading this right now.. 
	 * Thanks for taking a look at my code..
	 * I hope you the best..
	 * Have a great life. And lavarage all challneges you face.
	 * 🙂
	 * and remember.. God is the best planners. It happened for you...
	 * 	It's for your best. You have to see where is the exercise here.
	 */
	$('.add_reflection').submit(function (event) {
		event.preventDefault();
		event.stopPropagation();


		//  get data
		const reminderID = $('main').data('reminder-id');
		const url = `${apiDomain}/api/v1/reminders/${reminderID}/reflections`;
		const token = getCookie('access_token_cookie');

		const form = new FormData(this);
		const content = form.get('reflection_text');	
		// call api with token
		$.ajax({
			url: url,
			method: 'POST',
			contentType: 'application/json',
			headers: {
				'Authorization': `Bearer ${token}`,
			},
			data: JSON.stringify({content: content}),
			success: function (data) {
				const reflection = makeReflectionElement(data);
				console.log(data);
				$('.reflections').prepend(reflection);
				$('.add_reflection').trigger('reset');
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

	/**
	 * delete a reflection
	 */
	$('main').on('click', '.reflection .delete_icon', function (event) {
		event.stopPropagation();

		const reflectionID = $(this).closest('article').data('reflection-id');
		const token = getCookie('access_token_cookie');
		const url = `${apiDomain}/api/v1/reflections/${reflectionID}`;

		if (confirm('You are deleting your reflection now!, confirm?') === false) {
			return;
		}

		$.ajax({
			url: url,
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`
			},
			success: function () {
				$(`article[data-reflection-id=${reflectionID}]`).remove()
			},
			error: function (error) {
				if (error.status === 401) {
					// TODO: Get user back here agian.. Search when network is back
					window.location.href = '/login';
				} else {
					console.error(error);
					alert('Failed to delete the reflection now. Sorry for that!');
				}
			}
		})
	})


	/**
	 * Make user info ontop of the reminder body a link to the
	 * reminder owner
	 */
	$('.reminder .head').not('.date').click(function (event) {
		event.stopPropagation();

		const username = $(this).find('username').text().substr(1);

		window.location.href = `/profile/${username}`;
	})

	
	/**
	 * make the userinfo ontop of reflections point to reflection writer
	 */
	$('.reflections').on('click', '.reflection_head > img, .reflection_head .user_name', function (event) {
		const username = $(this).parent().find('.username').text().substr(1);

		window.location.href = `/profile/${username}`;
	})

	
	/**
	 * When click on edit icon for a reflection, Change it into a text area to edit it
	 */
	$('.reflections').on('click', '.edit_icon', function (event) {
		event.stopPropagation();
		console.log(33);
		
		const reflection = $(this).closest('article').find('.reflection_text');

		const inputField = $('<textarea>', {'class': 'edit_reflection_input'});
		$(inputField).val(reflection.text().trim());

		reflection.hide(100);
		reflection.parent().append(inputField);
	})
})
