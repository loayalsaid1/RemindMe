#!/usr/bin/python3
"""Test cases for the reflection class"""

import unittest
from models.reflection import Reflection


class TestReflection(unittest.TestCase):
    def setUp(self):
        self.reflection = Reflection()

    def test_attributes(self):
        self.assertTrue(hasattr(self.reflection, 'user_id'))
        self.assertTrue(hasattr(self.reflection, 'reminder_id'))
        self.assertTrue(hasattr(self.reflection, 'content'))

    def test_default_attribute_values(self):
        self.assertEqual(self.reflection.user_id, "")
        self.assertEqual(self.reflection.reminder_id, "")
        self.assertEqual(self.reflection.content, "")


if __name__ == '__main__':
    unittest.main()
