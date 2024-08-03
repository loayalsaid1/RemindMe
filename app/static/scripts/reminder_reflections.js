
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

/**
 * removeEditForm - remove edit form either after successful request or cencel action
 * 
 * takes <reflection> as argument representing the reflection article tag
 */
function removeEditForm (reflection) {
	reflection.find('.edit_reflection_form').fadeOut(100);
	reflection.find('.reflection_text').fadeIn(100);
	reflection.find('.edit_icon').fadeIn(100);
	
	reflection.find('.edit_reflection_form').remove();
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
	
		$(this).hide();

		const reflection = $(this).closest('article').find('.reflection_text');

		const inputField = `
		<form class="edit_reflection_form">
			<textarea class="edit_reflection_input" name="edit_input" maxlength="1024" >${reflection.text().trim()}</textarea>
			<button class="cancel" type="button">Cancel</button>
			<button type="submit">Done!</button>
		</form>
		`

		reflection.hide(100);
		reflection.parent().append(inputField);
	})

	/**
	 * Remove the edit form when clicking cancel button
	 */
	$('.reflections').on('click', '.edit_reflection_form .cancel', function (event) {
		const reflection = $(this).parent().parent();

		$(reflection).find('.edit_reflection_form').fadeOut(100);
		$(reflection).find('.reflection_text').fadeIn(100);
		$(reflection).find('.edit_icon').fadeIn(100);
		
		$(reflection).find('.edit_reflection_form').remove();
	})

	/**
	 * Send a request to edit a reflection if chnaged
	 */
	$('.reflections').on('submit', '.edit_reflection_form', function (event) {
		event.preventDefault();

		const reflection = $(this).closest('article');
		const form = $(this);

		if (reflection.find('.reflection_text').text() ===
		form.find('.edit_reflection_input').val()) {
			form.find('.cancel').click()
			return;
		}

		const url = apiDomain + `/api/v1/reflections/${reflection.data('reflection-id')}`;
		const token = getCookie('access_token_cookie');

		const content = $(this).find('.edit_reflection_input').val();
		
		$.ajax({
			method: 'PUT',
			url: url,

			headers:{
				'Authorization':`Bearer ${token}`,
			},
			
			contentType: 'application/json',
			
			data: JSON.stringify({'content': content}),

			success: function (data) {
				reflection.find('.reflection_text').text(data.content);
				
				removeEditForm(reflection);
			},
			error (error) {
				if (error.status === 401) {
					window.location.href = `/login?next=${window.location.pathname}`;
				} else {
					alert('Failed to edit the reflection now. Sorry for that!');

				}
			}
		});	
	})
})
