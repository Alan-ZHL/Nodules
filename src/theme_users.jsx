import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import "./theme_users.css"


function Users() {
    return (
        <h2> Display the users' info or related components. </h2>
    );
}


function Login(props) {
    const [message, setMessage] = useState("");
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    function getFormData() {
        return form.getFieldsValue(true);
    }
        
    function postData(){
        fetch("/api/login", {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(getFormData())
        })
        .then(resp => resp.json().then(
            data => {
                setMessage(data['message']);
                props.loginHelper(data['status']);
                if (data["status"] === 1) {
                    alert(data["message"]);
                }
            }
        ))
    }

    const loginForm = props.logined === 0 ? (
        <Form
            form={form}
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
        >
            <Form.Item
                name="email"
                rules={[
                {
                    required: true,
                    message: 'Please input your Email!',
                },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                {
                    required: true,
                    message: 'Please input your Password!',
                },
                ]}
            >
                <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <a className="login-form-forgot" href="">
                Forgot password
                </a>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button" onClick={postData}>
                Log in
                </Button>
            </Form.Item>
            <div>{message}</div>
        </Form>
    ) : (
        <Redirect to="/posts/public"/>
    );
    
    return (
        <>
            {loginForm}
        </>
    );
}


function Register () {
    const [message, setMessage] = useState("");
    const [form] = Form.useForm();

    const formItemLayout = {
        labelCol: {
        xs: {span: 24,},
        sm: {span: 8,},
        },
        wrapperCol: {
        xs: {span: 24,},
        sm: {span: 16,},
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
        xs: {span: 24,offset: 0,},
        sm: {span: 16,offset: 8,},
        },
    };

    function getFormData() {
        return form.getFieldsValue(true);
    }
        
    function postData(){
        fetch("/api/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(getFormData())
        })
        .then(resp => resp.json().then(
            message => {
                setMessage(message);
            }
        ));
    }

    const onFinish = (values) => {
        console.log('Received values of form: ', values);    // for tests only
    };

    return (
        <Form className ="regi-form" 
            labelCol={formItemLayout.labelCol} wrapperCol={formItemLayout.wrapperCol}
            form={form} name="register" onFinish={onFinish} scrollToFirstError>
            <Form.Item
                name="email"
                label="E-mail"
                rules={[
                {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                },
                {
                    required: true,
                    message: 'Please input your E-mail!',
                },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[
                {
                    required: true,
                    message: 'Please input your password!',
                },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                {
                    required: true,
                    message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }

                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                }),
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="username"
                label="Username"
                tooltip="What do you want others to call you?"
                rules={[
                {
                    required: true,
                    message: 'Please input your username!',
                    whitespace: true,
                },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                {
                    validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                },
                ]}
                wrapperCol={tailFormItemLayout.wrapperCol}
            >
                <Checkbox>
                    I have read the <a href="">agreement</a>
                </Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={tailFormItemLayout.wrapperCol}>
                <Button type="primary" htmlType="submit" onClick ={postData}>
                    Register
                </Button>
            </Form.Item>
            <div>{message}</div>
        </Form>
    );
};


export {Users, Register, Login};