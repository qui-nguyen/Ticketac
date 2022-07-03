var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
var request = require("sync-request"); // importation module sessions

var userModel = require("../models/users");

// ROUTE GET FOR SIGN-UP
router.get('/sign-up', (req, res, next) => {
  res.redirect('/login');
})

// ROUTE POST FOR SIGN-UP
router.post("/sign-up", async function (req, res, next) {
    // Condition in existing of user by email
    let alreadyExist = await userModel.findOne({
      email: req.body.email,
      password: req.body.password
    });
    if (alreadyExist === null && req.body.email) {
      // Create the session object by body objet (method POST)
      req.session.name = req.body.name;
      req.session.firstname = req.body.firstname;
      req.session.email = req.body.email;
      req.session.password = req.body.password;
      // Create a new user
      var newUser = new userModel({
        name: req.session.name,
        firstname: req.session.email,
        email: req.session.email,
        password: req.session.password,
      });
      await newUser.save();
      // Redirection to homepage page after sign-up if user not exist
      res.redirect("/homepage");
    }
    // Result of the router /sign-up
    res.render("login", {});
});

// ROUTE GET FOR SIGN-IN
router.get('/sign-in', (req, res, next) => {
  res.redirect('/login');
})

// ROUTE FOR SIGN-IN
router.post("/sign-in", async function (req, res, next) {
  // Condition in existing of user
  let alreadyExist = await userModel.findOne({
    password: req.body.password,
    email: req.body.email,
  }); 
  if (alreadyExist) {
    // Create the session mail by body objet (methode POST)
    req.session.email = req.body.email;
    // Redirection to weather page after sign-in IF EXIST
    res.redirect("/homepage");
  }
  // Result of the router /sign-up
  res.render("login", {});
});

// GET FOR LOGOUT
router.get("/logout", (req, res, next) => {
  req.session.email = undefined;
  req.session.listTicket = [];
  res.redirect("/login");
});

module.exports = router;
