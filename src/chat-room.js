import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import Axios from "./axios";
import { Link } from "react-router-dom";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.chatInfo);
    const newMessage = useSelector((state) => state && state.newMsg);
    console.log("LAST 5", chatMessages);
    console.log("NEW", newMessage);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = (e) => {
        // console.log(e.target.value);
        // console.log(e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            console.log(e.target.value);
            socket.emit("chat", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <React.Fragment>
            <p>hello chatrooom</p>
            <div className="chat-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((info, i) => {
                        return (
                            <div className="chatInfo" key={i}>
                                <div key={i} className="imageBoxSmall">
                                    <img
                                        width="100px"
                                        key={i}
                                        src={info.img_url}
                                    />
                                </div>
                                <div>
                                    <h3 key={info.id}>
                                        {info.first_name} {info.last_name}
                                    </h3>
                                    <p key={i}>{info.chat}</p>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <form>
                <textarea
                    rows="3"
                    cols="70"
                    placeholder="Write your thoughts "
                    onKeyDown={keyCheck}
                ></textarea>
            </form>
        </React.Fragment>
    );
}
