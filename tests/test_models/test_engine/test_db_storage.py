#!/usr/bin/python3
"""Test the db storage engine"""
import unittest
from os import getenv
from models.user import User
from models.reminder import Reminder
from models.base_model import Base
from models.engine.db_storage import DBStorage
from models import storage_t, storage
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session


@unittest.skipUnless(storage_t == "db", "db storage not enabled")
class TESTDBStorage(unittest.TestCase):
    """Test the db storage engine"""
    @classmethod
    def tearDownClass(cls):
        """After finishing testng"""
        storage.reload()

    def setUp(self):
        """Set up for the test"""
        self.storage = DBStorage()
        if "test" not in getenv('REMIND_ME_MYSQL_DB', ""):
            print("You dummy!😠💢, Stop right there",
                  "\nYou're testing on production or development DB!",
                  "\nRun the tests on the test database!")
            exit(1)
        self.storage._DBStorage__engine = create_engine(
            'mysql+mysqldb://{}:{}@{}/{}'.format(
                getenv('REMIND_ME_MYSQL_USER'),
                getenv('REMIND_ME_MYSQL_PWD'),
                getenv('REMIND_ME_MYSQL_HOST'),
                getenv('REMIND_ME_MYSQL_DB')
            ),
            pool_pre_ping=True
        )
        self.Session = scoped_session(sessionmaker(
            bind=self.storage._DBStorage__engine,
            expire_on_commit=False
        ))
        self.storage._DBStorage__session = self.Session()
        self.session = self.storage._DBStorage__session
        Base.metadata.create_all(self.storage._DBStorage__engine)

        self.user_1 = User()
        self.user_1.user_name = "test_user"
        self.user_1.password = "test_password"
        self.user_1.first_name = "test_first_name"
        self.user_1.last_name = "test_last_name"
        self.user_1.email = "test_email"

        self.user_2 = User()
        self.user_2.user_name = "test_user"
        self.user_2.password = "test_password"
        self.user_2.first_name = "test_first_name"
        self.user_2.last_name = "test_last_name"
        self.user_2.email = "test_email"

    def tearDown(self):
        """Clean up after each test"""
        self.session.close()
        Base.metadata.drop_all(self.storage._DBStorage__engine)
        self.session.close()
        del self.user_1
        del self.user_2

    def test_all(self):
        """Test the all method"""
        # Test with no objects
        Base.metadata.drop_all(self.storage._DBStorage__engine)
        Base.metadata.create_all(self.storage._DBStorage__engine)

        self.assertEqual(self.storage.all(), {})

        # Test with two objects
        self.storage.new(self.user_1)
        self.storage.new(self.user_2)
        self.storage.save()
        result = self.storage.all()

        # Test the keys and values of the output
        self.assertIn(f"{self.user_1.__class__.__name__}.{self.user_1.id}",
                      result)
        self.assertIn(self.user_1, result.values())

        self.assertEqual(len(self.storage.all()), 2)
        # When you pass it the class you want objects from
        self.assertEqual(len(self.storage.all(User)), 2)

    def test_new(self):
        """Test the new method"""
        self.storage.new(self.user_1)
        self.assertIn(self.user_1, self.session.new)

    def test_save(self):
        """Test the save method"""
        self.storage.new(self.user_1)
        self.storage.save()
        self.assertNotIn(self.user_1, self.session.new)

    def test_delete(self):
        """Test the delete method"""
        self.storage.new(self.user_1)
        self.storage.save()
        self.storage.delete(self.user_1)
        self.storage.save()
        self.assertIsNone(self.storage.get(User, self.user_1.id))

    def test_get(self):
        """Test the get method"""
        self.storage.new(self.user_1)
        self.storage.save()
        obj = self.storage.get(User, self.user_1.id)
        self.assertIs(obj, self.user_1)

    def test_count(self):
        """Test the count method"""
        self.assertEqual(self.storage.count(), 0)
        self.assertEqual(self.storage.count(User), 0)
        self.assertEqual(self.storage.count(Reminder), 0)
        self.storage.new(self.user_1)
        self.storage.save()
        self.assertEqual(self.storage.count(), 1)
