import axios from "./axios";

export async function getPost(id) {
    // console.log("current ID", id);
    const { data } = await axios.get("/get-posts/" + id + ".json");
    // console.log(data);
    return {
        type: "GET_POST",
        posts: data,
    };
}
export async function addPost(newPost, id) {
    let postId = {
        post: newPost,
        id: id,
    };
    // console.log("ADD POST ID", postId);
    const { data } = await axios.post("/add-post", postId);
    console.log("ADD POST INFO", data.obj);
    return {
        type: "ADD_POST",
        newPost: data.obj,
    };
}

export async function recieveRequests() {
    const { data } = await axios.get("/match-friends");
    // console.log(data);
    return {
        type: "RECEIVE_USERS",
        users: data.users,
    };
}

export async function acceptRequests(id) {
    // console.log(id);
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
    // console.log(id);
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
    // console.log(id);
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

export async function chatMessages(msgs) {
    // console.log("ACTIONMSGS", msgs);
    return {
        type: "CHAT_MESSAGES",
        chatInfo: msgs,
    };
}
export async function chatMessage(msg) {
    // console.log("NEWMSG", msg);
    return {
        type: "NEW_MESSAGE",
        newMsg: msg,
    };
}
