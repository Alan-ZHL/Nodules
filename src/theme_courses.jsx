import React, {useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import { Layout, PageHeader, Descriptions, List, Button, Menu, Tooltip } from "antd";
import { StarOutlined, CommentOutlined, NotificationOutlined } from "@ant-design/icons";

import "./theme_courses.css";
import { notifs_sample, posts_sample } from "./App";
import { CardListItem } from "./theme_posts";

const { Content } = Layout;


// General layout of a coursepage
function CoursePage() {
    const { courseid } = useParams();
    const [ course, setCourse ] = useState(null);
    const posts = findPosts(courseid);
    const notifs = findNotifs(courseid);

    useEffect(() => {
        async function findCourse() {
            const resp = await fetch("/courses/info", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"course_id": courseid})
            });
        
            const course = await resp.json();
            if (course["course_id"] !== "") {
                setCourse({
                    course_id: course["course_id"], course_name: course["course_name"], 
                    credit: course["credit"], workload: course["workload"], prerequisites: course["prerequisites"],
                    lecturer_id: course["lecturer_id"], lecturer_name: course["lecturer_name"],
                    open_semesters: course["open_semesters"],
                    description: course["description"], rating: course["rating"]
                });
            } else {
                setCourse(null);
            }
        }
        findCourse();
    }, [courseid]);

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