#!/usr/bin/python3
"""Test module for the user model"""

import unittest
from datetime import datetime
from models.user import User
from models.base_model import BaseModel


class TestUser(unittest.TestCase):
    """Test class for User model"""

    def setUp(self):
        """Set up a User object for testing"""
        self.user = User()

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
        self.assertTrue(hasattr(self.user, "extra_info"))
        self.assertTrue(hasattr(self.user, "img"))

    def test_user_save(self):
        """Test if User save method works correctly"""
        self.user.save()
        self.assertNotEqual(self.user.created_at, self.user.updated_at)

    def test_user_str(self):
        """Test if User __str__ method works correctly"""
        cls_name = self.user.__class__.__name__
        id = self.user.id
        attrs = self.user.__dict__

        expected_string = f"[{cls_name}] ({id}) {attrs}"

        self.assertEqual(expected_string, str(self.user))

    # def test_user_to_dict(self):
    #     """Test if User to_dict method works correctly"""
    #     user_dict = self.user.to_dict()
    #     self.assertEqual(user_dict["__class__"], "User")
    #     self.assertEqual(user_dict["email"], "")
    #     self.assertEqual(user_dict["password"], "")
    #     self.assertEqual(user_dict["first_name"], "")
    #     self.assertEqual(user_dict["last_name"], "")
    #     self.assertEqual(user_dict["profession"], "")
    #     self.assertEqual(user_dict["gender"], "")
    #     self.assertEqual(user_dict["extra_info"], "")
    #     self.assertEqual(user_dict["img"], None)


if __name__ == "__main__":
    unittest.main()
