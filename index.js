const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db");
const bc = require("./bc");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

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

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
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
                if (valid) {
                    bc.compare(password, valid.rows[0].password)
                        .then((result) => {
                            if (result) {
                                console.log("SUCCESS");
                                req.session.userId = valid.rows[0].id;
                                res.json({
                                    match: true,
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

app.listen(8080, function () {
    console.log("I'm listening.");
});
