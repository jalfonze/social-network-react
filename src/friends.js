import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import recieveRequests from "./actions";

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

    console.log("USERS ACTIONS", usersTrue, usersFalse);

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
                                    <h3 key={i}>
                                        <Link to={"/user/" + user.id}>
                                            {user.first_name} {user.last_name}
                                        </Link>
                                    </h3>
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
                                    <h3 key={i}>
                                        <Link to={"/user/" + user.id}>
                                            {user.first_name} {user.last_name}
                                        </Link>
                                    </h3>
                                </div>
                            );
                        })}
                </div>
            </div>
        </React.Fragment>
    );
}
