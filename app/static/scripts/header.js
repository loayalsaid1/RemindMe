$(document).ready(function() {
	$('.search-bar input').keypress(function (event) {
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
	})
})
