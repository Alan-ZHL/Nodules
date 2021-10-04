from flask import Flask
from flask_cors import CORS

from .view_posts import posts
from .view_courses import courses
from .view_users import users


def create_app(configs="api.config.Config"):
    app = Flask(__name__)
    CORS(app)
    # app.config.from_object(configs)

    app.register_blueprint(posts)
    app.register_blueprint(courses)
    app.register_blueprint(users)

    return app