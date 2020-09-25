import React from "react";
import axios from "./axios";
import ProfilePic from "./profile-pic";
import Uploader from "./uploader";
import BioEdit from "./bio-edit";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
        };
    }

    showModal() {
        this.props.modalShow();
        // console.log("CLICK");
    }

    componentDidMount() {
        console.log("PROFILE PROPS", this.props);
        this.setState({
            ...this.props,
        });
        console.log("PROFILE STATE", this.state);
    }

    render() {
        console.log(this.props);
        return (
            <React.Fragment>
                <div className="nav">
                    <img
                        src="/logo.png"
                        alt="logo"
                        width="250px"
                        height="95px"
                    ></img>
                    <ProfilePic
                        img_url={this.props.img_url}
                        showModal={() => this.showModal()}
                    />
                </div>
                <div className="linediv">
                    <div className="line"></div>
                </div>
                <div className="profileBody">
                    <img src={this.props.img_url} width="300px" />
                    <div className="profileInfo">
                        <h1>
                            {this.state.first_name} {this.state.last_name}
                        </h1>
                        <h2>{this.state.bio}</h2>
                        <BioEdit bio={this.state.bio} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
