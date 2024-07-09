#!/usr/bin/python3
"""Module that handles views for reminders"""

from api.v1.views import app_views
from models import storage
from models.reminder import Reminder
from flask import jsonify, abort, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User


@app_views.route("/reminders", strict_slashes=False, methods=["GET"])
def get_reminders():
    """Retrieves the list of all public reminders in the RemindMe app"""
    reminders = storage.all(Reminder).values()
    return jsonify([reminder.to_dict() for reminder in reminders])


@app_views.route("/reminders/<reminder_id>", strict_slashes=False,
                 methods=["GET"])
@jwt_required()
def get_reminder(reminder_id):
    """Retrieves a specific reminder in the RemindMe app"""
    reminder = storage.get(Reminder, reminder_id)
    if not reminder:
        abort(404)
    return jsonify(reminder.to_dict())


@app_views.route("/users/<user_id>/reminders", strict_slashes=False,)
@jwt_required()
def get_reminders_by_user(user_id):
    """Gets all reminders by a specific user"""
    current_user_id = get_jwt_identity()  # Get current user
    if current_user_id != user_id:
        abort(403, description="Access forbidden")

    user = storage.get(User, user_id)
    if not user:
        abort(404, description="User not found")

    reminders = storage.all(Reminder).values()
    user_reminders = []
    for reminder in reminders:
        if reminder.user_id == user_id:
            user_reminders.append(reminder.to_dict())
    return jsonify(user_reminders)


@app_views.route("/reminders", strict_slashes=False, methods=["POST"])
@jwt_required()
def create_reminder():
    """Creates new Reminder"""
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()  # Get data from request
    if 'text' not in data:
        abort(400, description="Missing text")

    new_reminder = Reminder()  # Create new Reminder
    for key, value in data.items():
        if key not in ['id', 'user_id', 'created_at', 'updated_at']:
            setattr(new_reminder, key, value)
    new_reminder.save()
    return jsonify(new_reminder.to_dict()), 201


@app_views.route(
    "/reminders/<reminder_id>", strict_slashes=False, methods=["PUT"])
@jwt_required()
def update_reminder(reminder_id):
    """Updates an existing Reminder"""
    reminder = storage.get(Reminder, reminder_id)
    if not reminder:
        abort(404)
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()  # Get data from request
    ignore_keys = ["id", "user_id", "created_at", "updated_at"]

    for key, value in data.items():
        if key not in ignore_keys:
            setattr(reminder, key, value)  # Update reminder
    reminder.save()
    return jsonify(reminder.to_dict())  # Return updated reminder


@app_views.route(
    "/reminders/<reminder_id>", strict_slashes=False, methods=["DELETE"])
@jwt_required()
def delete_reminder(reminder_id):
    """Deletes an existing Reminder"""
    reminder = storage.get(Reminder, reminder_id)
    if not reminder:
        abort(404)
    storage.delete(reminder)
    storage.save()
    return jsonify({}), 200
