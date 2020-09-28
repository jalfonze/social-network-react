import React from "react";
import axios from "./axios";
export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("PROPS PARAMS", this.props.match.params.id);
        axios
            .get("/user/" + this.props.match.params.id + ".json")
            .then((response) => {
                console.log("OTHERPROFILE INFO: ", response.data);
                this.setState(response.data.otherUserInfo);
                if (!this.state.bio) {
                    this.setState({
                        bio: "User currently has no bio",
                    });
                } else {
                    if (!this.state.img_url) {
                        this.setState({
                            img_url: "/default-photo.jpg",
                        });
                    }
                }
                if (response.data.redirect) {
                    this.props.history.push("/");
                }
            });
    }

    render() {
        return (
            <React.Fragment>
                <div className="profileBody">
                    <img src={this.state.img_url} width="300px" />
                    <div className="profileInfo">
                        <h1>
                            {this.state.first_name} {this.state.last_name}
                        </h1>
                        <h3>{this.state.bio}</h3>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
