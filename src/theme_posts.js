import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, List, Drawer, Button, Space } from 'antd';
import { LikeFilled, DislikeFilled, MessageOutlined } from '@ant-design/icons';
import "./theme_posts.css";
const {
  SubMenu
} = Menu;
const {
  Sider,
  Header,
  Content
} = Layout; // hard-coded notifications

const notifs_sample = [{
  title: "Remember to submit tutorial 4",
  course: "IT5007",
  author: "Prasanna Karthik Vairam",
  date: "2021-09-30",
  content: "remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd!"
}, {
  title: "Exam date determined",
  course: "IT5002",
  author: "Colin Tan",
  date: "2021-09-03",
  content: "Midterm exam is set on Oct 5th. Please be prepared."
}, {
  title: "Welcome to CS4226!",
  course: "CS4226",
  author: "Richard Ma",
  date: "2021-08-26",
  content: "Welcome to CS4226. I will be the lecturer of this course. Looking forward to meeting all of you!"
}]; // hard-coded posts info

const listData = [];

for (let i = 0; i < 16; i++) {
  listData.push({
    postid: 1056 + i,
    topic: `Sample post ${i}`,
    starter: "Donald Trump ex",
    course: "IT5007",
    date: "2 days ago",
    snippet: 'We supply a series of design principles, practical patterns and high quality design resources...',
    likes: 156,
    dislikes: 18,
    comments: 6
  });
} // Top-level component: display public posts with a complete layout


function PublicPostsGeneral(props) {
  // TODO: add the logic of getting the post from public / user info
  return /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(PostSider, {
    logined: props.logined,
    ispublic: props.ispublic
  }), /*#__PURE__*/React.createElement(PostContent, null), /*#__PURE__*/React.createElement(NotifSider, {
    logined: props.logined
  }));
} // Top-level component: display course posts with a complete layout


function CoursePostsGeneral(props) {
  return /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(PostSider, {
    logined: props.logined,
    ispublic: props.ispubic
  }), /*#__PURE__*/React.createElement(PostContent, null), /*#__PURE__*/React.createElement(NotifSider, {
    logined: props.logined
  }));
} // Left sider of the posts page: offers some simple filters


function PostSider(props) {
  const course_selector = props.ispublic === 0 ? /*#__PURE__*/React.createElement(SubMenu, {
    key: "sub1",
    title: "My courses"
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "course_1"
  }, "IT5007"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "course_2"
  }, "IT5002"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "course_3"
  }, "CS4226"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "course_4"
  }, "CS5424")) : null;
  return /*#__PURE__*/React.createElement(Sider, {
    width: 220,
    className: "sider-post"
  }, /*#__PURE__*/React.createElement(Menu, {
    mode: "inline",
    defaultOpenKeys: ['sub1', 'sub2'],
    className: "sider-post-menu"
  }, course_selector, /*#__PURE__*/React.createElement(SubMenu, {
    key: "sub2",
    title: "Filter by"
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "filter_1"
  }, "Favored courses"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "fileter_2"
  }, "Hotest posts"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "filter_3"
  }, "Latest posts"))));
} // Right sider: displays the notifications of the user


function NotifSider(props) {
  const notif_list = props.logined ? /*#__PURE__*/React.createElement(List, {
    itemLayout: "horizontal",
    dataSource: notifs_sample,
    renderItem: item => /*#__PURE__*/React.createElement(DraweredListItem, {
      item: item
    }),
    className: "sider-notif-list"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "notlogined-notif"
  }, "Login to synchronize the notifications.");
  return /*#__PURE__*/React.createElement(Sider, {
    width: 270,
    className: "sider-notif"
  }, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Header, {
    className: "header-notif"
  }, "Notifications"), /*#__PURE__*/React.createElement(Content, null, notif_list)));
} // Child component of NotifSider: renders a notification as a list item with a detailed drawer.


function DraweredListItem(props) {
  const [visible, setVisible] = useState(false);
  const item = props.item;

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(List.Item, {
    actions: [/*#__PURE__*/React.createElement("a", {
      onClick: showDrawer
    }, "more")]
  }, /*#__PURE__*/React.createElement(List.Item.Meta, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, item.course, /*#__PURE__*/React.createElement("br", null), item.title),
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "Created on ", item.date, ", ", /*#__PURE__*/React.createElement("br", null), "by ", item.author)
  })), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Drawer, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, item.course, /*#__PURE__*/React.createElement("br", null), item.title),
    placement: "right",
    onClose: onClose,
    visible: visible,
    width: 360
  }, item.content));
}

function PostContent() {
  return /*#__PURE__*/React.createElement(Content, {
    className: "content-post"
  }, /*#__PURE__*/React.createElement(List, {
    itemLayout: "vertical",
    size: "large",
    dataSource: listData,
    renderItem: item => /*#__PURE__*/React.createElement(CardListItem, {
      item: item
    }),
    pagination: {
      onchange: page => {
        console.log(page);
      },
      pageSize: 3,
      total: 18,
      style: {
        textAlign: "center"
      }
    }
  }));
}

function CardListItem(props) {
  let item = props.item;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Link, {
    to: `/posts/${item.postid}`
  }, /*#__PURE__*/React.createElement(List.Item, {
    key: item.postid,
    actions: [/*#__PURE__*/React.createElement(IconText, {
      icon: LikeFilled,
      text: item.likes,
      key: "list-vertical-like"
    }), /*#__PURE__*/React.createElement(IconText, {
      icon: DislikeFilled,
      text: item.dislikes,
      key: "list-vertical-dislike"
    }), /*#__PURE__*/React.createElement(IconText, {
      icon: MessageOutlined,
      text: item.comments,
      key: "list-vertical-message"
    })],
    className: "content-post-item"
  }, /*#__PURE__*/React.createElement(List.Item.Meta, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Link, {
      to: `/courses/${item.course}`
    }, /*#__PURE__*/React.createElement(Button, {
      type: "text"
    }, " ", item.course, " ")), item.topic),
    description: `Posted by ${item.author}, ${item.date}`
  }), item.snippet)));
}

const IconText = ({
  icon,
  text
}) => /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(icon), text);

export { PublicPostsGeneral, CoursePostsGeneral };