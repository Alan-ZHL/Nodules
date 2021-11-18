from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient

from api.config import Config
from api.models import collection_posts, collection_courses, collection_users
from api.models.load_sample import load_samples


def create_app(configs="api.config.Config"):
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(configs)

    return app

app = create_app()
load_samples(collection_posts, collection_courses, collection_users, clearup=True)