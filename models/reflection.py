#!/usr/bin/python3
"""Reflections model for RemindMe application"""
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
import models


class Reflection(BaseModel, Base):
    """Class that defines user reflections on reminders"""
    __tablename__ = 'reflections'
    if models.storage_t == "db":
        user_id = Column(String(36), ForeignKey('users.id'), nullable=False)
        reminder_id = Column(String(36), ForeignKey('reminders.id'),
                             nullable=False)
        content = Column(String(1024), nullable=False)
    else:
        user_id = ""
        reminder_id = ""
        content = ""

    @property
    def reminder(self):
        from models.reminder import Reminder
        return models.storage.get(Reminder, self.reminder_id)

    @property
    def user(self):
        from models.user import User
        return models.storage.get(User, self.user_id)
