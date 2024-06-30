#!/usr/bin/python3
"""Make the basemodel for the models"""
from datetime import datetime
from uuid import uuid4
import models
from models import storage


class BaseModel:
    """The base model for other models"""

    def __init__(self, *args, **kwargs):
        """Create an instance"""
        from models import storage
        if kwargs:
            # some safe gaurds
            if kwargs.get('__class__'):
                del kwargs['__class__']

            if kwargs.get('created_at'):
                kwargs['created_at'] = datetime.fromisoformat(
                    kwargs['created_at'])

            if kwargs.get('updated_at'):
                kwargs['updated_at'] = datetime.fromisoformat(
                    kwargs['updated_at'])

            [setattr(self, k, v) for k, v in kwargs.items()]

        else:
            self.id = str(uuid4())
            self.created_at = self.updated_at = datetime.now()
            storage.new(self)

    def __str__(self):
        """Make a string representation of the object"""
        format = f"[{self.__class__.__name__}] ({self.id}) {self.__dict__}"
        return format

    def save(self):
        """Update the updated_at attribute with the current datetime"""
        from models import storage
        self.updated_at = datetime.now()
        storage.save()

    def to_dict(self):
        """Make a dictionary representation of the object"""
        dictionary = self.__dict__.copy()
        dictionary['__class__'] = self.__class__.__name__
        dictionary['created_at'] = dictionary['created_at'].isoformat()
        dictionary['updated_at'] = dictionary['updated_at'].isoformat()
        return dictionary
