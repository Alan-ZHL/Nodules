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


// hard-coded data
const notifs_sample = [
    {notifid: 1, title: "Remember to submit tutorial 4", course_id: "IT5007", author: "Prasanna Karthik Vairam", date:"2021-09-30",
    content: "remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd!"},
    {notifid: 2, title: "Exam date determined", course_id: "IT5002", author: "Colin Tan", date: "2021-09-03", 
    content: "Midterm exam is set on Oct 5th. Please be prepared."}, 
    {notifid: 3, title: "Welcome to CS4226!", course_id: "CS4226", author: "Richard Ma", date: "2021-08-26", 
    content: "Welcome to CS4226. I will be the lecturer of this course. Looking forward to meeting all of you!"}
];
const posts_sample = [];
const comments_sample = [];
for (let i = 0; i < 16; i++) {
    posts_sample.push({
        postid: 1056 + i,
        topic: `Sample post ${i}`,
        starter: "Donald Trump ex",
        course_id: "IT5007", course_name: "Software Engineering on Application Architecture",
        date: "2 days ago",
        snippet: "We supply a series of design principles, practical patterns and high quality design resources...",
        content: "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
        likes: 156, dislikes: 18, comments: [i, i+1, i+2]
    });
}
for (let i = 0; i < 18; i++) {
    comments_sample.push({
        commentid: i,
        participant: "Biden III",
        date: "2 days ago",
        content: `Good job! ${i}`,
        likes: 10, dislikes: 2
    });
}


export default function App() {
    const [logined, setLogin] = useState(0);
    const [ispublic, setIspublic] = useState(1);

    //test function to simulate login
    function loginHelper() {
        setLogin(1);
        alert("Log in (simulate) successfully!");
    }

    //test function to simulate logout
    function logoutHelper() {
        setLogin(0);
        alert("Log out (simulate) successfully!");
    }

    function setPublic() {
        setIspublic(1);
    }

    function setPrivate() {
        setIspublic(0);
    }

    return (
        <Router>
            <Layout>
                <Toolbar logined={logined} 
                        loginHelper={loginHelper} 
                        logoutHelper={logoutHelper}
                        setPublic={setPublic}
                        setPrivate={setPrivate}/>

                <Switch>
                    <Route exact path="/posts/public">
                        <PublicForum logined={logined} ispublic={ispublic}/>
                    </Route>
                    <Route exact path="/posts/courses">
                        <CourseForum logined={logined} ispublic={ispublic}/>
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
                        <Login />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/posts/public" />
                        <PublicForum logined={logined} ispublic={ispublic}/>
                    </Route>
                </Switch>
            </Layout>
        </Router>
    );
}


function Toolbar(props) {
    const options = (props.logined) ? (
        <>
            <Menu.Item key="sub_1">
                <Link to="/users">Manage User Info</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="sub_2" onClick={props.logoutHelper}>
                <Link to="/logout">Log Out</Link>
            </Menu.Item>
        </>
    ) : (
        <>
            <Menu.Item key="sub_1">
                <Link to="/register">Register</Link>
            </Menu.Item>
            <Menu.Item key="sub_2" onClick={props.loginHelper}>
                <Link to="/login">Log In</Link>
            </Menu.Item>
        </>
    );

    return (
        <Header className="app-header">
            <Link to="/posts/public">
                <div className="logo">NodUleS</div>
            </Link>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" className="navbar-item" onClick={props.setPublic}>
                    <Link to="/posts/public">Public Chats</Link>
                </Menu.Item>
                <Menu.Item key="2" className="navbar-item" onClick={props.setPrivate} disabled={!props.logined}>
                    <Link to="/posts/courses">Course Discussion</Link>
                </Menu.Item>
                <SubMenu key="sub" icon={<UserOutlined />} 
                    title="Welcome, tourist!" className="navbar-user">
                    {options}
                </SubMenu>
            </Menu>
        </Header>
    );
}

export {notifs_sample, posts_sample, comments_sample};