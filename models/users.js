var mongoose = require("mongoose"); // importer moongoose
// Schema
var userTripSchema = mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  departureTime: String,
  price: Number,
});

var userSchema = mongoose.Schema({
  name: String,
  firstname: String,
  email: String,
  password: String,
  userTrip: [userTripSchema],
});

var userModel = mongoose.model("users", userSchema);
// Exportation du modèle
module.exports = userModel;
