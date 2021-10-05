import React from "react";
import { Layout, Menu, Breadcrumb } from 'antd';
import "./theme_posts.css";
const {
  SubMenu
} = Menu;
const {
  Sider
} = Layout;

function PublicPostsGeneral(props) {
  return /*#__PURE__*/React.createElement(PostSider, {
    logined: props.logined
  });
}

function CoursePostsGeneral() {
  return /*#__PURE__*/React.createElement("h2", null, " Display the ", /*#__PURE__*/React.createElement("strong", null, "course"), " posts and related components. ");
}

function PostSider(props) {
  return /*#__PURE__*/React.createElement(Sider, {
    width: 220
  }, /*#__PURE__*/React.createElement(Menu, {
    mode: "inline",
    defaultOpenKeys: ['sub1', 'sub2'],
    className: "sider-post"
  }, props.logined && /*#__PURE__*/React.createElement(SubMenu, {
    key: "sub1",
    title: "My courses"
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "1"
  }, "IT5007"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "2"
  }, "IT5002"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "3"
  }, "CS4226"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "4"
  }, "CS5424")), /*#__PURE__*/React.createElement(SubMenu, {
    key: "sub2",
    title: "Filter by"
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "1"
  }, "Favored courses"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "2"
  }, "Hotest posts"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "3"
  }, "Latest posts"))));
}

export { PublicPostsGeneral, CoursePostsGeneral };