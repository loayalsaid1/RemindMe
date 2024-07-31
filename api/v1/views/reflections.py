#!/usr/bin/python3
"""Module that handles views for reflections"""

from flask import jsonify, abort, request
from models import storage
from models.reflection import Reflection
from models.reminder import Reminder
from models.user import User
from api.v1.views import app_views
from flask_jwt_extended import jwt_required, get_jwt_identity


@app_views.route('/reminders/<reminder_id>/reflections', methods=[
    'GET'], strict_slashes=False)
@jwt_required()
def get_reflections_by_reminder(reminder_id):
    """Retrieves all reflections for a particular reminder"""
    reminder = storage.get(Reminder, reminder_id)

    if not reminder:
        abort(404, description="Reminder not found")
    reflections = [
        reflection.to_dict() for reflection in reminder.reflections]
    return jsonify(reflections)


@app_views.route(
    '/users/<user_id>/reflections', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_reflections_by_user(user_id):
    """Retrieves all reflections by a specific user"""
    current_user_id = get_jwt_identity()  # Get current user
    if current_user_id != user_id:
        abort(403, description="Access forbidden")

    user = storage.get(User, user_id)
    if not user:
        abort(404, description="User not found")

    reflections = storage.all(Reflection).values()
    for reflection in reflections:
        if reflection.user_id == user_id:
            user_reflections = reflection.to_dict()
    return jsonify(user_reflections)


@app_views.route('/reminders/<reminder_id>/reflections', methods=[
    'POST'], strict_slashes=False)
@jwt_required()
def create_reflection(reminder_id):
    """Creates a new reflection by a specific user"""
    user_id = get_jwt_identity()  # Get current user
    if not user_id:
        # Idon't know why this message was written?!
        abort(403, description="Access forbidden")

    user = storage.get(User, user_id)
    if not user:
        abort(404, description="User not found")
    
    data = request.get_json()
    if not data:
        abort(400, "Where is the request JSON Body?!")

    if 'content' not in data:
        abort(400, description="Missing content")

    reminder = storage.get(Reminder, reminder_id)
    if not reminder:
        abort(404, description="Reminder not found")

    reflection = Reflection()
    reflection.user_id = user_id
    reflection.reminder_id = reminder_id
    reflection.content = data['content']
    
    reflection.save()
    
    response = reflection.to_dict()
    response['updated_at'] = reflection.updated_at.strftime('%Y-%m-%d %H:%M GMT')

    # I think this is kinda breaking the rules.. But I'm gonna do it anyways now. 😁😎😁
    # 😉
    # I'm going to send user name and username with the response to save myself an api call!
    # and.....
    # time 😅😇
    # I think I could have done it in the time iam seaching for these emojies and writing this.
    # ha ha ha

    response['user_full_name'] = f"{reflection.user.first_name} {reminder.user.last_name}"
    response['username'] = reflection.user.user_name
    response['user_img_url'] = reflection.user.img_url

    return jsonify(response), 201


@app_views.route('/reflections/<reflection_id>', methods=[
    'PUT'], strict_slashes=False)
@jwt_required()
def update_reflection(reflection_id):
    """Updates a specific reflection"""
    current_user_id = get_jwt_identity()
    reflection = storage.get(Reflection, reflection_id)
    if not reflection:
        abort(404, description="Reflection not found")
    if reflection.user_id != current_user_id:
        abort(403, description="Permission denied")

    if not request.json:
        abort(400, description="Not a JSON")
    data = request.get_json()
    for key, value in data.items():
        setattr(reflection, key, value)
    reflection.save()
    return jsonify(reflection.to_dict()), 200


# TODO Refactor this for more security.. No time now.
@app_views.route('/reflections/<reflection_id>', methods=[
    'DELETE'], strict_slashes=False)
@jwt_required()
def delete_reflection(reflection_id):
    """Deletes a reflection"""
    current_user_id = get_jwt_identity()
    reflection = storage.get(Reflection, reflection_id)
    if not reflection:
        abort(404, description="Reflection not found")
    if reflection.user_id != current_user_id:
        abort(403, description="Permission denied")

    storage.delete(reflection)
    storage.save()
    return jsonify({}), 200
