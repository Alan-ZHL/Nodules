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
        const resp = await fetch("/api/users/info", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
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
                        {/* TODO: change "public" as a state */}
                        <PostForum logined={logined} public={1}/>
                    </Route>
                    <Route exact path="/posts/courses">
                        <PostForum logined={logined} public={0}/>
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
                        <PostForum logined={logined}/>
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