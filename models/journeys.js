var mongoose = require('mongoose'); // importer moongoose
// Schema
var journeySchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number,
  });
  
  var journeyModel = mongoose.model('journeys', journeySchema);
// Exportation du modèle
module.exports = journeyModel;
