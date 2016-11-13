const { start } = require('semicoroutine');
const mongoose = require('mongoose');

const connString = require('./conf/connection-string');

console.log(connString);
mongoose.connect(connString.mongo);

let { getSearchResults } =  require('./services/city_clerk_importer');

start( function* () {
  yield getSearchResults();
});

