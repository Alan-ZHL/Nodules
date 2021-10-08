import React, { useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { Layout, Menu, List, Drawer, Button, Space, Card, Comment, Tooltip } from 'antd';
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
  course_id: "IT5007",
  author: "Prasanna Karthik Vairam",
  date: "2021-09-30",
  content: "remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd!"
}, {
  title: "Exam date determined",
  course_id: "IT5002",
  author: "Colin Tan",
  date: "2021-09-03",
  content: "Midterm exam is set on Oct 5th. Please be prepared."
}, {
  title: "Welcome to CS4226!",
  course_id: "CS4226",
  author: "Richard Ma",
  date: "2021-08-26",
  content: "Welcome to CS4226. I will be the lecturer of this course. Looking forward to meeting all of you!"
}]; // hard-coded posts info

const listData = [];
const listComment = [];

for (let i = 0; i < 16; i++) {
  listData.push({
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
  listComment.push({
    commentid: i,
    participant: "Biden III",
    date: "2 days ago",
    content: `Good job! ${i}`,
    likes: 10,
    dislikes: 2
  });
} // Top-level component: display public posts with a complete layout


function PublicForum(props) {
  return /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(PostSider, {
    logined: props.logined,
    ispublic: props.ispublic
  }), /*#__PURE__*/React.createElement(PostContent, null), /*#__PURE__*/React.createElement(NotifSider, {
    logined: props.logined
  }));
} // Top-level component: display course posts with a complete layout


function CourseForum(props) {
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
    title: /*#__PURE__*/React.createElement(React.Fragment, null, item.course_id, /*#__PURE__*/React.createElement("br", null), item.title),
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "Created on ", item.date, ", ", /*#__PURE__*/React.createElement("br", null), "by ", item.author)
  })), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Drawer, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, item.course_id, /*#__PURE__*/React.createElement("br", null), item.title),
    placement: "right",
    onClose: onClose,
    visible: visible,
    width: 360
  }, item.content));
} // Showing a list of posts in the public or course forum


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
} // Creating a brief info of a post in the forum


function CardListItem(props) {
  let item = props.item;
  const history = useHistory();

  function showDetail() {
    history.push(`/posts/${item.postid}`);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(List.Item, {
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
      text: item.comments.length,
      key: "list-vertical-message"
    })],
    className: "content-post-item"
  }, /*#__PURE__*/React.createElement(List.Item.Meta, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Link, {
      to: `/courses/${item.course_id}`
    }, /*#__PURE__*/React.createElement(Button, {
      type: "text"
    }, " ", item.course_id, " ")), /*#__PURE__*/React.createElement("span", {
      className: "link-post-detail",
      onClick: showDetail
    }, item.topic)),
    description: `Posted by ${item.starter}, ${item.date}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "link-post-detail",
    onClick: showDetail
  }, item.snippet)));
}

const IconText = ({
  icon,
  text
}) => /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(icon), text); // Displaying the post detail


function PostDetail() {
  const {
    postid
  } = useParams();
  const history = useHistory(); // pass these functions to backend later

  const post = findPost(parseInt(postid));
  const comments = findComments(parseInt(postid) - 1056);
  const post_content = post === null ? /*#__PURE__*/React.createElement("h2", null, " Sorry, post ", postid, " does not exist.. ") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    className: "post-detail",
    actions: [/*#__PURE__*/React.createElement(IconText, {
      icon: LikeFilled,
      text: post.likes,
      key: "post-like"
    }), /*#__PURE__*/React.createElement(IconText, {
      icon: DislikeFilled,
      text: post.dislikes,
      key: "post-dislike"
    })]
  }, /*#__PURE__*/React.createElement(Card.Meta, {
    title: /*#__PURE__*/React.createElement("span", {
      className: "post-detail-title"
    }, post.topic),
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "Course:", /*#__PURE__*/React.createElement(Link, {
      to: `/courses/${post.course_id}`
    }, /*#__PURE__*/React.createElement(Button, {
      type: "text"
    }, post.course_id, ": ", post.course_name)), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", null, "Posted by ", post.starter, ", ", post.date))
  }), /*#__PURE__*/React.createElement("div", {
    className: "post-detail-content"
  }, /*#__PURE__*/React.createElement("span", {
    className: "post-detail-content-head"
  }, "Content"), /*#__PURE__*/React.createElement("br", null), post.content)), /*#__PURE__*/React.createElement(List, {
    className: "post-comment",
    header: `${comments.length} Replies`,
    itemLayout: "horizontal",
    dataSource: comments,
    renderItem: item => /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Comment, {
      actions: [/*#__PURE__*/React.createElement(Tooltip, {
        key: `comment-${item.commentid}-like`,
        title: "Like"
      }, /*#__PURE__*/React.createElement(LikeFilled, null), /*#__PURE__*/React.createElement("span", {
        className: "comment-action"
      }, item.likes)), /*#__PURE__*/React.createElement(Tooltip, {
        key: `comment-${item.commentid}-dislike`,
        title: "Dislike"
      }, /*#__PURE__*/React.createElement(DislikeFilled, null), /*#__PURE__*/React.createElement("span", {
        className: "comment-action"
      }, item.dislikes))],
      author: item.participant,
      content: item.content,
      datetime: item.date
    }))
  }));
  return /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Content, {
    className: "content-detail"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "button-back",
    onClick: () => history.goBack()
  }, "Back to the Forum"), post_content));
} // TODO: should be implemented on the backend


function findPost(postid) {
  const length = listData.length;

  for (let i = 0; i < length; i++) {
    if (listData[i].postid === postid) {
      return listData[i];
    }
  }

  return null;
} // TODO: should be implemented on the backend, and the logic should change accordingly


function findComments(idx) {
  if (idx < 0 || idx >= listComment.length - 3) {
    return null;
  } else {
    return listComment.slice(idx, idx + 3);
  }
}

export { PublicForum, CourseForum, PostDetail };