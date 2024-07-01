#!/usr/bin/python3
"""Streaks model for RemindMe application"""
from models.base_model import BaseModel


class Streak(BaseModel):
    """Class for user streaks"""

    def __init__(self, *args, **kwargs):
        """Initialize a Streaks instance"""
        super().__init__(*args, **kwargs)
        self.user_id = kwargs.get('user_id', "")
        self.days = kwargs.get('days', 0)
