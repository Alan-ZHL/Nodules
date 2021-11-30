// stated components: CoursePage

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout, PageHeader, Descriptions, List, Button, Menu, Tooltip } from "antd";
import { StarOutlined, CommentOutlined, NotificationOutlined } from "@ant-design/icons";

import "./theme_courses.css";
import { create_postREQ } from "./App";
import { getNotifs, getPostcards } from "./theme_posts";
import { CardListItem } from "./theme_posts";

const { Content } = Layout;

const PAGESIZE = 5;


// Top-level component: a coursepage
// states: course, posts, notifs
function CoursePage(props) {
    const { courseid } = useParams();
    const [ course, setCourse ] = useState(null);
    const [ postcards, setPostcards] = useState({count: 0, posts: []});
    const [ notifs, setNotifs] = useState({count: 0, posts: []});
    const enrolled = (props.user.user_id === -1 || !props.user.enrolled_courses.includes(courseid)) ? false : true;

    function setCourseHelper(course) {
        setCourse(course);
    }

    useEffect(() => {    
        findCourse(setCourseHelper, courseid);
        getPostcards((fetched_posts) => {
            setPostcards(fetched_posts);
        }, 1, [courseid]);
        getNotifs((fetched_notifs) => {
            setNotifs(fetched_notifs);
        }, [courseid]);
    }, [courseid]);

    if (course === null) {
        return (null);
    } else {
        return (
            <Layout className="coursepage-layout">
                <Content>
                    <CourseHeader id={courseid} name={course.course_name}/>
                    <CourseDesciptions course={course}/>
                    <CoursePostsAndNotifs enrolled={enrolled} posts={postcards} notifs={notifs}/>
                </Content>
            </Layout>
        );
    }
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
            <Descriptions.Item label="Open Semester" span={2}>{course.open_semesters.toString()}</Descriptions.Item>
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
    const enrolled = props.enrolled;
    
    const DropdownList = (enrolled) ? (
        (display === "notifs") ? (
            <List
                itemLayout="vertical"
                size="large"
                dataSource={props.notifs.posts}
                renderItem={item => (
                    <NotifListItem item={item}/>
                )}
                pagination={{
                    pageSize: PAGESIZE,
                    total: props.notifs.count,
                    style: {textAlign: "center"}
                }}
                className="coursepage-notifs"
            />
        ) : (
            <List
                itemLayout="vertical"
                dataSource={props.posts.posts}
                renderItem={item => (
                    <>
                        <br/>
                        <CardListItem item={item}/>
                    </>
                )}
                pagination={{
                    pageSize: PAGESIZE,
                    total: props.posts.count,
                    style: {textAlign: "center"}
                }}
                className="coursepage-posts"
            />
        )
    ) : (
        null
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
            <Menu.Item key="notifs" icon={<NotificationOutlined/>} onClick={displayNotifs} disabled={!enrolled}>
                Notifications
            </Menu.Item>
            <Menu.Item key="posts" icon={<CommentOutlined/>} onClick={displayPosts} disabled={!enrolled}>
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


async function findCourse(setCourseHelper, courseid) {
    const resp = await fetch("/api/courses/info", create_postREQ({"course_id": courseid}));
    const course = await resp.json();
    if (course["course_id"] !== "") {
        setCourseHelper({
            course_id: course["course_id"], course_name: course["course_name"], 
            credit: course["credit"], workload: course["workload"], prerequisites: course["prerequisites"],
            lecturer_id: course["lecturer_id"], lecturer_name: course["lecturer_name"],
            open_semesters: course["open_semesters"],
            description: course["description"], rating: course["rating"]
        });
    } else {
        setCourseHelper(null);
    }
}


export { CoursePage };