#!/usr/bin/python3
"""Module that handles views for reflections"""

from flask import jsonify, abort, request
from models import storage
from models.reflection import Reflection
from models.reminder import Reminder
from models.user import User
from api.v1.views import app_views


@app_views.route(
    '/reminders/<reminder_id>/reflections', methods=['GET'], strict_slashes=False)
def get_reflections_by_reminder(reminder_id):
    """Retrieves all reflections for a particular reminder"""
    reminder = storage.get(Reminder, reminder_id)
    if not reminder:
        abort(404, description="Reminder not found")
    reflections = [reflection.to_dict() for reflection in reminder.reflections]
    return jsonify(reflections)


@app_views.route('/users/<user_id>/reflections', methods=['GET'], strict_slashes=False)
def get_reflections_by_user(user_id):
    """Retrieves all reflections by a specific user"""
    user = storage.get(User, user_id)
    if not user:
        abort(404, description="User not found")
    reflections = storage.all(Reflection).values()
    user_reflections = [reflection.to_dict()
                        for reflection in reflections if reflection.user_id == user_id]
    return jsonify(user_reflections)


@app_views.route('/users/<user_id>/reflections', methods=['POST'], strict_slashes=False)
def create_reflection(user_id):
    """Creates a new reflection by a specific user"""
    user = storage.get(User, user_id)
    if not user:
        abort(404, description="User not found")
    if not request.json:
        abort(400, description="Not a JSON")
    data = request.get_json()
    if 'reminder_id' not in data:
        abort(400, description="Missing reminder_id")
    if 'content' not in data:
        abort(400, description="Missing content")

    reminder = storage.get(Reminder, data['reminder_id'])
    if not reminder:
        abort(404, description="Reminder not found")

    reflection = Reflection(
        user_id=user_id, reminder_id=data['reminder_id'], content=data['content'])
    reflection.save()
    return jsonify(reflection.to_dict()), 201
