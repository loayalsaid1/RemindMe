from flask_login import login_required, current_user
from flask import render_template, Blueprint, abort
from models import storage
from models.user import User


users = Blueprint('users', __name__)


@users.route('/profile', strict_slashes=False)
@login_required
def user_profile():
    """Get user profile page"""
    current_user.expand_streak()
    reminders = current_user.reminders
    return render_template(
        'user_reminders.html',
        user=current_user,
        reminders=reminders,
        user_reminders=True
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

@users.route('/profile/<username>', strict_slashes=False)
@login_required
def user_profile_by_username(username):
    """Show other users profiles"""
    try:
        profile_owner = storage.filter_objects(User, "user_name", username)[0]
    except IndexError:
        abort(404, description="User not found")
    
    reminders = storage.get_user_public_reminders(profile_owner.id)

    return render_template(
        'others_profile.html',
        user=current_user,
        reminders=reminders,
        profile_owner=profile_owner
        )
