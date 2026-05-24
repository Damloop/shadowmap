# src/api/__init__.py

from flask import Flask
from flask_cors import CORS
from src.api.models import db
from src.api.extensions import mail
