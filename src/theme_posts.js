// stated components: PostForum, PostDetail, DraweredListItem
import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { Layout, Menu, List, Drawer, Button, Space, Card, Comment, Tooltip, Divider, Input, Form, Modal } from 'antd';
import { LikeFilled, DislikeFilled, MessageOutlined, FileAddOutlined, BookOutlined, FilterOutlined } from '@ant-design/icons';
import "./theme_posts.css";
import { create_postREQ } from "./App";
const {
  SubMenu
} = Menu;
const {
  Sider,
  Header,
  Content
} = Layout;
const {
  TextArea
} = Input; // Top-level component: display the public posts, filters and notifications
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
    access: props.access,
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
  const access_name = props.access === 1 ? "course" : "public";
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
      title: "My courses",
      icon: /*#__PURE__*/React.createElement(BookOutlined, null)
    }, course_list);
  }

  return /*#__PURE__*/React.createElement(Sider, {
    width: 220,
    className: "sider-post"
  }, /*#__PURE__*/React.createElement(Menu, {
    mode: "inline",
    defaultOpenKeys: ["sub1", "sub2"],
    className: "sider-post-menu"
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "item1",
    icon: /*#__PURE__*/React.createElement(FileAddOutlined, null),
    disabled: props.logined === 0
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/posts/create/post"
  }, "Add new ", access_name, " post")), course_selector, /*#__PURE__*/React.createElement(SubMenu, {
    key: "sub2",
    title: "Filter by",
    icon: /*#__PURE__*/React.createElement(FilterOutlined, null)
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
      text: item.details.likes.length,
      key: "list-vertical-like"
    }), /*#__PURE__*/React.createElement(IconText, {
      icon: DislikeFilled,
      text: item.details.dislikes.length,
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
  text,
  trigger,
  disabled
}) => /*#__PURE__*/React.createElement(Button, {
  type: "text",
  onClick: trigger,
  disabled: disabled
}, /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(icon), text)); // page to create a new post


function NewPost(props) {
  const {
    post_type
  } = useParams();
  const [form] = Form.useForm();
  const history = useHistory();

  async function create_post() {
    let new_post = form.getFieldsValue(true);
    let resp = await fetch("/api/courses/get_name", create_postREQ({
      course_id: new_post.course_id
    }));
    let resp_json = await resp.json();

    if (resp_json.course_name === "") {
      alert(`Cannot find course ${new_post.course_id}!`);
    } else {
      new_post.access = props.access;
      new_post.post_type = post_type === "post" ? 2 : 1;
      new_post.course_name = resp_json.course_name;
      new_post.author_id = props.user.user_id;
      new_post.author_name = props.user.user_name;
      resp = await fetch("/api/posts/add_post", create_postREQ(new_post));
      resp_json = await resp.json();
      console.log(resp_json);
      alert(`Added a new ${post_type} successfully!`);
      form.resetFields();
    }
  }

  return /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Content, {
    className: "content-detail"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "button-back",
    onClick: () => history.goBack()
  }, "Cancel and Return"), /*#__PURE__*/React.createElement("h1", {
    className: "newpost-title"
  }, " new ", props.access === 2 ? "public" : "course", " ", post_type, " "), /*#__PURE__*/React.createElement(Form, {
    form: form,
    layout: "vertical",
    className: "newpost-form"
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "course_id",
    label: "Course ID:",
    rules: [{
      required: true,
      message: "Must specify a course you're talking about!"
    }]
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Form.Item, {
    name: "title",
    label: "Title:",
    rules: [{
      required: true,
      message: "Please give a title to describe your post!"
    }]
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Form.Item, {
    name: "content",
    label: "Content:",
    rules: [{
      required: true,
      message: "Please say something about your post!"
    }]
  }, /*#__PURE__*/React.createElement(TextArea, {
    showCount: true,
    autoSize: {
      minRows: 5,
      maxRows: 10
    },
    maxLength: 2000
  })), /*#__PURE__*/React.createElement(Form.Item, null, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    htmlType: "submit",
    className: "newpost-submit",
    onClick: create_post
  }, "Create Post")))));
} // Displaying the post detail
// states: post, comments


function PostDetail(props) {
  const {
    postid
  } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [form] = Form.useForm();
  const [pop, setPop] = useState(false); // control whether to pop up the form to create new comment

  const history = useHistory();
  const user_id = props.user.user_id;

  function setPostHelper(fetched_post) {
    setPost(fetched_post);
  }

  function setCommentsHelper(indices) {
    setComments(indices);
  }

  function setPopHelper(state) {
    setPop(state);
  }

  useEffect(() => {
    findPost(setPostHelper, setCommentsHelper, parseInt(postid));
  }, [postid]);

  async function create_comment() {
    let new_comment = form.getFieldsValue(true);

    if (new_comment.content) {
      new_comment.access = post.access;
      new_comment.title = "";
      new_comment.post_type = 3;
      new_comment.author_id = user_id;
      new_comment.author_name = props.user.user_name;
      new_comment.course_id = post.course_id;
      new_comment.course_name = post.course_name;
      let resp = await fetch("/api/posts/add_post", create_postREQ(new_comment));
      let resp_json = await resp.json();
      console.log(resp_json);
      resp = await fetch("/api/posts/update_comments", create_postREQ({
        post_id: post.post_id,
        comment_id: resp_json["post_id"]
      }));
      resp_json = await resp.json();
      console.log(resp_json);
      post.details.comments.push(resp_json["post_id"]);
      const new_post = {};
      Object.assign(new_post, post);
      setPost(new_post);
      getComments(setCommentsHelper, post.access, 0, post.details.comments);
    }

    setPop(false);
  }

  const new_comment_form = /*#__PURE__*/React.createElement(Form, {
    form: form,
    className: "newcomment_form"
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "content",
    placeholder: "comment on the post...",
    rules: [{
      required: true,
      message: "An empty comment does nothing!"
    }]
  }, /*#__PURE__*/React.createElement(TextArea, {
    autoSize: {
      minRows: 3,
      maxRows: 6
    },
    maxLength: 1000
  })));
  const post_content = post === null ? /*#__PURE__*/React.createElement("h2", null, " Sorry, post ", postid, " does not exist.. ") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    className: "post-detail",
    actions: [/*#__PURE__*/React.createElement(IconText, {
      icon: LikeFilled,
      text: post.details.likes.length,
      trigger: () => like_post(setPostHelper, user_id, post),
      key: "post-like"
    }), /*#__PURE__*/React.createElement(IconText, {
      icon: DislikeFilled,
      text: post.details.dislikes.length,
      trigger: () => dislike_post(setPostHelper, user_id, post),
      key: "post-dislike"
    }), /*#__PURE__*/React.createElement(IconText, {
      icon: MessageOutlined,
      text: "make a comment",
      trigger: () => setPopHelper(true),
      disabled: user_id === -1,
      key: "post-new-comment"
    })]
  }, /*#__PURE__*/React.createElement(Card.Meta, {
    title: /*#__PURE__*/React.createElement("h1", {
      className: "post-detail-title"
    }, post.title),
    description: /*#__PURE__*/React.createElement("div", null, "Course:", /*#__PURE__*/React.createElement(Link, {
      to: `/courses/${post.course_id}`
    }, /*#__PURE__*/React.createElement(Button, {
      type: "text"
    }, post.course_id, ": ", post.course_name)), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", null, "Posted by ", post.author_name, ", ", post.date))
  }), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "post-detail-content"
  }, /*#__PURE__*/React.createElement("span", {
    className: "post-detail-content-head"
  }, "Content"), /*#__PURE__*/React.createElement("br", null), post.content)), /*#__PURE__*/React.createElement(Modal, {
    title: "My Comment",
    visible: pop,
    onOk: create_comment,
    onCancel: () => setPopHelper(false)
  }, new_comment_form), /*#__PURE__*/React.createElement(List, {
    className: "post-comment",
    header: `${comments.length} Replies`,
    itemLayout: "horizontal",
    dataSource: comments,
    renderItem: item => /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Comment, {
      actions: [/*#__PURE__*/React.createElement(Tooltip, {
        key: `comment-${item.post_id}-like`,
        title: "Like"
      }, /*#__PURE__*/React.createElement(LikeFilled, {
        onClick: () => {
          let idx = comments.findIndex(comment => {
            return comment.post_id === item.post_id;
          });

          if (idx !== -1) {
            like_post(setCommentsHelper, user_id, comments[idx]);
            setComments([].concat(comments)); // refresh the comments
          }
        }
      }), /*#__PURE__*/React.createElement("span", {
        className: "comment-action"
      }, item.details.likes.length)), /*#__PURE__*/React.createElement(Tooltip, {
        key: `comment-${item.post_id}-dislike`,
        title: "Dislike"
      }, /*#__PURE__*/React.createElement(DislikeFilled, {
        onClick: () => {
          let idx = comments.findIndex(comment => {
            return comment.post_id === item.post_id;
          });

          if (idx !== -1) {
            dislike_post(setCommentsHelper, user_id, comments[idx]);
            setComments([].concat(comments));
          }
        }
      }), /*#__PURE__*/React.createElement("span", {
        className: "comment-action"
      }, item.details.dislikes.length))],
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
      snippet: postcard["content"].slice(0, 100) + "...",
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
} // like_post: front-end processing for liking bahaviors


async function like_post(setHelper, user_id, post) {
  // like_state: 
  //     0: no change; 1: liked; 2: like cancelled; 3: liked and dislike cancelled; 
  //     4: disliked; 5: dislike cancelled; 6: disliked and like cancelled
  let like_state = 0;

  if (user_id !== -1) {
    let likes = post.details.likes;
    let dislikes = post.details.dislikes;

    if (likes.includes(user_id)) {
      likes.splice(likes.indexOf(user_id), 1);
      like_state = 2;
    } else {
      likes.push(user_id);
      like_state = 1;
      let dislike_pos = dislikes.indexOf(user_id);

      if (dislike_pos !== -1) {
        dislikes.splice(dislike_pos, 1);
        like_state = 3;
      }
    }

    await fetch("/api/posts/update_like", {
      method: "post",
      confidential: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "post_id": post.post_id,
        "user_id": user_id,
        "like_state": like_state
      })
    });

    if (post.post_type === 2) {
      let new_post = {};
      Object.assign(new_post, post); // shallow copy of the modified post

      setHelper(new_post);
    } // comments are modified outside the function

  }
} // dislike_post: front-end processing for disliking bahaviors


async function dislike_post(setHelper, user_id, post) {
  // like_state: 
  //     0: no change; 1: liked; 2: like cancelled; 3: liked and dislike cancelled; 
  //     4: disliked; 5: dislike cancelled; 6: disliked and like cancelled
  let like_state = 0;

  if (user_id !== -1) {
    let likes = post.details.likes;
    let dislikes = post.details.dislikes;

    if (dislikes.includes(user_id)) {
      dislikes.splice(dislikes.indexOf(user_id), 1);
      like_state = 5;
    } else {
      dislikes.push(user_id);
      like_state = 4;
      let like_pos = likes.indexOf(user_id);

      if (like_pos !== -1) {
        likes.splice(like_pos, 1);
        like_state = 6;
      }
    }

    await fetch("/api/posts/update_like", {
      method: "post",
      confidential: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "post_id": post.post_id,
        "user_id": user_id,
        "like_state": like_state
      })
    });

    if (post.post_type === 2) {
      let new_post = {};
      Object.assign(new_post, post); // shallow copy of the modified post

      setHelper(new_post);
    } // comments are modified outside the function

  }
}

export { PostForum, NewPost, PostDetail, CardListItem, getPostcards, getNotifs, getComments };