import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            first: "",
            last: "",
            email: "",
            password: "",
        };
    }

    // how to set error message, but in if
    // this.setState({
    //     error: true
    // })
    // {this.state.error && <p>something went wrong</p>}

    //location.replace("/") will redirect user to slash route when they succesfully register

    handleChange(e) {
        // console.log(e);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => {
                // console.log("FIRST: ", this.state.first);
            }
        );
    }

    createUser(e) {
        e.preventDefault();
        console.log("click");
        console.log("CREATE USER STATE:", this.state);
        axios.post("/createUser", this.state).then((response) => {
            console.log("CREATE USER RESPONSE:", response);
            if (!response.data.success) {
                this.setState({ error: true });
            }
            if (response.data.sessionUserId) {
                location.replace("/");
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <h3>
                    Register here to find local singer songwriters in your area!
                </h3>
                <form className="registerForm">
                    {this.state.error && <p>FIELDS CANNOT BE EMPTY!</p>}
                    <label htmlFor="first">Enter first name here</label>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="first"
                        type="text"
                        placeholder="First Name"
                    ></input>
                    <label htmlFor="last">Enter last name here</label>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="last"
                        type="text"
                        placeholder="Last Name"
                    ></input>
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
                    <button onClick={(e) => this.createUser(e)}>Submit</button>
                </form>
                <p>
                    Already a member? <Link to="/login">Log In</Link>
                </p>
            </React.Fragment>
        );
    }
}
