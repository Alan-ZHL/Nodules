import React from "react";
import { Link, useParams } from "react-router-dom";
import { Layout, PageHeader, Description, DropDown, Tooltip } from "antd";
import { StarOutlined } from "@ant-design/icons";
import "./theme_courses.css";
const {
  Content,
  Sider
} = Layout; // hard-coded course info

const course_sample = [{
  course_id: "IT5007",
  course_name: "Software Engineering on Application Architecture",
  lecturer: "Prasanna Karthik Vairam",
  open_semesters: "Semester 1",
  description: "To meet changing business needs, this course focuses on flexible and agile software development on modern application architecture. Students learn to design and develop modern applications that support multiple clients across different platforms such as desktop, mobile devices and cloud. The course covers designing (1) website-based front-end software and (2) mobile app front-end that interacts with a common cloud-based backend. The final part involves engineering software for higher-level objectives such as security and performance. Tools and techniques for writing modern software, such as, HTML5, CSS3, React.js, Node.js, MySQL/MongoDB, and Git will be taught. ",
  notifications: []
}]; // General layout of a coursepage

function CoursePage() {
  const {
    courseid
  } = useParams();
  const course = findCourse(courseid);
  return /*#__PURE__*/React.createElement(Layout, {
    className: "coursepage-layout"
  }, /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement(CourseHeader, {
    id: course.course_id,
    name: course.course_name
  }), /*#__PURE__*/React.createElement(CourseDesciptions, {
    course: course
  })), /*#__PURE__*/React.createElement(CourseNotifications, {
    notifs: course.notifications
  }));
}

function CourseHeader(props) {
  return /*#__PURE__*/React.createElement(PageHeader, {
    ghost: false,
    onBack: () => window.history.back(),
    title: /*#__PURE__*/React.createElement("span", null, props.id),
    subTitle: /*#__PURE__*/React.createElement("span", null, props.name),
    extra: [/*#__PURE__*/React.createElement(Tooltip, {
      key: `${props.id}-favor`,
      title: "Favor this course"
    }, /*#__PURE__*/React.createElement(StarOutlined, null))]
  });
}

function findCourse(courseid) {
  for (var i = 0; i < course_sample.length; i++) {
    if (course_sample[i].course_id === courseid) {
      return course_sample[i];
    }
  }

  return null;
}

function CourseDesciptions() {
  return null;
}

function CourseNotifications() {
  return null;
}

export { CoursePage };