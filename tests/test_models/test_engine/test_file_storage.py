#!/usr/bin/python3
"""Module to test FileStorage"""
from models.base_model import BaseModel
from models.engine.file_storage import FileStorage
from models import storage
import unittest
import os
import json


class TestFileStorage(unittest.TestCase):
    """Class to test FileStorage"""

    def setUp(self):
        """Instances for test methods"""
        self.obj_1 = FileStorage()
        self.obj_2 = FileStorage()
        self.base_1 = BaseModel()
        self.base_2 = BaseModel()

    def tearDown(self):
        """ Remove file.json after testing"""
        try:
            os.remove("file.json")
        except Exception as e:
            pass

    def test_FileStorage_attributes(self):
        """Tests for present attributes"""
        self.assertTrue(hasattr(self.obj_1, '_FileStorage__objects'))
        self.assertTrue(hasattr(self.obj_1, '_FileStorage__file_path'))

    def test_save_method(self):
        """Tests for the save() method"""

        # Check that our file (file.json) is not in path before calling save()
        self.assertFalse(os.path.exists(FileStorage._FileStorage__file_path))

        # Call save() on object to  trigger the serialization
        # and file writing processes
        self.obj_1.save()

        # Check that "file.json" now exists in path
        self.assertTrue(os.path.exists(FileStorage._FileStorage__file_path))

        with open(FileStorage._FileStorage__file_path,
                  'r', encoding="utf-8") as file:
            contents = json.loads(file.read())
            for key in FileStorage._FileStorage__objects.keys():
                self.assertEqual(
                    FileStorage._FileStorage__objects[key].to_dict(),
                    contents[key])

    def test_new_method(self):
        """Tests the behaviour of the new() method"""
        new_obj = self.base_1
        self.obj_1.new(new_obj)
        new_obj_2 = self.base_2
        self.obj_2.new(new_obj_2)

        # Check that new_obj class name and id are in __objects as key
        self.assertIn(f"{new_obj.__class__.__name__}.{new_obj.id}",
                      FileStorage._FileStorage__objects.keys())

        # Check that 'new_obj' is a value in __objects
        self.assertIn(new_obj, FileStorage._FileStorage__objects.values())

        # Check that IDs in __objects are unique
        self.assertNotEqual(new_obj.id, new_obj_2.id)

    def test_reload_method(self):
        """Tests if reload() method behaves correctly"""
        base_3 = BaseModel()
        base_3.save()
        storage.reload()
        self.assertIn(f"{base_3.__class__.__name__}.{base_3.id}",
                      FileStorage._FileStorage__objects.keys())

    def test_all_method(self):
        """Test the behaviour of all() method"""
        objects = self.obj_1.all()
        self.assertEqual(objects, FileStorage._FileStorage__objects)

    def test_reload_when_file_empty(self):
        """ Test for reloading an empty file"""
        with open("file.json", "w") as jfile:
            pass
        with self.assertRaises(Exception):
            storage.reload()

    def test_save_method_on_FileStorage(self):
        """Tests that save() method saves a FileStorage instance"""
        my_store = FileStorage()
        self.assertFalse(os.path.exists(FileStorage._FileStorage__file_path))
        my_store.save()
        self.assertTrue(os.path.exists(FileStorage._FileStorage__file_path))

    """Author: Loay Al-Said"""
    def test_delete(self):
        """Test delete method"""


if __name__ == "__main__":
    unittest.main()
