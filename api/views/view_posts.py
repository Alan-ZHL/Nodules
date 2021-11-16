from flask import Blueprint, jsonify, request, session
from api.views import posts


# hard-coded data notifications, posts and comments
# TODO: remove "author_name" from post's metadata, and use additional query to retrieve that (allow for changes in user_name)
notifs_sample = [
    {"post_id": 1, "title": "Remember to submit tutorial 4", "access": 0, "post_type": 0, 
    "course_id": "IT5007", "course_name": "Software Engineering on Application Architecture",
    "author_id": 1001, "author_name": "Prasanna Karthik Vairam", "date":"2021-09-30",
    "content": "remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd!"},
    {"post_id": 2, "title": "Exam date determined", "access": 0, "post_type": 0,
    "course_id": "IT5002", "course_name": "Computer Systems and Applications",
    "author_id": 1002, "author_name": "Colin Tan", "date": "2021-09-03", 
    "content": "Midterm exam is set on Oct 5th. Please be prepared."}, 
    {"post_id": 3, "title": "Welcome to CS4226!", "access": 0, "post_type": 0, 
    "course_id": "CS4226", "course_name": "Internet Architecture", 
    "author_id": 1003, "author_name": "Richard Ma", "date": "2021-08-26", 
    "content": "Welcome to CS4226. I will be the lecturer of this course. Looking forward to meeting all of you!"}
]
posts_sample = [];    # TODO: remove "snippet" and generate with string contatenation
comments_sample = [];
for i in range(16):
    posts_sample.append({
        "post_id": 1056 + i, "title": f"Sample post {i}", "access": 1, "post_type": 1,
        "course_id": "IT5007", "course_name": "Software Engineering on Application Architecture",
        "author_id": 2001, "author_name": "Donald Trump ex", "date": "2 days ago",
        "content": "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product protopost_types beautifully and efficiently.",
        "snippet": "We supply a series of design principles, practical patterns and high quality design resources...",
        "details": {"likes": 156, "dislikes": 18, "comments": [i, i+1, i+2]}
    })
for i in range(18):
    comments_sample.append({
        "post_id": i, "title": "", "access": 1, "post_type": 2,
        "course_id": "IT5007", "course_name": "Software Engineering on Application Architecture",
        "author_id": 2002, "author_name": "Biden III", "date": "2 days ago",
        "content": f"Good job! {i}",
        "details": {"likes": 10, "dislikes": 2}
    })


@posts.route("/api/posts/cards", methods=["POST"])
def get_multiple_postcards():
    data = request.get_json()
    course_id = data["course_id"]
    if course_id == 0:
        return jsonify(posts_sample)
    else:
        posts = []
        for post in posts_sample:
            if post["course_id"] == course_id:
                posts.append(post)
        return jsonify(posts)


@posts.route("/api/posts/get_post", methods=["POST"])
def get_post():
    data = request.get_json()
    for post in posts_sample:
        if post["post_id"] == data["post_id"]:
            return jsonify(post)
    
    return jsonify({"post_id": -1})


@posts.route("/api/posts/notifs", methods=["POST"])
def get_notifs():
    data = request.get_json()
    course_id = data["course_id"]
    if course_id == 0:
        return jsonify(notifs_sample)
    else:
        notifs = []
        for notif in notifs_sample:
            if notif["course_id"] == course_id:
                notifs.append(notif)
        return jsonify(notifs)


@posts.route("/api/posts/comments", methods=["POST"])
def get_comments():
    data = request.get_json()
    indices = data["comments"]
    comments = []
    for comment in comments_sample:
        if comment["post_id"] in indices:
            comments.append(comment)

    return jsonify(comments)