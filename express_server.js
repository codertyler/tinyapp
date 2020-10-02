const express = require('express');
const app = express();
const PORT = 8080; // default port
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

// Cookie related apps
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "papa1"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "papa2"
  }
}

// Helper functions *************************************


function generateRandomString() {
  return Math.random().toString(36).slice(6);

};

const checkingEmailMatch = function (email) {
  for (user in users) {
    if (users[user].email === email) {
      return false;
    }
  }
  return true;
};

const getUserByEmail = function (email) {
  for (user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
}

const getLongURLbyshort = (id) => {
  for (key in urlDatabase) {
    if (key === id) {
      return urlDatabase[key]['longURL'];
    }
  }
}

const findshortURLFromID = function(userID) {
  for (items in urlDatabase) {
    if(urlDatabase[items]['userID'] === userID) {
      return items;
    }
  }
}


// ******************************************************


app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {

  if (!req.cookies['user_id']) {
    res.redirect('/login');
  } 

  const user_id = req.cookies['user_id'];
  const shortURL = findshortURLFromID(user_id);

  const templateVars = {

    urls: urlDatabase[shortURL],
    user_id,
    user: users[user_id],
    email: "",
    longURL: "",
    shortURL: findshortURLFromID(user_id)
  };

  if (user_id) {
    templateVars.email = users[user_id]['email'];
    templateVars.ShortURL = findshortURLFromID(user_id);

  }

  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {

  if (!req.cookies['user_id']) {
    res.redirect('/login');
  }

  const user_id = req.cookies['user_id'];
  const templateVars = {

    urls: urlDatabase[shortURL],
    user_id,
    user: users[user_id],
    email: "",
    longURL: "",
    shortURL: findshortURLFromID(user)
  };

  if (user_id) {
    templateVars.email = users[user_id]['email'];
    templateVars.ShortURL = findshortURLFromID(user);

  }
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const user_id = req.cookies['user_id'];
  const shortURL = findshortURLFromID(user_id);

  const templateVars = {

    urls: urlDatabase[shortURL],
    user_id,
    user: users[user_id],
    email: "",
    longURL: urlDatabase[shortURL]['longURL'],
    shortURL: findshortURLFromID(user)
  };

  if (user_id) {
    templateVars.email = users[user_id]['email'];
    templateVars.ShortURL = findshortURLFromID(user);

  }
  if (user_id) {
    templateVars.email = users[user_id]['email'];
  }

  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls`);

});

app.post('/urls/:shortURL/delete', (req, res) => {
  
  const user_id = req.cookies['user_id'];
  const shortURL = findshortURLFromID(user_id);
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL/update', (req, res) => {
  const templateVars = { username: req.cookies["id"], user: null }
  urlDatabase[req.params.shortURL]['longURL'] = req.body.newURL;
  res.redirect('/urls');
});

// come back later to set

app.post('/login', (req, res) => {

  let email = req.body.email;
  let password = req.body.password;
  let user;

  if (email === "" || password === "") {
    return res.status(403).send("email or password cannot empty");
  } else if (checkingEmailMatch(email)) {
    return res.status(403).send("email does not exist");
  } else {
    user = getUserByEmail(email);
    if (user.password === password) {
      res.cookie("user_id", user.id);
      res.redirect('/urls')
    } else {
      return res.status(403).send("wrong password!");

    }
  }


});

app.get('/login', (req, res) => {
  const templateVars = { username: req.cookies["id"], user: null }
  res.render('login');
});

// come back later to set

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
})

app.get('/register', (req, res) => {
  const templateVars = { username: req.cookies["id"], user: null }
  res.render('register');
});

app.post('/register', (req, res) => {

  const checkingEmail = function () {
    for (let items in users) {
      if (users[items]['email'] === req.body.email) {
        return true;
      }
    }
  }


  if (!req.body.email || !req.body.password) {
    res.status(400).send("email or password required");
  } else if (checkingEmail()) {
    res.status(400).send("user already exists");
  }

  const user = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  users[user] = {
    'id': user,
    'email': email,
    'password': password
  };
  res.cookie('user_id', user);
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
