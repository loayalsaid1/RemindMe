#!/usr/bin/python3
"""User model for RemindMe web application"""
import models
from models.base_model import BaseModel, Base
from models.reminder import Reminder
from models.reflection import Reflection
from models.streak import Streak
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Enum, Integer
from werkzeug.security import check_password_hash, generate_password_hash


class User(BaseModel, Base):
    """User model that inherits from BaseModel"""
    __tablename__ = 'users'
    if models.storage_t == "db":
        user_name = Column(String(32), nullable=False)
        user_custom_id = Column(Integer)
        email = Column(String(255), nullable=False)
        password = Column(String(64), nullable=False)
        first_name = Column(String(32), nullable=False)
        last_name = Column(String(32), nullable=False)
        profession = Column(String(32))
        gender = Column(Enum("Male", "Female", name="gender"))
        description = Column(String(512))
        img_url = Column(String(500))

        reminders = relationship("Reminder", backref="user",
                                 cascade="all, delete, delete-orphan")
        reflections = relationship("Reflection", backref="user",
                                   cascade="all, delete, delete-orphan")
        streaks = relationship("Streak", backref="user",
                               cascade="all, delete, delete-orphan")
    else:
        user_name = ""
        user_custom_id = 0
        email = ""
        password = ""
        first_name = ""
        last_name = ""
        profession = ""
        gender = ""
        description = ""
        img_url = None

        @property
        def reminders(self):
            user_reminders = []
            all_reminders = models.storage.all(Reminder).values()
            for reminder in all_reminders:
                if reminder.user_id == self.id:
                    user_reminders.append(reminder.id)

            return user_reminders

        @property
        def reflections(self):
            reflections = []
            all_reflectiolns = models.storage.all(Reflection).values()
            for reflection in all_reflectiolns:
                if reflection.user_id == self.id:
                    reflections.append(reflection.id)

            return reflections

        @property
        def streaks(self):
            user_streaks = []
            all_streaks = models.storage.all(Streak).values()
            for streak in all_streaks:
                if streak.user_id == self.id:
                    user_streaks.append(streak.id)

            return user_streaks

        def set_password(self, password):
            """Hash and set the password before saving it to the database"""
            self.password = generate_password_hash(password)

        def verify_password(self, password):
            """Verify hashed password"""
            return check_password_hash(self.password, password)
