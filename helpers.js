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
    if (database[user].email === email) {
      return database[user].id;
    }
  }
};

//Gets the longURL by entering User ID and the database

const urlsForUsers = (id, urlDB) => {
  const userURLs = {};
  for (user in urlDB) {
    if (urlDB[user]["userID"] === id) userURLs[user] = urlDB[user];
  }
  return userURLs;
};

//Generating random alphanumerics to assign as a user name
const generateRandomString = function () {
  return Math.random().toString(36).slice(6);
};

//Exporting the modules to the server file
module.exports = {
  generateRandomString,
  urlsForUsers,
  getUserByEmail,
  checkingEmailMatch,
};
