import React, {useState} from "react";
import {Link} from "react-router-dom";
import { Layout, Menu, List, Drawer, Button, Space } from 'antd';
import { LikeFilled, DislikeFilled, MessageOutlined } from '@ant-design/icons';

import "./theme_posts.css";


const { SubMenu } = Menu;
const { Sider, Header, Content } = Layout;

// hard-coded notifications
const notifs_sample = [
    {title: "Remember to submit tutorial 4", course: "IT5007", author: "Prasanna Karthik Vairam", date:"2021-09-30",
    content: "remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd!"},
    {title: "Exam date determined", course: "IT5002", author: "Colin Tan", date: "2021-09-03", 
    content: "Midterm exam is set on Oct 5th. Please be prepared."}, 
    {title: "Welcome to CS4226!", course: "CS4226", author: "Richard Ma", date: "2021-08-26", 
    content: "Welcome to CS4226. I will be the lecturer of this course. Looking forward to meeting all of you!"}
];

// hard-coded posts info
const listData = [];
for (let i = 0; i < 16; i++) {
listData.push({
    postid: 1056 + i,
    topic: `Sample post ${i}`,
    starter: "Donald Trump ex",
    course: "IT5007",
    date: "2 days ago",
    snippet: 'We supply a series of design principles, practical patterns and high quality design resources...',
    likes: 156, dislikes: 18, comments: 6
});
}


// Top-level component: display public posts with a complete layout
function PublicPostsGeneral(props) {
    // TODO: add the logic of getting the post from public / user info
    return (
        <Layout>
            <PostSider logined={props.logined} ispublic={props.ispublic}/>
            <PostContent />
            <NotifSider logined={props.logined}/>
        </Layout>
    );
}


// Top-level component: display course posts with a complete layout
function CoursePostsGeneral(props) {
    return (
        <Layout>
            <PostSider logined={props.logined} ispublic={props.ispubic}/>
            <PostContent />
            <NotifSider logined={props.logined}/>
        </Layout>
    );
}


// Left sider of the posts page: offers some simple filters
function PostSider(props) {
    const course_selector = props.ispublic === 0 ? (
        <SubMenu key="sub1" title="My courses">
            <Menu.Item key="course_1">IT5007</Menu.Item>
            <Menu.Item key="course_2">IT5002</Menu.Item>
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
                defaultOpenKeys={['sub1', 'sub2']}
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
                    title={<>{item.course}<br/>{item.title}</>}
                    description={<>Created on {item.date}, <br/>by {item.author}</>}
                />
            </List.Item>
            <hr/>
            <Drawer title={<>{item.course}<br/>{item.title}</>} placement="right" 
                    onClose={onClose} visible={visible} width={360}>
                {item.content}
            </Drawer>
        </>
    );
}


function PostContent() {
    return (
        <Content className="content-post">
            <List
                itemLayout="vertical"
                size="large"
                dataSource={listData}
                renderItem={item => (
                    <CardListItem item={item}/>
                )}
                pagination={{
                    onchange: page => {
                        console.log(page);
                    },
                    pageSize: 3,
                    total: 18,
                    style: {textAlign: "center"}
                }}
            />
        </Content>
    );
}


function CardListItem(props) {
    let item = props.item;

    return (
        <>
        <br/>
        <Link to={`/posts/${item.postid}`}>
            <List.Item
                key={item.postid}
                actions={[
                    <IconText icon={LikeFilled} text={item.likes} key="list-vertical-like" />,
                    <IconText icon={DislikeFilled} text={item.dislikes} key="list-vertical-dislike" />,
                    <IconText icon={MessageOutlined} text={item.comments} key="list-vertical-message" />
                ]}
                className="content-post-item"
            >
                <List.Item.Meta
                title={
                    <>
                        <Link to={`/courses/${item.course}`}>
                            <Button type="text"> {item.course} </Button>
                        </Link>
                        {item.topic}
                    </>
                }
                description={`Posted by ${item.author}, ${item.date}`}
                />
                {item.snippet}
            </List.Item>
        </Link>
        </>
    );
}


const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);



export {PublicPostsGeneral, CoursePostsGeneral};