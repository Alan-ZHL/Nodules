from flask import Blueprint, jsonify, request

from api.views import courses
from api import collection_courses


@courses.route("/api/courses/info", methods=["POST"])
def display_courses():
    data = request.get_json()
    courseid = data["course_id"]

    try:
        course = collection_courses.find_one({"course_id": courseid}, projection={"_id": False})
        return jsonify(course) if course != None else {"course_id": ""}
    except Exception as e:
        print(e)
        return jsonify({"course_id": ""})


@courses.route("/api/courses/get_name", methods=["POST"])
def get_course_name():
    data = request.get_json()
    courseid = data["course_id"]

    try:
        course = collection_courses.find_one({"course_id": courseid.upper()}, projection={"_id": False, "course_name": True})
        return jsonify(course) if course != None else {"course_name": ""}
    except Exception as e:
        print(e)
        return jsonify({"course_name": ""})