#!/usr/bin/python3
"""Reflection model for the RemindMe application"""
from models.base_model import BaseModel


class Reflection(BaseModel):
    """Reflection class that defines relections on reminders"""

    def __init__(self, *args, **kwargs):
        """Initialize a Reflections instance"""
        super().__init__(*args, **kwargs)
        self.user_id = kwargs.get('user_id', "")
        self.reminder_id = kwargs.get('reminder_id', "")
        self.content = kwargs.get('content', "")
