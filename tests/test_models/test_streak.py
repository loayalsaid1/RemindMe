#!/usr/bin/python3
"""""Test cases for the streak class"""
import unittest
from models.streak import Streak


class TestStreak(unittest.TestCase):
    def setUp(self):
        self.streak = Streak()

    def test_attributes(self):
        self.assertTrue(hasattr(self.streak, 'user_id'))
        self.assertTrue(hasattr(self.streak, 'days'))

    def test_default_attribute_values(self):
        self.assertEqual(self.streak.user_id, "")
        self.assertEqual(self.streak.days, 0)


if __name__ == '__main__':
    unittest.main()
