from flask import Blueprint, jsonify, request, session
from pymongo import DESCENDING
from datetime import datetime, timedelta

from api.views import posts
from api import collection_posts


# TODO: simplify the post format for postcards
@posts.route("/api/posts/cards", methods=["POST"])
def get_multiple_postcards():
    data = request.get_json()
    access = data["access"]
    courses = data["courses"]
    author_id = data["author_id"]
    sort = [("date", DESCENDING)] if data["sort"] == "date" else [("details.hotness", DESCENDING)]
    posts = filter_posts({"access": access, "type": 2, "courses": courses, "author_id": author_id}, sort=sort, skip=data["skip"], limit=data["limit"])
    
    return jsonify(posts)


@posts.route("/api/posts/get_post", methods=["POST"])
def get_post():
    data = request.get_json()

    try:
        post = collection_posts.find_one({"post_id": data["post_id"]}, projection={"_id": False})
        if post:
            post["date"] = transfer_date(post["date"])
            return jsonify(post)
        return jsonify({"post_id": -1})
    except Exception as e:
        print(e)
        return jsonify({"post_id": -1})


@posts.route("/api/posts/notifs", methods=["POST"])
def get_notifs():
    data = request.get_json()
    courses = data["courses"]
    author_id = data["author_id"]
    notifs = filter_posts({"access": 1, "type": 1, "courses": courses, "author_id": author_id})
    
    return jsonify(notifs)


@posts.route("/api/posts/comments", methods=["POST"])
def get_comments():
    data = request.get_json()
    indices = data["indices"]
    access = data["access"]
    author_id = data["author_id"]
    # print(data)
    comments = filter_posts({"access": access, "type": 3, "indices": indices, "author_id": author_id})

    return jsonify(comments)


@posts.route("/api/posts/update_like", methods=["POST"])
def update_likes():
    data = request.get_json()
    like_state = data["like_state"]
    try:
        user_details = collection_posts.find_one({"post_id": data["post_id"]}, projection={"_id": False, "details": True})["details"]
        # like_state: 
        #     0: no change; 1: liked; 2: like cancelled; 3: liked and dislike cancelled; 
        #     4: disliked; 5: dislike cancelled; 6: disliked and like cancelled
        if like_state == 1 or like_state == 3:
            user_details["likes"].append(data["user_id"])
            user_details["hotness"] += 1
        if like_state == 2 or like_state == 6:
            user_details["likes"].remove(data["user_id"])
            user_details["hotness"] -= 1
        if like_state == 4 or like_state == 6:
            user_details["dislikes"].append(data["user_id"])
            user_details["hotness"] -= 1
        if like_state == 3 or like_state == 5:
            user_details["dislikes"].remove(data["user_id"])
            user_details["hotness"] += 1

        collection_posts.update_one({"post_id": data["post_id"]}, {"$set": {"details": user_details}})
        # print(data["user_id"] in user_details["likes"], data["user_id"] in user_details["dislikes"])
        return jsonify({"status": 1})
    except Exception as e:
        print(e)
        return jsonify({"status": 0})


@posts.route("/api/posts/update_comments", methods=["POST"])
def update_comments():
    data = request.get_json()
    try:
        user_details = collection_posts.find_one({"post_id": data["post_id"]}, projection={"_id": False, "details": True})["details"]
        if data["comment_id"] not in user_details["comments"]:
            user_details["comments"].append(data["comment_id"])
            user_details["hotness"] += 2
        collection_posts.update_one({"post_id": data["post_id"]}, {"$set": {"details": user_details}})
        new_comment = collection_posts.find_one({"post_id": data["comment_id"]}, projection={"_id": False})
        if new_comment:
            new_comment["date"] = transfer_date(new_comment["date"])
            return jsonify(new_comment)
        return jsonify({"post_id": -1})
    except Exception as e:
        print(e)
        return jsonify({"post_id": -1})



@posts.route("/api/posts/add_post", methods=["POST"])
def add_post():
    data = request.get_json()
    max_id = 1
    try:
        for post in collection_posts.find(sort=[("post_id", DESCENDING)], limit=1, projection={"post_id": True}):
            max_id = post["post_id"] + 1
        data["course_id"] = data["course_id"].upper()
        data["post_id"] = max_id
        data["date"] = datetime.now()
        data["details"] = {"hotness": 0, "likes": [], "dislikes": [], "comments": []}
        collection_posts.insert_one(data)
        return jsonify({"post_id": max_id})
    except Exception as e:
        print(e)
        return jsonify({"post_id": -1})


# helper functions

# filter_posts: filter posts, notifs or comments with reagard to author_id and course_id
'''
    access: 1: course; 2: public
    type: 0: any; 1: notification; 2: post; 3: comment
    indices, courses: [0]: any
    author_id: 0: any
'''
def filter_posts(post_kwargs, sort=[("date", DESCENDING)], skip=0, limit=0):
    post_filters = {"access": post_kwargs["access"]}    # must provide "access" as one of post_kwargs
    projection = {"_id": False}

    if "type" in post_kwargs and post_kwargs["type"] != 0:
        post_filters["post_type"] = post_kwargs["type"]
    if "indices" in post_kwargs and 0 not in post_kwargs["indices"]:
        post_filters["post_id"] = {"$in": post_kwargs["indices"]}
    if "courses" in post_kwargs and 0 not in post_kwargs["courses"]:
        post_filters["course_id"] = {"$in": post_kwargs["courses"]}
    if "author_id" in post_kwargs and post_kwargs["author_id"] != 0:
        post_filters["author_id"] = post_kwargs["author_id"]
    # print(post_filters)

    try:
        filtered_posts = []
        count = collection_posts.count_documents(post_filters)
        for post in collection_posts.find(post_filters, sort=sort, skip=skip, limit=limit, projection=projection):
            post["date"] = transfer_date(post["date"])
            filtered_posts.append(post)
        # print(filtered_posts)
        return {"count": count, "posts": filtered_posts}
    except Exception as e:
        print(e)
        return {"count": 0, "posts": []}


# transfer_date: transfer a python datime object to a string
def transfer_date(date):
    now = datetime.now()
    delta = now - date
    if delta.days > 14:
        return f"{date.year}-{date.month}-{date.day}"
    elif delta.days > 1:
        return f"{delta.days} days ago"
    elif delta.days > 0:
        return "yesterday"
    elif delta.seconds > 3599:
        hours = delta.seconds // 3600
        return "1 hour ago" if hours == 1 else f"{hours} hours ago"
    else:
        return "whithin 1 hour"