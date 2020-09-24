import React from "react";

export default function ProfilePic({
    first_name,
    last_name,
    img_url,
    bio,
    showModal,
}) {
    if (!img_url) {
        img_url = "/default-photo.jpg";
    }
    if (!bio) {
        bio = "No bio yet, we don't know anything about this person";
    }
    return (
        <React.Fragment>
            <div className="profileInfo">
                <img
                    onClick={showModal}
                    src={img_url}
                    alt="logo"
                    height="91px"
                />
                <h1>{`${first_name} ${last_name}`}</h1>
                <p>{bio}</p>
            </div>
        </React.Fragment>
    );
}
