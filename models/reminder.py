#!/usr/bin/python3
"""Reminder model for the RemindMe web application"""
from models.base_model import BaseModel


class Reminder(BaseModel):
    """Class that defines user reminders"""

    def __init__(self, *args, **kwargs):
        """Initialize a Reminders instance"""
        super().__init__(*args, **kwargs)
        self.type = kwargs.get('type', "text")
        self.public = kwargs.get('public', False)
        self.text = kwargs.get('text', "")
        self.user_id = kwargs.get('user_id', "")
        self.img = kwargs.get('img', None)
