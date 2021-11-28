// stated components: MyPosts

import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { Form, Input, Button, Checkbox } from 'antd';
import { Layout, PageHeader, Descriptions, List, Menu, message } from "antd";
import { UserOutlined, LockOutlined, CoffeeOutlined, CommentOutlined } from '@ant-design/icons';

import "./theme_users.css"
import { create_postREQ} from "./App";
import { CardListItem, getPostcards } from "./theme_posts";

const { Content } = Layout;

const PAGESIZE = 3;


function Users(props) {
    const user = props.userInfo;

    if (props.logined === 0) {
        return (<div>Please login to retrieve user information.</div>);
    } else {
        return (
            <Layout className="user-layout">
                <Content>
                    <UserHeader title="Basic Information"/>
                    <UserDesciptions_basic user={user}/>
                    <br />
                    <UserHeader title="Module Information"/>
                    <UserDesciptions_module user={user}/>
                    <br />
                    <UserHeader title="My Post"/>
                    <MyPosts user={user} />
                </Content>
            </Layout>
        );
    }
}


function UserHeader(props) {
    return (
        <PageHeader
            ghost={false}
            title={props.title}
            className="user-header"
            >
        </PageHeader>
    );
}


function UserDesciptions_basic(props) {
    const user = props.user;
    let role = 'N/A';
    if (user.role === 0){role = 'Student'} ;
    if (user.role === 1){role = 'Lecturer'} ;
    if (user.role === 2){role = 'Admin'} ;

    return (
        <Descriptions 
            column={1}
            bordered 
            contentStyle={{background: "#fafafa"}}
            labelStyle={{background: "#ffffff", fontSize: "16px", width: 200}} 
        >
            <Descriptions.Item label="User Name" >{user.user_name}</Descriptions.Item>
            <Descriptions.Item label="Role" >{role}</Descriptions.Item>
            <Descriptions.Item label="Email" >{user.email}</Descriptions.Item>
            <Descriptions.Item label="About Me" >{user.about_me}</Descriptions.Item>
        </Descriptions>
    );
}


function UserDesciptions_module(props) {
    const user = props.user;
    return (
        <Descriptions 
            column={5}
            bordered 
            contentStyle={{background: "#fafafa"}}
            labelStyle={{background: "#ffffff", fontSize: "16px", width: 200}} 
        >
            <Descriptions.Item label="Taken Moduls" span={5}>
                <List
                    dataSource={user.taken_courses}
                    renderItem={item => (
                        <Link to={`/courses/${item}`}>
                            <Button type="text"> {item} </Button>
                        </Link>
                    )}
                />
            </Descriptions.Item>

            <Descriptions.Item label="Enrolled Moduls" span={5}>
                <List
                    dataSource={user.enrolled_courses}
                    renderItem={item => (
                        <Link to={`/courses/${item}`}>
                            <Button type="text"> {item} </Button>
                        </Link>
                    )}
                />
            </Descriptions.Item>

            <Descriptions.Item label="Favored Moduls" span={5}>
                <List
                    dataSource={user.favored_courses}
                    renderItem={item => (
                        <Link to={`/courses/${item}`}>
                            <Button type="text"> {item} </Button>
                        </Link>
                    )}
                />
            </Descriptions.Item>
        </Descriptions>
    );
}


// categaried by --public
//               --course (filtered by enrolled modules)
// states: display, publicPosts, coursePosts
function MyPosts(props) {
    const [display, setDisplay] = useState("public");    
    const [publicPosts, setPublicPosts] = useState({count: 0, posts: []});
    const [coursePosts, setCoursePosts] = useState({count: 0, posts: []});
    const user_id = props.user.user_id;

    function setPublicPostsHelper(fetched_posts) {
        setPublicPosts({count: fetched_posts.count, posts: publicPosts.posts.concat(fetched_posts.posts)});
    }
    function setCoursePostsHelper(fetched_posts) {
        setCoursePosts({count: fetched_posts.count, posts: coursePosts.posts.concat(fetched_posts.posts)});
    }

    useEffect(() => {
        if (display === "public") { 
            getPostcards(fetched_posts => {
                setPublicPosts(fetched_posts);
            }, 2, [0], user_id, 0, PAGESIZE);
        } else {
            getPostcards(fetched_posts => {
                setCoursePosts(fetched_posts);
            }, 1, [0], user_id, 0, PAGESIZE);
        }
    }, [display, user_id]);

    const drop_down_list = display === "public" ? (
            <PublicPostsByUser posts={publicPosts} setPublicPostsHelper={setPublicPostsHelper}/>
        ) : (
            <CoursePostsByUser user={props.user} posts={coursePosts} setCoursePostsHelper={setCoursePostsHelper}/>
        );

    return (
        <div>
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<CoffeeOutlined /> } onClick={() => setDisplay("public")}>
                    Public Chats
                </Menu.Item>
                <Menu.Item key="2" icon={<CommentOutlined /> } onClick={() => setDisplay("course")}>
                    Course Discussion
                </Menu.Item>
            </Menu>
            {drop_down_list}
        </div>
    );
}


function PublicPostsByUser(props){
    const posts = props.posts.posts;
    return (
        <List
            itemLayout="vertical"
            dataSource={props.posts.posts}
            renderItem={item => (
                <>
                    <br/>
                    <CardListItem item={item}/>
                </>
            )}
            pagination={{
                onChange: page => {
                    if (page * PAGESIZE > posts.length) {
                        getPostcards(props.setPublicPostsHelper, props.access, 
                            [0], 0, posts.length, page * PAGESIZE - posts.length);
                    }
                },
                pageSize: PAGESIZE,
                defaultPageSize: PAGESIZE,
                showSizeChanger: false,
                total: props.posts.count,
                style: {textAlign: "center"}
            }}
            className="user-posts"
        />
    )
}


function CoursePostsByUser(props) {
    const enrolledCourseList = props.user.enrolled_courses;
    const [displayed_course, setCourse] = useState(enrolledCourseList[0]);
    const course_posts_by_user = getSelectedCoursePosts(props.posts.posts, displayed_course);
    const menuItems = enrolledCourseList.map(
            course => {return <Menu.Item onClick={()=> setCourse(course)}>{course}</Menu.Item>}
        );
    const posts = props.posts.posts;

    return (
        <div>
            <Menu theme="light" mode="horizontal" className="user-course-disscusion-menu">
                {menuItems}
            </Menu>
            <List
                itemLayout="vertical"
                dataSource={course_posts_by_user}
                renderItem={item => (
                    <>
                        <br/>
                        <CardListItem item={item}/>
                    </>
                )}
                pagination={{
                    onChange: page => {
                        if (page * PAGESIZE > posts.length) {
                            getPostcards(props.setCoursePostsHelper, props.access, 
                                [0], 0, posts.length, page * PAGESIZE - posts.length);
                        }
                    },
                    pageSize: PAGESIZE,
                    defaultPageSize: PAGESIZE,
                    showSizeChanger: false,
                    total: course_posts_by_user.length,
                    style: {textAlign: "center"}
                }}
                className="user-posts"
            />
        </div>
    )
}


// helper function: get posts from a selected course **among user's enrolled courses**
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

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    function getFormData() {
        return form.getFieldsValue(true);
    }
        
    function postData(){
        fetch("/api/login", create_postREQ(getFormData()))
        .then(resp => resp.json().then(
            data => {
                setRetMsg(data['message']);
                props.loginHelper(data['status']);
                if (data["status"] === 1) {
                    message.success(data["message"]);
                } else {
                    message.error(data["message"]);
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
                rules={[{
                    required: true,
                    message: 'Please input your Email!',
                },]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{
                    required: true,
                    message: 'Please input your Password!',
                },]}
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
            <div>{retMsg}</div>
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
    const [retMsg, setRetMsg] = useState("");
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
        fetch("/api/register", create_postREQ(getFormData()))
        .then(resp => resp.json().then(
            retMsg => {
                setRetMsg(retMsg);
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
                rules={[{
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                }, {
                    required: true,
                    message: 'Please input your E-mail!',
                },]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[{
                    required: true,
                    message: 'Please input your password!',
                },]}
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
                name="user_name"
                label="Username"
                tooltip="What do you want others to call you?"
                rules={[{
                    required: true,
                    message: 'Please input your username!',
                    whitespace: true,
                },]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[{
                    validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                },]}
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
            <div>{retMsg}</div>
        </Form>
    );
};


export {Users, Register, Login};