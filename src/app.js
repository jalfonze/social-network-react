import React from "react";
import axios from "./axios";
import ProfilePic from "./profile-pic";
import Uploader from "./uploader";
import Profile from "./profile";

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
            console.log("USER INFO", response);
            this.setState(response.data.objInfo);
            console.log("STATE IN MOUNTED", this.state);
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
        console.log("APPCLICK");
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

    render() {
        return (
            <React.Fragment>
                <div className="profile-page">
                    {this.state.first_name && (
                        <Profile
                            {...this.state}
                            modalShow={() => this.showModal()}
                        />
                    )}
                    {this.state.showUploader && (
                        <Uploader
                            hideModal={() => this.hideModal()}
                            updatePic={(img) => this.updateImg(img)}
                        />
                    )}
                </div>
            </React.Fragment>
        );
    }
}
