import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            errMsg: "",
            email: "",
            code: "",
            newPass: "",
            currentDisplay: 1,
        };
    }

    handleChange(e) {
        // console.log(e);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => {
                console.log("FIRST: ", this.state);
            }
        );
    }

    confirmEmail(e) {
        e.preventDefault();
        let confirmEmail = {
            email: this.state.email,
        };
        console.log("CONFIRM EMAIL: ", this.state.email);
        axios.post("/confirmEmail", confirmEmail).then((response) => {
            console.log(response);
            if (!response.data.success) {
                this.setState({
                    error: true,
                    errMsg: response.data.errMsg,
                });
            }
            if (response.data.success) {
                this.setState({
                    currentDisplay: 2,
                    email: response.data.email,
                    errMsg: "",
                });
            }
        });
    }

    passwordChange(e) {
        e.preventDefault();
        console.log("PWCHANGE");

        let newPass = {
            code: this.state.code,
            newPass: this.state.newPass,
            email: this.state.email,
        };

        console.log("NEW PASS AND CODE: ", newPass);
        axios.post("/getCode", newPass).then((response) => {
            console.log(response);
            if (!response.data.success) {
                this.setState({
                    error: true,
                    errMsg: response.data.errMsg,
                });
            }
            if (response.data.success) {
                this.setState({
                    currentDisplay: 3,
                    errMsg: "",
                });
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.error && <p>{this.state.errMsg}</p>}
                {this.state.currentDisplay === 1 && (
                    <form className="registerForm">
                        <h2>
                            Type the email of the account you would like to
                            change the password of
                        </h2>
                        <label htmlFor="email">Enter email here</label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="email"
                            type="email"
                            placeholder="Email"
                        ></input>
                        <button onClick={(e) => this.confirmEmail(e)}>
                            Submit
                        </button>
                    </form>
                )}

                {this.state.currentDisplay === 2 && (
                    <form className="registerForm">
                        <h2>Email in database!</h2>
                        <h2>
                            Type the code we have emailed you and your new
                            password
                        </h2>
                        <label htmlFor="code">Enter code here</label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="code"
                            type="text"
                            placeholder="Code"
                        ></input>
                        <label htmlFor="newPass">Enter NEW password here</label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="newPass"
                            type="password"
                            placeholder="New Password"
                        ></input>
                        <button onClick={(e) => this.passwordChange(e)}>
                            Submit
                        </button>
                    </form>
                )}

                {this.state.currentDisplay === 3 && (
                    <div>
                        <h3>
                            Password change successful!{" "}
                            <Link to="/login"> Click here to log in </Link>
                        </h3>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
