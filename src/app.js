import React from "react";
import axios from "./axios";
import ProfilePic from "./profile-pic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: true,
            errMsg: "",
            showUploader: false,
            file: null,
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
        this.setState({
            img_url: image,
        });
    }

    showModal() {
        // console.log("CLICK");
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
                    <img src="/logo.png" alt="logo" width="250px"></img>
                    <ProfilePic
                        {...this.state}
                        showModal={() => this.showModal()}
                    />

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
