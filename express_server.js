const express = require("express");
const app = express();
const PORT = 8080; // default port
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

// Helper functions imports: ***************************

const { generateRandomString } = require("./helpers");
const { checkingEmailMatch } = require("./helpers");
const { urlsForUsers } = require("./helpers");
// ******************************************************

// Cookie related apps
app.use(
  cookieSession({
    name: "session",
    keys: ["superdupersecret", "themostsuperduper"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

// Setting the view engine as EJS
app.set("view engine", "ejs");

//User Database stored as an object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "papa1",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "papa2",
  },
};

//URL Database for the app stored as an object
const urlDatabase = {
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },

  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" },
};

// Shows the JSON style of the urls page
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//----- Home Page / Login / Register

//main index page is the login page when user is not logged in
app.get("/", (req, res) => {
  res.render("login");
});

//This display the reigster page
//Displays the templateVars
app.get("/register", (req, res) => {
  if (req.session["user_id"]) {
    res.redirect("/urls");
  } else {
    let templateVars = {
      email: req.session.userID,
    };

    res.render("register", templateVars);
  }
});

//This handles the login
//Sets the email from the input
//Sets the password from the input
//Declares the user
//Hashing the password using bcrypt
//This function checks if the email and password fields are actually filled in the login page
//If either of the fields are empty it will return an error message
//This statement is checking if the email belongs to an existing user
//If the email does not exist or does not match it will return an error message saying the email doesn't exist
//If user emaile exists it will compare hashed password to confirm the match;
//Obtain the user ID from email from the users database
//Setting the session for the user
//If all successful redirecting the user to the main page
//If the password doesn't match, it will send error

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const dbPassword = users[checkingEmailMatch(email, users)].password;

  if (email === "" || password === "") {
    res.status(403).send("email or password cannot empty");
    return;
  } else if (!checkingEmailMatch(email, users)) {
    res.status(403).send("email does not exist");
    return;
  } else if (
    bcrypt.compareSync(password, dbPassword) ||
    password === dbPassword
  ) {
    req.session["user_id"] = checkingEmailMatch(email, users);
    res.redirect("/urls");
  } else {
    res.status(403).send("wrong password");
    return;
  }
});

//------------- Add new URL--------------

//Checking if user is logged in
//Rendering the main page with templateVars
app.get("/urls/new", (req, res) => {
  if (!req.session["user_id"]) {
    return res.status(403).send("You must be logged in to create new URLs");
  }

  const name = req.session["user_id"];
  const email = name["email"];
  let templateVars = {
    urls: urlDatabase,
    name: users[name],
    user_id: req.session["user_id"],
    email: "",
  };
  res.render("urls_new", templateVars);
});

//------------ URL LIST -------------

//This is the index or the main page
//If user is not logged in it shows a error page
//Setting the variables so it can easier to pass into templateVars
//If user ID exists it is setting the templateVars based on the user ID
//Rendering the templateVars into the index page to display
app.get("/urls", (req, res) => {
  if (!req.session["user_id"]) {
    return res.status(403).send("You must be logged in to view this page");
  }

  const name = req.session["user_id"];

  const templateVars = {
    name,
    user: users[name],
    shortURL: "",
    longURL: "",
    email: "",
  };

  if (name) {
    templateVars.email = users[name]["email"];
    templateVars.obj = urlsForUsers(name, urlDatabase);
  }

  res.render("urls_index", templateVars);
});

// This handles the new long URL into the database by generating shortURL by generating random alphanumerics
//User ID must be identified to assign to the correct user
//This function generates shortURL from the random number generating function in the helper functions
//This adds the new shortened URL along with long URL into the database assigned to the correct user ID
app.post("/urls", (req, res) => {
  const user_id = req.session["user_id"];
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: user_id };
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;

  const user_id = req.session.user_id;

  if (!user_id) {
    return res.status(403).send("You must be logged in to view this page");
  } else if (user_id !== urlDatabase[shortURL]["userID"]) {
    return res.status(403).send("You don't have the privilege for this page");
  }

  const name = req.session["user_id"];
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]["longURL"],
    name: users[name],
    email: users[name]["email"],
  };
  res.render("urls_show", templateVars);
});

//This handles when anyone goes to the shortened URL and redirects to the long URL
//We need the user ID to obtain the long URL
//This function sets the long URL from the database
//This is the final redirection
//This handles the deletion of the existing URLs of a logged in user
//actual deletion from the database

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL]["longURL"];
  res.redirect(longURL);
}),
  app.post("/urls/:shortURL/delete", (req, res) => {
    if (!req.session["user_id"]) {
      return res.status(403).send("You must be logged in to view this page");
    }

    const user_id = req.session["user_id"];
    const shortURL = req.params["shortURL"];
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  });

//This handles the update of long URL in an assigned short URL for a logged in user
//Actual update command is here
//After the update it directs to the main page with the list of URLs
app.post("/urls/:shortURL/update", (req, res) => {
  const templateVars = { username: req.session["id"], user: null };
  urlDatabase[req.params.shortURL]["longURL"] = req.body.newURL;
  res.redirect("/urls");
});

//This handles the login page directing to the login page
app.get("/login", (req, res) => {
  if (req.session["user_id"]) {
    res.redirect("/urls");
  } else {
    let templateVars = {
      name: req.session["user_id"],
    };
    res.render("login", templateVars);
  }
});

//This page handles the logout by clearing cookies from the browser
//Cookie session assigns two cookies and the following two lines clear both of them
//Then it returns to the login page
app.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.clearCookie("session.sig");

  res.redirect("/login");
});

//This handles the register request
//Checking if the email is already regsitered
//Checking if email or password are entered into input
//If email or password is not entered it will show the error
//Checking if the email exists and if it does shows the error
//Generating user ID from the random number generator
//Getting the email from the input and setting the variable
//Getting the passwrod and hashing with bcrypt
//Adding new user to the database
//Sets a session so the user can use the services
//Goes to the main page
app.post("/register", (req, res) => {
  const checkingEmail = function () {
    for (let items in users) {
      if (users[items]["email"] === req.body.email) {
        return true;
      }
    }
  };

  if (!req.body.email || !req.body.password) {
    res.status(400).send("email or password required");
  } else if (checkingEmail()) {
    res.status(400).send("user already exists");
  }

  const user = generateRandomString();
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);

  users[user] = {
    id: user,
    email: email,
    password: password,
  };
  req.session.user_id = user;
  res.redirect("/urls");
});

//When the server is running it will display that it is listening
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
