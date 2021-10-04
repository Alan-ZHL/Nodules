import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Posts from "./theme_posts";
import Courses from "./theme_courses";
import { Users, Register, Login } from "./theme_users";
export default function App() {
  return /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Toolbar, null), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
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

function Toolbar() {
  return /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Link, {
    to: "/posts"
  }, "Posts")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Link, {
    to: "/courses"
  }, "Courses")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Link, {
    to: "/users"
  }, "Users"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, " ", /*#__PURE__*/React.createElement(Link, {
    to: "/register"
  }, "Register"), " "), /*#__PURE__*/React.createElement("li", null, " ", /*#__PURE__*/React.createElement(Link, {
    to: "/login"
  }, "Login"), " "))));
}