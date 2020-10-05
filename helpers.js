//Get the user ID by entering email address and database
const getUserByEmail = function (email, database) {
  for (user in database) {
    if (database[user]["email"] === email) {
      return database[user]["id"];
    }
  }
};

//Check if the email already exist in the database
const checkingEmailMatch = function (email, database) {
  for (user in database) {
    if (database[user]["email"] === email) {
      return false;
    }
  }
  return true;
};

//Gets the longURL by entering User ID and the database
const getLongURLbyID = function (userID, database) {
  let longURLs = [];
  for (items in database) {
    if (database[items]["userID"] === userID) {
      longURLs.push(database[items]["longURL"]);
    }
  }
  return longURLs;
};

//Gets the short URL by entering user ID and database
const findshortURLFromID = function (userID, database) {
  let shortURLs = [];
  for (items in database) {
    if (database[items]["userID"] === userID) {
      shortURLs.push(items);
    }
  }
  return shortURLs;
};

//Generating random alphanumerics to assign as a user name
const generateRandomString = function () {
  return Math.random().toString(36).slice(6);
};

//Exporting the modules to the server file
module.exports = {
  generateRandomString,
  getLongURLbyID,
  getUserByEmail,
  checkingEmailMatch,
  findshortURLFromID,
};
