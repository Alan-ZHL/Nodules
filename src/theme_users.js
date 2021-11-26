// stated components: MyPosts
import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { Form, Input, Button, Checkbox } from 'antd';
import { Layout, PageHeader, Descriptions, List, Menu, message } from "antd";
import { UserOutlined, LockOutlined, CoffeeOutlined, CommentOutlined } from '@ant-design/icons';
import "./theme_users.css";
import { create_postREQ } from "./App";
import { CardListItem, getPostcards } from "./theme_posts";
const {
  Content
} = Layout;

function Users(props) {
  const user = props.userInfo;

  if (props.logined === 0) {
    return /*#__PURE__*/React.createElement("div", null, "Please login to retrieve user information.");
  } else {
    return /*#__PURE__*/React.createElement(Layout, {
      className: "user-layout"
    }, /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement(UserHeader, {
      title: "Basic Information"
    }), /*#__PURE__*/React.createElement(UserDesciptions_basic, {
      user: user
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(UserHeader, {
      title: "Module Information"
    }), /*#__PURE__*/React.createElement(UserDesciptions_module, {
      user: user
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(UserHeader, {
      title: "My Post"
    }), /*#__PURE__*/React.createElement(MyPosts, {
      user: user
    })));
  }
}

function UserHeader(props) {
  return /*#__PURE__*/React.createElement(PageHeader, {
    ghost: false,
    title: props.title,
    className: "user-header"
  });
}

function UserDesciptions_basic(props) {
  const user = props.user;
  let role = 'N/A';

  if (user.role === 0) {
    role = 'Student';
  }

  ;

  if (user.role === 1) {
    role = 'Lecturer';
  }

  ;

  if (user.role === 2) {
    role = 'Admin';
  }

  ;
  return /*#__PURE__*/React.createElement(Descriptions, {
    column: 1,
    bordered: true,
    contentStyle: {
      background: "#fafafa"
    },
    labelStyle: {
      background: "#ffffff",
      fontSize: "16px",
      width: 200
    }
  }, /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "User Name"
  }, user.user_name), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Role"
  }, role), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Email"
  }, user.email), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "About Me"
  }, user.about_me));
}

function UserDesciptions_module(props) {
  const user = props.user;
  return /*#__PURE__*/React.createElement(Descriptions, {
    column: 5,
    bordered: true,
    contentStyle: {
      background: "#fafafa"
    },
    labelStyle: {
      background: "#ffffff",
      fontSize: "16px",
      width: 200
    }
  }, /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Taken Moduls",
    span: 5
  }, /*#__PURE__*/React.createElement(List, {
    dataSource: user.taken_courses,
    renderItem: item => /*#__PURE__*/React.createElement(Link, {
      to: `/courses/${item}`
    }, /*#__PURE__*/React.createElement(Button, {
      type: "text"
    }, " ", item, " "))
  })), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Enrolled Moduls",
    span: 5
  }, /*#__PURE__*/React.createElement(List, {
    dataSource: user.enrolled_courses,
    renderItem: item => /*#__PURE__*/React.createElement(Link, {
      to: `/courses/${item}`
    }, /*#__PURE__*/React.createElement(Button, {
      type: "text"
    }, " ", item, " "))
  })), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Favored Moduls",
    span: 5
  }, /*#__PURE__*/React.createElement(List, {
    dataSource: user.favored_courses,
    renderItem: item => /*#__PURE__*/React.createElement(Link, {
      to: `/courses/${item}`
    }, /*#__PURE__*/React.createElement(Button, {
      type: "text"
    }, " ", item, " "))
  })));
} // categaried by --public
//               --course (filtered by enrolled modules)
// states: display, publicPosts, coursePosts


function MyPosts(props) {
  const [display, setDisplay] = useState("public");
  const [publicPosts, setPublicPosts] = useState([]);
  const [coursePosts, setCoursePosts] = useState([]);
  const user_id = props.user.user_id;

  function setPublicPostsHelper(posts) {
    setPublicPosts(posts);
  }

  function setCoursePostsHelper(posts) {
    setCoursePosts(posts);
  }

  useEffect(() => {
    if (display === "public") {
      getPostcards(setPublicPostsHelper, 2, [0], user_id);
    } else {
      getPostcards(setCoursePostsHelper, 1, [0], user_id);
    }
  }, [display, user_id]);
  const drop_down_list = display === "public" ? /*#__PURE__*/React.createElement(PublicPostsByUser, {
    posts: publicPosts
  }) : /*#__PURE__*/React.createElement(CoursePostsByUser, {
    user: props.user,
    posts: coursePosts
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Menu, {
    theme: "light",
    mode: "horizontal",
    defaultSelectedKeys: ['1']
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "1",
    icon: /*#__PURE__*/React.createElement(CoffeeOutlined, null),
    onClick: () => setDisplay("public")
  }, "Public Chats"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "2",
    icon: /*#__PURE__*/React.createElement(CommentOutlined, null),
    onClick: () => setDisplay("course")
  }, "Course Discussion")), drop_down_list);
}

function PublicPostsByUser(props) {
  return /*#__PURE__*/React.createElement(List, {
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
    className: "user-posts"
  });
}

function CoursePostsByUser(props) {
  const enrolledCourseList = props.user.enrolled_courses;
  const [displayed_course, setCourse] = useState(enrolledCourseList[0]);
  const course_posts_by_user = getSelectedCoursePosts(props.posts, displayed_course);
  const menuItems = enrolledCourseList.map(course => {
    return /*#__PURE__*/React.createElement(Menu.Item, {
      onClick: () => setCourse(course)
    }, course);
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Menu, {
    theme: "light",
    mode: "horizontal",
    className: "user-course-disscusion-menu"
  }, menuItems), /*#__PURE__*/React.createElement(List, {
    itemLayout: "vertical",
    dataSource: course_posts_by_user,
    renderItem: item => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(CardListItem, {
      item: item
    })),
    pagination: {
      onchange: page => {
        console.log(page);
      },
      pageSize: 3,
      total: course_posts_by_user.length,
      style: {
        textAlign: "center"
      }
    },
    className: "user-posts"
  }));
} // helper function: get posts from a selected course **among user's enrolled courses**


function getSelectedCoursePosts(posts, course) {
  let course_posts = [];

  for (let post of posts) {
    if (post["course_id"] === course) {
      course_posts.push(post);
    }
  }

  return course_posts;
}

function Login(props) {
  const [retMsg, setRetMsg] = useState("");
  const [form] = Form.useForm();

  const onFinish = values => {
    console.log('Received values of form: ', values);
  };

  function getFormData() {
    return form.getFieldsValue(true);
  }

  function postData() {
    fetch("/api/login", create_postREQ(getFormData())).then(resp => resp.json().then(data => {
      setRetMsg(data['message']);
      props.loginHelper(data['status']);

      if (data["status"] === 1) {
        message.success(data["message"]);
      } else {
        message.error(data["message"]);
      }
    }));
  }

  const loginForm = props.logined === 0 ? /*#__PURE__*/React.createElement(Form, {
    form: form,
    name: "normal_login",
    className: "login-form",
    initialValues: {
      remember: true
    },
    onFinish: onFinish
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "email",
    rules: [{
      required: true,
      message: 'Please input your Email!'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    prefix: /*#__PURE__*/React.createElement(UserOutlined, {
      className: "site-form-item-icon"
    }),
    placeholder: "Email"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    name: "password",
    rules: [{
      required: true,
      message: 'Please input your Password!'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    prefix: /*#__PURE__*/React.createElement(LockOutlined, {
      className: "site-form-item-icon"
    }),
    type: "password",
    placeholder: "Password"
  })), /*#__PURE__*/React.createElement(Form.Item, null, /*#__PURE__*/React.createElement(Form.Item, {
    name: "remember",
    valuePropName: "checked",
    noStyle: true
  }, /*#__PURE__*/React.createElement(Checkbox, null, "Remember me")), /*#__PURE__*/React.createElement("a", {
    className: "login-form-forgot",
    href: ""
  }, "Forgot password")), /*#__PURE__*/React.createElement(Form.Item, null, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    htmlType: "submit",
    className: "login-form-button",
    onClick: postData
  }, "Log in")), /*#__PURE__*/React.createElement("div", null, retMsg)) : /*#__PURE__*/React.createElement(Redirect, {
    to: "/posts/public"
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, loginForm);
}

function Register() {
  const [retMsg, setRetMsg] = useState("");
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 8
      }
    },
    wrapperCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 16
      }
    }
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  };

  function getFormData() {
    return form.getFieldsValue(true);
  }

  function postData() {
    fetch("/api/register", create_postREQ(getFormData())).then(resp => resp.json().then(retMsg => {
      setRetMsg(retMsg);
    }));
  }

  const onFinish = values => {
    console.log('Received values of form: ', values); // for tests only
  };

  return /*#__PURE__*/React.createElement(Form, {
    className: "regi-form",
    labelCol: formItemLayout.labelCol,
    wrapperCol: formItemLayout.wrapperCol,
    form: form,
    name: "register",
    onFinish: onFinish,
    scrollToFirstError: true
  }, /*#__PURE__*/React.createElement(Form.Item, {
    name: "email",
    label: "E-mail",
    rules: [{
      type: 'email',
      message: 'The input is not valid E-mail!'
    }, {
      required: true,
      message: 'Please input your E-mail!'
    }]
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Form.Item, {
    name: "password",
    label: "Password",
    rules: [{
      required: true,
      message: 'Please input your password!'
    }],
    hasFeedback: true
  }, /*#__PURE__*/React.createElement(Input.Password, null)), /*#__PURE__*/React.createElement(Form.Item, {
    name: "confirm",
    label: "Confirm Password",
    dependencies: ['password'],
    hasFeedback: true,
    rules: [{
      required: true,
      message: 'Please confirm your password!'
    }, ({
      getFieldValue
    }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }

        return Promise.reject(new Error('The two passwords that you entered do not match!'));
      }

    })]
  }, /*#__PURE__*/React.createElement(Input.Password, null)), /*#__PURE__*/React.createElement(Form.Item, {
    name: "user_name",
    label: "Username",
    tooltip: "What do you want others to call you?",
    rules: [{
      required: true,
      message: 'Please input your username!',
      whitespace: true
    }]
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Form.Item, {
    name: "agreement",
    valuePropName: "checked",
    rules: [{
      validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement'))
    }],
    wrapperCol: tailFormItemLayout.wrapperCol
  }, /*#__PURE__*/React.createElement(Checkbox, null, "I have read the ", /*#__PURE__*/React.createElement("a", {
    href: ""
  }, "agreement"))), /*#__PURE__*/React.createElement(Form.Item, {
    wrapperCol: tailFormItemLayout.wrapperCol
  }, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    htmlType: "submit",
    onClick: postData
  }, "Register")), /*#__PURE__*/React.createElement("div", null, retMsg));
}

;
export { Users, Register, Login };