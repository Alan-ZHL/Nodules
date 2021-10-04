import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Switch, Route, 
    Link
} from "react-router-dom";

import Posts from "./theme_posts";
import Courses from "./theme_courses";
import {Users, Register, Login} from "./theme_users";


export default function App() {
    return (
        <Router>
            <div>
                <Toolbar />

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

function Toolbar() {
    return (
        <ul>
            <li>
                <Link to="/posts">Posts</Link>
            </li>
            <li>
                <Link to="/courses">Courses</Link>
            </li>
            <li>
                <Link to="/users">Users</Link>
                <ul>
                    <li> <Link to="/register">Register</Link> </li>
                    <li> <Link to="/login">Login</Link> </li>
                </ul>
            </li>
        </ul>
    );
}