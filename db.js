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
        SELECT first_name, last_name, img_url, bio  
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
