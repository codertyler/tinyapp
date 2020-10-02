const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
};


const findshortURLFromID = function(userID) {
  for (items in urlDatabase) {
    console.log(urlDatabase[items]['longURL'])
    if(urlDatabase[items]['userID'] === userID) {
      console.log(items)
    }
  }
}

findshortURLFromID('b2xVn2');

