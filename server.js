const express = require("express");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const parseurl = require("parseurl");
const bodyParser = require("body-parser")

const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: "elvis",
  resave: false,
  saveUninitialized: true
}));

let users = [];

app.get("/", function(request, respond) {
  respond.redirect("/login");
});

app.get("/login", function(request, respond) {
  let user = request.session.user;
  respond.render("login", {user: user});
});

app.post("/login", function(request, respond) {
  respond.redirect("/");
});

app.get("/signup", function(request, respond) {
  respond.render("signup");
});

app.post("/signup", function(request, respond) {
  users.filter(function(user){
    if(user.id === req.body.id){
      respond.render('signup', {message: "User Already Exists! Login or choose another user id"});
    }
  });
  let newUser = {id: request.body.id, password: request.body.password};
  users.push(newUser);
  request.session.user = newUser;
  console.log(users);
  respond.redirect("/behindCurtain");
});

app.get("/behindCurtain", function(request, respond) {
  respond.render("behindCurtain", {user: request.session.user});
});

app.listen(3000, function () {
  console.log("Begin Login Page App");
});
