#!/usr/bin/python3
"""Test cases for the reminder class"""
import unittest
from models.reminder import Reminder


class TestReminder(unittest.TestCase):
    def setUp(self):
        self.reminder = Reminder()

    def test_attributes(self):
        self.assertTrue(hasattr(self.reminder, 'type'))
        self.assertTrue(hasattr(self.reminder, 'public'))
        self.assertTrue(hasattr(self.reminder, 'text'))
        self.assertTrue(hasattr(self.reminder, 'user_id'))
        self.assertTrue(hasattr(self.reminder, 'img'))

    def test_default_attribute_values(self):
        self.assertEqual(self.reminder.type, "text")
        self.assertFalse(self.reminder.public)
        self.assertEqual(self.reminder.text, "")
        self.assertEqual(self.reminder.user_id, "")
        self.assertIsNone(self.reminder.img)


if __name__ == '__main__':
    unittest.main()
