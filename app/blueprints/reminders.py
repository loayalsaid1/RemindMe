from flask_login import login_required, current_user
from flask import render_template, Blueprint, abort
from models import storage
from models.reflection import Reflection
from models.reminder import Reminder

reminders = Blueprint('reminders', __name__, url_prefix='/reminders')

@reminders.route('/<reminder_id>', strict_slashes=False)
@login_required
def get_reminder(reminder_id):
	"""Get a page with the reminder and it's reflections"""
	reminder = storage.get(Reminder, reminder_id)
	if not reminder:
		abort(404, 'Reminder not fount')

	reflections = storage.filter_objects(Reflection, 'reminder_id', reminder_id)

	# Add user reflections in the begenning of the list
	for i in range(len(reflections)):
		if reflections[i].user_id == current_user.id:
			obj = reflections.pop(i)
			reflections.insert(0, obj)

	if reminder.user_id == current_user:
		return render_template('reminder.html', profile_owner=reminder.user,
		user=current_user, reminder=reminder, reflections=reflections,
		 owner=True)	
	else:
		return render_template('reminder.html', profile_owner=reminder.user,
		user=current_user, reminder=reminder, reflections=reflections,
		 owner=False)	
