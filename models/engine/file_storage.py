#!/usr/bin/python3
"""Module that defines the FileStorage engine class"""

import json
from models.base_model import BaseModel
from models.user import User
from models.reflection import Reflection
from models.streak import Streak
from models.reminder import Reminder


class FileStorage:
    """Class that manages conversions and persistence of objects"""

    __objects = {}
    __file_path = "file.json"
    classes = {
        "BaseModel": BaseModel,
        "User": User,
        "Reflection": Reflection,
        "Streak": Streak,
        "Reminder": Reminder
    }

    def all(self, cls=None):
        """Returns a dictionary of all objects"""
        if cls:
            objects = {}
            class_name = cls.__name__
            for key, value in self.__objects.items():
                if key.startswith(f"{class_name}."):
                    objects.update({key: value})

            return objects
        else:
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

    def get(self, cls, id):
        """Get an object from storage based on class and ID"""
        return self.__objects.get(f"{cls.__name__}.{id}")

    def delete(self, obj=None):
        """Delete an object from storage"""
        if obj:
            key = f"{obj.__class__.__name__}.{getattr(obj, 'id')}"
            if key in self.__objects:
                del self.__objects[key]
