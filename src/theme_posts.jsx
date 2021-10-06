import React from "react";
import { Layout, Menu, Breadcrumb } from 'antd';

import "./theme_posts.css";


const { SubMenu } = Menu;
const { Sider } = Layout;


function PublicPostsGeneral(props) {
    return (
        <Layout>
            <PostSider logined={props.logined}/>
        </Layout>
    );
}


function CoursePostsGeneral() {
    return (
        <h2> Display the <strong>course</strong> posts and related components. </h2>
    );
}


function PostSider(props) {
    const course_selector = (props.logined) ? (
        <SubMenu key="sub1" title="My courses">
            <Menu.Item key="1">IT5007</Menu.Item>
            <Menu.Item key="2">IT5002</Menu.Item>
            <Menu.Item key="3">CS4226</Menu.Item>
            <Menu.Item key="4">CS5424</Menu.Item>
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
                    <Menu.Item key="1">Favored courses</Menu.Item>
                    <Menu.Item key="2">Hotest posts</Menu.Item>
                    <Menu.Item key="3">Latest posts</Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
    );
}

export {PublicPostsGeneral, CoursePostsGeneral};