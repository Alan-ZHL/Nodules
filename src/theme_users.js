import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import "./theme_users.css";

function Users() {
  return /*#__PURE__*/React.createElement("h2", null, " Display the users' info or related components. ");
}

function Login(props) {
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();

  const onFinish = values => {
    console.log('Received values of form: ', values);
  };

  function getFormData() {
    return form.getFieldsValue(true);
  }

  function postData() {
    fetch("/login", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(getFormData())
    }).then(resp => resp.json().then(data => {
      setMessage(data['message']);
      props.loginHelper(data['status']);
      alert("Log in successfully!");
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
  }, "Log in")), /*#__PURE__*/React.createElement("div", null, message)) : /*#__PURE__*/React.createElement(Redirect, {
    to: "/posts/public"
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, loginForm);
}

function Register() {
  const [message, setMessage] = useState("");
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
    console.log(form.getFieldsValue(true));
    return form.getFieldsValue(true);
  }

  function postData() {
    fetch("/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(getFormData())
    }).then(resp => resp.json().then(message => {
      setMessage(message);
    }));
  }

  const onFinish = values => {
    console.log('Received values of form: ', values);
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
    name: "username",
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
  }, "Register")), /*#__PURE__*/React.createElement("div", null, message));
}

;
export { Users, Register, Login };