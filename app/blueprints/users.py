from flask_login import login_required, current_user
from flask import render_template, Blueprint
from models import storage_t

users = Blueprint('users', __name__)


@users.route('/profile', strict_slashes=False)
@login_required
def nonesense():
	"""Get user profile page"""
	reminders = current_user.reminders
	print(storage_t)
	print(reminders)
	for reminder in reminders:
		print(reminder)
	return render_template(
		'profile.html',
		user=current_user,
		reminders=reminders,
		useless_variable_passed_to_jinja_template="Hey,, I am a garbage string which has no meaning or purpose.. I am here to demonstrate that I dont' evne know what iam talking about"
		)
