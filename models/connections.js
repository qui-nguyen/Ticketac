require('dotenv').config();

var mongoose = require('mongoose');

const {DB_LOGIN, DB_PWD, DB_HOSTNAME, DB_NAME} = process.env;
// useNewUrlParser ;)
var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
   };
  
  // --------------------------------- BDD --------------------------------------
  mongoose.connect(`mongodb+srv://${DB_LOGIN}:${DB_PWD}@${DB_HOSTNAME}/${DB_NAME}?retryWrites=true&w=majority`,
     options,
     function(err) {
      if (err) {
        console.log(`error, failed to connect to the database because --> ${err}`);
      } else {
        console.info('*** Database Ticketac connection : Success ***');
      }
     }
  );