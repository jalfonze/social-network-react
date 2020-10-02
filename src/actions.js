import axios from "axios";

export default async function recieveRequests() {
    const { data } = await axios.get("/match-friends");
    console.log(data);
    return {
        type: "RECEIVE_USERS",
        users: data.users,
    };
}
// export default async function acceptRequests() {
//     const { data } = await axios.get("/user");
//     return {
//         type: "RECEIVE_USERS",
//         users: data.users,
//     };
// }
// export default async function unFriend() {
//     const { data } = await axios.get("/user");
//     return {
//         type: "RECEIVE_USERS",
//         users: data.users,
//     };
// }
