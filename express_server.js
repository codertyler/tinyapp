const express = require("express");
const app = express();
const PORT = 8080; // default port
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

// Helper functions imports: ***************************

const { generateRandomString } = require("./helpers");
const { checkingEmailMatch } = require("./helpers");
const { getUserByEmail } = require("./helpers");
const { getLongURLbyID } = require("./helpers");
const { findshortURLFromID } = require("./helpers");

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

//URL Database for the app stored as an object
const urlDatabase = {
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },

  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" },
};

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

// Shows the JSON style of the urls page
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//This is the index or the main page
app.get("/urls", (req, res) => {
  //If user is not logged in it shows a error page
  if (!req.session["user_id"]) {
    return res.status(403).send("You must be logged in to view this page");
  }

  //Setting the variables so it can easier to pass into templateVars
  const user_id = req.session["user_id"];

  const templateVars = {
    user_id,
    user: users[user_id],
    shortURL: "",
    longURL: "",
  };

  //If user ID exists it is setting the templateVars based on the user ID

  if (user_id) {
    templateVars.email = users[user_id]["email"];
    templateVars.shortURL = findshortURLFromID(user_id, urlDatabase);
    templateVars.longURL = getLongURLbyID(user_id, urlDatabase);
  }

  //Rendering the templateVars into the index page to display
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  //Checking if user is looged in
  if (!req.session["user_id"]) {
    return res.status(403).send("You must be logged in to create new URLs");
  }

  const user_id = req.session["user_id"];
  const shortURL = findshortURLFromID(user_id, urlDatabase);

  const templateVars = {
    urls: urlDatabase[shortURL],
    user_id,
    user: users[user_id],
    email: "",
    longURL: "",
    shortURL: "",
  };

  if (user_id) {
    templateVars.email = users[user_id]["email"];
    templateVars.shortURL = findshortURLFromID(user_id, urlDatabase);
  }
  //Rendering the main page with templateVars
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session["user_id"]) {
    return res.status(403).send("You must be logged in to view this page");
  }

  const user_id = req.session["user_id"];
  const shortURL = findshortURLFromID(user_id, urlDatabase);

  const templateVars = {
    urls: urlDatabase[shortURL],
    user_id,
    user: users[user_id],
    email: "",
    longURL: "",
    shortURL: "",
  };

  if (user_id) {
    templateVars.email = users[user_id]["email"];
    templateVars.shortURL = findshortURLFromID(user_id, urlDatabase);
    templateVars.longURL = getLongURLbyID(user_id, urlDatabase);
  }

  res.render("urls_show", templateVars);
});

//This handles when anyone goes to the shortened URL and redirects to the long URL
app.get("/u/:id", (req, res) => {
  //We need the user ID to obtain the long URL
  const user_id = req.session["user_id"];
  //This function sets the long URL from the database
  const longURL = getLongURLbyID(user_id, urlDatabase);
  //This is the final redirection
  res.redirect(longURL);
}),
  // This handles the new long URL into the database by generating shortURL by generating random alphanumerics
  app.post("/urls", (req, res) => {
    //User ID must be identified to assign to the correct user
    const user_id = req.session["user_id"];
    //This function generates shortURL from the random number generating function in the helper functions
    const shortURL = generateRandomString();
    //This adds the new shortened URL along with long URL into the database assigned to the correct user ID
    urlDatabase[shortURL] = { longURL: req.body.longURL, userID: user_id };
    res.redirect("/urls");
  });

//This handles the deletion of the existing URLs of a logged in user
app.post("/urls/:shortURL/delete", (req, res) => {
  const user_id = req.session["user_id"];
  const shortURL = findshortURLFromID(user_id, urlDatabase);
  //actual deletion from the database
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//This handles the update of long URL in an assigned short URL for a logged in user
app.post("/urls/:shortURL/update", (req, res) => {
  const templateVars = { username: req.session["id"], user: null };
  //Actual update command is here
  urlDatabase[req.params.shortURL]["longURL"] = req.body.newURL;
  //After the update it directs to the main page with the list of URLs
  res.redirect("/urls");
});

//This handles the login
app.post("/login", (req, res) => {
  //Sets the email from the input
  let email = req.body.email;
  //Sets the password from the input
  let password = req.body.password;
  //Declares the user
  let user;
  //Hashing the password using bcrypt
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  //This function checks if the email and password fields are actually filled in the login page
  if (email === "" || password === "") {
    //If either of the fields are empty it will return an error message
    return res.status(403).send("email or password cannot empty");
    //This statement is checking if the email belongs to an existing user
  } else if (checkingEmailMatch(email, users)) {
    //If the email does not exist or does not match it will return an error message saying the email doesn't exist
    return res.status(403).send("email does not exist");
  } else {
    //If user emaile exists it will compare hashed password to confirm the match;
    if (bcrypt.compareSync(password, hashedPassword)) {
      //Obtain the user ID from email from the users database
      user = getUserByEmail(email, users);
      //Setting the session for the user
      req.session.user_id = user;
      //If all successful redirecting the user to the main page
      res.redirect("/urls");
      //If the password doesn't match, it will send error
    } else {
      return res.status(403).send("wrong password!");
    }
  }
});

//This handles the login page directing to the login page
app.get("/login", (req, res) => {
  res.render("login");
});

//This page handles the logout by clearing cookies from the browser
app.post("/logout", (req, res) => {
  //Cookie session assigns two cookies and the following two lines clear both of them
  res.clearCookie("session");
  res.clearCookie("session.sig");
  //Then it returns to the login page
  res.redirect("/login");
});

//This display the reigster page
app.get("/register", (req, res) => {
  //Displays the templateVars
  const templateVars = { username: req.session["id"], user: null };
  res.render("register");
});

//This handles the register request
app.post("/register", (req, res) => {
  //Checking if the email is already regsitered
  const checkingEmail = function () {
    for (let items in users) {
      if (users[items]["email"] === req.body.email) {
        return true;
      }
    }
  };

  //Checking if email or password are entered into input
  if (!req.body.email || !req.body.password) {
    //If email or password is not entered it will show the error
    res.status(400).send("email or password required");
    //Checking if the email exists and if it does shows the error
  } else if (checkingEmail()) {
    res.status(400).send("user already exists");
  }

  //Generating user ID from the random number generator
  const user = generateRandomString();
  //Getting the email from the input and setting the variable
  const email = req.body.email;
  //Getting the passwrod and hashing with bcrypt
  const password = bcrypt.hashSync(req.body.password, 10);

  //Adding new user to the database
  users[user] = {
    id: user,
    email: email,
    password: password,
  };
  //Sets a session so the user can use the services
  req.session.user_id = user;
  //Goes to the main page
  res.redirect("/urls");
});

//When the server is running it will display that it is listening
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
