from flask import Blueprint, jsonify, request

from api.views import courses
from api import collection_courses


@courses.route("/api/courses/info", methods=["POST"])
def display_courses():
    data = request.get_json()
    courseid = data["course_id"]

    try:
        course = collection_courses.find_one({"course_id": courseid}, projection={"_id": False})
        # print(course, type(course))
        return jsonify(course)
    except Exception as e:
        print(e)
        return jsonify({"course_id": ""})