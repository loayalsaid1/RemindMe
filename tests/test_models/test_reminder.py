#!/usr/bin/python3
"""Test cases for the reminder class"""
import unittest
from models.reminder import Reminder
from models import storage_t
from models.user import User
from models.reflection import Reflection


class TestReminder(unittest.TestCase):
    """Test cases for the reminder class"""
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
        self.reminder.text = "Reminder text"
        self.reminder.save()

    def tearDown(self):
        """Clearn after tests"""
        self.user.delete()
        del self.user
        self.reminder.delete()
        del self.reminder

    def test_attributes(self):
        self.assertTrue(hasattr(self.reminder, 'is_text'))
        self.assertTrue(hasattr(self.reminder, 'public'))
        self.assertTrue(hasattr(self.reminder, 'text'))
        self.assertTrue(hasattr(self.reminder, 'user_id'))
        self.assertTrue(hasattr(self.reminder, 'img_url'))
        self.assertTrue(hasattr(self.reminder, 'caption'))

    def test_reminder_attributes(self):
        self.assertTrue(self.reminder.is_text)
        self.assertTrue(self.reminder.public)
        self.assertTrue(self.reminder.text, "Reminder text")
        self.assertEqual(self.reminder.user_id, self.user.id)
        self.assertEqual(self.reminder.img_url, None)
        if storage_t == "db":
            self.assertEqual(self.reminder.caption, None)
        else:
            self.assertEqual(self.reminder.caption, "")

    def test_reminder_relationships(self):
        """Test relationships of a reminder"""
        self.assertEqual(self.reminder.user, self.user)

        reflection = Reflection()
        reflection.user_id = self.user.id
        reflection.reminder_id = self.reminder.id
        reflection.content = "Reflection text"
        reflection.save()
        if storage_t == "db":
            self.assertEqual(self.reminder.reflections, [reflection])
        else:
            self.assertEqual(self.reminder.reflections, [reflection.id])


if __name__ == '__main__':
    unittest.main()
