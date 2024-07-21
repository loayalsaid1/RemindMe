#!/usr/bin/python3
"""Module that handles views for reminders"""

from imagekitio import ImageKit
from flask import request
from api.v1.views import app_views
from models import storage
from models.reminder import Reminder
from flask import jsonify, abort, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
import os

# ImageKit Credentials
IMAGEKIT_PRIVATE_KEY = "private_edl1a45K3hzSaAhroLRPpspVRqM="
IMAGEKIT_PUBLIC_KEY = "public_tTc9vCi5O7L8WVAQquK6vQWNx08="
IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/loayalsaid1/"


ik = ImageKit(
    private_key=IMAGEKIT_PRIVATE_KEY,
    public_key=IMAGEKIT_PUBLIC_KEY,
    url_endpoint=IMAGEKIT_URL_ENDPOINT
)


@app_views.route("/reminders", strict_slashes=False, methods=["GET"])
def get_reminders():
    """Retrieves the list of all public reminders in the RemindMe app"""
    reminders = storage.all(Reminder).values()
    public_reminders = [reminder.to_dict()
                        for reminder in reminders if reminder.public]
    return jsonify(public_reminders)


@app_views.route("/reminders/<reminder_id>", strict_slashes=False,
                 methods=["GET"])
def get_reminder(reminder_id):
    """Retrieves a specific reminder in the RemindMe app"""
    reminder = storage.get(Reminder, reminder_id)
    if not reminder:
        abort(404)
    if not reminder.public:
        abort(403, description="Access forbidden")
    return jsonify(reminder.to_dict())


@app_views.route("/users/<user_id>/reminders", strict_slashes=False, methods=["GET"])
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
    user_reminders = [reminder.to_dict()
                      for reminder in reminders if reminder.user_id == user_id]
    return jsonify(user_reminders)


@app_views.route("/reminders", strict_slashes=False, methods=["POST"])
# @jwt_required()
def create_reminder():
    """Creates new Reminder"""
    # Get user_id from JWT token
    # user_id = get_jwt_identity()
    user_id = "55882be5-acd3-4f31-ad15-d28f824ca577"

    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()  # Get data from request
    data['user_id'] = user_id

    new_reminder = Reminder()  # Create new Reminder

    if 'is_text' in data and data['is_text'] == False:
        if 'image' in request.files:
            image = request.files['image']
            extention = image.filename.split('.')[-1]
            temp_file_path = f'temp_image.{extention}'
            image.save(temp_file_path)

            # Upload image to ImageKit
            response = ik.upload([temp_file_path], options={
                                 "use_unique_file_name": False})
            img_url = response['files'][0]['url']

            os.remove(temp_file_path)  # Remove temporary file

            data['img_url'] = img_url

    for key, value in data.items():
        if key not in ['id', 'created_at', 'updated_at']:
            setattr(new_reminder, key, value)

    new_reminder.save()
    return jsonify(new_reminder.to_dict()), 201


@app_views.route(
    "/reminders/<reminder_id>", strict_slashes=False, methods=["PUT"])
@jwt_required()
def update_reminder(reminder_id):
    """Updates an existing Reminder"""
    user_id = get_jwt_identity()  # Get current user id
    reminder = storage.get(Reminder, reminder_id)
    if not reminder:
        abort(404, description="Reminder not found")
    if reminder.user_id != user_id:
        abort(403, description="Access forbidden")
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()  # Get data from request

    if 'is_text' in data and data['is_text'] is False:
        if 'image' in request.files:
            image = request.files['image']
            extention = image.filename.split('.')[-1]
            temp_file_path = f'temp_image.{extention}'
            image.save(temp_file_path)

            # Upload image to ImageKit
            response = ik.upload([temp_file_path], options={
                                 "use_unique_file_name": False})
            img_url = response['files'][0]['url']

            os.remove(temp_file_path)  # Remove temporary file

            data['img_url'] = img_url

    for key, value in data.items():
        if key not in ['id', 'created_at', 'updated_at']:
            setattr(reminder, key, value)  # Update reminder

    reminder.save()
    return jsonify(reminder.to_dict()), 200


@app_views.route(
    "/reminders/<reminder_id>", strict_slashes=False, methods=["DELETE"])
@jwt_required()
def delete_reminder(reminder_id):
    """Deletes an existing Reminder"""
    user_id = get_jwt_identity()  # Get current user id
    reminder = storage.get(Reminder, reminder_id)
    if not reminder:
        abort(404)
    if reminder.user_id != user_id:
        abort(403, description="Access forbidden")
    storage.delete(reminder)
    storage.save()
    return jsonify({}), 200
