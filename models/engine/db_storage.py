#!/usr/bin/python3
"""A storage engine based on mysql server"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from os import getenv
from models.base_model import Base
from models.user import User
from models.reflection import Reflection
from models.reminder import Reminder
from models.streak import Streak


classes = {
    "User": User,
    "Reflection": Reflection,
    "Streak": Streak,
    "Reminder": Reminder
}


class DBStorage:
    """DBStorage class"""
    __engine = None
    __session = None

    def __init__(self):
        """Initialize our engine"""
        user = getenv('REMIND_ME_MYSQL_USER')
        password = getenv('REMIND_ME_MYSQL_PWD')
        host = getenv('REMIND_ME_MYSQL_HOST')
        db = getenv('REMIND_ME_MYSQL_DB')
        self.__engine = create_engine(
            f"mysql+mysqldb://{user}:{password}@{host}/{db}",
            pool_pre_ping=True
        )

        """if the environment is testing drop all tables"""
        if getenv('REMIND_ME_ENV') == 'TEST':
            if "test" not in getenv('REMIND_ME_MYSQL_BD'):
                print("You dummy!😠💢. Stop right there!",
                      "\nYou're testing on production or development DB!",
                      "\nRun the tests on the test database!")
                exit(1)
            Base.metadata.drop_all(self.__engine)

    def all(self, cls=None):
        """Make a query for one or all objs in the DB"""
        if cls:
            query_result = self.__session.query(cls).all()
        else:
            query_result = []
            for cls in classes.values():
                query_result.extend(self.__session.query(cls).all())
        objects = {}
        for obj in query_result:
            object_class = obj.__class__.__name__
            objects[f'{object_class}.{obj.id}'] = obj
        return objects

    def new(self, obj):
        """Add an obj to the current DB session"""
        self.__session.add(obj)

    def save(self):
        """Commit changes to the current DB session"""
        self.__session.commit()

    def delete(self, obj=None):
        """This method deletes an obj from current DB session"""
        if obj is not None:
            self.__session.delete(obj)

    def get(self, cls, id):
        """This method retrieves one obj via cls name and ID"""
        if cls in classes.values():
            return self.__session.query(cls).filter_by(id=id).first()
        return None

    def count(self, cls=None):
        """Get number of objects in the current DB session"""
        if cls:
            return self.__session.query(cls).count()
        else:
            counts = [
                self.__session.query(cls).count() for cls in classes.values()
            ]
            return sum(counts)

    def reload(self):
        """This method creates all tables in the DB"""
        Base.metadata.create_all(self.__engine)
        session = sessionmaker(bind=self.__engine, expire_on_commit=False)
        Session = scoped_session(session)
        self.__session = Session()

    def filter_objects(self, cls, name, value):
        """Search for a property in a class"""
        if cls in classes.values():
            try:
                if type(value) is str:
                    filter_ = eval(f"{cls.__name__}.{name} == '{value}'")
                else:
                    filter_ = eval(f"{cls.__name__}.{name} == {value}")
                    
                objects = self.__session.query(cls).filter(filter_).all()
                if objects:
                    return objects
                else:
                    return None
            except Exception:
                    return None
        return None
