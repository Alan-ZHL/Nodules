import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { PostForum, PostDetail } from "./theme_posts";
import { CoursePage } from "./theme_courses";
import { Users, Register, Login } from "./theme_users";
import "./App.css";
const {
  SubMenu
} = Menu;
const {
  Header
} = Layout;
export default function App() {
  const [logined, setLogin] = useState(0); // record the login status of a visit

  const [userInfo, setUserInfo] = useState({
    user_name: "tourist",
    email: "Please login."
  });

  async function loginHelper(status) {
    setLogin(status);
    await getUserInfo();
  } //test function to simulate logout


  function logoutHelper() {
    setLogin(0);
    setUserInfo({
      user_name: "tourist",
      email: "Please login."
    });
  }

  async function getUserInfo() {
    const resp = await fetch("/api/users/info", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const resp_json = await resp.json();

    if (resp_json["status"] === 1) {
      setUserInfo({
        user_name: resp_json["user_name"],
        email: resp_json["email"]
      });
    }
  }

  return /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Toolbar, {
    logined: logined,
    userInfo: userInfo,
    logoutHelper: logoutHelper
  }), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/posts/public"
  }, /*#__PURE__*/React.createElement(PostForum, {
    logined: logined,
    public: 1
  })), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/posts/courses"
  }, /*#__PURE__*/React.createElement(PostForum, {
    logined: logined,
    public: 0
  })), /*#__PURE__*/React.createElement(Route, {
    path: "/posts/:postid"
  }, /*#__PURE__*/React.createElement(PostDetail, null)), /*#__PURE__*/React.createElement(Route, {
    path: "/courses/:courseid"
  }, /*#__PURE__*/React.createElement(CoursePage, null)), /*#__PURE__*/React.createElement(Route, {
    path: "/users"
  }, /*#__PURE__*/React.createElement(Users, null)), /*#__PURE__*/React.createElement(Route, {
    path: "/register"
  }, /*#__PURE__*/React.createElement(Register, null)), /*#__PURE__*/React.createElement(Route, {
    path: "/login"
  }, /*#__PURE__*/React.createElement(Login, {
    logined: logined,
    loginHelper: loginHelper
  })), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/"
  }, /*#__PURE__*/React.createElement(Redirect, {
    to: "/posts/public"
  }), /*#__PURE__*/React.createElement(PostForum, {
    logined: logined
  })))));
}

function Toolbar(props) {
  var user_name = props.userInfo.user_name; // modify user_name / complete user info as a state of App

  const options = props.logined ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "sub_1"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/users"
  }, "Manage User Info")), /*#__PURE__*/React.createElement(Menu.Divider, null), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "sub_2",
    onClick: logout
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/posts/public"
  }, "Log Out"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "sub_1"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/register"
  }, "Register")), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "sub_2"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/login"
  }, "Log In")));

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
    className: "navbar-item"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/posts/public"
  }, "Public Chats")), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "2",
    className: "navbar-item",
    disabled: !props.logined
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/posts/courses"
  }, "Course Discussion")), /*#__PURE__*/React.createElement(SubMenu, {
    key: "sub",
    icon: /*#__PURE__*/React.createElement(UserOutlined, null),
    title: `Welcome, ${user_name}!`,
    className: "navbar-user"
  }, options)));
}