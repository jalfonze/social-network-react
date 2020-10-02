import React from "react";
import axios from "./axios";
import FriendButton from "./friend-button";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // console.log("PROPS PARAMS", this.props.match.params.id);
        axios
            .get("/user/" + this.props.match.params.id + ".json")
            .then((response) => {
                // console.log("OTHERPROFILE INFO: ", response.data);
                this.setState(response.data.otherUserInfo);
                if (!this.state.bio) {
                    this.setState({
                        bio: "User currently has no bio",
                    });
                }
                if (response.data.redirect) {
                    this.props.history.push("/");
                }
            });
        axios.get("");
    }

    showBio() {
        console.log("FRIENDS");
        this.setState({
            friends: true,
        });
    }

    render() {
        // console.log("RENDER", this.state);

        return (
            <React.Fragment>
                <div className="profileBody">
                    <div className="imageBox">
                        {this.state.img_url && (
                            <img src={this.state.img_url} width="300px" />
                        )}
                        {!this.state.img_url && (
                            <img src="/default-photo.jpg" width="300px" />
                        )}
                    </div>
                    <div className="profileInfo">
                        <h1>
                            {this.state.first_name} {this.state.last_name}
                        </h1>
                        {this.state.friends && <h3>{this.state.bio}</h3>}
                        {!this.state.friends && (
                            <h3>Must be friends to see bio</h3>
                        )}
                        {this.state.id && (
                            <FriendButton
                                {...this.state}
                                showFriendsBio={() => this.showBio()}
                            />
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
