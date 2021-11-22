from pymongo import MongoClient, IndexModel, ASCENDING, DESCENDING, TEXT

from api.config import Config


# checking and initiation
def init_db():
    db_client = MongoClient(Config.DB_URL)

    db = db_client[Config.DB_NAME]
    db_list = db_client.list_database_names()
    if Config.DB_NAME in db_list:
        print("Detected existent database: " + Config.DB_NAME)

    # change the content on any modifications on data formats
    # current collections: posts, courses, users
    collection_posts = db["posts"]
    collection_courses = db["courses"]
    collection_users = db["users"]
    collection_list = db.list_collection_names()
    if "posts" not in collection_list:
        indexes = [
            IndexModel([("post_id", DESCENDING)], unique=True),
            IndexModel([("title", TEXT)]),
            IndexModel([("type", ASCENDING)]),
            IndexModel([("author_id", DESCENDING)]),
            IndexModel([("course_id", ASCENDING)]),
            IndexModel([("date", DESCENDING)]),
        ]
        collection_posts.create_indexes(indexes)
        print("Added indexes: posts")
    if "courses" not in collection_list:
        indexes = [
            IndexModel([("course_id", ASCENDING)], unique=True),
            IndexModel([("course_name", ASCENDING)], unique=True),
            IndexModel([("lecturer_id", DESCENDING)]),
        ]
        collection_courses.create_indexes(indexes)
    if "users" not in collection_list:
        indexes = [
            IndexModel([("user_id", DESCENDING)], unique=True),
            IndexModel([("user_name", ASCENDING)]),
            IndexModel([("email", ASCENDING)], unique=True),
            IndexModel([("role", ASCENDING)]),
        ]
        collection_users.create_indexes(indexes)

    return (collection_posts, collection_courses, collection_users)


collection_posts, collection_courses, collection_users = init_db()