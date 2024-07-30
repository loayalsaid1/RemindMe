#!/usr/bin/python3
"""User model for RemindMe web application"""
import models
from models.base_model import BaseModel, Base
from models.reminder import Reminder
from models.reflection import Reflection
from models.streak import Streak
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Enum, Integer, ForeignKey
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import UserMixin


class User(UserMixin, BaseModel, Base):
    """User model that inherits from BaseModel"""
    __tablename__ = 'users'
    if models.storage_t == "db":
        user_name = Column(String(32), nullable=False)
        user_custom_id = Column(Integer)
        email = Column(String(255), nullable=False)
        password = Column(String(1024), nullable=False)
        first_name = Column(String(32), nullable=False)
        last_name = Column(String(32), nullable=False)
        profession = Column(String(32))
        gender = Column(Enum("Male", "Female", name="gender"))
        description = Column(String(512))
        img_url = Column(String(500))
        longest_streak_id = Column(String(36))
        current_streak_id = Column(String(36))

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
    @property
    def longest_streak(self):
        """Get uesr longest streak"""
        if not self.longest_streak_id:
            return None

        return models.storage.get(Streak, self.longest_streak_id)

    @property
    def current_streak(self):
        """Return user's current running streak if any"""
        if not self.current_streak_id:
            return None

        return models.storage.get(Streak, self.current_streak_id)

    def set_password(self, password):
        """Hash and set the password before saving it to the database"""
        self.password = generate_password_hash(password)

    def verify_password(self, password):
        """Verify hashed password"""
        return check_password_hash(self.password, password)

    def update_longest_streak(self):
        """Update longest streak if current streak is
            longet that existing one.
        """
        current_streak = self.current_streak

        if current_streak.days > self.longest_streak.days:
            self.longest_streak_id = current_streak.id
            
    def expand_streak(self):
        streak = self.current_streak
        
        if not streak or (streak and streak.status == 'expired'):
            new_streak = Streak()
            new_streak.user_id = self.id
            new_streak.save()

            self.current_streak_id = new_streak.id
            models.storage.save()
        elif streak.status == 'running':
            streak.update()

        self.update_longest_streak()

        models.storage.save()
