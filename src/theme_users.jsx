import React, { useState, useEffect } from "react";


function Users() {
    return (
        <h2> Display the users' info or related components. </h2>
    );
}


function Register() {
    const [status, setStatus] = useState("pending response...");

    useEffect(() => {
        setTimeout(() => {
            fetch("/register", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(resp => resp.json().then(
                new_stat => {
                    setStatus(new_stat);
                }
            ))
            .catch(e => {
                console.log(e);
            });
        }, 2000);
    });

    return (
        <div style={{marginTop: "60px"}}>
            <h2> Display the registration form. </h2>
            <p> Test response from backend: {status}</p>
        </div>
    );
}


function Login() {
    return (
        <h2 style={{marginTop: "5%"}}> Display the login form. </h2>
    );
}

export {Users, Register, Login};