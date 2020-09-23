import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";

let component;

if (location.pathname === "/welcome") {
    component = <Welcome />;
} else {
    component = <p>WELCOME TO muSEEQ YOU ARE NOW LOGGED IN!! :D</p>;
}

ReactDOM.render(component, document.querySelector("main"));
