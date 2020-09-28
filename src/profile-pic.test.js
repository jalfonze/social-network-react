import React from "react";
import ProfilePic from "./profile-pic";
import { render, waitForElement, fireEvent } from "@testing-library/react";

test("when no url i passed, /default-photo.jpg is used as src", () => {
    const { container } = render(<ProfilePic />);

    expect(
        container.querySelector("img").src.endsWith("/default-photo.jpg")
    ).toBe(true);
});

test("alt should be 'profile-pic-icon', ", () => {
    const { container } = render(<ProfilePic />);

    expect(container.querySelector("img").alt).toBe("profile-pic");
});

test("CLICK", () => {
    const onClick = jest.fn(() => console.log("click"));
    const { container } = render(<ProfilePic showModal={onClick} />);
    fireEvent.click(container.querySelector("img"));
    expect(onClick.mock.calls.length).toBe(1);
});
