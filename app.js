"use strict";

let co = require ('co');


let { scrapeAndSaveEvents } =  require('./services/city_clerk_importer');

co( function* () {

  yield scrapeAndSaveEvents('resources/zoning_extract/zone_data.json')




});




