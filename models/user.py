#!/usr/bin/python3
"""User model for RemindMe application"""
from models.base_model import BaseModel


class User(BaseModel):
    """User model for RemindMe application"""

    def __init__(self, *args, **kwargs):
        """Initialize a User instance"""
        super().__init__(*args, **kwargs)  # call the parent constructor
        self.email = kwargs.get('email', "")
        self.password = kwargs.get('password', "")
        self.first_name = kwargs.get('first_name', "")
        self.last_name = kwargs.get('last_name', "")
        self.profession = kwargs.get('profession', "")
        self.gender = kwargs.get('gender', "")
        self.extra_info = kwargs.get('extra_info', "")
        self.img = kwargs.get('img', None)
