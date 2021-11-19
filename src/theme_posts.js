// stated components: PostForum, PostDetail, DraweredListItem
import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { Layout, Menu, List, Drawer, Button, Space, Card, Comment, Tooltip, Divider } from 'antd';
import { LikeFilled, DislikeFilled, MessageOutlined } from '@ant-design/icons';
import "./theme_posts.css";
const {
  SubMenu
} = Menu;
const {
  Sider,
  Header,
  Content
} = Layout; // Top-level component: display the public posts, filters and notifications
// states: postcards (simple form of a post), notifs

function PostForum(props) {
  const [postcards, setPostcards] = useState([]);
  const [notifs, setNotifs] = useState([]);
  useEffect(() => {
    getPostcards(postcards => {
      setPostcards(postcards);
    }, props.access);
  }, [props.access]); // bind course posts with specific users

  useEffect(() => {
    if (props.logined === 1 && props.user.user_id !== -1) {
      getNotifs(notifs => {
        setNotifs(notifs);
      }, props.user.enrolled_courses);
    } else {
      setNotifs([]);
    }
  }, [props.logined, props.user]);
  return /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(PostSider, {
    logined: props.logined,
    user: props.user
  }), /*#__PURE__*/React.createElement(PostContent, {
    postcards: postcards
  }), /*#__PURE__*/React.createElement(NotifSider, {
    logined: props.logined,
    notifs: notifs
  }));
} // Left sider of the posts page: offer some simple filters


function PostSider(props) {
  var course_selector = null;

  if (props.logined === 1 && props.user.user_id !== -1) {
    const enrolled_courses = props.user.enrolled_courses;
    const favored_courses = props.user.favored_courses;
    let course_list = [];
    let key = 1;

    for (let course of enrolled_courses) {
      course_list.push( /*#__PURE__*/React.createElement(Menu.Item, {
        key: `course_${key}`
      }, /*#__PURE__*/React.createElement(Link, {
        to: `/courses/${course}`
      }, course, " (enrolled)")));
      key++;
    }

    for (let course of favored_courses) {
      course_list.push( /*#__PURE__*/React.createElement(Menu.Item, {
        key: `course_${key}`
      }, /*#__PURE__*/React.createElement(Link, {
        to: `/courses/${course}`
      }, course)));
      key++;
    }

    course_selector = /*#__PURE__*/React.createElement(SubMenu, {
      key: "sub1",
      title: "My courses"
    }, course_list);
  }

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
    dataSource: props.notifs,
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
// states: visible


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


function PostContent(props) {
  return /*#__PURE__*/React.createElement(Content, {
    className: "content-post"
  }, /*#__PURE__*/React.createElement(List, {
    itemLayout: "vertical",
    size: "large",
    dataSource: props.postcards,
    renderItem: item => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(CardListItem, {
      item: item
    })),
    pagination: {
      onchange: page => {
        console.log(page);
      },
      pageSize: 5,
      total: props.postcards.length,
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
// states: post, comments


function PostDetail() {
  const {
    postid
  } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const history = useHistory();

  function setPostHelper(fetched_post) {
    setPost(fetched_post);
  }

  function setCommentsHelper(indices) {
    setComments(indices);
  }

  useEffect(() => {
    findPost(setPostHelper, setCommentsHelper, parseInt(postid));
  }, [postid]);
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
        key: `comment-${item.post_id}-like`,
        title: "Like"
      }, /*#__PURE__*/React.createElement(LikeFilled, null), /*#__PURE__*/React.createElement("span", {
        className: "comment-action"
      }, item.details.likes)), /*#__PURE__*/React.createElement(Tooltip, {
        key: `comment-${item.post_id}-dislike`,
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
} // getPostcards: function to get a postcard list for the post forum
// postcard: simpler form of a post
// access:    1: course; 2: public
// course_id: [0]: any course
// author_id: 0: any author


async function getPostcards(setPostcardsHelper, access = 2, courses = [0], author_id = 0) {
  const resp = await fetch("/api/posts/cards", {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "access": access,
      "courses": courses,
      "author_id": author_id
    })
  });
  const resp_json = await resp.json();
  var postcards = [];

  for (let postcard of resp_json) {
    postcards.push({
      post_id: postcard["post_id"],
      title: postcard["title"],
      course_id: postcard["course_id"],
      author_id: postcard["author_id"],
      author_name: postcard["author_name"],
      date: postcard["date"],
      snippet: postcard["snippet"],
      details: {
        likes: postcard["details"]["likes"],
        dislikes: postcard["details"]["dislikes"],
        comments: postcard["details"]["comments"]
      }
    });
  }

  setPostcardsHelper(postcards);
} // findPost (different from getPostcards): find a specific and complete post, updating the post as well as its comments
// (export notice: please export the nested "getComments" as well)


async function findPost(setPostHelper, setCommentsHelper, post_id) {
  const resp = await fetch("/api/posts/get_post", {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "post_id": post_id
    })
  });
  const post = await resp.json();

  if (post["post_id"] !== -1) {
    setPostHelper({
      post_id: post["post_id"],
      title: post["title"],
      access: post["access"],
      post_type: post["post_type"],
      course_id: post["course_id"],
      course_name: post["course_name"],
      author_id: post["author_id"],
      author_name: post["author_name"],
      date: post["date"],
      content: post["content"],
      details: {
        likes: post["details"]["likes"],
        dislikes: post["details"]["dislikes"],
        comments: post["details"]["comments"]
      }
    });
    getComments(setCommentsHelper, post["access"], 0, post["details"]["comments"]);
  } else {
    setPostHelper(null);
  }
} // getNotifs: function to get notifications of a user
// course_id: [0]: any course
// author_id: 0: any author


async function getNotifs(setNotifsHelper, courses = [0], author_id = 0) {
  const resp = await fetch("/api/posts/notifs", {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "courses": courses,
      "author_id": author_id
    })
  });
  const resp_json = await resp.json();
  var notifs = [];

  for (let notif of resp_json) {
    notifs.push({
      post_id: notif["post_id"],
      title: notif["title"],
      access: notif["access"],
      post_type: notif["post_type"],
      course_id: notif["course_id"],
      course_name: notif["course_name"],
      author_id: notif["author_id"],
      author_name: notif["author_name"],
      date: notif["date"],
      content: notif["content"]
    });
  }

  setNotifsHelper(notifs);
} // getComments: function to get comments of a post
// access:    0: course; 1: public
// author_id: 0: any author
// indices:   list of comments (as post_ids)


async function getComments(setCommentsHelper, access = 2, author_id = 0, indices = []) {
  const resp = await fetch("/api/posts/comments", {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "comments": indices,
      "access": access,
      "author_id": author_id
    })
  });
  const resp_json = await resp.json();
  var comments = [];

  for (let comment of resp_json) {
    comments.push({
      post_id: comment["post_id"],
      title: comment["title"],
      access: comment["access"],
      type: comment["type"],
      course_id: comment["course_id"],
      course_name: comment["course_name"],
      author_id: comment["author_id"],
      author_name: comment["author_name"],
      date: comment["date"],
      content: comment["content"],
      details: {
        likes: comment["details"]["likes"],
        dislikes: comment["details"]["dislikes"]
      }
    });
  }

  setCommentsHelper(comments);
}

export { PostForum, PostDetail, CardListItem, getPostcards, getNotifs, getComments };