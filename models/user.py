#!/usr/bin/python3
"""User model for RemindMe web application"""
from models.base_model import BaseModel


class User(BaseModel):
    """User model that inherits from BaseModel"""

    email = ""
    password = ""
    first_name = ""
    last_name = ""
    profession = ""
    gender = ""
    extra_info = ""
    img = None
