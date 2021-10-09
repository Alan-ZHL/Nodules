from flask import Flask
from flask_cors import CORS

from api.config import Config


def create_app(configs="api.config.Config"):
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(configs)

    return app

app = create_app()
# login_manager = app.static_folder # (put your init code here)



# # add these imports if the project is run with "flask run (FLASK_APP=api)"
# from api.views.view_posts import posts
# from api.views.view_courses import courses
# from api.views.view_users import users

# app.register_blueprint(posts)
# app.register_blueprint(courses)
# app.register_blueprint(users)