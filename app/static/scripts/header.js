$(document).ready(function() {
	const searchBar = $('.search_bar');
	const searchIcon = $('.search_icon');
	const searchInput = $('.search_input');

	searchIcon.on('click', function() {
		searchBar.toggleClass('expanded');
		searchInput.focus(); // Automatically focus on the input when expanded
	});

	$(document).on('click', function(event) {
		if (!searchBar.is(event.target) && searchBar.has(event.target).length === 0) {
			searchBar.removeClass('expanded'); // Close search bar when clicking outside
		}
	});

	$('.search_bar input').keypress(function (event) {
		if (event.keyCode == 13) {
			event.preventDefault();

			const username = $(this).val();
			const url = `${apiDomain}/api/v1/check_user/${username}`;

			$.ajax({
				url: url,
				method: 'GET',
				success: function () {
					window.location.href = `/profile/${username}`;
				},
				error: function (error) {
					const response = JSON.parse(error.responseText);
					if (response.exists === false) {
						alert(`No user wiht username ${username}.`);
					} else {
						alert('Sorry for that, this service is not available for now');
					}
				}
			})
		}
	});
});
