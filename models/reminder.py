#!/usr/bin/python3
"""Reminders model for RemindMe application"""
from models.base_model import BaseModel


class Reminder(BaseModel):
    """Reminders model that inherits from BaseModel"""

    is_text = True
    public = False
    text = ""
    user_id = ""
    img_ = None
    img_caption = ""
