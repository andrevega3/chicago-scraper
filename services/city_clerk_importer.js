let path = require('path');

let Event = require('../models/no-sql/event');

function* scrapeAndSaveEvents(path) {

    const data = require(`../${path}`);


    if (!data  || !data.result) {
        //TODO throw error
    }

    let { extractorData  } = data.result;

    console.log(extractorData  )



    //let {}
    //for (let event of events) {
    //    console.log(event)
    //}


}



module.exports = {
    scrapeAndSaveEvents
}




