const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/users-db");

module.exports.createUser = (first, last, email, pw) => {
    console.log("DB CREATEUSER", first, last, email, pw);
    return db.query(
        `
        INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
        [first, last, email, pw]
    );
};

module.exports.getUser = (email) => {
    return db.query(
        `
        SELECT *  
        FROM users
        where email = ($1)
        `,
        [email]
    );
};

module.exports.getUserInfo = (id) => {
    return db.query(
        `
        SELECT id, first_name, last_name, img_url, bio  
        FROM users
        where id = ($1)
        `,
        [id]
    );
};

module.exports.postCode = (email, code) => {
    return db.query(
        `
        INSERT INTO secretcode (email, secret_code)
        VALUES ($1, $2)
        RETURNING *
        `,
        [email, code]
    );
};

module.exports.getCode = (email) => {
    return db.query(
        `
        SELECT * FROM secretcode
        WHERE email = ($1)
        ORDER BY id DESC
        LIMIT 1
        `,
        [email]
    );
};

module.exports.updatePass = (pw, email) => {
    return db.query(
        `
        UPDATE users
        SET password = ($1)
        WHERE email = ($2)
        `,
        [pw, email]
    );
};

module.exports.updateImg = (img, id) => {
    return db.query(
        `
        UPDATE users
        SET img_url = ($1)
        WHERE id = ($2)
        RETURNING img_url
        `,
        [img, id]
    );
};

module.exports.updateBio = (bio, id) => {
    return db.query(
        `
        UPDATE users
        SET bio = ($1)
        WHERE id = ($2)
        RETURNING bio
        `,
        [bio, id]
    );
};

module.exports.selectAllUsers = (val) => {
    return db.query(
        `
        SELECT id, first_name, last_name, img_url, bio FROM users
        WHERE first_name ILIKE $1
        LIMIT 10
        `,
        [val + "%"]
    );
};
module.exports.recentUsers = () => {
    return db.query(
        `
        SELECT * FROM users
        ORDER BY id DESC
        LIMIT 5
        `
    );
};

module.exports.getRequest = (recieveId, senderId) => {
    // console.log(recieveId, senderId);
    return db.query(
        `
        SELECT * FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)
        `,
        [recieveId, senderId]
    );
};

module.exports.sendRequest = (recieveId, senderId) => {
    console.log("SEND", recieveId, senderId);
    return db.query(
        `
        INSERT INTO friendships (recipient_id, sender_id)
        VALUES ($1, $2)
        RETURNING recipient_id, sender_id
        `,
        [recieveId, senderId]
    );
};

module.exports.cancelRequest = (senderId, recieveId) => {
    return db.query(
        `
        DELETE FROM friendships
        WHERE (sender_id = ($1) AND recipient_id = ($2))
        `,
        [senderId, recieveId]
    );
};

module.exports.acceptRequest = (senderId, recieveId) => {
    console.log(recieveId);
    return db.query(
        `
        UPDATE friendships
        SET accepted = true
        WHERE (recipient_id = $1 AND sender_id = $2)
        `,
        [senderId, recieveId]
    );
};

module.exports.deleteFriend = (senderId, recieveId) => {
    console.log(senderId, recieveId);
    return db.query(
        `
        DELETE FROM friendships
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (recipient_id = $1 AND sender_id = $2)
        `,
        [senderId, recieveId]
    );
};

module.exports.matchFriend = (viewerId) => {
    console.log(viewerId);
    return db.query(
        `
        SELECT users.id, first_name, last_name, img_url, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
        `,
        [viewerId]
    );
};

module.exports.lastMsgs = () => {
    return db.query(
        `
        SELECT first_name, last_name, img_url, chat
        FROM chat
        JOIN users
        ON users.id = chat.user_id
        ORDER BY chat.id DESC
        LIMIT 10
        `
    );
};

module.exports.addMsg = (id, chat) => {
    return db.query(
        `
        INSERT INTO chat (user_id, chat)
        VALUES ($1, $2)
        RETURNING user_id, chat
        `,
        [id, chat]
    );
};

module.exports.getPosts = (id) => {
    console.log("WALL ID DB", id);
    return db.query(
        `
        SELECT author_id, first_name, last_name, img_url, post, wall_owner 
        FROM posts
        JOIN users
        ON users.id = posts.author_id
        WHERE wall_owner = ($1)
        ORDER BY posts.id DESC
        LIMIT 5
        `,

        [id]
    );
};
module.exports.addPost = (post, id, user) => {
    console.log("WALL POST POST ID DB", post, id, user);
    return db.query(
        `
        INSERT INTO posts (post, wall_owner, author_id)
        VALUES ($1, $2, $3)
        RETURNING post, wall_owner, author_id
        `,
        [post, id, user]
    );
};

module.exports.getUserFriends = (profileId) => {
    // console.log(recieveId, senderId);
    return db.query(
        `
        SELECT * FROM friendships
        WHERE (recipient_id = $1 OR sender_id = $1)
        AND accepted = true
        `,
        [profileId]
    );
};

module.exports.getFriendInfo = (id) => {
    return db.query(
        `
        SELECT id, first_name, last_name, img_url
        FROM users
        where id = ANY ($1)
        `,
        [id]
    );
};
