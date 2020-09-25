import React from "react";

export default class BioEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
            textAreaVisible: false,
        };
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

    updateBio(e) {
        e.preventDefault();
        console.log(this.state.bio);
        this.setState({ textAreaVisible: false });
    }

    componentDidMount() {
        if (!this.state.bio) {
            this.setState({
                bio: "No bio yet, click here to update your Bio!",
            });
        }
    }

    render() {
        console.log("BIO STATE", this.state);
        return (
            <React.Fragment>
                <h1 onClick={() => this.editBio()}>{this.state.bio}</h1>
                {this.state.textAreaVisible && (
                    <form>
                        <textarea
                            onChange={(e) => this.handleChange(e)}
                            name="bio"
                            rows="10"
                            cols="40"
                        ></textarea>
                        <button onClick={(e) => this.updateBio(e)}>
                            Submit
                        </button>
                    </form>
                )}
            </React.Fragment>
        );
    }
}
