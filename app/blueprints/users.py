from flask_login import login_required, current_user
from flask import render_template, Blueprint
from models import storage_t

users = Blueprint('users', __name__)


@users.route('/profile', strict_slashes=False)
@login_required
def user_profile():
    """Get user profile page"""
    reminders = current_user.reminders
    return render_template(
        'user_reminders.html',
        user=current_user,
        reminders=reminders,
        )
