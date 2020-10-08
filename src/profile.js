import React from "react";
// import axios from "./axios";
// import ProfilePic from "./profile-pic";
import BioEdit from "./bio-edit";
import WallPost from "./wall-post";

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
        // console.log("PROFILE PROPS", this.props);
        this.setState({
            ...this.props,
        });
        // console.log("PROFILE STATE", this.state);
    }

    render() {
        return (
            <React.Fragment>
                <div className="profileBody">
                    <div className="imageBox">
                        <img src={this.props.img_url} width="300px" />
                    </div>
                    <div className="profileInfo">
                        <h1>
                            {this.state.first_name} {this.state.last_name}
                        </h1>
                        <BioEdit bio={this.state.bio} />
                    </div>
                </div>
                <div>
                    <WallPost {...this.state} />
                </div>
            </React.Fragment>
        );
    }
}
