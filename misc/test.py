#!/usr/bin/python3

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.base_model import Base
from models.user import User
from models.reminder import Reminder
from models.reflection import Reflection
from models.streak import Streak

# Configure database URL
DB_USER = os.getenv('REMIND_ME_MYSQL_USER', 'remind_me_dev')
DB_PWD = os.getenv('REMIND_ME_MYSQL_PWD', 'Remind_me_dev_pwd1')
DB_HOST = os.getenv('REMIND_ME_MYSQL_HOST', 'localhost')
DB_NAME = os.getenv('REMIND_ME_MYSQL_DB', 'remind_me_dev_db')
DB_URL = f'mysql+mysqldb://{DB_USER}:{DB_PWD}@{DB_HOST}/{DB_NAME}'

# Create the engine and session
engine = create_engine(DB_URL)

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()


# Function to add sample data to the database
def add_sample_data():
    # Create Users
    user1 = User()
    user2 = User()

    # Add user information
    user1.user_name = "JohnDoe"
    user1.user_custom_id = 1
    user1.email = "john@example.com"
    user1.password = "password123"
    user1.first_name = "John"
    user1.last_name = "Doe"
    user1.profession = "Engineer"
    user1.gender = "Male"
    user1.description = "A regular user"
    user1.img_url = "http://example.com/johndoe.jpg"

    user2.user_name = "JaneSmith"
    user2.user_custom_id = 2
    user2.email = "jane@example.com"
    user2.password = "password123"
    user2.first_name = "Jane"
    user2.last_name = "Smith"
    user2.profession = "Doctor"
    user2.gender = "Female"
    user2.description = "Another regular user"
    user2.img_url = "http://example.com/janesmith.jpg"

    session.add_all([user1, user2])
    session.commit()

    # Create Reminders
    reminder1 = Reminder()
    reminder1.public = True
    reminder1.is_text = True
    reminder1.text = "Buy groceries"
    reminder1.user_id = user1.id
    session.add(reminder1)

    reminder2 = Reminder()
    reminder2.public = True
    reminder2.is_text = False
    reminder2.user_id = user2.id
    reminder2.img_url = "http://example.com/reminder2.jpg"
    reminder2.caption = "Important reminder"
    session.add(reminder2)

    session.commit()

    # Create Reflections
    reflection1 = Reflection()
    reflection1.user_id = user1.id
    reflection1.reminder_id = reminder1.id
    reflection1.content = "Don't forget the milk!"
    session.add(reflection1)

    reflection2 = Reflection()
    reflection2.user_id = user2.id
    reflection2.reminder_id = reminder2.id
    reflection2.content = "This is very important!"
    session.add(reflection2)

    session.commit()

    # Create Streaks
    streak1 = Streak()
    streak1.user_id = user1.id
    streak1.days = 5
    session.add(streak1)

    streak2 = Streak()
    streak2.user_id = user2.id
    streak2.days = 3
    session.add(streak2)

    session.commit()

    print("Sample data added successfully!")


if __name__ == "__main__":
    print("Executing this command will drop all rows from the tables,\
     are you sure you want to proceed? (y/n)")
    response = input()
    if response.lower() == 'y':
        for table in Base.metadata.tables.values():
            session.query(table).delete()
            session.commit()
            print(f"Successfully deleted all rows from {table.name}")
        print("All rows have been cleared from all tables.")
    else:
        print("No changes have been made.")
    add_sample_data()
