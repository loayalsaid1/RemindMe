#!/usr/bin/python3
""""Test remindme application"""

import pytest
import requests

BASE_URL = 'http://0.0.0.0:5000/api/v1'


def get_headers(token=None):
    """Helper function to get headers with or without JWT token"""
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    return headers


def test_user_creation():
    """Test user creation"""
    url = f"{BASE_URL}/auth/register"
    user_data = {
        "email": "testuser@example.com",
        "password": "password123",
        "first_name": "Test",
        "last_name": "User"
    }
    response = requests.post(url, json=user_data, headers=get_headers())
    assert response.status_code == 201
    user = response.json()
    assert 'id' in user
    assert user['email'] == user_data['email']


def test_user_login():
    """Test user login to get JWT token"""
    url = f"{BASE_URL}/auth/login"
    login_data = {
        "email": "testuser@example.com",
        "password": "password123"
    }
    response = requests.post(url, json=login_data, headers=get_headers())
    assert response.status_code == 200
    data = response.json()
    assert 'access_token' in data
    return data['access_token']


def test_create_reminder(jwt_token):
    """Test creating a reminder"""
    url = f"{BASE_URL}/reminders"
    reminder_data = {
        "text": "This is a test reminder",
        "user_id": "testuser_id"  # Replace with actual user_id from user creation response
    }
    response = requests.post(url, json=reminder_data,
                             headers=get_headers(jwt_token))
    assert response.status_code == 201
    reminder = response.json()
    assert 'id' in reminder
    assert reminder['text'] == reminder_data['text']
    return reminder['id']


def test_create_reflection(jwt_token, reminder_id):
    """Test creating a reflection"""
    url = f"{BASE_URL}/reminders/{reminder_id}/reflections"
    reflection_data = {
        "content": "This is a test reflection",
        "user_id": "testuser_id",  # Replace with actual user_id from user creation response
        "reminder_id": reminder_id
    }
    response = requests.post(url, json=reflection_data,
                             headers=get_headers(jwt_token))
    assert response.status_code == 201
    reflection = response.json()
    assert 'id' in reflection
    assert reflection['content'] == reflection_data['content']


@pytest.mark.order(1)
def test_all():
    """Run all tests in order"""
    test_user_creation()
    jwt_token = test_user_login()
    reminder_id = test_create_reminder(jwt_token)
    test_create_reflection(jwt_token, reminder_id)


if __name__ == '__main__':
    pytest.main()
