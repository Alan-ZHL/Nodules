from flask import Blueprint, jsonify, request
from api.views import courses


# print(__name__)
# courses = Blueprint("courses", __name__)

# hard-coded course info
course_sample = [
    {
        "course_id": "IT5007", "course_name": "Software Engineering on Application Architecture", 
        "credit": 4, "workload": "2-1-0-5-2", 
        "prerequisites": ["IT5001", "IT5003"],
        "lecturer_id": 1001, "lecturer_name": "Prasanna Karthik Vairam",
        "open_semesters": "Semester 1",
        "description": "To meet changing business needs, this course focuses on flexible and agile software development on modern application architecture. Students learn to design and develop modern applications that support multiple clients across different platforms such as desktop, mobile devices and cloud. The course covers designing (1) website-based front-end software and (2) mobile app front-end that interacts with a common cloud-based backend. The final part involves engineering software for higher-level objectives such as security and performance. Tools and techniques for writing modern software, such as, HTML5, CSS3, React.js, Node.js, MySQL/MongoDB, and Git will be taught. ",
        "rating": 5.0
    },
    {
        "course_id": "IT5002", "course_name": "Computer Systems and Applications", 
        "credit": 4, "workload": "2-1-2-3-2", 
        "prerequisites": ["IT5001"],
        "lecturer_id": 1002, "lecturer_name": "Tan Keng Yan, Colin",
        "open_semesters": "Semester 1",
        "description": "This module aims to introduce non-computing students to (a) the common principles and concepts in computer systems: abstraction, layering, indirection, caching, hierarchical naming, prefetching, pipelining, locking, concurrency; (b) the inner workings of a computing device, including hardware (CPU, memory, disks), operating systems (kernels, processes and threads, virtual memory, files), and applications (Web, databases).",
        "rating": 5.0
    },
    {
        "course_id": "CS4226", "course_name": "Internet Architecture", 
        "credit": 4, "workload": "2-1-4-3", 
        "prerequisites": ["CS2105", "MA2216"],
        "lecturer_id": 1003, "lecturer_name": "Ma Tianbai, Richard",
        "open_semesters": "Semester 1",
        "description": "This module aims to focus on advanced networking concepts pertaining to the modern Internet architecture and applications. It covers a range of topics including network performance (throughput, delay, Little’s Law and M/M/1 queuing formula), and resource allocation and buffer management (max-min fair, round-robin and RED), intra- and inter-domain routing (RIP, OSPF and BGP), congestion control and modern variations of TCP (AIMD and Cubic TCP), peer-to-peer applications and content delivery networks (BitTorrent, Skype, Akamai), and data center networking and management (SDN and OpenFlow).",
        "rating": 5.0
    },
]


@courses.route("/api/courses/info", methods=["POST"])
def display_courses():
    data = request.get_json()
    courseid = data["course_id"]
    for course in course_sample:
        if course["course_id"] == courseid:
            return jsonify(course)

    return jsonify({"course_id": ""})