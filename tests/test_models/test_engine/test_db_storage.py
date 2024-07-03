#!/usr/bin/python3
"""Test the db storage engine"""
import unittest
from models.user import User
from models.reminder import Reminder
from os import getenv
from models.engine.db_storage import DBStorage
from models.base_model import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session


class TESTDBStorage(unittest.TestCase):
    """Test the db storage engine"""

    def setUp(self):
        """Set up for the test"""
        self.storage = DBStorage()
        self.storage._DBStorage__engine = create_engine(
            'mysql+mysqldb://{}:{}@{}/{}'.format(
                getenv('REMIND_ME_MYSQL_USER'),
                getenv('REMIND_ME_MYSQL_PWD'),
                getenv('REMIND_ME_MYSQL_HOST'),
                getenv('REMIND_ME_MYSQL_DB')
            )
        )

        self.storage._DBStorage__session = scoped_session(sessionmaker(
            bind=self.storage._DBStorage__engine,
            expire_on_commit=False
        ))
        self.session = self.storage._DBStorage__session
        Base.metadata.create_all(self.storage._DBStorage__engine)

        self.user_1 = User(
            first_name="John", last_name="Doe", email="jdoe@me.com",
            password="password"
        )
        self.user_2 = User(
            first_name="Jane", last_name="Doe", email="jane@me.com",
            password="password"

        )

    def teardown(self):
        """Clean up after each test"""
        Base.metadata.drop_all(self.storage._DBStorage__engine)
        self.session.remove()
        del self.user_1
        del self.user_2

    def test_all(self):
        """Test the all method"""
        # test with no objects
        self.assertEqual(self.storage.all(), {})
        # test with two objects
        self.session.add(self.user_1)
        self.session.add(self.user_2)
        self.session.commit()
        result = self.storage.all()

        # test the keys and values of the output
        self.assertIn(f"{self.user_1.__class__.__name__}.{self.user_1.id}",
                      self.user_1, result)
        self.assertIn(self.user_1, result.values())

        self.assertEqual(len(self.storage.all()), 2)
        # When you pass it the class you want objects from
        self.assertEqual(len(self.storage.all(User)), 2)

    def test_new(self):
        """Test the new method"""
        self.storage.new(self.user_1)
        self.asserIn(self.user_1, self.session.new)

    def test_save(self):
        """Test the save method"""
        self.storage.new(self.user_1)
        self.storage.save()
        self.assertNotIn(self.user_1, self.session.new)

    def test_delete(self):
        """Test the delete method"""
        self.storage.new(self.user_1)
        self.storage.delete(self.user_1)
        self.assertNotIn(self.user_1, self.session.new)

    def test_get(self):
        """Test Get method"""
        self.storage.new(self.user_1)
        self.storage.save()
        obj = self.get(User, self.user_1.id)
        self.assertIs(obj, self.user_1)

    def test_reload(self):
        """Test reload method"""
        self.storage.reload()
        self.assertIsInstance(self.storage._DBStorage__session,
                              scoped_session)
    def test_count(self):
        """Test count method"""
        self.assertEqual(self.count(), 0)
        self.assertEqual(self.count(User), 0)
        self.assertEqual(self.count(Reminder), 0)
        self.user_1.save()
        self.assertEqual(self.count(), 1)
        self.assertEqual(self.count(User), 1)
        self.storage.new(self.user_2)
        self.user_2.save()
        self.assertEqual(self.count(), 2)
        self.assertEqual(self.count(User), 2)
        self.assertEqual(self.count(Reminder), 0)
