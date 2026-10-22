$(document).ready(function() {
	const searchBar = $('.search_bar');
	const searchIcon = $('.search_icon');
	const searchInput = $('.search_input');
	
	// Search bar functionality
	searchIcon.on('click', function() {
		searchBar.toggleClass('expanded');
		searchBar.attr('aria-expanded', searchBar.hasClass('expanded'));
		if (searchBar.hasClass('expanded')) {
			searchInput.focus(); // Automatically focus on the input when expanded
		}
	});

	// Keyboard accessibility for search icon
	searchIcon.on('keypress', function(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			$(this).click();
		}
	});

	$(document).on('click', function(event) {
		if (!searchBar.is(event.target) && searchBar.has(event.target).length === 0) {
			searchBar.removeClass('expanded'); // Close search bar when clicking outside
			searchBar.attr('aria-expanded', 'false');
		}
	});

	$('.search_bar input').keypress(function (event) {
		if (event.keyCode == 13) {
			event.preventDefault();

			const username = $(this).val().trim();
			if (!username) return;
			
			const url = `${apiDomain}/api/v1/check_user/${username}`;
			
			// Show loading indicator
			const loadingIndicator = $('<span class="search_loading"></span>');
			searchBar.append(loadingIndicator);

			$.ajax({
				url: url,
				method: 'GET',
				success: function () {
					window.location.href = `/profile/${username}`;
				},
				error: function (error) {
					const response = JSON.parse(error.responseText);
					if (response.exists === false) {
						alert(`No user with username ${username}.`);
					} else {
						alert('Sorry for that, this service is not available for now');
					}
				},
				complete: function() {
					// Remove loading indicator
					loadingIndicator.remove();
				}
			});
		}
	});
});
