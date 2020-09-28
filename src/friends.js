import React from "react";
import axios from "axios";

export default class Friends extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log("MOUNTAS YAS");
        axios.get("/all-users").then((response) => {
            // console.log(response.data.allUsersArray);
            let allUsers = [];
            for (let i = 0; i < response.data.allUsersArray.length; i++) {
                // console.log(response.data.allUsersArray[i]);
                allUsers.push(response.data.allUsersArray[i]);
                this.setState({
                    allUsers,
                });
            }
            console.log("FRIENDS: ", this.state);
            console.log("ALLUSERS: ", allUsers);
        });
    }
    render() {
        return (
            <React.Fragment>
                <h1>HELLO</h1>
                <h1>HELLO</h1>
                <h1>HELLO</h1>
                <h1>HELLO</h1>
            </React.Fragment>
        );
    }
}
