import React, { useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { Layout, Menu, List, Drawer, Button, Space, Card, Comment, Tooltip, Divider } from 'antd';
import { LikeFilled, DislikeFilled, MessageOutlined } from '@ant-design/icons';

import "./theme_posts.css";
import { notifs_sample, posts_sample, comments_sample } from "./App";

const { SubMenu } = Menu;
const { Sider, Header, Content } = Layout;


// Top-level component: display public posts with a complete layout
function PublicForum(props) {
    return (
        <Layout>
            <PostSider logined={props.logined}/>
            <PostContent />
            <NotifSider logined={props.logined}/>
        </Layout>
    );
}


// Top-level component: display course posts with a complete layout
function CourseForum(props) {
    return (
        <Layout>
            <PostSider logined={props.logined}/>
            <PostContent />
            <NotifSider logined={props.logined}/>
        </Layout>
    );
}


// Left sider of the posts page: offers some simple filters
function PostSider(props) {
    const course_selector = props.logined === 1 ? (
        <SubMenu key="sub1" title="My courses">
            <Menu.Item key="course_1"><Link to="/courses/IT5007">IT5007</Link></Menu.Item>
            <Menu.Item key="course_2"><Link to="/courses/IT5002">IT5002</Link></Menu.Item>
            <Menu.Item key="course_3">CS4226</Menu.Item>
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
            dataSource={notifs_sample}
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
                    description={<>Created on {item.date}, <br/>by {item.author}</>}
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
function PostContent() {
    return (
        <Content className="content-post">
            <List
                itemLayout="vertical"
                size="large"
                dataSource={posts_sample}
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
                    total: posts_sample.length,
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
        history.push(`/posts/${item.postid}`);
    }

    return (
        <List.Item
            key={item.postid}
            actions={[
                <IconText icon={LikeFilled} text={item.likes} key="list-vertical-like" />,
                <IconText icon={DislikeFilled} text={item.dislikes} key="list-vertical-dislike" />,
                <IconText icon={MessageOutlined} text={item.comments.length} key="list-vertical-message" />
            ]}
            className="content-post-item"
        >
            <List.Item.Meta
            title={
                <>
                    <Link to={`/courses/${item.course_id}`}>
                        <Button type="text"> {item.course_id} </Button>
                    </Link>
                    <span className="link-post-detail" onClick={showDetail}>{item.topic}</span>
                </>
            }
            description={`Posted by ${item.starter}, ${item.date}`}
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
function PostDetail() {
    const { postid } = useParams();
    const history = useHistory();
    // pass these functions to backend later
    const post = findPost(parseInt(postid));
    const comments = findComments(parseInt(postid) - 1056);

    const post_content = post === null ? (
        <h2> Sorry, post {postid} does not exist.. </h2>
    ) : (
        <>
        <Card
            className="post-detail"
            actions={[
                <IconText icon={LikeFilled} text={post.likes} key="post-like" />,
                <IconText icon={DislikeFilled} text={post.dislikes} key="post-dislike" />,
            ]}
        >
            <Card.Meta
                title={<span className="post-detail-title">{post.topic}</span>}
                description={
                    <>
                    Course: 
                    <Link to={`/courses/${post.course_id}`}>
                        <Button type="text">{post.course_id}: {post.course_name}</Button>
                    </Link>
                    <br/>
                    <span>Posted by {post.starter}, {post.date}</span>
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
                            <Tooltip key={`comment-${item.commentid}-like`} title="Like">
                                <LikeFilled/>
                                <span className="comment-action">{item.likes}</span>
                            </Tooltip>,
                            <Tooltip key={`comment-${item.commentid}-dislike`} title="Dislike">
                                <DislikeFilled/>
                                <span className="comment-action">{item.dislikes}</span>
                            </Tooltip>,
                        ]}
                        author={item.participant}
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


// TODO: should be implemented on the backend
function findPost(postid) {
    const length = posts_sample.length;
    for (let i = 0; i < length; i++) {
        if (posts_sample[i].postid === postid) {
            return posts_sample[i];
        }
    }
    return null;
}


// TODO: should be implemented on the backend, and the logic should change accordingly
function findComments(idx) {
    if (idx < 0 || idx >= comments_sample.length - 3) {
        return null;
    } else {
        return comments_sample.slice(idx, idx + 3);
    }
}



export {PublicForum, CourseForum, PostDetail, CardListItem};