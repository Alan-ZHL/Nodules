from api import app
from api.views.view_posts import posts
from api.views.view_courses import courses
from api.views.view_users import users

app.register_blueprint(posts)
app.register_blueprint(courses)
app.register_blueprint(users)


if __name__ == "__main__":
    app.run(debug=True)