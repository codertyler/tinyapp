
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

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
};

const getUserByEmail = function (email, database) {
  for (user in database) {
    if (database[user]['email'] === email) {
      return database[user]['id'];
    }
  }
};

const checkingEmailMatch = function (email, database) {
  for (user in database) {
    if (database[user]['email'] === email) {
      return false;
    }
  }
  return true;
};


const getLongURLbyshort = function(userID, database) {
  let longURLs = [];
  for (items in database) {
    if(database[items]["userID"] === userID) {
      longURLs.push(database[items]["longURL"]);
    }
}
  return longURLs;
};

const findshortURLFromID = function(userID, database) {
  let shortURLs = [];
  for (items in database) {
    if(database[items]["userID"] === userID) {
      shortURLs.push(items);
    }
}
  return shortURLs;
};

const generateRandomString = function () {
  return Math.random().toString(36).slice(6);

};

module.exports = { generateRandomString, getLongURLbyshort, getUserByEmail, checkingEmailMatch, findshortURLFromID }
