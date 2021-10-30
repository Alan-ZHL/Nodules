import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { PublicForum, CourseForum, PostDetail } from "./theme_posts";
import { CoursePage } from "./theme_courses";
import { Users, Register, Login } from "./theme_users";
import "./App.css";
const {
  SubMenu
} = Menu;
const {
  Header
} = Layout; // hard-coded data notifications, posts and comments

const notifs_sample = [{
  notifid: 1,
  title: "Remember to submit tutorial 4",
  course_id: "IT5007",
  author: "Prasanna Karthik Vairam",
  date: "2021-09-30",
  content: "remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd!"
}, {
  notifid: 2,
  title: "Exam date determined",
  course_id: "IT5002",
  author: "Colin Tan",
  date: "2021-09-03",
  content: "Midterm exam is set on Oct 5th. Please be prepared."
}, {
  notifid: 3,
  title: "Welcome to CS4226!",
  course_id: "CS4226",
  author: "Richard Ma",
  date: "2021-08-26",
  content: "Welcome to CS4226. I will be the lecturer of this course. Looking forward to meeting all of you!"
}];
const posts_sample = [];
const comments_sample = [];

for (let i = 0; i < 16; i++) {
  posts_sample.push({
    postid: 1056 + i,
    topic: `Sample post ${i}`,
    starter: "Donald Trump ex",
    course_id: "IT5007",
    course_name: "Software Engineering on Application Architecture",
    date: "2 days ago",
    snippet: "We supply a series of design principles, practical patterns and high quality design resources...",
    content: "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
    likes: 156,
    dislikes: 18,
    comments: [i, i + 1, i + 2]
  });
}

for (let i = 0; i < 18; i++) {
  comments_sample.push({
    commentid: i,
    participant: "Biden III",
    date: "2 days ago",
    content: `Good job! ${i}`,
    likes: 10,
    dislikes: 2
  });
}

export default function App() {
  const [logined, setLogin] = useState(0); // record the login status of a visit

  const [userInfo, setUserInfo] = useState({
    username: "tourist",
    email: "Please login."
  });

  async function loginHelper(status) {
    setLogin(status);
    await getUserInfo();
  } //test function to simulate logout


  function logoutHelper() {
    setLogin(0);
    setUserInfo({
      username: "tourist",
      email: "Please login."
    });
  }

  async function getUserInfo() {
    const resp = await fetch("/users/info", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const resp_json = await resp.json();

    if (resp_json["status"] === 1) {
      setUserInfo({
        username: resp_json["username"],
        email: resp_json["email"]
      });
    } else {
      alert("Fail to collect current user's info...");
    }
  }

  return /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Toolbar, {
    logined: logined,
    userInfo: userInfo,
    logoutHelper: logoutHelper
  }), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/posts/public"
  }, /*#__PURE__*/React.createElement(PublicForum, {
    logined: logined
  })), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/posts/courses"
  }, /*#__PURE__*/React.createElement(CourseForum, {
    logined: logined
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
  }), /*#__PURE__*/React.createElement(PublicForum, {
    logined: logined
  })))));
}

function Toolbar(props) {
  var username = props.userInfo.username; // modify username / complete user info as a state of App

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
    const resp = await fetch("/logout", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const resp_json = await resp.json();

    if (resp_json["status"] === 1) {
      props.logoutHelper();
      alert(`${resp_json["username"]} log out successfully.`);
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
    title: `Welcome, ${username}!`,
    className: "navbar-user"
  }, options)));
}

export { notifs_sample, posts_sample, comments_sample };