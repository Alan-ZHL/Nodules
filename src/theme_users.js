import React, { useState, useEffect } from "react";

function Users() {
  return /*#__PURE__*/React.createElement("h2", null, " Display the users' info or related components. ");
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
      }).then(resp => resp.json().then(new_stat => {
        setStatus(new_stat);
      }));
    }, 2000);
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, " Display the registration form. "), /*#__PURE__*/React.createElement("p", null, " Test response from backend: ", status));
}

function Login() {
  return /*#__PURE__*/React.createElement("h2", null, " Display the login form. ");
}

export { Users, Register, Login };