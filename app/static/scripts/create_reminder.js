function getTokenFromCookie() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; access_token_cookie=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Retrieves token from cookie
const token = getTokenFromCookie();

if (token) {
  const apiUrl = 'http://localhost:5001/api/v1/reminders';
  const data = {
    description: 'This is the RemindMe app',
    public: true,
    text: 'The new reminder for Loay',
    is_text: true,
  };

  // Sends POST request using fetch() asynchronously
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((result) => {
      console.log('Success:', result);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
} else {
  console.error('No token found');
}
