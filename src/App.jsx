import React, {useState} from "react";
import {
    BrowserRouter as Router,
    Switch, Route, Link
} from "react-router-dom";
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import {PublicPostsGeneral, CoursePostsGeneral} from "./theme_posts";
import Courses from "./theme_courses";
import {Users, Register, Login} from "./theme_users";
import "./App.css";


const { SubMenu } = Menu;
const { Header } = Layout;


export default function App() {
    const [logined, setLogin] = useState(0);

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

    return (
        <Router>
            <>
                <Toolbar logined={logined} 
                        loginHelper={loginHelper} 
                        logoutHelper={logoutHelper}/>

                <Switch>
                    <Route path="/users">
                        <Users />
                    </Route>
                    <Route path="/courses">
                        <Courses />
                    </Route>
                    <Route path="/posts/public">
                        <PublicPostsGeneral logined={logined}/>
                    </Route>
                    <Route path="/posts/courses">
                        <CoursePostsGeneral />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                </Switch>
            </>
        </Router>
    );
}


function Toolbar(props) {
    const options = (props.logined) ? (
        <>
            <Menu.Item key="1">
                <Link to="/users">Manage User Info</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2" onClick={props.logoutHelper}>
                <Link to="/logout">Log Out</Link>
            </Menu.Item>
        </>
    ) : (
        <>
            <Menu.Item key="1">
                <Link to="/register">Register</Link>
            </Menu.Item>
            <Menu.Item key="2" onClick={props.loginHelper}>
                <Link to="/login">Log In</Link>
            </Menu.Item>
        </>
    );

    return (
        <Layout>
            <Header className="header">
                <div className="logo">NodUleS</div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" className="navbar-item">
                        <Link to="/posts/public">Public Chats</Link>
                    </Menu.Item>
                    <Menu.Item key="2" className="navbar-item" disabled={!props.logined}>
                        <Link to="/posts/courses">Course Discussion</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<UserOutlined />} 
                        title="Welcome, tourist!" className="navbar-user"
                        defaultSelectedKeys={['1']}>
                        {options}
                    </SubMenu>
                </Menu>
            </Header>
        </Layout>
    );
}