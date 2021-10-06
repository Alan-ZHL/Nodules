import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { PublicPostsGeneral, CoursePostsGeneral } from "./theme_posts";
import Courses from "./theme_courses";
import { Users, Register, Login } from "./theme_users";
import "./App.css";
const {
  SubMenu
} = Menu;
const {
  Header
} = Layout;
export default function App() {
  const [logined, setLogin] = useState(0);
  const [ispublic, setIspublic] = useState(1); //test function to simulate login

  function loginHelper() {
    setLogin(1);
    alert("Log in (simulate) successfully!");
  } //test function to simulate logout


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

  return /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Toolbar, {
    logined: logined,
    loginHelper: loginHelper,
    logoutHelper: logoutHelper,
    setPublic: setPublic,
    setPrivate: setPrivate
  }), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: "/"
  }, /*#__PURE__*/React.createElement(Redirect, {
    to: "/posts/public"
  }), /*#__PURE__*/React.createElement(PublicPostsGeneral, {
    logined: logined,
    ispublic: ispublic
  })), /*#__PURE__*/React.createElement(Route, {
    path: "/users"
  }, /*#__PURE__*/React.createElement(Users, null)), /*#__PURE__*/React.createElement(Route, {
    path: "/courses"
  }, /*#__PURE__*/React.createElement(Courses, null)), /*#__PURE__*/React.createElement(Route, {
    path: "/posts/public"
  }, /*#__PURE__*/React.createElement(PublicPostsGeneral, {
    logined: logined,
    ispublic: ispublic
  })), /*#__PURE__*/React.createElement(Route, {
    path: "/posts/courses"
  }, /*#__PURE__*/React.createElement(CoursePostsGeneral, {
    logined: logined,
    ispublic: ispublic
  })), /*#__PURE__*/React.createElement(Route, {
    path: "/register"
  }, /*#__PURE__*/React.createElement(Register, null)), /*#__PURE__*/React.createElement(Route, {
    path: "/login"
  }, /*#__PURE__*/React.createElement(Login, null)))));
}

function Toolbar(props) {
  const options = props.logined ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "sub_1"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/users"
  }, "Manage User Info")), /*#__PURE__*/React.createElement(Menu.Divider, null), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "sub_2",
    onClick: props.logoutHelper
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/logout"
  }, "Log Out"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "sub_1"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/register"
  }, "Register")), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "sub_2",
    onClick: props.loginHelper
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/login"
  }, "Log In")));
  return /*#__PURE__*/React.createElement(Header, {
    className: "app-header"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/posts/public"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo"
  }, "NodUleS")), /*#__PURE__*/React.createElement(Menu, {
    theme: "dark",
    mode: "horizontal",
    defaultSelectedKeys: ['1']
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "1",
    className: "navbar-item",
    onClick: props.setPublic
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/posts/public"
  }, "Public Chats")), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "2",
    className: "navbar-item",
    onClick: props.setPrivate,
    disabled: !props.logined
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/posts/courses"
  }, "Course Discussion")), /*#__PURE__*/React.createElement(SubMenu, {
    key: "sub",
    icon: /*#__PURE__*/React.createElement(UserOutlined, null),
    title: "Welcome, tourist!",
    className: "navbar-user"
  }, options)));
}