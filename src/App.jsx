import React, {useState} from "react";
import {
    BrowserRouter as Router,
    Switch, Route
} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Dropdown from 'react-bootstrap/Dropdown';

import {PublicPostsGeneral, CoursePostsGeneral} from "./theme_posts";
import Courses from "./theme_courses";
import {Users, Register, Login} from "./theme_users";
import "./App.css";


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
                        <PublicPostsGeneral />
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
            <LinkContainer to="/users">
                <Dropdown.Item>Manage user Info</Dropdown.Item>
            </LinkContainer>
            <Dropdown.Divider />
            <LinkContainer to="logout">
                <Dropdown.Item onClick={props.logoutHelper}>Logout</Dropdown.Item>
            </LinkContainer>
        </>
    ) : (
        <>
        <LinkContainer to="/register">
            <Dropdown.Item>Register</Dropdown.Item>
        </LinkContainer>
        <LinkContainer to="/login">
            <Dropdown.Item onClick={props.loginHelper}>Login</Dropdown.Item>
        </LinkContainer>
        </>
    );

    return (
        <Navbar bg="light" expand="lg" className="homepage-navbar">
            <LinkContainer to="/">
                <Navbar.Brand className="navbar-brand"><strong>NodUleS</strong></Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="homepage-nav" />
            <Navbar.Collapse id="homepage-nav">
                <Nav variant="tabs" className="d-flex justify-content-center">
                    <LinkContainer to="/posts/public">
                        <Nav.Link>Public Chats</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/posts/courses">
                        <Nav.Link>Course Discussion</Nav.Link>
                    </LinkContainer>
                    
                </Nav>
            </Navbar.Collapse>
            <Dropdown>
                <Dropdown.Toggle variant="light" id="user_dropdown">
                    Welcome, tourist!
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {options}
                </Dropdown.Menu>
            </Dropdown>
        </Navbar>
    );
}