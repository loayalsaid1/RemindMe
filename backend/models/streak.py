#!/usr/bin/python3
"""Streaks model for RemindMe application"""
from models.base_model import BaseModel, Base
from models import storage_t
from sqlalchemy import Column, String, Integer, ForeignKey
from datetime import date, datetime


class Streak(BaseModel, Base):
    """Class that models user streaks of RemindMe application"""
    __tablename__ = "streaks"

    if storage_t == "db":
        user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
        days = Column(Integer, default=1)
    else:
        user_id = ""
        days = 1
    @property
    def status(self):
        """Check the status of the streak
            
            Returns one of three:
                'expired' => If hasn't been updated for 2 days
                'running' => If not expired but will expire today if not updated
                'updated' => If updated today
        """
        # TODO => consider users from different time zones
        today = date.today()
        last_update_date = self.updated_at.date()

        difference  = (today - last_update_date)

        if difference.days == 0:
            return 'updated'
        elif difference.days == 1 or difference.days == 2:
            # A glitch to encourage some users
            return 'running'
        else:
            return 'expired'

    def update(self):
        """Add a day to the streak"""
        self.days += 1
        self.updated_at = datetime.utcnow()
