# data samples for the project (change the content on any modifications on data formats)
from datetime import datetime, timedelta


# users
# user_id (testing purpose): 1-1000: virtual users (with no detailed info); 1001-3000: teachers; 3001 onwards: students
userinfo = [
        {
            "user_id": 3001, "user_name": "tester", "email": "test_user@nus.edu", 
            "password": "123", "role": 0, # 0: student; 1:lecturer 2: administer
            "enrolled_courses": ["IT5007", "IT5002", "CS4226"],
            "favored_courses": ["CS5424"],
            "taken_courses": ["IT5001", "IT5003"],
            "about_me": "Hello, testing testing... Hello, testing testing... Hello, testing testing...",
        }
    ]

# courses
course_sample = [
    {
        "course_id": "IT5007", "course_name": "Software Engineering on Application Architecture", 
        "credit": 4, "workload": "2-1-0-5-2", 
        "prerequisites": ["IT5001", "IT5003"],
        "lecturer_id": 1001, "lecturer_name": "Prasanna Karthik Vairam",
        "open_semesters": ["Semester 1"], 
        "enroll_code": None,
        "lecture_time": [4, "16:00", "18:00"], 
        "tutorial_time": [[4, "18:00", "19:00"]],
        "description": "To meet changing business needs, this course focuses on flexible and agile software development on modern application architecture. Students learn to design and develop modern applications that support multiple clients across different platforms such as desktop, mobile devices and cloud. The course covers designing (1) website-based front-end software and (2) mobile app front-end that interacts with a common cloud-based backend. The final part involves engineering software for higher-level objectives such as security and performance. Tools and techniques for writing modern software, such as, HTML5, CSS3, React.js, Node.js, MySQL/MongoDB, and Git will be taught. ",
        "rating": 5.0
    },
    {
        "course_id": "IT5002", "course_name": "Computer Systems and Applications", 
        "credit": 4, "workload": "2-1-2-3-2", 
        "prerequisites": ["IT5001"],
        "lecturer_id": 1002, "lecturer_name": "Tan Keng Yan, Colin",
        "open_semesters": ["Semester 1"],
        "enroll_code": None,
        "lecture_time": [5, "18:30", "21:30"], 
        "tutorial_time": [[6, "14:00", "15:00"], [6, "15:00", "16:00"]],
        "description": "This module aims to introduce non-computing students to (a) the common principles and concepts in computer systems: abstraction, layering, indirection, caching, hierarchical naming, prefetching, pipelining, locking, concurrency; (b) the inner workings of a computing device, including hardware (CPU, memory, disks), operating systems (kernels, processes and threads, virtual memory, files), and applications (Web, databases).",
        "rating": 5.0
    },
    {
        "course_id": "CS4226", "course_name": "Internet Architecture", 
        "credit": 4, "workload": "2-1-4-3", 
        "prerequisites": ["CS2105", "MA2216"],
        "lecturer_id": 1003, "lecturer_name": "Ma Tianbai, Richard",
        "open_semesters": ["Semester 1"],
        "enroll_code": None,
        "lecture_time": [5, "12:00", "14:00"], 
        "tutorial_time": [[1, "14:00", "15:00"]],
        "description": "This module aims to focus on advanced networking concepts pertaining to the modern Internet architecture and applications. It covers a range of topics including network performance (throughput, delay, Little’s Law and M/M/1 queuing formula), and resource allocation and buffer management (max-min fair, round-robin and RED), intra- and inter-domain routing (RIP, OSPF and BGP), congestion control and modern variations of TCP (AIMD and Cubic TCP), peer-to-peer applications and content delivery networks (BitTorrent, Skype, Akamai), and data center networking and management (SDN and OpenFlow).",
        "rating": 5.0
    },
    {
        "course_id": "CS5424", "course_name": "Distributed Databases", 
        "credit": 4, "workload": "2-1-3-4", 
        "prerequisites": ["CS3223"],
        "lecturer_id": 1004, "lecturer_name": "Chan Chee Yong",
        "open_semesters": ["Semester 1"],
        "enroll_code": None,
        "lecture_time": [1, "18:30", "20:30"], 
        "tutorial_time": [[1, "20:30", "21:30"]],
        "description": "This module studies the management of data in a distributed environment. It covers the fundamental principles of distributed data management and includes distribution design, data integration, distributed query processing and optimization, distributed transaction management, and replication. It will also look at how these techniques can be adapted to support database management in emerging technologies (e.g., parallel systems, peer-to-peer systems, cloud computing).",
        "rating": 5.0
    }
]

# posts: notifs, posts and comments
notifs_sample = [
    {"post_id": 1, "title": "Remember to submit tutorial 4", "access": 1, "post_type": 1, 
    "course_id": "IT5007", "course_name": "Software Engineering on Application Architecture",
    "author_id": 1001, "author_name": "Prasanna Karthik Vairam", "date": datetime(2021, 9, 30),
    "content": "remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd!"},
    {"post_id": 2, "title": "Exam date determined", "access": 1, "post_type": 1,
    "course_id": "IT5002", "course_name": "Computer Systems and Applications",
    "author_id": 1002, "author_name": "Colin Tan", "date": datetime(2021, 9, 3), 
    "content": "Midterm exam is set on Oct 5th. Please be prepared."}, 
    {"post_id": 3, "title": "Welcome to CS4226!", "access": 1, "post_type": 1, 
    "course_id": "CS4226", "course_name": "Internet Architecture", 
    "author_id": 1003, "author_name": "Richard Ma", "date": datetime(2021, 8, 26), 
    "content": "Welcome to CS4226. I will be the lecturer of this course. Looking forward to meeting all of you!"}
]
posts_sample = [];
comments_sample = [];
for i in range(200):
    title = f"Sample public post {i}" if i < 160 else f"Sample course post {i}"
    access = 2 if i < 160 else 1
    content = "This is a sample course post. Ask me anything!" if i >= 160 else "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product protopost_types beautifully and efficiently."
    posts_sample.append({
        "post_id": 1001 + i, "title": title, "access": access, "post_type": 2,
        "course_id": "IT5007", "course_name": "Software Engineering on Application Architecture",
        "author_id": 3001, "author_name": "tester", "date": datetime.now() - timedelta(days=2),
        "content": content,
        "details": {
            "hotness": 70,    # hotness = likes - dislikes + comments * 2
            "likes": [i for i in range(900, 982)], 
            "dislikes": [i for i in range(982, 1000)], 
            "comments": [i*3+2001, i*3+2002, i*3+2003]}
    })
posts_sample.append({
    "post_id": 1999, "title": "CS5424 test post", "access": 2, "post_type": 2,
    "course_id": "CS5424", "course_name": "Distributed Database",
    "author_id": 3001, "author_name": "tester", "date": datetime.now() - timedelta(days=2),
    "content": "This is a sample post for testing. CS5424 is not enrolled by any user by default, and can be used to test the functions of favoring and unfavoring.",
    "details": {
        "hotness": 92,    # hotness = likes - dislikes + comments * 2
        "likes": [i for i in range(900, 996)], 
        "dislikes": [i for i in range(996, 1000)], 
        "comments": []}
})
for i in range(600):
    access = 2 if i < 480 else 1
    content = "Sounds great!" if i < 480 else "Good job!"
    comments_sample.append({
        "post_id": 2001 + i, "title": "", "access": access, "post_type": 3,
        "course_id": "IT5007", "course_name": "Software Engineering on Application Architecture",
        "author_id": 1, "author_name": "Biden III", "date": datetime.now() - timedelta(days=1),
        "content": content,
        "details": {
            "hotness": 8,
            "likes": [i for i in range(990, 999)], 
            "dislikes": [i for i in range(999, 1000)]}
    })


def load_samples(collection_posts, collection_courses, collection_users, clearup=False):
    if (clearup):
        collection_posts.delete_many({})
        collection_courses.delete_many({})
        collection_users.delete_many({})

    try:
        collection_posts.insert_many(posts_sample)
        collection_posts.insert_many(comments_sample)
        collection_posts.insert_many(notifs_sample)

        collection_courses.insert_many(course_sample)

        collection_users.insert_many(userinfo)
        print("Loaded data samples to the database.")
    except Exception as e:
        print(e)
        print("Failed to load data samples.")