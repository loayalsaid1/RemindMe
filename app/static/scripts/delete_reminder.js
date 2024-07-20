function getTokenFromCookie() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; access_token_cookie=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// token retrieval
const token = getTokenFromCookie();

if (token) {
  const reminderId = '99e456dd-96b4-414f-b056-11a396f0b134';
  const apiUrl = `http://localhost:5001/api/v1/reminders/${reminderId}`;

  fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((result) => {
      console.log('Reminder deleted successfully:', result);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
} else {
  console.error('No token found');
}
