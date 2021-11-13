import React, {useState} from "react";
import {
    BrowserRouter as Router,
    Switch, Route, Link,
    Redirect
} from "react-router-dom";
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { PublicForum, CourseForum, PostDetail } from "./theme_posts";
import { CoursePage } from "./theme_courses";
import { Users, Register, Login } from "./theme_users";
import "./App.css";


const { SubMenu } = Menu;
const { Header } = Layout;


// hard-coded data notifications, posts and comments
const notifs_sample = [
    {post_id: 1, title: "Remember to submit tutorial 4", type: 0,
    course_id: "IT5007", course_name: "Software Engineering on Application Architecture",
    author_id: 1001, author_name: "Prasanna Karthik Vairam", date:"2021-09-30",
    content: "remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd!"},
    {post_id: 2, title: "Exam date determined", type: 0,
    course_id: "IT5002", course_name: "Computer Systems and Applications",
    author_id: 1002, author_name: "Colin Tan", date: "2021-09-03", 
    content: "Midterm exam is set on Oct 5th. Please be prepared."}, 
    {post_id: 3, title: "Welcome to CS4226!", type: 0, 
    course_id: "CS4226", course_name: "Internet Architecture", 
    author_id: 1003, author_name: "Richard Ma", date: "2021-08-26", 
    content: "Welcome to CS4226. I will be the lecturer of this course. Looking forward to meeting all of you!"}
];
const posts_sample = [];
const comments_sample = [];
for (let i = 0; i < 16; i++) {
    posts_sample.push({
        post_id: 1056 + i, title: `Sample post ${i}`, type: 1,
        course_id: "IT5007", course_name: "Software Engineering on Application Architecture",
        author_id: 2001, author_name: "Donald Trump ex", date: "2 days ago",
        snippet: "We supply a series of design principles, practical patterns and high quality design resources...",
        content: "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
        details: {likes: 156, dislikes: 18, comments: [i, i+1, i+2]}
    });
}
for (let i = 0; i < 18; i++) {
    comments_sample.push({
        post_id: i, title: "", type: 2,
        course_id: "IT5007", course_name: "Software Engineering on Application Architecture",
        author_id: 2002, author_name: "Biden III", date: "2 days ago",
        content: `Good job! ${i}`,
        details: {likes: 10, dislikes: 2}
    });
}


export default function App() {
    const [logined, setLogin] = useState(0);    // record the login status of a visit
    const [userInfo, setUserInfo] = useState({user_name: "tourist", email: "Please login."});
    
    async function loginHelper(status) {
        setLogin(status);
        await getUserInfo();
    }

    //test function to simulate logout
    function logoutHelper() {
        setLogin(0);
        setUserInfo({user_name: "tourist", email: "Please login."});
    }

    async function getUserInfo() {
        const resp = await fetch("/users/info", {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        const resp_json = await resp.json();
        if (resp_json["status"] === 1) {
            setUserInfo({user_name: resp_json["user_name"], email: resp_json["email"]});
        }
    }

    return (
        <Router>
            <Layout>
                <Toolbar logined={logined}
                        userInfo={userInfo}
                        logoutHelper={logoutHelper}/>

                <Switch>
                    <Route exact path="/posts/public">
                        <PublicForum logined={logined}/>
                    </Route>
                    <Route exact path="/posts/courses">
                        <CourseForum logined={logined}/>
                    </Route>
                    <Route path="/posts/:postid">
                        <PostDetail />
                    </Route>
                    <Route path="/courses/:courseid">
                        <CoursePage />
                    </Route>
                    <Route path="/users">
                        <Users />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/login">
                        <Login logined={logined} loginHelper={loginHelper} />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/posts/public" />
                        <PublicForum logined={logined}/>
                    </Route>
                </Switch>
            </Layout>
        </Router>
    );
}


function Toolbar(props) {
    var user_name = props.userInfo.user_name;    // modify user_name / complete user info as a state of App
    const options = (props.logined) ? (
        <>
            <Menu.Item key="sub_1">
                <Link to="/users">Manage User Info</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="sub_2" onClick={logout}>
                <Link to="/posts/public">Log Out</Link>
            </Menu.Item>
        </>
    ) : (
        <>
            <Menu.Item key="sub_1">
                <Link to="/register">Register</Link>
            </Menu.Item>
            <Menu.Item key="sub_2">
                <Link to="/login">Log In</Link>
            </Menu.Item>
        </>
    );

    async function logout() {
        const resp = await fetch("/logout", {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const resp_json = await resp.json();
        if (resp_json["status"] === 1) {
            props.logoutHelper();
            alert(`${resp_json["user_name"]} log out successfully.`);
        } else {
            alert("Log out failed.");
        }
    }

    return (
        <Header className="app-header">
            <Link to="/posts/public">
                <div className="logo">NodUleS</div>
            </Link>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" className="navbar-item">
                    <Link to="/posts/public">Public Chats</Link>
                </Menu.Item>
                <Menu.Item key="2" className="navbar-item" disabled={!props.logined}>
                    <Link to="/posts/courses">Course Discussion</Link>
                </Menu.Item>
                <SubMenu key="sub" icon={<UserOutlined />} 
                    title={`Welcome, ${user_name}!`} className="navbar-user">
                    {options}
                </SubMenu>
            </Menu>
        </Header>
    );
}

export {notifs_sample, posts_sample, comments_sample};