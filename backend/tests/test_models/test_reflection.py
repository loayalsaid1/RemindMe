#!/usr/bin/python3
"""Test cases for the reflection class"""

import unittest
from models.reflection import Reflection
from models.user import User
from models.reminder import Reminder
from models.base_model import Base


class TestReflection(unittest.TestCase):
    def setUp(self):

        self.user = User()
        self.user.user_name = "test_user"
        self.user.password = "test_password"
        self.user.first_name = "test_first_name"
        self.user.last_name = "test_last_name"
        self.user.email = "test_email"
        self.user.save()

        self.reminder = Reminder()
        self.reminder.user_id = self.user.id
        self.reminder.is_text = True
        self.reminder.public = True
        self.reminder.text = "Reminder text"
        self.reminder.save()

        self.reflection = Reflection()
        self.reflection.user_id = self.user.id
        self.reflection.reminder_id = self.reminder.id
        self.reflection.content = "Reflection text"
        self.reflection.save()

    def test_attributes(self):
        self.assertTrue(hasattr(self.reflection, 'user_id'))
        self.assertTrue(hasattr(self.reflection, 'reminder_id'))
        self.assertTrue(hasattr(self.reflection, 'content'))

    def test_reflection_attributes(self):
        self.assertEqual(self.reflection.user_id, self.user.id)
        self.assertEqual(self.reflection.reminder_id, self.reminder.id)
        self.assertEqual(self.reflection.content, "Reflection text")

    def test_reflection_relationships(self):
        """Test relationships of a reflection"""
        self.assertEqual(self.reflection.user, self.user)
        self.assertEqual(self.reflection.reminder, self.reminder)


if __name__ == '__main__':
    unittest.main()
