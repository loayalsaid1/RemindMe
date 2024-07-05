REMIND_ME_MYSQL_USER=remind_me_dev    REMIND_ME_MYSQL_PWD=Remind_me_dev_pwd1        REMIND_ME_MYSQL_HOST=localhost   REMIND_ME_MYSQL_DB=remind_me_dev_db REMIND_ME_TYPE_STORAGE=db


localhost
Remind_me
remind_me_dev


self.user = User()
self.user.user_name = "test_user"
self.user.password = "test_password"
self.user.first_name = "test_first_name"
self.user.last_name = "test_last_name"
self.user.email = "test_email"
self.user.save()

reminder = Reminder()
reminder.user_id = self.user.id
reminder.is_text = True
reminder.public = True
reminder.text = "Reminder text"
reminder.save()

reflection = Reflection()
reflection.user_id = self.user.id
reflection.reminder_id = reminder.id
reflection.content = "Reflection text"
reflection.save()

streak = Streak()
streak.user_id = self.user.id
streak.days = 1
streak.save()
