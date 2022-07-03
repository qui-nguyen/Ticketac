var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var request = require("sync-request"); // importation module sessions

var journeyModel = require("../models/journeys"); // importation du modèle
var userModel = require("../models/users");

// GET LOGIN PAGE
router.get("/", function (req, res, next) {
    res.redirect("/homepage");
});

// GET LOGIN PAGE
router.get("/login", function (req, res, next) {
  if (req.session.email !== undefined) {
    res.redirect("/homepage");
  }
  res.render("login", {});
});

// GET HOME PAGE
router.get("/homepage", function (req, res, next) {
  if (req.session.email === undefined) {
    res.redirect("/login");
  }
  if (req.session.listTicket === undefined) {
    req.session.listTicket = [];
  }
  res.render("homepage", {});
});

//GET JOURNEY PAGE => action form : "/journey" of homepage
// Verify date send by FrontEnd
router.post("/journey", async function (req, res, next) {
  let trajetResult = await journeyModel.find({
    departure: req.body.departure,
    arrival: req.body.arrival,
    date: new Date(req.body.date),
  });

  // Redirect to page error if not found
  if (trajetResult.length === 0) {
    res.redirect("/error");
  }
  let dateResearch = req.body.date;
  res.render("journey", { trajetResult, dateResearch });
});

// GET ERROR PAGE
router.get("/error", function (req, res, next) {
  res.render("error");
});

// POST TICKETS PAGE => use id transfered by input hidden
router.post("/ticket", async function (req, res, next) {
  if (req.session.email === undefined) {
    res.redirect("/login");
  } else {
    let ticket = await journeyModel.findById(req.body.id);
    req.session.listTicket.unshift(ticket);
    let total = 0;
    req.session.listTicket.forEach((ticket) => {
      total += ticket.price;
    });

    res.render("ticket", {
      listTicket: req.session.listTicket,
      total,
    });
  }
});
// GET TICKET
router.get("/ticket", async function (req, res, next) {
  if (req.session.email === undefined) {
    res.redirect("/login");
  } else {
    let total = 0;
    req.session.listTicket.forEach((ticket) => {
      total += ticket.price;
    });
    res.render("ticket", {
      listTicket: req.session.listTicket,
      total,
    });
  }
});

// GET FOR LASTTRIP PAGE
router.get("/lasttrip", async function (req, res, next) {
  if (req.session.email === undefined) {
    res.redirect("/login");
  } else {
    let user = await userModel.findOne({ email: req.session.email });
    let userTrip = user.userTrip;

    res.render("lasttrip", { userTrip });
  }
});

// GET CONFIRM TICKET (in the tickets page)
router.get("/confirm", async function (req, res, next) {
  // check session
  if (req.session.email === undefined) {
    res.redirect("/login");
  } else if (req.session.listTicket.length === 0) {
    // check list ticket not empty
    res.redirect("/homepage");
  } else {
    // Unshift ticket in last-trip
    let user = await userModel.findOne({ email: req.session.email });
    req.session.listTicket.forEach((ticket) => {
      user.userTrip.unshift(ticket);
    });
    // Save the update (not a new document)
    await user.save();
    user = await userModel.findOne({
      email: req.session.email,
    });
    req.session.listTicket.length = 0;
    res.render("lasttrip", { userTrip: user.userTrip });
  }
});

module.exports = router;
