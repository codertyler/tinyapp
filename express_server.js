const express = require('express');
const app = express();
const PORT =  8080; // default port
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const e = require('express');
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabs.ca",
  "9sm5xK" : "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}



app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const user_id = req.cookies['user_id'];
  
  const templateVars = { 
  
    urls : urlDatabase,
    user_id,
    user : users[user_id],
    email : ""
  };

  if (user_id) {
    templateVars.email = users[user_id]['email'];
  }
  
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const user_id = req.cookies['user_id'];
  const templateVars = { 
  
    urls : urlDatabase,
    user_id,
    user : users[user_id],
    email: users[user_id]['email']
    
  };
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const user_id = req.cookies['user_id'];

  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], email: users[user_id]['email'] };
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
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL/update', (req, res) =>{
  urlDatabase[req.params.shortURL] = req.body.newURL ;
  res.redirect('/urls');
});

// come back later to set

app.post('/login', (req, res) => {
  res.cookie('user_id', req.body.user_id);
  res.redirect('/urls');
});

app.get('/login', (req, res) => {

  res.render('login');
});

// come back later to set

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) =>{
  
  const checkingEmail = function() {
    for(let items in users) {
      if (users[items]['email'] === req.body.email) {
        return true;
      } 
    }
  }
  
  
  if (!req.body.email || !req.body.password) {
    res.status(400).send("email or password required");
  } else if(checkingEmail()) {
    res.status(400).send("user already exists");
  }
  
  const user = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  users[user] = {
    'id' : user,
    'email' : email,
    'password' : password
  };
  res.cookie('user_id', user);
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString () {
  return Math.random().toString(36).slice(6);
  
};