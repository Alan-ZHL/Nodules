import React, {useState} from "react";
import {
    BrowserRouter as Router,
    Switch, Route, Link,
    Redirect
} from "react-router-dom";
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { PostForum, PostDetail } from "./theme_posts";
import { CoursePage } from "./theme_courses";
import { Users, Register, Login } from "./theme_users";
import "./App.css";


const { SubMenu } = Menu;
const { Header } = Layout;


export default function App() {
    // record the login status of a visit -- 1: logined; 0: not logined
    const [logined, setLogin] = useState(0);
    // distinguish public post area from course post area -- 1: public; 0: course
    const [access, setAccess] = useState(1);
    // get user information upon a login operation
    const [userInfo, setUserInfo] = useState({user_id: -1, user_name: "tourist", email: "Please login."});
    
    async function loginHelper(status) {
        setLogin(status);
        await getUserInfo();
    }

    // function to simulate logout
    function logoutHelper() {
        setLogin(0);
        setAccess(1);
        setUserInfo({user_id: -1, user_name: "tourist", email: "Please login."});
    }

    function setAccessHelper(val) {
        setAccess(val);
    }

    async function getUserInfo() {
        const resp = await fetch("/api/users/info", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );
        const user = await resp.json();
        if (user["user_id"] === -1) {
            setUserInfo({user_id: -1, user_name: "tourist", email: "Please login."});
        } else {
            setUserInfo({
                user_id: user["user_id"], user_name: user["user_name"], email: user["email"], 
                enrolled_courses: user["enrolled_courses"], 
                favored_courses: user["favored_courses"],
                taken_courses: user["taken_courses"],
                role: user["role"],
                about_me: user["about_me"],
            });
        }
    }

    return (
        <Router>
            <Layout>
                <Toolbar logined={logined}
                        userInfo={userInfo}
                        logoutHelper={logoutHelper}
                        setAccessHelper={setAccessHelper}/>

                <Switch>
                    <Route exact path="/posts/public">
                        <PostForum logined={logined} access={access} user={userInfo}/>
                    </Route>
                    <Route exact path="/posts/courses">
                        <PostForum logined={logined} access={access} user={userInfo}/>
                    </Route>
                    <Route path="/posts/:postid">
                        <PostDetail />
                    </Route>
                    <Route path="/courses/:courseid">
                        <CoursePage />
                    </Route>
                    <Route path="/users">
                        <Users logined={logined} userInfo={userInfo}/>
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/login">
                        <Login logined={logined} loginHelper={loginHelper} />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/posts/public" />
                        <PostForum logined={logined} access={access} user={userInfo}/>
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
        const resp = await fetch("/api/logout", {
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
                <Menu.Item key="1" className="navbar-item" onClick={() => props.setAccessHelper(1)}>
                    <Link to="/posts/public">Public Chats</Link>
                </Menu.Item>
                <Menu.Item key="2" className="navbar-item" onClick={() => props.setAccessHelper(0)} disabled={!props.logined}>
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