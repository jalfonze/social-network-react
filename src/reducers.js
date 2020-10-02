export default function (state = {}, action) {
    if (action.type == "RECEIVE_USERS") {
        state = Object.assign({}, state, {
            users: action.users,
        });
    }
    console.log(state);
    return state;
}
