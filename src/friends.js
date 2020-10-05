import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { recieveRequests, acceptRequests, unFriend, denyId } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const usersTrue = useSelector(
        (state) =>
            state.users && state.users.filter((user) => user.accepted == true)
    );
    const usersFalse = useSelector(
        (state) =>
            state.users && state.users.filter((user) => user.accepted === false)
    );

    useEffect(() => {
        console.log("helo");
        dispatch(recieveRequests());
    }, []);

    const acceptFriend = (id) => {
        // console.log("clickclick");
        // console.log(id);
        dispatch(acceptRequests(id));
    };
    const deleteFriend = (id) => {
        // console.log("clickclick");
        // console.log(id);
        dispatch(unFriend(id));
    };
    const denyReq = (id) => {
        // console.log("clickclick");
        // console.log(id);
        dispatch(denyId(id));
    };

    // console.log("USERS ACTIONS", usersTrue, usersFalse);

    return (
        <React.Fragment>
            <div className="friends-list">
                <div className="friends">
                    <h1>Friends</h1>
                    {usersTrue &&
                        usersTrue.map((user, i) => {
                            return (
                                <div className="friends-info" key={i}>
                                    <div className="imageBoxSmall">
                                        <img
                                            width="100px"
                                            src={user.img_url}
                                        ></img>
                                    </div>
                                    <div className="req-text">
                                        <h3 key={i}>
                                            <Link to={"/user/" + user.id}>
                                                {user.first_name}{" "}
                                                {user.last_name}
                                            </Link>
                                        </h3>
                                        <p
                                            className="friend-response"
                                            onClick={() =>
                                                deleteFriend(user.id)
                                            }
                                        >
                                            Unfriend
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div className="requests">
                    <h1>Friend Requests</h1>
                    {usersFalse &&
                        usersFalse.map((user, i) => {
                            return (
                                <div className="req-info" key={i}>
                                    <div className="imageBoxSmall">
                                        <img
                                            width="100px"
                                            src={user.img_url}
                                        ></img>
                                    </div>
                                    <div className="req-text">
                                        <h3 key={i}>
                                            <Link to={"/user/" + user.id}>
                                                {user.first_name}{" "}
                                                {user.last_name}
                                            </Link>
                                        </h3>
                                        <p
                                            className="friend-response"
                                            onClick={() =>
                                                acceptFriend(user.id)
                                            }
                                        >
                                            Accept
                                        </p>
                                        <p
                                            className="friend-response"
                                            onClick={() => denyReq(user.id)}
                                        >
                                            Deny
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </React.Fragment>
    );
}
