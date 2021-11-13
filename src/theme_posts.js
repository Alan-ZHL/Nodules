import React, { useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { Layout, Menu, List, Drawer, Button, Space, Card, Comment, Tooltip, Divider } from 'antd';
import { LikeFilled, DislikeFilled, MessageOutlined } from '@ant-design/icons';
import "./theme_posts.css";
import { notifs_sample, posts_sample, comments_sample } from "./App";
const {
  SubMenu
} = Menu;
const {
  Sider,
  Header,
  Content
} = Layout; // Top-level component: display public posts with a complete layout

function PublicForum(props) {
  return /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(PostSider, {
    logined: props.logined
  }), /*#__PURE__*/React.createElement(PostContent, null), /*#__PURE__*/React.createElement(NotifSider, {
    logined: props.logined
  }));
} // Top-level component: display course posts with a complete layout


function CourseForum(props) {
  return /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(PostSider, {
    logined: props.logined
  }), /*#__PURE__*/React.createElement(PostContent, null), /*#__PURE__*/React.createElement(NotifSider, {
    logined: props.logined
  }));
} // Left sider of the posts page: offers some simple filters


function PostSider(props) {
  const course_selector = props.logined === 1 ? /*#__PURE__*/React.createElement(SubMenu, {
    key: "sub1",
    title: "My courses"
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "course_1"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/courses/IT5007"
  }, "IT5007")), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "course_2"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/courses/IT5002"
  }, "IT5002")), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "course_3"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/courses/CS4226"
  }, "CS4226")), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "course_4"
  }, "CS5424")) : null;
  return /*#__PURE__*/React.createElement(Sider, {
    width: 220,
    className: "sider-post"
  }, /*#__PURE__*/React.createElement(Menu, {
    mode: "inline",
    defaultOpenKeys: ["sub1", "sub2"],
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
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "Created on ", item.date, ", ", /*#__PURE__*/React.createElement("br", null), "by ", item.author_name)
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
    dataSource: posts_sample,
    renderItem: item => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(CardListItem, {
      item: item
    })),
    pagination: {
      onchange: page => {
        console.log(page);
      },
      pageSize: 5,
      total: posts_sample.length,
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
    history.push(`/posts/${item.post_id}`);
  }

  return /*#__PURE__*/React.createElement(List.Item, {
    key: item.post_id,
    actions: [/*#__PURE__*/React.createElement(IconText, {
      icon: LikeFilled,
      text: item.details.likes,
      key: "list-vertical-like"
    }), /*#__PURE__*/React.createElement(IconText, {
      icon: DislikeFilled,
      text: item.details.dislikes,
      key: "list-vertical-dislike"
    }), /*#__PURE__*/React.createElement(IconText, {
      icon: MessageOutlined,
      text: item.details.comments.length,
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
    }, item.title)),
    description: `Posted by ${item.author_name}, ${item.date}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "link-post-detail",
    onClick: showDetail
  }, item.snippet));
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
      text: post.details.likes,
      key: "post-like"
    }), /*#__PURE__*/React.createElement(IconText, {
      icon: DislikeFilled,
      text: post.details.dislikes,
      key: "post-dislike"
    })]
  }, /*#__PURE__*/React.createElement(Card.Meta, {
    title: /*#__PURE__*/React.createElement("span", {
      className: "post-detail-title"
    }, post.title),
    description: /*#__PURE__*/React.createElement(React.Fragment, null, "Course:", /*#__PURE__*/React.createElement(Link, {
      to: `/courses/${post.course_id}`
    }, /*#__PURE__*/React.createElement(Button, {
      type: "text"
    }, post.course_id, ": ", post.course_name)), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", null, "Posted by ", post.author_name, ", ", post.date))
  }), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
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
      }, item.details.likes)), /*#__PURE__*/React.createElement(Tooltip, {
        key: `comment-${item.commentid}-dislike`,
        title: "Dislike"
      }, /*#__PURE__*/React.createElement(DislikeFilled, null), /*#__PURE__*/React.createElement("span", {
        className: "comment-action"
      }, item.details.dislikes))],
      author: item.author_name,
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
  const length = posts_sample.length;

  for (let i = 0; i < length; i++) {
    if (posts_sample[i].post_id === postid) {
      return posts_sample[i];
    }
  }

  return null;
} // TODO: should be implemented on the backend, and the logic should change accordingly


function findComments(idx) {
  if (idx < 0 || idx >= comments_sample.length - 3) {
    return null;
  } else {
    return comments_sample.slice(idx, idx + 3);
  }
}

export { PublicForum, CourseForum, PostDetail, CardListItem };