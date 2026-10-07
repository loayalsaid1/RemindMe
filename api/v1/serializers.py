#!/usr/bin/python3
"""Public JSON shapes for API responses. Strip secrets; attach computed fields."""

from models.user import User


def make_initial_username(storage, first_name, last_name):
    """Build a unique username from first + last name."""
    initial_username = "".join(
        e for e in f"{first_name}{last_name}" if e.isalnum()
    ).lower()
    if not initial_username:
        initial_username = "user"
    if not storage.filter_objects(User, "user_name", initial_username):
        return initial_username
    i = 1
    while True:
        candidate = f"{initial_username}{i}"
        if not storage.filter_objects(User, "user_name", candidate):
            return candidate
        i += 1


def user_public_dict(user):
    """User JSON without password. Includes streak day counts for the UI."""
    data = user.to_dict()
    data.pop("password", None)
    current = user.current_streak
    longest = user.longest_streak
    data["current_streak"] = {"days": current.days if current else 0}
    data["longest_streak"] = {"days": longest.days if longest else 0}
    return data


def reflection_public_dict(reflection):
    """Reflection JSON with denormalized author fields the UI already expects."""
    data = reflection.to_dict()
    author = reflection.user
    if author:
        data["user_full_name"] = f"{author.first_name} {author.last_name}"
        data["username"] = author.user_name
        data["user_img_url"] = author.img_url
    else:
        data["user_full_name"] = ""
        data["username"] = ""
        data["user_img_url"] = None
    return data
