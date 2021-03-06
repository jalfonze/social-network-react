import React from "react";
import axios from "./axios";

export default class BioEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
            textAreaVisible: false,
            editBtn: true,
        };
    }

    componentDidMount() {
        if (!this.state.bio) {
            this.setState({
                bio: "No bio yet, click here to update your Bio!",
                editBtn: false,
            });
        }
        // console.log("BIO PROPS", this.state);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    editBio() {
        this.setState({
            textAreaVisible: true,
        });
    }

    closeText() {
        this.setState({
            textAreaVisible: false,
        });
    }

    updateBio(e) {
        e.preventDefault();
        // console.log("STATE AFTER UPDATE", this.state.bio);
        let bio = {
            bio: this.state.bio,
        };
        axios.post("/updateBio", bio).then((response) => {
            console.log("UPDATE BIO RESPONSE CLIENT", response);
            if (response.data.bio) {
                this.setState({
                    editBtn: true,
                    textAreaVisible: false,
                });
            }
        });
    }

    charCount(e) {
        console.log(e.target.value.length);

        this.setState({
            charCount: e.target.value.length,
        });
    }

    render() {
        // console.log("BIO STATE", this.state);
        return (
            <React.Fragment>
                {!this.state.textAreaVisible && (
                    <h3 onClick={() => this.editBio()}>{this.state.bio}</h3>
                )}
                {this.state.editBtn && !this.state.textAreaVisible && (
                    <p className="editBtn" onClick={() => this.editBio()}>
                        Edit
                    </p>
                )}
                {this.state.textAreaVisible && (
                    <form>
                        <textarea
                            onChange={(e) => this.handleChange(e)}
                            onKeyUp={(e) => this.charCount(e)}
                            name="bio"
                            rows="6"
                            cols="40"
                            maxLength="150"
                        ></textarea>
                        <div className="counters">
                            <span id="characterCount">
                                {this.state.charCount || 0}
                            </span>
                            <span className="maxLength">/ 150</span>
                        </div>
                        <p
                            onClick={() => this.closeText()}
                            className="closeBtn"
                        >
                            close
                        </p>
                        <button onClick={(e) => this.updateBio(e)}>
                            Submit
                        </button>
                    </form>
                )}
            </React.Fragment>
        );
    }
}
