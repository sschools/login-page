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
app.use(express.static("public"));

app.use(session({
  secret: "elvis",
  resave: false,
  saveUninitialized: true
}));

let users = [];

app.get("/", function(request, respond) {
  respond.redirect("/home");
});

app.get("/home", function(request, respond) {
  respond.render("home");
})

app.get("/login", function(request, respond) {
  let user = request.session.user;
  respond.render("login", {user: user});
});

app.post("/login", function(request, respond) {
  users.filter(function(user){
    if(user.id === request.body.id && user.password === request.body.password){
      request.session.user = user;
      respond.redirect("/behindCurtain");
    }
  });
  respond.render("login", {message: "Either your username or password is incorrect."});
});

app.get("/signup", function(request, respond) {
  respond.render("signup");
});

app.post("/signup", function(request, respond) {
  users.filter(function(user){
    if(user.id === request.body.id){
      respond.render("signup", {message: "User Already Exists"});
    }
  });
  let newUser = {id: request.body.id, password: request.body.password};
  users.push(newUser);
  request.session.user = newUser;
  respond.redirect("/behindCurtain");
});

app.get("/behindCurtain", function(request, respond) {
  respond.render("behindCurtain", {user: request.session.user});
});

app.post("/behindCurtain", function(request, respond) {
  request.session.destroy(function(){

  });
  respond.redirect("/home");
});

app.listen(3000, function () {
  console.log("Begin Login Page App");
});
