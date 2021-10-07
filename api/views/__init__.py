from flask import Blueprint

# hard-coded import_name: change when renaming the corresponding files!!
posts = Blueprint("posts", "api.views.view_posts")
courses = Blueprint("courses", "api.views.view_courses")
users = Blueprint("users", "api.views.view_users")