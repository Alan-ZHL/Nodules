import React, {useState} from "react";
import { Link, useParams } from "react-router-dom";
import { Layout, PageHeader, Descriptions, List, Button, Menu, Tooltip } from "antd";
import { StarOutlined, CommentOutlined, NotificationOutlined } from "@ant-design/icons";

import "./theme_courses.css";
import { notifs_sample, posts_sample } from "./App";
import { CardListItem } from "./theme_posts";

const { Content } = Layout;


// hard-coded course info
const course_sample = [
    {
        course_id: "IT5007", course_name: "Software Engineering on Application Architecture", 
        credit: 4, workload: "2-1-0-5-2", 
        prerequisites: ["IT5001", "IT5003"],
        lecturer_id: 1001, lecturer_name: "Prasanna Karthik Vairam",
        open_semesters: "Semester 1",
        description: "To meet changing business needs, this course focuses on flexible and agile software development on modern application architecture. Students learn to design and develop modern applications that support multiple clients across different platforms such as desktop, mobile devices and cloud. The course covers designing (1) website-based front-end software and (2) mobile app front-end that interacts with a common cloud-based backend. The final part involves engineering software for higher-level objectives such as security and performance. Tools and techniques for writing modern software, such as, HTML5, CSS3, React.js, Node.js, MySQL/MongoDB, and Git will be taught. ",
        rating: 5.0
    },
    {
        course_id: "IT5002", course_name: "Computer Systems and Applications", 
        credit: 4, workload: "2-1-2-3-2", 
        prerequisites: ["IT5001"],
        lecturer_id: 1002, lecturer_name: "Tan Keng Yan, Colin",
        open_semesters: "Semester 1",
        description: "This module aims to introduce non-computing students to (a) the common principles and concepts in computer systems: abstraction, layering, indirection, caching, hierarchical naming, prefetching, pipelining, locking, concurrency; (b) the inner workings of a computing device, including hardware (CPU, memory, disks), operating systems (kernels, processes and threads, virtual memory, files), and applications (Web, databases).",
        rating: 5.0
    },
    {
        course_id: "CS4226", course_name: "Internet Architecture", 
        credit: 4, workload: "2-1-4-3", 
        prerequisites: ["CS2105", "MA2216"],
        lecturer_id: 1003, lecturer_name: "Ma Tianbai, Richard",
        open_semesters: "Semester 1",
        description: "This module aims to focus on advanced networking concepts pertaining to the modern Internet architecture and applications. It covers a range of topics including network performance (throughput, delay, Little’s Law and M/M/1 queuing formula), and resource allocation and buffer management (max-min fair, round-robin and RED), intra- and inter-domain routing (RIP, OSPF and BGP), congestion control and modern variations of TCP (AIMD and Cubic TCP), peer-to-peer applications and content delivery networks (BitTorrent, Skype, Akamai), and data center networking and management (SDN and OpenFlow).",
        rating: 5.0
    },
];


// General layout of a coursepage
function CoursePage() {
    const { courseid } = useParams();
    const course = findCourse(courseid);
    const posts = findPosts(courseid);
    const notifs = findNotifs(courseid);

    if (course === null) {
        return (null);
    } else {
        return (
            <Layout className="coursepage-layout">
                <Content>
                    <CourseHeader id={course.course_id} name={course.course_name}/>
                    <CourseDesciptions course={course}/>
                    <CoursePostsAndNotifs posts={posts} notifs={notifs}/>
                </Content>
            </Layout>
        );
    }
}


function findCourse(courseid) {
    for (var i = 0; i < course_sample.length; i++) {
        if (course_sample[i].course_id === courseid) {
            return course_sample[i];
        }
    }

    return null;
}


function findNotifs(courseid) {
    const notifs = [];

    for (var i = 0; i < notifs_sample.length; i++) {
        if (notifs_sample[i].course_id === courseid) {
            notifs.push(notifs_sample[i]);
        }
    }

    return notifs;
}

function findPosts(courseid) {
    const posts = [];

    for (var i = 0; i < posts_sample.length; i++) {
        if (posts_sample[i].course_id === courseid) {
            posts.push(posts_sample[i]);
        }
    }

    return posts;
}


function CourseHeader(props) {
    return (
        <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={
                <span>{props.id}</span>
            }
            subTitle={
                <span>{props.name}</span>
            }
            extra={[
                <Tooltip key={`${props.id}-favor`} title="Favor this course">
                    <StarOutlined />
                </Tooltip>,
            ]}
            className="coursepage-header"
            >
        </PageHeader>
    );
}


function CourseDesciptions(props) {
    const course = props.course;

    return (
        <Descriptions column={2} bordered 
            labelStyle={{background: "#ffffff", fontSize: "16px"}} 
            contentStyle={{background: "#fafafa"}}>
            <Descriptions.Item label="Open Semester" span={2}>{course.open_semesters}</Descriptions.Item>
            <Descriptions.Item label="Lecturer" span={2}>{course.lecturer_name}</Descriptions.Item>
            <Descriptions.Item label="Module Credit">{course.credit}</Descriptions.Item>
            <Descriptions.Item label="Workload">{course.workload}</Descriptions.Item>
            <Descriptions.Item label="Prerequisites" span={2}>
                <List
                    dataSource={course.prerequisites}
                    renderItem={item => (
                        <Link to={`/courses/${item}`}>
                            <Button type="text"> {item} </Button>
                        </Link>
                    )}
                />
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
                {course.description}
            </Descriptions.Item>
        </Descriptions>
    );
}


function CoursePostsAndNotifs(props) {
    const [display, setDisplay] = useState("notifs");
    const DropdownList = display === "notifs" ? (
        <List
            itemLayout="vertical"
            size="large"
            dataSource={props.notifs}
            renderItem={item => (
                <NotifListItem item={item}/>
            )}
            pagination={{
                onchange: page => {
                    console.log(page);
                },
                pageSize: 5,
                total: props.notifs.length,
                style: {textAlign: "center"}
            }}
            className="coursepage-notifs"
        />
    ) : (
        <List
            itemLayout="vertical"
            dataSource={props.posts}
            renderItem={item => (
                <>
                    <br/>
                    <CardListItem item={item}/>
                </>
            )}
            pagination={{
                onchange: page => {
                    console.log(page);
                },
                pageSize: 3,
                total: props.posts.length,
                style: {textAlign: "center"}
            }}
            className="coursepage-posts"
        />
    );

    function displayPosts() {
        setDisplay("posts");
    }

    function displayNotifs() {
        setDisplay("notifs");
    }

    return (
        <>
        <Menu mode="horizontal" defaultSelectedKeys={["notifs"]} className="coursepage-options">
            <Menu.Item key="notifs" icon={<NotificationOutlined/>} onClick={displayNotifs}>
                Notifications
            </Menu.Item>
            <Menu.Item key="posts" icon={<CommentOutlined/>} onClick={displayPosts}>
                Course Posts
            </Menu.Item>
        </Menu>
        {DropdownList}
        </>
    );
}


function NotifListItem(props) {
    let item = props.item;

    return (
        <>
        <br/>
        <List.Item
            key={item.post_id}
            className="coursepage-notifs-item"
        >
            <List.Item.Meta
            title={item.title}
            description={`Posted by ${item.author_name}, ${item.date}`}
            />
            <span>{item.content}</span>
        </List.Item>
        </>
    );
}


export { CoursePage };