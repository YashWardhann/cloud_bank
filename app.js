const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");

const {spawn} = require("child_process");

const User = require("./models/User.model.js");
const Question = require("./models/Question.model.js");
const Answer = require("./models/Answer.model.js");

const PORT = process.env.PORT || 8080; 

const app = express();

const mysql = require('mysql2');
const { connect } = require("mongoose");

const server = app.listen(PORT, () => {
    console.log(`Listening to port ${server.address().port}`);
});

app.use(session({ secret: "yash" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "pug");
app.set("views", "./views");

// Connect to mysql 
const connection = mysql.createConnection({
    host: "localhost", 
    user: "root", 
    password: "", 
    database: "karyak"
});

// let connection

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.locals.session = req.session;
    console.log(`Incoming ${req.method} to ${req.url}`);
    return next();
});

app.post("/query", async (req, res) => {
    try {
        console.log(req.body);
        connection.query(req.body.query, (err, results, fields) => {
            if (err) throw new Error(err);
            console.log(results);
            return res.status(200).json( { data: JSON.stringify(results) } );
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json( { message: "ERROR" } );
    }
});

app.get('/face-login', async (req, res) => {
    const python = spawn('python', ['faces.py']);
    let dataStore = "";

    python.stdout.on('data', (data) => {
        dataStore += data.toString();
    });
    
    python.on("close", (code) => {
        console.log(dataStore);
        return res.status(200).json({ status: 200, message: "FACE_RECOGNIZED" });
    });

    python.stderr.on("data", (data) => {
        console.log(data.toString());
    })    
})

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        connection.query(`SELECT * FROM Customer WHERE name = '${name}'`, (err, results, fields) => {
            if (err) throw new Error(err);
            console.log(results);

            if (results.length > 0) {
                return res.status(400).json( { message: "DUPLICATE_EMAIL" } );
            }

            // Insert the record into the database 
            connection.query(`INSERT INTO Customer(name, login_time, login_date, password) VALUES ("${name}", NOW(), '2021-09-01', '${password}');`, (err, results, fields) => {
                if (err) throw new Error(err);
                // Capture face of user
                const python = spawn('python', ['face_capture.py', `${name}`]);
                
                python.on("close", (code) => {
                    console.log("Closed!");
                    return res.status(201).json( { message: "CREATED" } );
                });

                python.stdout.on("data", (data) => {
                    console.log(data.toString());
                })

                python.stderr.on("data", (data) => {
                    console.log(data.toString());
                })
            });
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json( { message: "ERROR" } );
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        connection.query(
            `SELECT * FROM Customer WHERE 
            name = '${email}' and password = '${password}'
            LIMIT 1`,
        (err, results, fields) => {
            if (err) throw new Error(err);
            
            if (results.length > 0) {
                req.session.authenticated = true;
                req.session.userData = results[0];
                return res.status(200).json( { message: "OK" } );
            } else {
                return res.status(401).json( { message: "INVALID_PASSWORD" } );
            }
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json( { message: "ERROR" } );
    }
});

app.post("/logout", (req, res) => {
    // Destroy the current session 
    req.session.destroy();
    return res.status(200).json({ message: "OK" });
});

app.get("/login", (req, res) => {
    if (req.session.authenticated) {
        return res.redirect("/dashboard");
    }
    return res.render("login");
});

app.get("/dashboard", async (req, res) => {
    console.log(req.session.authenticated);
    return res.render("dashboard", {
        userData: req.session.userData,
        auth: req.session.authenticated
    })
});

app.get("/signup", (req, res) => {
    if (req.session.authenticated) {
        return res.redirect("/dashboard");
    }
    return res.render("signup");
});

app.get("/ask", (req, res) => {

    const userIsAuth = req.session.authenticated || false;

    return res.render("ask", {
        auth: userIsAuth
    });
});

app.get("/question/:id", async (req, res) => {
    const userIsAuth = req.session.authenticated || false;
    
    const questionData = await Question.findOne({_id: req.params.id});
    const answerIds = questionData.answer;

    const answerData = await Answer.find({ qid: req.params.id });
    
    let userCreated = false;
    if (userIsAuth && questionData.creatorId === req.session.user._id) {
        userCreated = true;
    }

    return res.render("question", {
        auth: userIsAuth, 
        question: questionData, 
        answer: answerData,
        userCreated: userCreated
    });
});

app.get("/transaction", async (req, res) => {
    
});

app.post("/question", async (req, res) => {
    if (!req.session.authenticated) {
        return res.status(403).json({ message: "UNAUTHORIZED" });
    }
    
    const questionTitle = req.body.title;
    const questionContent = req.body.content; 
    const questionSpace = req.body.space;
    const creatorName = req.session.user.name; 
    const creatorId = req.session.user._id;

    try {
        const question = await Question.create({
            title: questionTitle, 
            space: questionSpace, 
            content: questionContent, 
            time: Date.now(), 
            creatorId: creatorId, 
            creatorName: creatorName
        });

        return res.status(201).json({ message: "CREATED", data: question });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "ERROR" });
    }
})

app.post("/answer", async (req, res) => {
    if (!req.session.authenticated) {
        return res.status(403).json({ message: "UNAUTHORIZED" });
    }

    const content = req.body.answer; 
    const questionId = req.body.questionId;

    try {
        const answer = await Answer.create({
            content: content, 
            qid: questionId,
            uname: req.session.user.name,
            uid: req.session.user._id,
            timestamp: Date.now()
        });

        const question = await Question.findOne({
            _id: req.body.questionId
        });

        if (!question.answer) {
            question.answer = [];
        }

        question.answer.push(answer._id);
        await question.save();

        return res.status(200).json({ message: "ADDED" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "ERROR" });
    }
});

app.post("/upvote", async (req, res) => {
    if (!req.session.authenticated) {
        return res.status(403).json({ message: "UNAUTHORIZED" });
    }

    try {
        const questionId = req.body.questionId; 
        const userId = req.session.user._id;

        const questionData = await Question.findOne({ _id: questionId });
        
        console.log(questionData);

        if (!questionData) {
            return res.status(404).json({ message: "INVALID_QID" });
        }

        if (!questionData.up) {
            questionData.up = [];
        }

        if (questionData.up.includes(userId)) {
            let index = questionData.up.indexOf(userId);
            questionData.up.splice(index, 1);
        } else {
            questionData.up.push(userId);
        }

        await questionData.save();

        return res.status(200).json({ message: "UPDATED" });
        

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "ERROR" });
    }
});

app.delete("/question", async (req, res) => {
    try {
        console.log(req.body.qid);
        const questionData = await Question.findOne({ _id: req.body.qid });
        
        if (questionData) {
            await questionData.remove();
            return res.status(200).json({ message: "DELETED" });
        } 

        return res.status(404).json({ message: "NOT_FOUND" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "ERROR" });
    }
});

app.delete("/answer", async (req, res) => {
    try {
        const answerData = await Answer.findOne({
            _id: req.body.aid
        });

        if (answerData) {
            const questionData = await Question.findOne({ _id: req.body.qid });
    
            if (questionData) {
                const index = questionData.answer.indexOf(req.body.aid);

                if (index != -1) {
                    questionData.answer.splice(index, 1);
                    await answerData.remove();
                    await questionData.save();
                    return res.status(200).json({ message: "DELETED" });
                }
            }
        } 

        return res.status(404).json({ message: "AID_NOT_FOUND" });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "ERROR" });
    } 
});

app.put("/question", async (req, res) => {
    try {
        const questionData = await Question.findOne({ _id: req.body.qid });
        questionData.title = req.body.title; 
        questionData.content = req.body.content;

        await questionData.save();
        return res.status(200).json({ message: "UPDATED" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "ERROR" });
    }
});

app.get("/answer", async (req, res) => {
    try {
        console.log(req.query.qid);
        const answers = await Answer.find({ qid: req.query.qid });
        return res.status(200).json({ data: answers });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "ERROR" });
    }
})