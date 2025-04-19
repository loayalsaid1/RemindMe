function loadFile(event) {
	const image = document.getElementsByClassName('profile_image')[0];
	const file = event.target.files[0];
	
	if (file) {
			// Check file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
					alert('File size too large. Please select an image under 5MB.');
					event.target.value = '';
					return;
			}
			
			// Preview image
			image.src = URL.createObjectURL(file);
			image.onload = () => {
					URL.revokeObjectURL(image.src); // free memory
			};
			
			// Add a nice effect when image is changed
			image.classList.add('image-changed');
			setTimeout(() => {
					image.classList.remove('image-changed');
			}, 700);
	}
}

// Add animation when page loads
document.addEventListener('DOMContentLoaded', function() {
	document.querySelector('main').classList.add('fade-in');
});
