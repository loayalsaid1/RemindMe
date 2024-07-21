if (token) {
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
