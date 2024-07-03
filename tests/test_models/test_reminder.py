#!/usr/bin/python3
"""Test cases for the reminder class"""
import unittest
from models.reminder import Reminder


class TestReminder(unittest.TestCase):
    def setUp(self):
        self.reminder = Reminder()

    def test_attributes(self):
        self.assertTrue(hasattr(self.reminder, 'is_text'))
        self.assertTrue(hasattr(self.reminder, 'public'))
        self.assertTrue(hasattr(self.reminder, 'text'))
        self.assertTrue(hasattr(self.reminder, 'user_id'))
        self.assertTrue(hasattr(self.reminder, 'img'))
        self.assertTrue(hasattr(self.reminder, 'img_caption'))

    def test_default_attribute_values(self):
        self.assertTrue(self.reminder.is_text)
        self.assertFalse(self.reminder.public)
        self.assertEqual(self.reminder.text, "")
        self.assertEqual(self.reminder.user_id, "")
        self.assertIsNone(self.reminder.img)
        self.assertEqual(self.reminder.img_caption, "")


if __name__ == '__main__':
    unittest.main()
