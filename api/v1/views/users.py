#!/usr/bin/python3
import os
import tempfile
from imagekitio import ImageKit
from flask import jsonify, request, abort
from models import storage
from models.user import User
from api.v1.views import app_views
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.v1.serializers import user_public_dict, make_initial_username

IMAGEKIT_PRIVATE_KEY = os.getenv('IMAGEKIT_PRIVATE_KEY')
IMAGEKIT_PUBLIC_KEY = os.getenv('IMAGEKIT_PUBLIC_KEY')
IMAGEKIT_URL_ENDPOINT = os.getenv('IMAGEKIT_URL_ENDPOINT')

ik = ImageKit(
    private_key=IMAGEKIT_PRIVATE_KEY,
    public_key=IMAGEKIT_PUBLIC_KEY,
    url_endpoint=IMAGEKIT_URL_ENDPOINT
)


@app_views.route("/users", methods=["GET"], strict_slashes=False)
def get_users():
    """Retrieves the list of all users (public fields only)."""
    users = storage.all(User).values()
    return jsonify([user_public_dict(user) for user in users])


@app_views.route("/users/username/<username>", methods=["GET"], strict_slashes=False)
def get_user_by_username(username):
    """Public lookup by username. Empty list is not used; 404 if missing."""
    found = storage.filter_objects(User, "user_name", username)
    if not found:
        abort(404)
    return jsonify(user_public_dict(found[0]))


@app_views.route("users/<user_id>", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_user(user_id):
    """Retrieves a specific user. Identity from cookie, compared to path id."""
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        abort(403, description="Access forbidden")
    user = storage.get(User, user_id)
    if not user:
        abort(404)
    return jsonify(user_public_dict(user))


@app_views.route("/users", methods=["POST"], strict_slashes=False)
def create_user():
    """Creates a new RemindMe user. Username is generated server-side."""
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()
    if "email" not in data or "password" not in data:
        abort(400, description="Missing email or password")
    if storage.get_user_by_email(data["email"]):
        abort(400, description="Email already exists")

    new_user = User()
    first_name = data.get("first_name", "")
    last_name = data.get("last_name", "")
    for key, value in data.items():
        if key not in ["id", "created_at", "updated_at", "user_name", "password"]:
            setattr(new_user, key, value)
    new_user.user_name = make_initial_username(storage, first_name, last_name)
    new_user.set_password(data["password"])
    new_user.save()
    return jsonify(user_public_dict(new_user)), 201


@app_views.route("/users/<user_id>", methods=["PUT"], strict_slashes=False)
@jwt_required()
def update_user(user_id):
    """Update the profile of the authenticated user only."""
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        abort(403, description="Access forbidden")

    user = storage.get(User, user_id)
    if not user:
        abort(404)

    if request.is_json:
        data = request.get_json() or {}
    else:
        data = request.form.to_dict()

    if not data and not request.files:
        abort(400, description="No data provided")

    # Handle image file upload if provided
    image_file = request.files.get('profile_image') or request.files.get('image')
    if image_file and image_file.filename:
        extension = image_file.filename.split('.')[-1]
        with tempfile.NamedTemporaryFile(suffix=f'.{extension}', delete=False) as temp_file:
            temp_file_path = temp_file.name
            image_file.save(temp_file_path)

        try:
            with open(temp_file_path, 'rb') as f:
                result = ik.upload_file(
                    file=f,
                    file_name=f'profile_{user.id}.{extension}'
                )
            if result.response_metadata.http_status_code == 200:
                data['img_url'] = result.url
            else:
                abort(500, description="Failed to upload image")
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    elif str(data.get('remove_image', '')).lower() in ['true', '1']:
        data['img_url'] = None

    ignore_keys = ["id", "created_at", "updated_at", "email", "profile_image", "image", "remove_image"]

    for key, value in data.items():
        if key not in ignore_keys:
            if key == "password":
                user.set_password(value)
            elif key == "img_url" and (value == "" or value == "null" or value is None):
                setattr(user, key, None)
            else:
                setattr(user, key, value)

    user.save()
    return jsonify(user_public_dict(user))


@app_views.route("/user/<user_id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
def delete_user(user_id):
    """Delete user, close account, deactivate account"""
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        abort(403, description="Access forbidden")

    user = storage.get(User, user_id)
    if not user:
        abort(404, description="User not found")

    user.delete()
    storage.save()
    return jsonify({"success": True}), 200


@app_views.route("/check_user/<username>", strict_slashes=False)
def check_user(username):
    """Check if a user with a username exists"""
    user = storage.filter_objects(User, "user_name", username)
    if user:
        return jsonify({"exists": True}), 200
    return jsonify({"exists": False}), 404
