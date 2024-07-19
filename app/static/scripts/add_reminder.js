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


})
