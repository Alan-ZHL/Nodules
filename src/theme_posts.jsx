// stated components: PostForum, PostDetail, DraweredListItem

import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { Layout, Menu, List, Drawer, Button, Space, Card, Comment, Tooltip, Divider } from 'antd';
import { LikeFilled, DislikeFilled, MessageOutlined } from '@ant-design/icons';

import "./theme_posts.css";
// import { notifs_sample, posts_sample, comments_sample } from "./App";

const { SubMenu } = Menu;
const { Sider, Header, Content } = Layout;


// Top-level component: display the public posts, filters and notifications
// states: postcards (simple form of a post), notifs
function PostForum(props) {
    const [postcards, setPostcards] = useState([]);
    const [notifs, setNotifs] = useState([]);

    useEffect(() => {
        getPostcards((postcards) => {
            setPostcards(postcards);
        });    // TODO: pass "public" to the function
        if (props.logined) {
            getNotifs((notifs) => {
                setNotifs(notifs);
            });
        }
    }, [props.logined]);

    return (
        <Layout>
            <PostSider logined={props.logined}/>
            <PostContent postcards={postcards}/>
            <NotifSider logined={props.logined} notifs={notifs}/>
        </Layout>
    );
}


// Left sider of the posts page: offer some simple filters
function PostSider(props) {
    const course_selector = props.logined === 1 ? (
        <SubMenu key="sub1" title="My courses">
            <Menu.Item key="course_1"><Link to="/courses/IT5007">IT5007</Link></Menu.Item>
            <Menu.Item key="course_2"><Link to="/courses/IT5002">IT5002</Link></Menu.Item>
            <Menu.Item key="course_3"><Link to="/courses/CS4226">CS4226</Link></Menu.Item>
            <Menu.Item key="course_4">CS5424</Menu.Item>
        </SubMenu>
    ) : (
        null
    );

    return (
        <Sider width={220} className="sider-post">
            <Menu
                mode="inline"
                defaultOpenKeys={["sub1", "sub2"]}
                className="sider-post-menu"
            >
                {course_selector}
                <SubMenu key="sub2" title="Filter by">
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
                <IconText icon={LikeFilled} text={item.details.likes} key="list-vertical-like" />,
                <IconText icon={DislikeFilled} text={item.details.dislikes} key="list-vertical-dislike" />,
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


const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);



// Displaying the post detail
// states: post, comments
function PostDetail() {
    const { postid } = useParams();
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

    const post_content = post === null ? (
        <h2> Sorry, post {postid} does not exist.. </h2>
    ) : (
        <>
        <Card
            className="post-detail"
            actions={[
                <IconText icon={LikeFilled} text={post.details.likes} key="post-like" />,
                <IconText icon={DislikeFilled} text={post.details.dislikes} key="post-dislike" />,
            ]}
        >
            <Card.Meta
                title={<span className="post-detail-title">{post.title}</span>}
                description={
                    <>
                    Course: 
                    <Link to={`/courses/${post.course_id}`}>
                        <Button type="text">{post.course_id}: {post.course_name}</Button>
                    </Link>
                    <br/>
                    <span>Posted by {post.author_name}, {post.date}</span>
                    </>
                }
            />
            <Divider />
            <div className="post-detail-content">
                <span className="post-detail-content-head">Content</span>
                <br/>
                {post.content}
            </div>
        </Card>
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
                                <LikeFilled/>
                                <span className="comment-action">{item.details.likes}</span>
                            </Tooltip>,
                            <Tooltip key={`comment-${item.post_id}-dislike`} title="Dislike">
                                <DislikeFilled/>
                                <span className="comment-action">{item.details.dislikes}</span>
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
// author_id: 0: any author
async function getPostcards(setPostcardsHelper=null, access=true, course_id=0) {
    const resp = await fetch("/api/posts/cards", {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "access": access, "course_id": course_id
        }),
    });
    const resp_json = await resp.json();
    var postcards = [];
    for (let postcard of resp_json) {
        postcards.push({
            post_id: postcard["post_id"], title: postcard["title"], 
            course_id: postcard["course_id"], 
            author_id: postcard["author_id"], author_name: postcard["author_name"], date: postcard["date"],
            snippet: postcard["snippet"],
            details: {likes: postcard["details"]["likes"], dislikes: postcard["details"]["dislikes"], comments: postcard["details"]["comments"]}
        });
    }
    setPostcardsHelper(postcards);
}


// findPost (different from getPostcards): find a specific and complete post, updating the post as well as its comments
// (export notice: please export the nested "getComments" as well)
async function findPost(setPostHelper, setCommentsHelper, post_id) {
    const resp = await fetch("/api/posts/get_post", {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"post_id": post_id}),
    });
    const post = await resp.json();
    if (post["post_id"] !== -1) {
        setPostHelper({
            post_id: post["post_id"], title: post["title"], access: post["access"], post_type: post["post_type"],
            course_id: post["course_id"], course_name: post["course_name"],
            author_id: post["author_id"], author_name: post["author_name"], date: post["date"],
            content: post["content"],
            details: {likes: post["details"]["likes"], dislikes: post["details"]["dislikes"], comments: post["details"]["comments"]}
        });
        getComments(setCommentsHelper, post["details"]["comments"]);
    } else {
        setPostHelper(null);
    }
}


// getNotifs: function to get notifications of a user
async function getNotifs(setNotifsHelper, course_id=0) {
    const resp = await fetch("/api/posts/notifs", {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"course_id": course_id})
    });
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
async function getComments(setCommentsHelper, indices) {
    const resp = await fetch("/api/posts/comments", {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"comments": indices})
    });
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



export {PostForum, PostDetail, CardListItem, getNotifs, getPostcards};