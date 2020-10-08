import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "./axios";

export default function UserFriends(props) {
    const [friend, setFriend] = useState();
    useEffect(() => {
        // console.log(props);

        axios
            .get("/user-friends/" + props.params.id + ".json")
            .then((response) => {
                console.log("USER FRIEND RETURN", response.data);
                setFriend(response.data);
            });
    }, []);

    console.log(friend);

    return (
        <React.Fragment>
            <h1>Friends</h1>
            <div className="imageBoxSmallFriend">
                {friend &&
                    friend.map((info, i) => {
                        return (
                            <div key={i} className="imageBoxSmall">
                                <Link to={"/user/" + info.id}>
                                    <img
                                        className="friend-image"
                                        width="100px"
                                        src={info.img_url}
                                    ></img>
                                </Link>
                            </div>
                        );
                    })}
            </div>
        </React.Fragment>
    );
}
