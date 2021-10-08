import React, {useState} from "react";
import {
    BrowserRouter as Router,
    Switch, Route, Link,
    Redirect
} from "react-router-dom";
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import {PublicForum, CourseForum, PostDetail} from "./theme_posts";
import { CoursePage } from "./theme_courses";
import {Users, Register, Login} from "./theme_users";
import "./App.css";


const { SubMenu } = Menu;
const { Header } = Layout;


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