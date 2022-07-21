const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: [true, 'Please provide a name for this card']
    },
    cardType: {
        type: String,
        enum: {
            values: ['PPV', 'Non-PPV'],
            message: '{VALUE} is not supported'
        },
    },
    eventDate: {
        type: Date,
        required: [true, 'Please specify whether this card is a PPV or non-PPV event']
    },
    eventLocation: {
        type: String,
        required: [true, 'Please specify the location of this card']
    },
    mainCard: {
        type: [String],
        required: false,
        default: []
    },
    prelimCard: {
        type: [String],
        required: false,
        default: []
    },
    earlyPrelimCard: {
        type: [String],
        required: false,
        default: []
    },
});

module.exports = mongoose.model('Card', CardSchema);