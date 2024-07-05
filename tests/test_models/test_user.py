#!/usr/bin/python3
"""Test module for the user model"""

import unittest
from datetime import datetime
from models import storage_t
from models.user import User
from models.base_model import BaseModel
from models .reminder import Reminder
from models.streak import Streak
from models.reflection import Reflection


class TestUser(unittest.TestCase):
    """Test class for User model"""
    def setUp(self):
        """Set up a User object for testing"""
        self.user = User()
        self.user.user_name = "test_user"
        self.user.password = "test_password"
        self.user.first_name = "test_first_name"
        self.user.last_name = "test_last_name"
        self.user.email = "test_email"
        self.user.save()

    def tearDown(self):
        """Tear down tests in the class"""
        self.user.delete()
        del self.user

    def test_user_attributes(self):
        """Test if User class has the correct attributes"""
        self.assertTrue(hasattr(self.user, "created_at"))
        self.assertTrue(hasattr(self.user, "updated_at"))
        self.assertTrue(hasattr(self.user, "id"))
        self.assertTrue(hasattr(self.user, "email"))
        self.assertTrue(hasattr(self.user, "password"))
        self.assertTrue(hasattr(self.user, "first_name"))
        self.assertTrue(hasattr(self.user, "last_name"))
        self.assertTrue(hasattr(self.user, "profession"))
        self.assertTrue(hasattr(self.user, "gender"))
        self.assertTrue(hasattr(self.user, "description"))
        self.assertTrue(hasattr(self.user, "img_url"))

        # Relationships
        self.assertTrue(hasattr(self.user, "reminders"))
        self.assertTrue(hasattr(self.user, "reflections"))
        self.assertTrue(hasattr(self.user, "streaks"))

    def test_relationships(self):
        """Test user relationships"""
        reminder = Reminder()
        reminder.user_id = self.user.id
        reminder.is_text = True
        reminder.public = True
        reminder.text = "Reminder text"
        reminder.save()

        reflection = Reflection()
        reflection.user_id = self.user.id
        reflection.reminder_id = reminder.id
        reflection.content = "Reflection text"
        reflection.save()

        streak = Streak()
        streak.user_id = self.user.id
        streak.days = 1
        streak.save()
        if storage_t == "db":
            self.assertEqual([reminder], self.user.reminders)
            self.assertEqual([reflection], self.user.reflections)
            self.assertEqual([streak], self.user.streaks)
        else:
            self.assertEqual([reminder.id], self.user.reminders)
            self.assertEqual([reflection.id], self.user.reflections)
            self.assertEqual([streak.id], self.user.streaks)


if __name__ == "__main__":
    unittest.main()
