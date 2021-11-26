import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Layout, Menu, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { PostForum, NewPost, PostDetail } from "./theme_posts";
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
  // record the login status of a visit -- 1: logined; 0: not logined
  const [logined, setLogin] = useState(0); // distinguish public post area from course post area -- 2: public; 1: course

  const [access, setAccess] = useState(2); // get user information upon a login operation

  const [userInfo, setUserInfo] = useState({
    user_id: -1,
    user_name: "tourist",
    email: "Please login."
  });

  async function loginHelper(status) {
    setLogin(status);
    await getUserInfo();
  } // function to simulate logout


  function logoutHelper() {
    setLogin(0);
    setAccess(2);
    setUserInfo({
      user_id: -1,
      user_name: "tourist",
      email: "Please login."
    });
  }

  function setAccessHelper(val) {
    setAccess(val);
  }

  async function getUserInfo() {
    const resp = await fetch("/api/users/info", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const user = await resp.json();

    if (user["user_id"] === -1) {
      setUserInfo({
        user_id: -1,
        user_name: "tourist",
        email: "Please login."
      });
    } else {
      setUserInfo({
        user_id: user["user_id"],
        user_name: user["user_name"],
        email: user["email"],
        enrolled_courses: user["enrolled_courses"],
        favored_courses: user["favored_courses"],
        taken_courses: user["taken_courses"],
        role: user["role"],
        about_me: user["about_me"]
      });
    }
  }

  return /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Toolbar, {
    logined: logined,
    userInfo: userInfo,
    logoutHelper: logoutHelper,
    setAccessHelper: setAccessHelper
  }), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/posts/public"
  }, /*#__PURE__*/React.createElement(PostForum, {
    logined: logined,
    access: access,
    user: userInfo
  })), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/posts/courses"
  }, /*#__PURE__*/React.createElement(PostForum, {
    logined: logined,
    access: access,
    user: userInfo
  })), /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/posts/create/:post_type"
  }, /*#__PURE__*/React.createElement(NewPost, {
    logined: logined,
    access: access,
    user: userInfo
  })), /*#__PURE__*/React.createElement(Route, {
    path: "/posts/:postid"
  }, /*#__PURE__*/React.createElement(PostDetail, {
    user: userInfo
  })), /*#__PURE__*/React.createElement(Route, {
    path: "/courses/:courseid"
  }, /*#__PURE__*/React.createElement(CoursePage, {
    user: userInfo,
    setAccessHelper: setAccessHelper
  })), /*#__PURE__*/React.createElement(Route, {
    path: "/users"
  }, /*#__PURE__*/React.createElement(Users, {
    logined: logined,
    userInfo: userInfo
  })), /*#__PURE__*/React.createElement(Route, {
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
      message.info(`${resp_json["user_name"]} log out successfully.`);
    } else {
      message.warning("Log out failed.");
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
    className: "navbar-item",
    onClick: () => props.setAccessHelper(2)
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/posts/public"
  }, "Public Chats")), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "2",
    className: "navbar-item",
    onClick: () => props.setAccessHelper(1),
    disabled: !props.logined
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/posts/courses"
  }, "Course Discussion")), /*#__PURE__*/React.createElement(SubMenu, {
    key: "sub",
    icon: /*#__PURE__*/React.createElement(UserOutlined, null),
    title: `Welcome, ${user_name}!`,
    className: "navbar-user"
  }, options)));
} // helper function: create a post request with this template


function create_postREQ(body) {
  return {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

export { App, create_postREQ };