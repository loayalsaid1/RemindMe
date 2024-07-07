#!/usr/bin/python3
"""This module contains utility functions"""

from models import storage
from models.user import User


def get_user_by_email(email):
    """Get user by their email address"""
    return storage.get_user_by_email(email)
