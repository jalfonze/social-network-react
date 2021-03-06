const express = require("express");
const app = express();
const compression = require("compression");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const db = require("./db");
const bc = require("./bc");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const ses = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const secretCode = cryptoRandomString({
    length: 8,
});
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { error } = require("console");

//https://s3.amazonaws.com/spicedling/

app.use(compression());

// app.use(
//     cookieSession({
//         secret: "Hello There, General Kenobi",
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("myToken", req.csrfToken());
    next();
});

app.use(express.json());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(express.static("./public"));

////UPLOADER

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

////UPLOADER

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/createUser", (req, res) => {
    // console.log(req.body);
    let { first, last, email, password } = req.body;
    bc.hash(password)
        .then((hashedPW) => {
            req.body.password = hashedPW;
            let newPass = req.body.password;
            console.log("AFTER HASH: ", req.body);
            if (
                first === "" ||
                last === "" ||
                email === "" ||
                password === ""
            ) {
                res.json({
                    success: false,
                });
                return;
            } else {
                db.createUser(first, last, email, newPass)
                    .then((response) => {
                        // console.log("CREATE USER SUCCESS!");
                        // console.log(
                        //     "CREATE USER RESPONSE:",
                        //     response.rows[0].id
                        // );
                        req.session.userId = response.rows[0].id;
                        console.log("REQ SESSION: ", req.session);
                        let sessionUserId = req.session;
                        res.json({
                            sessionUserId,
                        });
                    })
                    .catch((err) => console.log("ERROR IN CREATE USER: ", err));
            }
        })
        .catch((err) => console.log("ERROR IN BC HASH: ", err));
});

app.post("/userLogin", (req, res) => {
    console.log("USER LOGIN: ", req.body);
    let { email, password } = req.body;
    if (email === "" || password === "") {
        res.json({
            success: false,
            errMsg: "FIELDS CANNOT BE EMPTY!",
        });
    } else {
        db.getUser(email)
            .then((valid) => {
                console.log("USER LOGIN", valid);
                if (valid) {
                    bc.compare(password, valid.rows[0].password)
                        .then((result) => {
                            if (result) {
                                console.log("SUCCESS");
                                req.session.userId = valid.rows[0].id;
                                res.json({
                                    success: true,
                                });
                            } else {
                                console.log("EMAIL OR PASSWORD NOT MATCH!");
                                res.json({
                                    success: false,
                                    errMsg: "EMAIL OR PASSWORD DOES NOT MATCH",
                                });
                            }
                        })
                        .catch((err) => {
                            console.log("ERR IN COMPARE", err);
                        });
                }
            })
            .catch((err) => {
                console.log("ERR IN EMAIL VALID", err);
                console.log("INVALID EMAIL");
                res.json({
                    success: false,
                    errMsg: "INVALID EMAIL",
                });
            });
    }
});

app.post("/confirmEmail", (req, res) => {
    console.log("CONFIRM EMAIL: ", req.body);
    let { email } = req.body;
    if (email === "") {
        res.json({
            success: false,
            errMsg: "FIELD CANNOT BE EMPTY",
        });
    } else {
        db.getUser(email)
            .then((valid) => {
                console.log(valid.rows);
                if (valid.rows[0]) {
                    let code = secretCode;
                    console.log("SECRET CODE", code);
                    db.postCode(email, code).then((response) => {
                        console.log("CONFIRM EMAIL: ", response.rows);
                        console.log("CONFIRM EMAIL: ", response.rows[0].email);
                        ses.sendEmail(
                            response.rows[0].email,
                            "Request for Password Change",
                            `Please type this code in the code box to confirm ${response.rows[0].secret_code},
                            if you did not request this, please ignore this Email`
                        );
                        res.json({
                            success: true,
                            email: response.rows[0].email,
                        });
                    });
                } else {
                    res.json({
                        success: false,
                        errMsg: "EMAIL NOT IN DATABASE",
                    });
                }
            })
            .catch((err) => {
                console.log("ERR IN CONFIRM EMAIL: ", err);
                res.json({
                    success: false,
                    errMsg: "EMAIL NOT IN DATABASE",
                });
            });
    }
});

app.post("/getCode", (req, res) => {
    console.log("NEW PASS", req.body);
    let { code, email, newPass } = req.body;
    if (code === "" || newPass === "") {
        res.json({
            success: false,
            errMsg: "FIELDS ARE EMPTY! THEY CANNOT BE EMPTY",
        });
    }
    db.getCode(email)
        .then((response) => {
            console.log(response.rows[0]);
            if (code === response.rows[0].secret_code) {
                console.log("CODE MATCH");
                bc.hash(newPass).then((hashedPW) => {
                    db.updatePass(hashedPW, email).then(() => {
                        console.log("PASSWORD CHANGE SUCCESFUL!");
                    });
                    res.json({
                        success: true,
                    });
                });
            } else {
                res.json({
                    success: false,
                    errMsg: "CODE DID NOT MATCH",
                });
            }
        })
        .catch((err) => console.log("ERR IN GET CODE: ", err));
});

app.get("/user", (req, res) => {
    db.getUserInfo(req.session.userId).then((response) => {
        console.log(response.rows[0]);
        let objInfo = response.rows[0];
        res.json({ objInfo });
    });
});

app.post("/uploadImg", uploader.single("file"), s3.upload, (req, res) => {
    console.log("REQ FILE!", req.file);
    let { filename } = req.file;
    let url = `https://s3.amazonaws.com/spicedling/${filename}`;
    console.log("URL IMAGE", url);
    if (req.file) {
        db.updateImg(url, req.session.userId).then((response) => {
            console.log(response.rows[0]);
            res.json({
                img_url: response.rows[0].img_url,
            });
        });
    } else {
        res.json({
            success: false,
            errMsg: "Image not available",
        });
    }
});

app.post("/updateBio", (req, res) => {
    console.log("UPDATE  BIO", req.body);
    db.updateBio(req.body.bio, req.session.userId).then((response) => {
        console.log("UPDAT BIO RESPONSE", response.rows[0].bio);
        let bioResponse = response.rows[0].bio;
        res.json({
            bio: bioResponse,
        });
    });
});

app.get("/user/:id.json", (req, res) => {
    // console.log("OTHER PROFILE ID", req.params.id);
    db.getUserInfo(req.params.id)
        .then((response) => {
            // console.log("OTHER PROFILE INFO", response.rows[0]);
            let otherUserInfo = response.rows[0];
            if (req.session.userId == req.params.id || !response.rows[0]) {
                // console.log("TRUE");
                res.json({
                    redirect: true,
                });
            } else {
                res.json({ otherUserInfo });
                // console.log("WHAT", { otherUserInfo });
            }
        })
        .catch((err) => {
            console.log("ERROR IN OTHER USER INFO", err);
            res.json({
                success: false,
                errMsg: "User not found",
                redirect: true,
            });
        });
});

app.get("/users/:val.json", (req, res) => {
    console.log("VALA PARAMS", req.params.val);
    let val = req.params.val;
    if (val === "undefined") {
        console.log("SOMETHING");
        db.recentUsers().then((response) => {
            console.log("RECENTS ", response.rows);
            res.json(response.rows);
        });
    } else {
        db.selectAllUsers(req.params.val)
            .then((response) => {
                // console.log("SEARCHED USERS", response.rows);
                res.json(response.rows);
            })
            .catch((err) => console.log("ERROR IN SEARCH USER", err));
    }
});

app.get("/initial-status/:otherId.json", (req, res) => {
    let other = parseInt(req.params.otherId);
    console.log("OTHER USER ID REQ", req.session.userId, other);
    db.getRequest(other, req.session.userId)
        .then((response) => {
            console.log("INITIAL RESPONDSE", response.rows);
            if (response.rows.length == 0) {
                console.log("EMPTY ARRAY");
                res.json({
                    btnMsg: "add",
                });
            } else if (
                req.session.userId === response.rows[0].recipient_id &&
                !response.rows[0].accepted
            ) {
                console.log("ACCEPTS");
                console.log(response.rows);
                res.json({
                    btnMsg: "accept",
                });
            } else if (
                req.session.userId === response.rows[0].sender_id &&
                !response.rows[0].accepted
            ) {
                console.log("CANCEL");
                res.json({
                    btnMsg: "cancel",
                });
            } else if (response.rows[0].accepted) {
                console.log("ACCEPTED");
                res.json({
                    btnMsg: "end",
                });
            }
        })
        .catch((err) => console.log("ERROR IN GET INITIAL", err));
});

app.post("/send-request", (req, res) => {
    // console.log(req.body);
    if (req.body.btnMsg === "Send friend request") {
        db.sendRequest(req.body.viewerId, req.session.userId).then(
            (response) => {
                console.log("SEND REQ", response.rows);
                if (req.session.userId === response.rows[0].recipient_id) {
                    console.log("ACCEPTS");
                    console.log(response.rows);
                    res.json({
                        btnMsg: "accept",
                    });
                } else if (req.session.userId === response.rows[0].sender_id) {
                    console.log("CANCEL");
                    res.json({
                        btnMsg: "cancel",
                    });
                }
            }
        );
    } else if (req.body.btnMsg === "Cancel request") {
        db.cancelRequest(req.session.userId, req.body.viewerId).then(() => {
            res.json({
                btnMsg: "add",
            });
        });
    } else if (req.body.btnMsg === "Accept request") {
        db.acceptRequest(
            req.session.userId,
            req.body.viewerId || req.body.acceptId
        ).then(() => {
            res.json({
                btnMsg: "end",
            });
        });
    } else if (req.body.btnMsg === "Unfriend") {
        console.log(req.body, req.session);
        db.deleteFriend(
            req.body.viewerId || req.body.deleteId,
            req.session.userId
        ).then(() => {
            console.log("ARRIVED");
            res.json({
                btnMsg: "add",
            });
        });
    }
});

app.get("/match-friends", (req, res) => {
    db.matchFriend(req.session.userId).then((response) => {
        // console.log("MATCH FRIENDS", response.rows);
        let friendsArr = { users: response.rows };

        res.json(friendsArr);
    });
});

app.get("/get-posts/:wallId.json", (req, res) => {
    console.log("WALL ID", req.params.wallId);
    if (req.params.wallId == "str") {
        console.log("ITS STRING!");
        db.getPosts(req.session.userId).then((response) => {
            console.log("POST INFO", response.rows);
            res.json(response.rows);
        });
    } else {
        db.getPosts(req.params.wallId).then((response) => {
            // console.log("POST INFO", response.rows);
            res.json(response.rows);
        });
    }
});

app.post("/add-post", (req, res) => {
    console.log("WALL ID POST", req.body);
    if (req.body.id == "str") {
        db.addPost(req.body.post, req.session.userId, req.session.userId)
            .then((response) => {
                console.log("ADD POST ROWS", response.rows);
                const newObj = {
                    post: response.rows[0].post,
                    wall_owner: response.rows[0].wall_owner,
                    author_id: response.rows[0].authoer_id,
                };
                db.getUserInfo(req.session.userId)
                    .then((response) => {
                        const firstObj = response.rows[0];
                        const obj = { ...newObj, ...firstObj };
                        res.json({ obj });
                    })
                    .catch((err) => console.log("ERROR IN GET POST", err));
            })
            .catch((err) => console.log("ERROR IN GET POST 2", err));
    } else {
        db.addPost(req.body.post, req.body.id, req.session.userId)
            .then((response) => {
                console.log("ADD POST ROWS", response.rows);
                const newObj = {
                    post: response.rows[0].post,
                    wall_owner: response.rows[0].wall_owner,
                    author_id: response.rows[0].authoer_id,
                };
                db.getUserInfo(req.session.userId)
                    .then((response) => {
                        // console.log("USUSUSUSSU", response.rows[0]);
                        const firstObj = response.rows[0];
                        const obj = { ...newObj, ...firstObj };
                        res.json({ obj });
                    })
                    .catch((err) => console.log("ERROR IN GET POST", err));
                // console.log("POST INFO", response.rows);
            })
            .catch((err) => console.log("ERROR IN GET POST 2", err));
    }
});

app.get("/user-friends/:userFrId.json", (req, res) => {
    // console.log("USER FRIEND ID", req.params.userFrId);
    let other = parseInt(req.params.userFrId);
    db.getUserFriends(req.params.userFrId)
        .then((response) => {
            console.log(response.rows);
            let friends = response.rows;
            let arrOfFriendId = [];
            friends.map((friend) => {
                // console.log("FRIEEEEEEEND", friend);
                if (friend.sender_id !== other) {
                    console.log("Mapped Friend", friend.sender_id);
                    arrOfFriendId.push(friend.sender_id);
                } else if (friend.recipient_id !== other) {
                    arrOfFriendId.push(friend.recipient_id);
                }
            });
            db.getFriendInfo(arrOfFriendId)
                .then((response) => {
                    console.log("USER FRIEND INFO", response.rows);
                    res.json(response.rows);
                })
                .catch((err) => console.log("ERROR I FRIEND", err));
            console.log("ARR ONE", arrOfFriendId);
        })
        .catch((err) => console.log("ERR", err));
});

app.get("/logout", (req, res) => {
    console.log("click");
    req.session = null;
    res.redirect("/welcome");
    console.log(req.session);
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function () {
    console.log("I'm listening.");
});

io.on("connection", function (socket) {
    console.log(`socket with id ${socket.id} has connected`);
    if (!socket.request.session.userId) {
        console.log("DISCONNECTED");
        return socket.disconnect(true);
    }
    socket.on("disconnect", () => {
        console.log(`socket with id ${socket.id} has disconnected`);
    });

    db.lastMsgs().then((response) => {
        // console.log("LAST CHATS", response.rows);

        io.sockets.emit("chatMessages", response.rows.reverse());
    });

    socket.on("chat", (newMsg) => {
        // console.log("msg from chat: ", newMsg);
        // console.log("user who snt message: ", socket.request.session.userId);
        db.addMsg(socket.request.session.userId, newMsg).then((response) => {
            db.getUserInfo(socket.request.session.userId).then((response) => {
                // console.log("USUSUSUSSU", response.rows[0]);
                const firstObj = response.rows[0];
                const obj = { ...newObj, ...firstObj };
                io.sockets.emit("addMessage", obj);
            });
            const newObj = {
                user_id: response.rows[0].user_id,
                chat: response.rows[0].chat,
            };
            // console.log("NEW MESSAGE", response.rows[0]);
            // io.sockets.emit("addMessage", response.rows[0]);
        });
    });
});
