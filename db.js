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
