#!/usr/bin/python3
"""Reflections model for RemindMe application"""
from models.base_model import BaseModel


class Reflection(BaseModel):
    """Class that defines user reflections on reminders"""

    user_id = ""
    reminder_id = ""
    content = ""
