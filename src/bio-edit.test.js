import React from "react";
import BioEdit from "./bio-edit";
import { render, waitForElement, fireEvent } from "@testing-library/react";

test("if no bio", () => {
    const { container } = render(<BioEdit bio={false} />);

    expect(container.querySelector("h2").innerHTML).toBe(
        "No bio yet, click here to update your Bio!"
    );
});

test("if bio", () => {
    const { container } = render(<BioEdit bio={true} />);

    expect(container.querySelector(".editBtn").innerHTML).toBe("Edit");
});

test("if edit or add is clicked", () => {
    const onClick = jest.fn(() => console.log("click"));
    const { container } = render(<BioEdit editBio={onClick} />);
    fireEvent.click(container.querySelector("p"));
    expect(container.querySelector("form"));
});
