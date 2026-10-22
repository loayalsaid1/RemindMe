#!/usr/bin/python3
"""""Test cases for the streak class"""
import unittest
from models import storage
from models.streak import Streak
from models import storage_t
from models.user import User


class TestStreak(unittest.TestCase):
    """Test cases for the streak class"""
    @classmethod
    def setUpClass(cls):
        """Set up tests in the class"""
        cls.user = User()
        cls.user.user_name = "test_user"
        cls.user.password = "test_password"
        cls.user.first_name = "test_first_name"
        cls.user.last_name = "test_last_name"
        cls.user.email = "test_email"
        cls.user.save()

    def setUp(self):
        self.streak = Streak()
        self.streak.user_id = self.user.id
        self.streak.save()

    def tearDown(self):
        """tear down tests in the class"""
        del self.streak

    def test_attributes(self):
        self.assertTrue(hasattr(self.streak, 'user_id'))
        self.assertTrue(hasattr(self.streak, 'days'))

    def test_attribute_values(self):
        self.assertEqual(self.streak.user_id, self.user.id)

        # check default value
        self.assertEqual(self.streak.days, 1)


if __name__ == '__main__':
    unittest.main()
