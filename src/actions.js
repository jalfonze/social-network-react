import axios from "./axios";

export async function recieveRequests() {
    const { data } = await axios.get("/match-friends");
    console.log(data);
    return {
        type: "RECEIVE_USERS",
        users: data.users,
    };
}

export async function acceptRequests(id) {
    console.log(id);
    let acceptId = {
        acceptId: id,
        btnMsg: "Accept request",
    };
    const { data } = await axios.post("/send-request", acceptId);
    return {
        type: "ACCEPT_FRIEND",
        users: data.users,
        userId: id,
    };
}
export async function unFriend(id) {
    console.log(id);
    let deleteId = {
        deleteId: id,
        btnMsg: "Unfriend",
    };
    const { data } = await axios.post("/send-request", deleteId);

    return {
        type: "UNFRIEND",
        users: data.users,
        userId: id,
    };
}
export async function denyId(id) {
    console.log(id);
    let deleteId = {
        deleteId: id,
        btnMsg: "Unfriend",
    };
    const { data } = await axios.post("/send-request", deleteId);

    return {
        type: "UNFRIEND",
        users: data.users,
        userId: id,
    };
}
