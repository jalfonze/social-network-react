import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPost, addPost } from "./actions";
import { Link } from "react-router-dom";

export default function WallPost(props) {
    // console.log("PROP FROM OTHERPROFILE", props.params.id);
    const dispatch = useDispatch();
    const postsInfo = useSelector((state) => state.posts && state.posts);
    const newPost = useSelector((state) => state.newPost && state.newPost);

    // console.log("POOOST", postsInfo);
    // console.log("NOOPOOOST", newPost);

    useEffect(() => {
        // console.log("PROPS PARAMS", this.props.path);
        if (!props.path) {
            let num = "str";
            dispatch(getPost(num));
        } else {
            dispatch(getPost(props.params.id));
        }
    }, [!newPost]);

    const keyCheck = (e) => {
        // console.log(e.target.value);
        // console.log(e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            console.log(e.target.value);
            if (!props.params) {
                let num = "str";
                dispatch(addPost(e.target.value, num));
            } else {
                dispatch(addPost(e.target.value, props.params.id));
            }
            e.target.value = "";
        }
    };

    return (
        <React.Fragment>
            <div className="wall-post-main">
                <div className="textarea">
                    <h1>Write something nice!</h1>
                    <textarea
                        rows="3"
                        cols="70"
                        placeholder="Write something nice"
                        onKeyDown={keyCheck}
                    ></textarea>
                </div>
                {postsInfo &&
                    postsInfo.map((posts, i) => {
                        return (
                            <React.Fragment key={i}>
                                <div className="posts-main">
                                    <div className="imageBoxSmall">
                                        <img
                                            width="100px"
                                            src={posts.img_url}
                                        ></img>
                                    </div>
                                    <div className="posts-info">
                                        <h3>
                                            <Link
                                                to={"/user/" + posts.author_id}
                                            >
                                                {posts.first_name}{" "}
                                                {posts.last_name}
                                            </Link>
                                        </h3>
                                        <p key={posts.id}>{posts.post}</p>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
            </div>
        </React.Fragment>
    );
}
