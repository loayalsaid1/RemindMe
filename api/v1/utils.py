#!/usr/bin/python3
"""This module contains utility functions"""

from models import storage
from models.user import User


def get_user_by_email(email):
    """Retrieve a user by their email"""
    users = storage.all(User).values()
    for user in users:
        if user.email == email:
            return user
    return None
