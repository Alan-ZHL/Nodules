import React, {useState} from "react";
import {
    BrowserRouter as Router,
    Switch, Route
} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import Posts from "./theme_posts";
import Courses from "./theme_courses";
import {Users, Register, Login} from "./theme_users";


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
            <div>
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
                    <Route path="/posts">
                        <Posts />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}


function Toolbar(props) {
    const options = (props.logined) ? (
        <LinkContainer to="logout">
            <NavDropdown.Item onClick={props.logoutHelper}>Logout</NavDropdown.Item>
        </LinkContainer>
    ) : (
        <>
        <LinkContainer to="/register">
            <NavDropdown.Item>Register</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/login">
            <NavDropdown.Item onClick={props.loginHelper}>Login</NavDropdown.Item>
        </LinkContainer>
        </>
    );

    return (
        <Navbar bg="light" expand="lg">
            <LinkContainer to="/">
                <Navbar.Brand><strong>NodUleS</strong></Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="homepage-nav" />
            <Navbar.Collapse id="homepage-nav">
                <Nav variant="tabs" className="mr-auto">
                    <LinkContainer to="/posts/public">
                        <Nav.Link>Public Chats</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/posts/course">
                        <Nav.Link>Course Discussion</Nav.Link>
                    </LinkContainer>
                    <NavDropdown title="Welcome, tourist!" id="user-dropdown">
                        <LinkContainer to="/users">
                            <NavDropdown.Item>Manage user Info</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        {options}
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}