export default function (state = {}, action) {
    if (action.type == "RECEIVE_USERS") {
        state = Object.assign({}, state, {
            users: action.users,
            userId: action.userId,
        });
    }

    if (action.type == "CHAT_MESSAGES") {
        console.log("REDUCER CHATINFO", action.chatInfo);
        state = {
            ...state,
            chatInfo: action.chatInfo,
        };
    }
    if (action.type == "NEW_MESSAGE") {
        console.log("REDUCER NEW", action.newMsg);
        state = {
            ...state,
            chatInfo: [...state.chatInfo, action.newMsg],
            // chatInfo: state.chatInfo.concat(action.newMsg),
        };
    }

    if (action.type == "ACCEPT_FRIEND") {
        state = {
            ...state,
            users: state.users.map((user) => {
                if (action.userId === user.id) {
                    return {
                        ...user,
                        accepted: true,
                    };
                } else {
                    return user;
                }
            }),
        };
    }
    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            users: state.users.map((user) => {
                if (action.userId === user.id) {
                    return {
                        ...user,
                        accepted: null,
                    };
                } else {
                    return user;
                }
            }),
        };
    }
    console.log("CURRENT STATE ", state);
    return state;
}
