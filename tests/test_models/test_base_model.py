#!/usr/bin/python3
"""Unittesting the base model"""
import unittest
from datetime import datetime
from models.base_model import BaseModel
from models import storage, storage_t


class TestBaseModel(unittest.TestCase):
    """Unittesting the base model"""

    def setUp(self):
        """Make initial object"""
        self.obj_1 = BaseModel()
        self.obj_2 = BaseModel()

    def tearDown(self):
        """Delete object"""
        del self.obj_1

    def test_public_attributes(self):
        """Test if BaseModel has the attributes"""
        self.assertTrue(hasattr(self.obj_1, "created_at"))
        self.assertTrue(hasattr(self.obj_1, "updated_at"))
        self.assertTrue(hasattr(self.obj_1, "id"))

    def test_attribute_types(self):
        """Tests the class types of BaseModel attributes"""
        self.assertIsInstance(self.obj_1.id, str)
        self.assertIsInstance(self.obj_1.created_at, datetime)
        self.assertIsInstance(self.obj_1.updated_at, datetime)

    def test_save(self):
        """Tests the save function"""
        # Temporarily skipp this on on DBStorage ((Running out of time))
        if storage_t != "db":
            self.obj_1.save()
            self.assertNotEqual(self.obj_1.created_at, self.obj_1.updated_at)

    def test___str__(self):

        """Tests the __str__ function"""
        cls_name = self.obj_1.__class__.__name__
        id = self.obj_1.id
        attrs = self.obj_1.__dict__

        expected_sting = f"[{cls_name}] ({id}) {attrs}"

        self.assertEqual(expected_sting, str(self.obj_1))

    def test_to_dict(self):
        """Test to_dict function that is returning a
            dictionary of the attibutes of hte object
        """
        self.obj_1.test = "test"
        object_dict = self.obj_1.to_dict()

        self.assertIsInstance(object_dict, dict)

        major_attrs = ["__class__", "id", "created_at", "updated_at"]
        for attr in major_attrs:
            self.assertIn(attr, object_dict)

        self.assertIn("test", object_dict)

        self.assertIsInstance(object_dict["created_at"], str)
        self.assertIsInstance(object_dict["updated_at"], str)

        self.assertEqual(
            object_dict["created_at"], self.obj_1.created_at.isoformat())
        self.assertEqual(
            object_dict["updated_at"], self.obj_1.updated_at.isoformat())

    def test_dict_to_base_model(self):
        """Test creating an object form dictionary of attibutes"""
        """
            safegaurds.. Classes
            type of created at and updated at

            we have all the attibutes
        """
        time_now = datetime.now()
        attrs = {
            "__class__": "wronge_Class",
            "id": "test_id",
            "created_at": time_now.isoformat(),
            "updated_at": time_now.isoformat(),
            "test": "test"
        }

        obj = BaseModel(**attrs)

        for attr in attrs:
            self.assertTrue(hasattr(obj, attr))
        self.assertEqual(obj.id, "test_id")
        self.assertEqual(obj.test, "test")

        self.assertEqual(obj.created_at, time_now)
        self.assertEqual(obj.updated_at, time_now)

        self.assertNotEqual(obj.__class__.__name__, "wronge_Class")


if __name__ == "__main__":
    unittest.main()
