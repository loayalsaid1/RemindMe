#!/usr/bin/python3
"""Streaks model for RemindMe application"""
from models.base_model import BaseModel, Base
from models import storage_t
from sqlalchemy import Column, String, Integer, ForeignKey


class Streak(BaseModel, Base):
    """Class that models user streaks of RemindMe application"""
    __tablename__ = "streaks"

    if storage_t == "db":
        user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
        days = Column(Integer, default=1)
    else:
        user_id = ""
        days = 1
