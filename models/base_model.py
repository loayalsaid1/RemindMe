#!/usr/bin/python3
"""Make the basemodel for the other models"""
from datetime import datetime
from uuid import uuid4
import models
from sqlalchemy import Column, DateTime, String
from sqlalchemy.ext.declarative import declarative_base
from os import getenv
Base = declarative_base()


class BaseModel:
    """The base model for other models"""
    id = Column(String(36), nullable=False, primary_key=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())

    def __init__(self, *args, **kwargs):
        """Create an instance"""
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

    def __str__(self):
        """Make a string representation of the object"""
        format = f"[{self.__class__.__name__}] ({self.id}) {self.__dict__}"
        return format

    def save(self):
        """Update the updated_at attribute with the current datetime"""
        self.updated_at = datetime.now()
        models.storage.new(self)
        models.storage.save()

    def to_dict(self):
        """Make a dictionary representation of the object"""
        dictionary = self.__dict__.copy()
        dictionary['__class__'] = self.__class__.__name__
        dictionary['created_at'] = dictionary['created_at'].isoformat()
        dictionary['updated_at'] = dictionary['updated_at'].isoformat()
        if '_sa_instance_state' in dictionary:
            del dictionary['_sa_instance_state']
        return dictionary

    def delete(self):
        """Delete an instance from storage"""
        models.storage.delete(self)
