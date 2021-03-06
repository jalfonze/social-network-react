import React from "react";
import axios from "./axios";
import ProfilePic from "./profile-pic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./other-profile";
import Friends from "./friends";
import Chat from "./chat-room";
import FindPeople from "./find-people";
import { Link } from "react-router-dom";
// import * as io from "socket.io-client";

// const socket = io.connect();

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            errMsg: "",
            showUploader: false,
            file: null,
            bio: null,
            first_name: "",
            last_name: "",
            img_url: "",
        };
    }

    componentDidMount() {
        axios.get("/user").then((response) => {
            // console.log("USER INFO", response);
            this.setState(response.data.objInfo);
            // console.log("STATE IN MOUNTED", this.state);
            if (!this.state.img_url) {
                this.setState({
                    img_url: "/default-photo.jpg",
                });
            }
        });
    }

    updateImg(image) {
        // console.log("UPDATE", image);
        this.setState({
            img_url: image,
        });
        // console.log("UPDATE", this.state);
    }

    showModal() {
        // console.log("APPCLICK");
        this.setState({
            showUploader: true,
        });
    }

    hideModal() {
        // console.log("CLICK");
        this.setState({
            showUploader: false,
        });
    }

    logOut() {
        axios.get("/logout");
    }

    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <div className="nav">
                        <img
                            src="/logo3.png"
                            alt="logo"
                            width="250px"
                            height="95px"
                        ></img>
                        <h5>
                            <Link to="/">My Profile</Link>
                        </h5>
                        <h5>
                            <Link to="/users">Find People</Link>
                        </h5>
                        <h5>
                            <Link to="/friends-list">My Friends</Link>
                        </h5>
                        <h5>
                            <Link to="/chat-room">Chat Room</Link>
                        </h5>
                        <h5>
                            <a href="/welcome" onClick={() => this.logOut()}>
                                Log Out
                            </a>
                        </h5>
                        <ProfilePic
                            img_url={this.state.img_url}
                            showModal={() => this.showModal()}
                        />
                    </div>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <React.Fragment>
                                    <div className="profile-page">
                                        {this.state.first_name && (
                                            <Profile
                                                {...this.state}
                                                modalShow={() =>
                                                    this.showModal()
                                                }
                                            />
                                        )}
                                    </div>
                                </React.Fragment>
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/users" component={FindPeople} />
                        <Route path="/friends-list" component={Friends} />
                        <Route path="/chat-room" component={Chat} />
                    </div>
                    {this.state.showUploader && (
                        <Uploader
                            hideModal={() => this.hideModal()}
                            updatePic={(img) => this.updateImg(img)}
                        />
                    )}
                </BrowserRouter>
            </React.Fragment>
        );
    }
}
