// stated components: CoursePage
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout, PageHeader, Descriptions, List, Button, Menu, Tooltip } from "antd";
import { StarOutlined, CommentOutlined, NotificationOutlined } from "@ant-design/icons";
import "./theme_courses.css";
import { create_postREQ } from "./App";
import { getNotifs, getPostcards } from "./theme_posts";
import { CardListItem } from "./theme_posts";
const {
  Content
} = Layout; // Top-level component: a coursepage
// states: course, posts, notifs

function CoursePage(props) {
  const {
    courseid
  } = useParams();
  const [course, setCourse] = useState(null);
  const [postcards, setPostcards] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const enrolled = props.user.user_id === -1 || !props.user.enrolled_courses.includes(courseid) ? false : true;

  function setCourseHelper(course) {
    setCourse(course);
  }

  useEffect(() => {
    findCourse(setCourseHelper, courseid);
    getPostcards(postcards => {
      setPostcards(postcards);
    }, 1, [courseid]);
    getNotifs(notifs => {
      setNotifs(notifs);
    }, [courseid]);
  }, [courseid]);
  console.log(course);

  if (course === null) {
    return null;
  } else {
    return /*#__PURE__*/React.createElement(Layout, {
      className: "coursepage-layout"
    }, /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement(CourseHeader, {
      id: courseid,
      name: course.course_name
    }), /*#__PURE__*/React.createElement(CourseDesciptions, {
      course: course
    }), /*#__PURE__*/React.createElement(CoursePostsAndNotifs, {
      enrolled: enrolled,
      posts: postcards,
      notifs: notifs
    })));
  }
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
    }, /*#__PURE__*/React.createElement(StarOutlined, null))],
    className: "coursepage-header"
  });
}

function CourseDesciptions(props) {
  const course = props.course;
  return /*#__PURE__*/React.createElement(Descriptions, {
    column: 2,
    bordered: true,
    labelStyle: {
      background: "#ffffff",
      fontSize: "16px"
    },
    contentStyle: {
      background: "#fafafa"
    }
  }, /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Open Semester",
    span: 2
  }, course.open_semesters), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Lecturer",
    span: 2
  }, course.lecturer_name), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Module Credit"
  }, course.credit), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Workload"
  }, course.workload), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Prerequisites",
    span: 2
  }, /*#__PURE__*/React.createElement(List, {
    dataSource: course.prerequisites,
    renderItem: item => /*#__PURE__*/React.createElement(Link, {
      to: `/courses/${item}`
    }, /*#__PURE__*/React.createElement(Button, {
      type: "text"
    }, " ", item, " "))
  })), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Description",
    span: 2
  }, course.description));
}

function CoursePostsAndNotifs(props) {
  const [display, setDisplay] = useState("notifs");
  const enrolled = props.enrolled;
  const DropdownList = enrolled ? display === "notifs" ? /*#__PURE__*/React.createElement(List, {
    itemLayout: "vertical",
    size: "large",
    dataSource: props.notifs,
    renderItem: item => /*#__PURE__*/React.createElement(NotifListItem, {
      item: item
    }),
    pagination: {
      onchange: page => {
        console.log(page);
      },
      pageSize: 5,
      total: props.notifs.length,
      style: {
        textAlign: "center"
      }
    },
    className: "coursepage-notifs"
  }) : /*#__PURE__*/React.createElement(List, {
    itemLayout: "vertical",
    dataSource: props.posts,
    renderItem: item => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(CardListItem, {
      item: item
    })),
    pagination: {
      onchange: page => {
        console.log(page);
      },
      pageSize: 3,
      total: props.posts.length,
      style: {
        textAlign: "center"
      }
    },
    className: "coursepage-posts"
  }) : null;

  function displayPosts() {
    setDisplay("posts");
  }

  function displayNotifs() {
    setDisplay("notifs");
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Menu, {
    mode: "horizontal",
    defaultSelectedKeys: ["notifs"],
    className: "coursepage-options"
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "notifs",
    icon: /*#__PURE__*/React.createElement(NotificationOutlined, null),
    onClick: displayNotifs,
    disabled: !enrolled
  }, "Notifications"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "posts",
    icon: /*#__PURE__*/React.createElement(CommentOutlined, null),
    onClick: displayPosts,
    disabled: !enrolled
  }, "Course Posts")), DropdownList);
}

function NotifListItem(props) {
  let item = props.item;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(List.Item, {
    key: item.post_id,
    className: "coursepage-notifs-item"
  }, /*#__PURE__*/React.createElement(List.Item.Meta, {
    title: item.title,
    description: `Posted by ${item.author_name}, ${item.date}`
  }), /*#__PURE__*/React.createElement("span", null, item.content)));
}

async function findCourse(setCourseHelper, courseid) {
  const resp = await fetch("/api/courses/info", create_postREQ({
    "course_id": courseid
  }));
  const course = await resp.json();

  if (course["course_id"] !== "") {
    setCourseHelper({
      course_id: course["course_id"],
      course_name: course["course_name"],
      credit: course["credit"],
      workload: course["workload"],
      prerequisites: course["prerequisites"],
      lecturer_id: course["lecturer_id"],
      lecturer_name: course["lecturer_name"],
      open_semesters: course["open_semesters"],
      description: course["description"],
      rating: course["rating"]
    });
  } else {
    setCourseHelper(null);
  }
}

export { CoursePage };