const http = require('http');
const express = require("express"); 
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { exit } = require("process");
require("dotenv").config({ path: path.resolve(__dirname, 'credentials/.env') });
const { MongoClient, ServerApiVersion } = require('mongodb');

/****** FUNCTIONS FROM database_helpers ******/
const { insertNewUser, verifyReturningUser, verifyExistingUsername, updateUserTransactions, getUserData, getUpdatedBalance } = require("./database_helpers");
const { arrayToHTMLTable } = require("./helpers");

/****** MANAGING MONOGDB DATABASE ******/
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const dbName = process.env.MONGO_DB_NAME;
const dbCollection = process.env.MONGO_COLLECTION

/* Our database and collection */
const databaseAndCollection = {db: dbName, collection: dbCollection};

/* Connect to the database */
const uri = `mongodb+srv://${userName}:${password}@cluster0.vbckr.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

/****** MANAGING TERMINAL ARGUMENTS ******/
process.stdin.setEncoding("utf8");
if (process.argv.length != 3) {
    process.stdout.write(`Incorrect number of arguments\n`);
    process.exit(0);
}

/****** START SERVER ON THE PORT NUMBER ******/
let portNumber = process.argv[2];
let app = express();
http.createServer(app).listen(portNumber);

/****** MANAGING APP ROUTES******/
app.use(bodyParser.urlencoded({extended:false}));
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
  })
);

app.get("/", function (_, response) {
    response.render("index");
});

app.get("/login", function (_, response) {
    response.render("login");
});

app.post("/homeAfterLogin", function (request, response) {
    verifyReturningUser(client, databaseAndCollection, request.body.username, request.body.password).then(function(result) {
        if (result) {
            request.session.username = request.body.username;
            request.session.name = result.name;
            request.session.save();

            getUserData(client, databaseAndCollection, request.session.username).then(function(result) {
                responseVariables = {
                    name: request.session.name,
                    balance: 0,
                    table: arrayToHTMLTable(result.transactions)
                };
                response.render("home", responseVariables);
            })
        } else {
            response.redirect("/login");
        }
    });
});

app.get("/signup", function (_, response) {
    response.render("signup");
});

app.post("/homeAfterSignup", function (request, response) {
    
    verifyExistingUsername(client, databaseAndCollection, request.body.username).then(function(result) {
        if (result) {
            response.redirect("/signup");
        } else {
            request.session.username = request.body.username;
            request.session.name = request.body.name;
            request.session.save();

            let variables = { 
                name: request.body.name,
                username: request.body.username,
                password: request.body.password,
                transactions: []
            };
            insertNewUser(client, databaseAndCollection, variables);

            let responseVariables = {
                name: request.session.name,
                balance: getUpdatedBalance(),
                table: arrayToHTMLTable([])
            };
            response.render("home", responseVariables);
        }
    });
});

app.post("/home", function (request, response) {
    let transaction = {
        date: request.body.date,
        stock: request.body.stock,
        numStock: request.body.numStock
    }
    updateUserTransactions(client, databaseAndCollection, request.session.username,transaction).then(function(result) {
        if (result) {
            getUserData(client, databaseAndCollection, request.session.username).then(function(result) {
                responseVariables = {
                    name: request.session.name,
                    balance: getUpdatedBalance(),
                    table: arrayToHTMLTable(result.transactions)
                };
                response.render("home", responseVariables);
            })
        }
    });
});

/** NOTIMPLEMENTED **/
app.post("/logout", (request, response) => {
    let message;
  
    if (request.session.username != undefined) {
      request.session.destroy();
      message = "You have logged out";
    } else {
      message = "You were not logged in";
    }
    response.send(message);
});

/****** MANAGING TERMINAL OUTPUT AND PROMPT INTERACTION ******/
process.stdout.write("Web server started and running at http://localhost:" + portNumber + "\n");
let prompt = "Stop to shutdown the server: ";
process.stdout.write(prompt);

process.stdin.on("readable", function () {
    let dataInput = process.stdin.read();
    if (dataInput !== null) {
        let command = dataInput.trim();
        if (command === "stop") {
            process.stdout.write(`Shutting down the server\n`);
            exit(0);
        } else {
        process.stdout.write(`Invalid command: ${command}\n`);
        }
        process.stdout.write(prompt);
        process.stdin.resume();
    }
});