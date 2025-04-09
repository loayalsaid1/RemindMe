$(document).ready(function() {
	const aside = $('aside');

	$('aside .toggle_icon').on('click', function() {
		aside.toggleClass('open');
	})

});
