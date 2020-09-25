import React from "react";

export default function ProfilePic({
    img_url,

    showModal,
}) {
    if (!img_url) {
        img_url = "/default-photo.jpg";
    }

    return (
        <React.Fragment>
            <div className="profileInfo">
                <img onClick={showModal} src={img_url} alt="logo" height="95" />
            </div>
        </React.Fragment>
    );
}
