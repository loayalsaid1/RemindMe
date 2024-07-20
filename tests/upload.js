const form = document.querySelector('form');
const imageInput = document.getElementById('imageInput');
const uploadButton = document.getElementById('uploadButton');

uploadButton.addEventListener('click', async (event) => {
  event.preventDefault();

  if (imageInput.files.length === 0) {
    console.error('No image file selected.');
    return;
  }

  const formData = new FormData();
  formData.append('image', imageInput.files[0]);

  const token = 'YOUR_JWT_TOKEN_HERE';

  try {
    const response = await fetch('/upload_image', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const imageUrl = data.imageUrl;
      console.log('Image uploaded successfully:', imageUrl);
    } else {
      const error = await response.text();
      console.error('Image upload failed:', error);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
});
