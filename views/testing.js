const urlDatabase = {
  "b2xVn2": {
  longURL: "http://www.lighthouselabs.ca",
  userID: "userRandomID"
  },
  "9sm5xK": {
  longURL: "http://www.google.com",
  userID: "user2RandomID"
  },
  "geesyu": {
  longURL: "http://www.heu.com",
  userID: "userRandomID"
  },
  "px6247": {
  longURL: "www.google.com",
  userID: "userRandomID"
  }
  };

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



const getURLsByUserID = (userID, database) => {
  let obj = {
    userID: userID,
    longURL: [],
    shortURL: []
  };


  for (items in database) {
    if(database[items]["userID"] === userID) {
      obj.longURL.push(database[items]["longURL"]);
      obj.shortURL.push(items);
    }

  }

}




getURLsByUserID('userRandomID', urlDatabase);

