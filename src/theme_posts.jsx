import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";

import "./theme_posts.css";


function PublicPostsGeneral() {
    return (
        <Nav className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar collapse">
            <div className="sidebar-sticky pt-3">
                <h6 className="sidebar-heading px-4 mt-4 mb-2 text-muted">
                    Filter by
                </h6>
                <ul className="flex-column">
                    <li>
                        Favored courses
                    </li>
                    <li>
                        Hotest Posts
                    </li>
                    <li>
                        Latest Posts
                    </li>
                </ul>
            </div>
        </Nav>
    );
}

function CoursePostsGeneral() {
    return (
        <h2> Display the <strong>course</strong> posts and related components. </h2>
    );
}

export {PublicPostsGeneral, CoursePostsGeneral};