#!/usr/bin/python3
"""Module that defines the FileStorage engine class"""

import json
from models.base_model import BaseModel


class FileStorage:
    """Class that manages conversions and persistence of objects"""

    __objects = {}
    __file_path = "file.json"
    classes = {
        "BaseModel": BaseModel
    }

    def all(self):
        """Returns a dictionary of all objects"""
        return self.__objects

    def new(self, obj):
        """Sets in __objects the obj with key <obj class name>.id"""
        if obj:
            key = f"{obj.__class__.__name__}.{obj.id}"
            self.__objects[key] = obj

    def save(self):
        """Serializes __objects to the JSON file (path: __file_path)"""
        with open(self.__file_path, "w") as f:
            json.dump({k: v.to_dict() for k, v in self.__objects.items()}, f)

    def reload(self):
        """Deserializes the JSON file to __objects"""
        try:
            with open(self.__file_path, "r") as f:
                for key, value in json.load(f).items():
                    self.__objects[key] = self.classes[value["__class__"]](
                        **value)
        except FileNotFoundError:
            pass
