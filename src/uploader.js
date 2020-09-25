import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            errMsg: "Something went Wrong",
        };
    }

    changePic() {
        this.props.updatePic(this.state.img_url);
        console.log("CHANGE PIC", this.state.img_url);
    }
    closeModal() {
        this.props.hideModal();
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.files[0],
            },
            () => console.log("FILE CHANGE", this.state)
        );
    }
    submitImg(e) {
        e.preventDefault();

        // console.log("SUBMIT IMAGE");
        let formData = new FormData();
        formData.append("file", this.state.file);
        console.log("STATE FILE: ", this.state.file);
        console.log("SUBMITIMAGEFILE: ", formData);

        axios
            .post("/uploadImg", formData)
            .then((response) => {
                console.log("SUBMIT IMG: ", response.data.img_url);
                this.setState({
                    img_url: response.data.img_url,
                });
                this.changePic();
                // console.log(this.state.url_img);
                this.closeModal();
            })
            .catch((err) => {
                console.log("ERROR IN uploaimg", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <React.Fragment>
                <div className="uploadModal">
                    <p onClick={this.props.hideModal} className="closeBtn">
                        close
                    </p>
                    <h1>Update Profile Picture</h1>
                    <form className="updatePic">
                        {this.state.error && <p>{this.state.errMsg}</p>}
                        <input
                            onChange={(e) => this.handleChange(e)}
                            type="file"
                            name="file"
                            accept="image.*"
                        ></input>
                        <button onClick={(e) => this.submitImg(e)}>
                            submit
                        </button>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}
