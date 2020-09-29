const express = require("express");
const app = express();
const compression = require("compression");
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
app.use(
    cookieSession({
        secret: "Hello There, General Kenobi",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

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
        // console.log(response.rows[0]);
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
    console.log("OTHER PROFILE ID", req.params.id);
    db.getUserInfo(req.params.id)
        .then((response) => {
            console.log("OTHER PROFILE INFO", response.rows[0]);
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

app.get("/recents", (req, res) => {});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
