export default function (state = {}, action) {
    if (action.type == "RECEIVE_USERS") {
        state = Object.assign({}, state, {
            users: action.users,
            userId: action.userId,
        });
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
    console.log(state);
    return state;
}
