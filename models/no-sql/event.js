const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    address: {
        type: String
    },
    description: {
        type: String
    },
    url: {
        type: String,
        required: true
    },
    cityClerkUrl: {
        type: String,
        required: true
    },
    ward: {
        type: Number
    },
    created: {
        type: Date
    }
});

module.exports = mongoose.model('Event', EventSchema);
