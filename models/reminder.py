#!/usr/bin/python3
"""Reminders model for RemindMe application"""
from models.base_model import BaseModel, Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from os import getenv
import models
from models.reflection import Reflection


class Reminder(BaseModel, Base):
    """Reminders model that inherits from BaseModel"""
    __tablename__ = 'reminders'

    if getenv('REMIND_ME_TYPE_STORAGE') == 'db':
        public = Column(Boolean, nullable=False, default=True)
        is_text = Column(Boolean, nullable=False, default=True)
        text = Column(String(1024), nullable=False)
        img_url = Column(String(500), default=None)
        caption = Column(String(1025), default=None)
        user_id = Column(String(36), ForeignKey('users.id'), nullable=False)

        reflections = relationship('Reflection', backref='reminder',
                                   cascade="all, delete, delete-orphan")
    else:
        is_text = True
        public = True
        text = ""
        user_id = ""
        img_url = None
        caption = ""

        @property
        def reflections(self):
            from models.reflection import Reflection

            reflections = []
            all_reflections = models.storage.all(Reflection).values()
            for reflection in all_reflections:
                if reflection.reminder_id == self.id:
                    reflections.append(reflection.id)

            return reflections

        @property
        def user(self):
            from models.user import User
            return models.storage.get(User, self.user_id)
