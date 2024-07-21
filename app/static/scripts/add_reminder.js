$(document).ready(function() {
	/**
	 * blur main section except for the froms
	 */
	function blur_main() {
		$('main > *').not('.add_image_reminder').not('.add_text_reminder').css('filter', 'blur(2px)');
	}


	/**
	 * position add reminder windows
	 */
	function positionAddReminderWindows() {
		const scrollY = $("main").scrollTop();
		const mainHeight = $("main").height();
		const mainWidth = $("main").width();
  
		$(".add_reminder_window").css({
		  top: `${scrollY + mainHeight / 2}px`,
		  left: `${mainWidth / 2}px`,
		});
	}


	/**
	 * Get the access_token_cookie for JWT
	 */
	function getCookie(name) {
		let value = "; " + document.cookie;
		let parts = value.split("; " + name + "=");
		if (parts.length === 2) return parts.pop().split(";").shift();
	}


	/**
	 * Mkae  a text reminder out of api response of newliy created reminder
	 * 
	 */
	function makeTextReminder(data) {
		const text = data.text;
		const caption = data.caption;
		const public = data.public;
		const userId = data.user_id;
		const isText = data.is_text;
		const id = data.id;
		const imgURL = data.imge_url;

		const reminder = `
		<article data-reminder-id="${id}" data-type="${isText ? 'text' : 'image'}"  data-visibility="${public ? 'public' : 'private'}">
			<div class="shown">
				${public
					? ''
					: '<span class="material-symbols-outlined lock_icon">visibility_lock</span>'}
				${isText
					? `<p>${text}</p>`
					: `<img class="reminder_image" src="${imgURL}" alt="">`}
			</div>
			<div class="hidden">
				<p class="caption">${caption}</p>
				<span class="material-symbols-outlined hidden_icons menu_icon">
					menu
				</span>
				<ul class="reminder_options">
					<li class="edit_reminder">
						<span class="material-symbols-outlined">
							edit
						</span>
					</li>
					<li class="toggle_visibility">
						<span class="material-symbols-outlined">
							${public ? 'visibility' : 'visibility_lock'}
						</span>
					</li>
					<li class="delete_reminder">
						<span class="material-symbols-outlined">
							delete
						</span>
					</li>
				</ul>
				<span class="material-symbols-outlined hidden_icons magnify_icon">
					zoom_in
				</span>
				<button class="show_reminder" type="button">Show reflections</button>
			</div>
		</article>
		`

		return reminder;
	}
	/**
	 * Showing the add text reminder form whwen chlicking the button
	 * and the buttons to choose
	 */
	$('.add_text_reminder_button').off('click').click(function(event) {
		event.stopPropagation();
		positionAddReminderWindows()
		$('.add_image_reminder').fadeOut(100);
		$('.add_text_reminder').fadeIn(300);
		blur_main();
	})


	/**
	 * Showing the add image reminder form whwen chlicking the button
	 * and the buttons to choose
	 */
	$('.add_image_reminder_button').off('click').click(function(event) {
		event.stopPropagation();
		positionAddReminderWindows()
		$('.add_text_reminder').fadeOut(100);
		$('.add_image_reminder').fadeIn(300);
		blur_main();
	})

	/************************/

	/**
		* Hide the form & unblur the main
		*
		*
		* when clicking the cancel icon
		*/
	$('.cancel_icon').off('click').click(function(event) {
		event.stopPropagation();
		$(this).parent().fadeOut(300);
		$('main > *').css('filter', 'none');
	})



	/*******************/

	/** Handle the forms */

	$('.text_reminder_form').off('submit').submit(function(event) {
		event.preventDefault();

		const form = new FormData(this);

		const data = {
			isText: true,
			public: form.get('reminder_visibility') === 'public',
			text: form.get('reminder_text'),
			caption: form.get('caption')
		}

		const token = getCookie('access_token_cookie');
		const endpointURL = 'http://localhost:5001/api/v1/reminders';

		$.ajax({
			url: endpointURL,
			method: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			headers: {
				'Authorization': `Bearer ${token}`
			},
			success: function (data) {
				console.log(data);
				const reminder = makeTextReminder(data);
				$('main').prepend(reminder);

				$('.add_text_reminder').fadeOut(100);
				$('main > *').css('filter', 'none');
			},
			error: function (error) {
				if (error.status === 401) {
					window.location.href = '/login';
				}
				
				console.log(error);
				alert('Failed to add reminder');
			}
		})
	});
})
