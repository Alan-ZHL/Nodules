import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Posts from "./theme_posts";
import Courses from "./theme_courses";
import { Users, Register, Login } from "./theme_users";
export default function App() {
  const [logined, setLogin] = useState(0); //test function to simulate login

  function loginHelper() {
    setLogin(1);
    alert("Log in (simulate) successfully!");
  } //test function to simulate logout


  function logoutHelper() {
    setLogin(0);
    alert("Log out (simulate) successfully!");
  }

  return /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Toolbar, {
    logined: logined,
    loginHelper: loginHelper,
    logoutHelper: logoutHelper
  }), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: "/users"
  }, /*#__PURE__*/React.createElement(Users, null)), /*#__PURE__*/React.createElement(Route, {
    path: "/courses"
  }, /*#__PURE__*/React.createElement(Courses, null)), /*#__PURE__*/React.createElement(Route, {
    path: "/posts"
  }, /*#__PURE__*/React.createElement(Posts, null)), /*#__PURE__*/React.createElement(Route, {
    path: "/register"
  }, /*#__PURE__*/React.createElement(Register, null)), /*#__PURE__*/React.createElement(Route, {
    path: "/login"
  }, /*#__PURE__*/React.createElement(Login, null)))));
}

function Toolbar(props) {
  const options = props.logined ? /*#__PURE__*/React.createElement(LinkContainer, {
    to: "logout"
  }, /*#__PURE__*/React.createElement(NavDropdown.Item, {
    onClick: props.logoutHelper
  }, "Logout")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(LinkContainer, {
    to: "/register"
  }, /*#__PURE__*/React.createElement(NavDropdown.Item, null, "Register")), /*#__PURE__*/React.createElement(LinkContainer, {
    to: "/login"
  }, /*#__PURE__*/React.createElement(NavDropdown.Item, {
    onClick: props.loginHelper
  }, "Login")));
  return /*#__PURE__*/React.createElement(Navbar, {
    bg: "light",
    expand: "lg"
  }, /*#__PURE__*/React.createElement(LinkContainer, {
    to: "/"
  }, /*#__PURE__*/React.createElement(Navbar.Brand, null, /*#__PURE__*/React.createElement("strong", null, "NodUleS"))), /*#__PURE__*/React.createElement(Navbar.Toggle, {
    "aria-controls": "homepage-nav"
  }), /*#__PURE__*/React.createElement(Navbar.Collapse, {
    id: "homepage-nav"
  }, /*#__PURE__*/React.createElement(Nav, {
    variant: "tabs",
    className: "mr-auto"
  }, /*#__PURE__*/React.createElement(LinkContainer, {
    to: "/posts/public"
  }, /*#__PURE__*/React.createElement(Nav.Link, null, "Public Chats")), /*#__PURE__*/React.createElement(LinkContainer, {
    to: "/posts/course"
  }, /*#__PURE__*/React.createElement(Nav.Link, null, "Course Discussion")), /*#__PURE__*/React.createElement(NavDropdown, {
    title: "Welcome, tourist!",
    id: "user-dropdown"
  }, /*#__PURE__*/React.createElement(LinkContainer, {
    to: "/users"
  }, /*#__PURE__*/React.createElement(NavDropdown.Item, null, "Manage user Info")), /*#__PURE__*/React.createElement(NavDropdown.Divider, null), options))));
}