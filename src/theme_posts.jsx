// stated components: PostForum, PostDetail, DraweredListItem

import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { Layout, Menu, List, Drawer, Button, 
        Space, Card, Comment, Tooltip, Divider,
        Input, Form, Modal, message } from 'antd';
import { LikeFilled, DislikeFilled, 
        MessageOutlined, FileAddOutlined,
        BookOutlined, FilterOutlined } from '@ant-design/icons';

import "./theme_posts.css";
import {create_postREQ} from "./App";

const { SubMenu } = Menu;
const { Sider, Header, Content } = Layout;
const { TextArea } = Input;


// Top-level component: display the public posts, filters and notifications
// states: postcards (simple form of a post), notifs
function PostForum(props) {
    const [postcards, setPostcards] = useState([]);
    const [notifs, setNotifs] = useState([]);
    
    useEffect(() => {
        getPostcards((postcards) => {
            setPostcards(postcards);
        }, props.access);
    }, [props.access]);    // bind course posts with specific users

    useEffect(() => {
        if (props.logined === 1 && props.user.user_id !== -1) {
            getNotifs((notifs) => {
                setNotifs(notifs);
            }, props.user.enrolled_courses);
        } else {
            setNotifs([]);
        }
    }, [props.logined, props.user]);

    return (
        <Layout>
            <PostSider access={props.access} logined={props.logined} user={props.user}/>
            <PostContent postcards={postcards}/>
            <NotifSider logined={props.logined} notifs={notifs}/>
        </Layout>
    );
}


// Left sider of the posts page: offer some simple filters
function PostSider(props) {
    const access_name = (props.access === 1) ? "course" : "public";
    var course_selector = (null);
    if (props.logined === 1 && props.user.user_id !== -1) {
        const enrolled_courses = props.user.enrolled_courses;
        const favored_courses = props.user.favored_courses;
        let course_list = [];
        let key = 1;
        for (let course of enrolled_courses) {
            course_list.push(
                <Menu.Item key={`course_${key}`}><Link to={`/courses/${course}`}>{course} (enrolled)</Link></Menu.Item>
            );
            key ++;
        }
        for (let course of favored_courses) {
            course_list.push(
                <Menu.Item key={`course_${key}`}><Link to={`/courses/${course}`}>{course}</Link></Menu.Item>
            );
            key ++;
        }
        course_selector = (
            <SubMenu key="sub1" title="My courses" icon={<BookOutlined/>}>
                {course_list}
            </SubMenu>
        );
    }

    return (
        <Sider width={220} className="sider-post">
            <Menu
                mode="inline"
                defaultOpenKeys={["sub1", "sub2"]}
                className="sider-post-menu"
            >
                <Menu.Item key="item1" icon={<FileAddOutlined/>} disabled={props.logined === 0}>
                    <Link to="/posts/create/post">Add new {access_name} post</Link>
                </Menu.Item>
                {course_selector}
                <SubMenu key="sub2" title="Filter by" icon={<FilterOutlined/>}>
                    <Menu.Item key="filter_1">Favored courses</Menu.Item>
                    <Menu.Item key="fileter_2">Hotest posts</Menu.Item>
                    <Menu.Item key="filter_3">Latest posts</Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
    );
}


// Right sider: displays the notifications of the user
function NotifSider(props) {
    const notif_list = props.logined ? (
        <List
            itemLayout="horizontal"
            dataSource={props.notifs}
            renderItem={item => (
                <DraweredListItem item={item} />
            )}
            className="sider-notif-list"
        />
    ) : (
        <div className="notlogined-notif">Login to synchronize the notifications.</div>
    );

    return (
        <Sider width={270} className="sider-notif">
            <Layout>
                <Header className="header-notif">Notifications</Header>
                <Content>
                    {notif_list}
                </Content>
            </Layout>
        </Sider>
    );
}


// Child component of NotifSider: renders a notification as a list item with a detailed drawer.
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

    return (
        <>
            <List.Item
                actions={[<a onClick={showDrawer}>more</a>]}
            >
                <List.Item.Meta
                    title={<>{item.course_id}<br/>{item.title}</>}
                    description={<>Created on {item.date}, <br/>by {item.author_name}</>}
                />
            </List.Item>
            <hr/>
            <Drawer title={<>{item.course_id}<br/>{item.title}</>} placement="right" 
                    onClose={onClose} visible={visible} width={360}>
                {item.content}
            </Drawer>
        </>
    );
}


// Showing a list of posts in the public or course forum
function PostContent(props) {
    return (
        <Content className="content-post">
            <List
                itemLayout="vertical"
                size="large"
                dataSource={props.postcards}
                renderItem={item => (
                    <>
                        <br/>
                        <CardListItem item={item}/>
                    </>
                )}
                pagination={{
                    onchange: page => {
                        console.log(page);
                    },
                    pageSize: 5,
                    showSizeChanger: false,
                    total: props.postcards.length,
                    style: {textAlign: "center"}
                }}
            />
        </Content>
    );
}


// Creating a brief info of a post in the forum
function CardListItem(props) {
    let item = props.item;
    const history = useHistory();

    function showDetail() {
        history.push(`/posts/${item.post_id}`);
    }

    return (
        <List.Item
            key={item.post_id}
            actions={[
                <IconText icon={LikeFilled} text={item.details.likes.length} key="list-vertical-like" />,
                <IconText icon={DislikeFilled} text={item.details.dislikes.length} key="list-vertical-dislike" />,
                <IconText icon={MessageOutlined} text={item.details.comments.length} key="list-vertical-message" />
            ]}
            className="content-post-item"
        >
            <List.Item.Meta
            title={
                <>
                    <Link to={`/courses/${item.course_id}`}>
                        <Button type="text"> {item.course_id} </Button>
                    </Link>
                    <span className="link-post-detail" onClick={showDetail}>{item.title}</span>
                </>
            }
            description={`Posted by ${item.author_name}, ${item.date}`}
            />
            <span className="link-post-detail" onClick={showDetail}>{item.snippet}</span>
        </List.Item>
    );
}


const IconText = ({ icon, text, trigger, disabled }) => (
    <Button type="text" onClick={trigger} disabled={disabled}>
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    </Button>
);


// page to create a new post
function NewPost(props) {
    const {post_type} = useParams();
    const [form] = Form.useForm();
    const history = useHistory();

    async function create_post() {
        let new_post = form.getFieldsValue(true);
        let resp = await fetch("/api/courses/get_name", create_postREQ({course_id: new_post.course_id}));
        let resp_json = await resp.json();

        console.log(props.access, props.user.enrolled_courses);
        if (resp_json.course_name === "") {
            message.error(`Cannot find course ${new_post.course_id}!`);
        } else if (props.access === 1 && !props.user.enrolled_courses.includes(new_post.course_id.toUpperCase())) {
            message.warning(`Sorry, please make sure you have enrolled in course ${new_post.course_id}!`);
        } else {
            new_post.access = props.access;
            new_post.post_type = (post_type === "post") ? 2 : 1;
            new_post.course_name = resp_json.course_name;
            new_post.author_id = props.user.user_id;
            new_post.author_name = props.user.user_name;
            resp = await fetch("/api/posts/add_post", create_postREQ(new_post));
            resp_json = await resp.json();
            console.log(resp_json);
            message.success(`Added a new ${post_type} successfully!`);
            form.resetFields();
        }
    }

    return (
        <Layout>
            <Content className="content-detail">
                <Button className="button-back" onClick={() => history.goBack()}>Cancel and Return</Button>
                <h1 className="newpost-title"> new {(props.access === 2) ? "public" : "course"} {post_type} </h1>
                <Form
                    form={form}
                    layout="vertical"
                    className="newpost-form">
                        <Form.Item
                            name="course_id"
                            label="Course ID:"
                            rules={[{
                                required: true,
                                message: "Must specify a course you're talking about!",
                            }]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item 
                            name="title"
                            label="Title:"
                            rules={[{
                                required: true,
                                message: "Please give a title to describe your post!",
                            }]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="content"
                            label="Content:"
                            rules={[{
                                required: true,
                                message: "Please say something about your post!"
                            }]}>
                            <TextArea showCount autoSize={{minRows: 5, maxRows: 10}} maxLength={2000}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="newpost-submit" onClick={create_post}>
                                Create Post
                            </Button>
                        </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
}


// Displaying the post detail
// states: post, comments
function PostDetail(props) {
    const { postid } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [form] = Form.useForm();
    const [pop, setPop] = useState(false);    // control whether to pop up the form to create new comment
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
            resp = await fetch("/api/posts/update_comments", create_postREQ({post_id: post.post_id, comment_id: resp_json["post_id"]}));
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

    const new_comment_form = (
        <Form
            form={form}
            className="newcomment_form">
                <Form.Item
                    name="content"
                    placeholder="comment on the post..."
                    rules={[{
                        required: true,
                        message: "An empty comment does nothing!"
                    }]}>
                    <TextArea autoSize={{minRows: 3, maxRows: 6}} maxLength={1000}/>
                </Form.Item>
        </Form>);

    const post_content = post === null ? (
        <h2> Sorry, post {postid} does not exist.. </h2>
    ) : (
        <>
        <Card
            className="post-detail"
            actions={[
                <IconText 
                    icon={LikeFilled} text={post.details.likes.length} 
                    trigger={() => like_post(setPostHelper, user_id, post)} key="post-like"/>,
                <IconText 
                    icon={DislikeFilled} text={post.details.dislikes.length} 
                    trigger={() => dislike_post(setPostHelper, user_id, post)} key="post-dislike"/>,
                <IconText 
                    icon={MessageOutlined} text="make a comment"
                    trigger={() => setPopHelper(true)} disabled={user_id === -1} key="post-new-comment"/>,
            ]}
        >
            <Card.Meta
                title={<h1 className="post-detail-title">{post.title}</h1>}
                description={
                    <div>
                    Course: 
                    <Link to={`/courses/${post.course_id}`}>
                        <Button type="text">{post.course_id}: {post.course_name}</Button>
                    </Link>
                    <br/>
                    <span>Posted by {post.author_name}, {post.date}</span>
                    </div>
                }
            />
            <Divider />
            <div className="post-detail-content">
                <span className="post-detail-content-head">Content</span>
                <br/>
                {post.content}
            </div>
        </Card>
        <Modal
            title="My Comment"
            visible={pop}
            onOk={create_comment}
            onCancel={() => setPopHelper(false)}
        >
            {new_comment_form}
        </Modal>
        <List
            className="post-comment"
            header={`${comments.length} Replies`}
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={item => (
                <li>
                    <Comment
                        actions={[
                            <Tooltip key={`comment-${item.post_id}-like`} title="Like">
                                <LikeFilled onClick={() => {
                                    let idx = comments.findIndex((comment) => {
                                        return comment.post_id === item.post_id;
                                    });
                                    if (idx !== -1) {
                                        like_post(setCommentsHelper, user_id, comments[idx]);
                                        setComments([].concat(comments));    // refresh the comments
                                    }
                                }}/>
                                <span className="comment-action">{item.details.likes.length}</span>
                            </Tooltip>,
                            <Tooltip key={`comment-${item.post_id}-dislike`} title="Dislike">
                                <DislikeFilled onClick={() => {
                                    let idx = comments.findIndex((comment) => {
                                        return comment.post_id === item.post_id;
                                    });
                                    if (idx !== -1) {
                                        dislike_post(setCommentsHelper, user_id, comments[idx]);
                                        setComments([].concat(comments));
                                    }
                                }}/>
                                <span className="comment-action">{item.details.dislikes.length}</span>
                            </Tooltip>,
                        ]}
                        author={item.author_name}
                        content={item.content}
                        datetime={item.date}
                    />
                </li>
            )}
        />
        </>
    );

    return (
        <Layout>
            <Content className="content-detail">
                <Button className="button-back" onClick={() => history.goBack()}>Back to the Forum</Button>
                {post_content}
            </Content>
        </Layout>
    );
}


// getPostcards: function to get a postcard list for the post forum
// postcard: simpler form of a post
// access:    1: course; 2: public
// course_id: [0]: any course
// author_id: 0: any author
async function getPostcards(setPostcardsHelper, access=2, courses=[0], author_id=0) {
    const resp = await fetch("/api/posts/cards", create_postREQ({
        "access": access, "courses": courses, "author_id": author_id
    }));
    const resp_json = await resp.json();
    var postcards = [];
    for (let postcard of resp_json) {
        postcards.push({
            post_id: postcard["post_id"], title: postcard["title"], 
            course_id: postcard["course_id"], 
            author_id: postcard["author_id"], author_name: postcard["author_name"], date: postcard["date"],
            snippet: postcard["content"].slice(0, 100) + "...",
            details: {likes: postcard["details"]["likes"], dislikes: postcard["details"]["dislikes"], comments: postcard["details"]["comments"]}
        });
    }
    setPostcardsHelper(postcards);
}


// findPost (different from getPostcards): find a specific and complete post, updating the post as well as its comments
// (export notice: please export the nested "getComments" as well)
async function findPost(setPostHelper, setCommentsHelper, post_id) {
    const resp = await fetch("/api/posts/get_post", create_postREQ({"post_id": post_id}));
    const post = await resp.json();
    if (post["post_id"] !== -1) {
        setPostHelper({
            post_id: post["post_id"], title: post["title"], access: post["access"], post_type: post["post_type"],
            course_id: post["course_id"], course_name: post["course_name"],
            author_id: post["author_id"], author_name: post["author_name"], date: post["date"],
            content: post["content"],
            details: {likes: post["details"]["likes"], dislikes: post["details"]["dislikes"], comments: post["details"]["comments"]}
        });
        getComments(setCommentsHelper, post["access"], 0, post["details"]["comments"]);
    } else {
        setPostHelper(null);
    }
}


// getNotifs: function to get notifications of a user
// course_id: [0]: any course
// author_id: 0: any author
async function getNotifs(setNotifsHelper, courses=[0], author_id=0) {
    const resp = await fetch("/api/posts/notifs", create_postREQ({
        "courses": courses, "author_id": author_id
    }));
    const resp_json = await resp.json();
    var notifs = [];
    for (let notif of resp_json) {
        notifs.push({
            post_id: notif["post_id"], title: notif["title"], access: notif["access"], post_type: notif["post_type"],
            course_id: notif["course_id"], course_name: notif["course_name"],
            author_id: notif["author_id"], author_name: notif["author_name"], date: notif["date"],
            content: notif["content"]
        });
    }
    setNotifsHelper(notifs);
}


// getComments: function to get comments of a post
// access:    0: course; 1: public
// author_id: 0: any author
// indices:   list of comments (as post_ids)
async function getComments(setCommentsHelper, access=2, author_id=0, indices=[]) {
    const resp = await fetch("/api/posts/comments", create_postREQ({
        "indices": indices, "access": access, "author_id": author_id
    }));
    const resp_json = await resp.json();
    var comments = [];
    for (let comment of resp_json) {
        comments.push({
            post_id: comment["post_id"], title: comment["title"], access: comment["access"], type: comment["type"],
            course_id: comment["course_id"], course_name: comment["course_name"],
            author_id: comment["author_id"], author_name: comment["author_name"], date: comment["date"],
            content: comment["content"],
            details: {likes: comment["details"]["likes"], dislikes: comment["details"]["dislikes"]}
        });
    }
    setCommentsHelper(comments);
}


// like_post: front-end processing for liking bahaviors
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

        await fetch("/api/posts/update_like", create_postREQ({
            "post_id": post.post_id, "user_id": user_id, "like_state": like_state
        }));
        
        if (post.post_type === 2) {
            let new_post = {};
            Object.assign(new_post, post);    // shallow copy of the modified post
            setHelper(new_post);
        }
        // comments are modified outside the function
    }
}

// dislike_post: front-end processing for disliking bahaviors
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
        
        await fetch("/api/posts/update_like", create_postREQ({
            "post_id": post.post_id, "user_id": user_id, "like_state": like_state
        }));

        if (post.post_type === 2) {
            let new_post = {};
            Object.assign(new_post, post);    // shallow copy of the modified post
            setHelper(new_post);
        }
        // comments are modified outside the function
    }
}


export {PostForum, NewPost, PostDetail, CardListItem, getPostcards, getNotifs, getComments};