import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout, PageHeader, Descriptions, List, Button, Menu, Tooltip } from "antd";
import { StarOutlined, CommentOutlined, NotificationOutlined } from "@ant-design/icons";
import "./theme_courses.css";
import { notifs_sample, posts_sample } from "./App";
import { CardListItem } from "./theme_posts";
const {
  Content
} = Layout; // hard-coded course info

const course_sample = [{
  course_id: "IT5007",
  course_name: "Software Engineering on Application Architecture",
  credit: 4,
  workload: "2-1-0-5-2",
  prerequisites: ["IT5001", "IT5003"],
  lecturer: "Prasanna Karthik Vairam",
  open_semesters: "Semester 1",
  description: "To meet changing business needs, this course focuses on flexible and agile software development on modern application architecture. Students learn to design and develop modern applications that support multiple clients across different platforms such as desktop, mobile devices and cloud. The course covers designing (1) website-based front-end software and (2) mobile app front-end that interacts with a common cloud-based backend. The final part involves engineering software for higher-level objectives such as security and performance. Tools and techniques for writing modern software, such as, HTML5, CSS3, React.js, Node.js, MySQL/MongoDB, and Git will be taught. "
}, {
  course_id: "IT5002",
  course_name: "Computer Systems and Applications",
  credit: 4,
  workload: "2-1-2-3-2",
  prerequisites: ["IT5001"],
  lecturer: "Tan Keng Yan, Colin",
  open_semesters: "Semester 1",
  description: "This module aims to introduce non-computing students to (a) the common principles and concepts in computer systems: abstraction, layering, indirection, caching, hierarchical naming, prefetching, pipelining, locking, concurrency; (b) the inner workings of a computing device, including hardware (CPU, memory, disks), operating systems (kernels, processes and threads, virtual memory, files), and applications (Web, databases)."
}]; // General layout of a coursepage

function CoursePage() {
  const {
    courseid
  } = useParams();
  const course = findCourse(courseid);
  const posts = findPosts(courseid);
  const notifs = findNotifs(courseid);

  if (course === null) {
    return null;
  } else {
    return /*#__PURE__*/React.createElement(Layout, {
      className: "coursepage-layout"
    }, /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement(CourseHeader, {
      id: course.course_id,
      name: course.course_name
    }), /*#__PURE__*/React.createElement(CourseDesciptions, {
      course: course
    }), /*#__PURE__*/React.createElement(CoursePostsAndNotifs, {
      posts: posts,
      notifs: notifs
    })));
  }
}

function findCourse(courseid) {
  for (var i = 0; i < course_sample.length; i++) {
    if (course_sample[i].course_id === courseid) {
      return course_sample[i];
    }
  }

  return null;
}

function findNotifs(courseid) {
  const notifs = [];

  for (var i = 0; i < notifs_sample.length; i++) {
    if (notifs_sample[i].course_id === courseid) {
      notifs.push(notifs_sample[i]);
    }
  }

  return notifs;
}

function findPosts(courseid) {
  const posts = [];

  for (var i = 0; i < posts_sample.length; i++) {
    if (posts_sample[i].course_id === courseid) {
      posts.push(posts_sample[i]);
    }
  }

  return posts;
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
  }, course.lecturer), /*#__PURE__*/React.createElement(Descriptions.Item, {
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
  const DropdownList = display === "notifs" ? /*#__PURE__*/React.createElement(List, {
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
  });

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
    onClick: displayNotifs
  }, "Notifications"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "posts",
    icon: /*#__PURE__*/React.createElement(CommentOutlined, null),
    onClick: displayPosts
  }, "Course Posts")), DropdownList);
}

function NotifListItem(props) {
  let item = props.item;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(List.Item, {
    key: item.notifid,
    className: "coursepage-notifs-item"
  }, /*#__PURE__*/React.createElement(List.Item.Meta, {
    title: item.title,
    description: `Posted by ${item.author}, ${item.date}`
  }), /*#__PURE__*/React.createElement("span", null, item.content)));
}

export { CoursePage };