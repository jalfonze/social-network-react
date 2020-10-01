import React, { useState, useEffect } from "react";
import Axios from "./axios";

export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        console.log("FRIEND BTTN", props.id);
        Axios.get("/initial-status/" + props.id + ".json").then((response) => {
            console.log("FREQUEST RESP", response.data);
            if (response.data.btnMsg == "add") {
                setButtonText("Send friend request");
            } else if (response.data.btnMsg == "cancel") {
                setButtonText("Cancel request");
            } else if (response.data.btnMsg == "accept") {
                setButtonText("Accept request");
            } else if (response.data.btnMsg == "end") {
                setButtonText("Unfriend");
                props.showFriendsBio();
            }
        });
    }, []);

    const sendRequest = () => {
        // console.log("CLICK");
        let requestId = {
            btnMsg: buttonText,
            viewerId: props.id,
        };

        Axios.post("/send-request", requestId).then((response) => {
            console.log(response.data);
            if (response.data.btnMsg == "cancel") {
                setButtonText("Cancel request");
            } else if (response.data.btnMsg == "accept") {
                setButtonText("Accept request");
            } else if (response.data.btnMsg == "add") {
                setButtonText("Send friend request");
            } else if (response.data.btnMsg == "end") {
                setButtonText("Unfriend");
            }
        });
    };

    return <button onClick={sendRequest}>{buttonText}</button>;
}
