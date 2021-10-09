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
        lecturer: "Prasanna Karthik Vairam",
        open_semesters: "Semester 1",
        description: "To meet changing business needs, this course focuses on flexible and agile software development on modern application architecture. Students learn to design and develop modern applications that support multiple clients across different platforms such as desktop, mobile devices and cloud. The course covers designing (1) website-based front-end software and (2) mobile app front-end that interacts with a common cloud-based backend. The final part involves engineering software for higher-level objectives such as security and performance. Tools and techniques for writing modern software, such as, HTML5, CSS3, React.js, Node.js, MySQL/MongoDB, and Git will be taught. ",
    }
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
            >
        </PageHeader>
    );
}


function CourseDesciptions(props) {
    const course = props.course;

    return (
        <Descriptions column={2} bordered>
            <Descriptions.Item label="Open Semester" span={2}>{course.open_semesters}</Descriptions.Item>
            <Descriptions.Item label="Lecturer" span={2}>{course.lecturer}</Descriptions.Item>
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
                <CardListItem item={item}/>
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
        <Menu mode="horizontal">
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
            key={item.notifid}
            className="coursepage-notifs-item"
        >
            <List.Item.Meta
            title={item.title}
            description={`Posted by ${item.author}, ${item.date}`}
            />
            <span>{item.content}</span>
        </List.Item>
        </>
    );
}


export { CoursePage };