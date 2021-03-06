import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            errMsg: "",
            email: "",
            password: "",
        };
    }

    handleChange(e) {
        // console.log(e);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => {
                // console.log("FIRST: ", this.state);
            }
        );
    }

    userLogin(e) {
        e.preventDefault();
        console.log("LOGIN", this.state);
        axios.post("/userLogin", this.state).then((response) => {
            console.log(response);
            if (!response.data.success) {
                this.setState({
                    error: true,
                    errMsg: response.data.errMsg,
                });
            }
            if (response.data.success) {
                location.replace("/");
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="welcome-head">
                    Register here to find local singer songwriters in your area!
                </h3>
                <form className="registerForm">
                    {this.state.error && <p>{this.state.errMsg}</p>}
                    <label htmlFor="email">Enter email here</label>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="email"
                        type="email"
                        placeholder="Email"
                    ></input>
                    <label htmlFor="password">Enter password here</label>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="password"
                        type="password"
                        placeholder="Password"
                    ></input>
                    <button onClick={(e) => this.userLogin(e)}>Submit</button>
                </form>
                <p className="welcome-foot">
                    Forgot your password?{" "}
                    <Link to="/reset-password">
                        click here to change your password
                    </Link>
                </p>
                <p className="welcome-foot">
                    No Account? <Link to="/">click here to sign up!</Link>
                </p>
            </React.Fragment>
        );
    }
}
