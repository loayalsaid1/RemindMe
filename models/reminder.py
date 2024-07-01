#!/usr/bin/python3
"""Reminders model for RemindMe application"""
from models.base_model import BaseModel


class Reminder(BaseModel):
    """Reminders model that inherits from BaseModel"""

    type = "text"
    public = False
    text = ""
    user_id = ""
    img = None
