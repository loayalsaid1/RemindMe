#!/usr/bin/python3
"""Streaks model for RemindMe application"""
from models.base_model import BaseModel


class Streak(BaseModel):
    """Class that models user streaks of RemindMe application"""

    user_id = ""
    days = 0
