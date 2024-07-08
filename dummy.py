from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, username, password, full_name):
        self.username = username
        self.password = password
        self.full_name = full_name

    def get_id(self):
        return self.username

users = {
    "user1": User("user1", "password1", "John Doe"),
    "user2": User("user2", "password2", "Jane Smith"),
    "user3": User("user3", "password3", "Alice Johnson"),
    "user4": User("user4", "password4", "Bob Brown")
}
