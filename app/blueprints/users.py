from flask_login import login_required, current_user
from flask import render_template, Blueprint
from models import storage

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


@users.route('/public_reminders', strict_slashes=False)
@login_required
def public_reminders():
    """Serve public reminders page

        Get 40 random public reminder
    """
    reminders = storage.get_random_public_reminders(limit=40)
    
    return render_template(
        'public_reminders.html',
        user=current_user,
        reminders=reminders,
        public_ewall=True
        )
