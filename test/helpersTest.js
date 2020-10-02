const { assert } = require('chai');
const { getUserByEmail } = require('../helpers.js');
const {checkingEmailMatch} = require('../helpers');
const {getLongURLbyshort} = require('../helpers');
const {findshortURLFromID} = require('../helpers');

const testUsers = {
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
};

const TestUrlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput);
  });

  it('should return undefined', function() {
    const user = getUserByEmail("user3@example.com", testUsers)
    const expectedOutput = undefined;
    assert.strictEqual(user, expectedOutput);
  });

});



describe('checkingEmailMatch', function () {
  it('should return false if the email exists in the database', function(){
    const user = checkingEmailMatch("user@example.com", testUsers);
    const expectedOutput = false;
    assert.strictEqual(user, expectedOutput);
  })

  it('should return true if the email does not in the database', function(){
    const user = checkingEmailMatch("user5@example.com", testUsers);
    const expectedOutput = true;
    assert.strictEqual(user, expectedOutput);
  })
});

describe('getLongURLbyshort', function () {
  it('should return the long url after taking user id from the url database', function () {
    const user = getLongURLbyshort("user2RandomID", TestUrlDatabase);
    const expectedOutput = ["http://www.lighthouselabs.ca"];
    assert.strictEqual(user.length, expectedOutput.length);
  })

  it('should return the empty array if not existing user id is passed', function () {
    const user = getLongURLbyshort("user2RandomID2", TestUrlDatabase);
    const expectedOutput = 0;
    assert.strictEqual(user.length, expectedOutput);
  })
})

describe('findshortURLFromID', function () {
  it('should return short url after taking the user id and the users database', function () {
    const user = findshortURLFromID("userRandomID", TestUrlDatabase);
    const expectedOutput = ["b2xVn2"];
    assert.strictEqual(user.length, expectedOutput.length);
  })
})
