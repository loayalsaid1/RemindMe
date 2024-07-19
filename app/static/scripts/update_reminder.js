function getTokenFromCookie() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; access_token_cookie=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Check the token retrieval
const token = getTokenFromCookie();

if (token) {
  const reminderId = '85c09277-14be-4421-8989-de3405681254';
  const apiUrl = `http://localhost:5001/api/v1/reminders/${reminderId}`;
  const data = {
    description: 'Updated description for the reminder',
    public: false,
    text: 'Updated text for the reminder',
    is_text: true,
  };

  fetch(apiUrl, {
    method: 'PUT',
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
