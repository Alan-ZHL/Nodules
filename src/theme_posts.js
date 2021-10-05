import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import "./theme_posts.css";

function PublicPostsGeneral() {
  return /*#__PURE__*/React.createElement(Nav, {
    className: "col-md-3 col-lg-2 d-none d-md-block bg-light sidebar collapse"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-sticky pt-3"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "sidebar-heading px-4 mt-4 mb-2 text-muted"
  }, "Filter by"), /*#__PURE__*/React.createElement("ul", {
    className: "flex-column"
  }, /*#__PURE__*/React.createElement("li", null, "Favored courses"), /*#__PURE__*/React.createElement("li", null, "Hotest Posts"), /*#__PURE__*/React.createElement("li", null, "Latest Posts"))));
}

function CoursePostsGeneral() {
  return /*#__PURE__*/React.createElement("h2", null, " Display the ", /*#__PURE__*/React.createElement("strong", null, "course"), " posts and related components. ");
}

export { PublicPostsGeneral, CoursePostsGeneral };