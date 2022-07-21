const mongoose = require('mongoose');

const FightSchema = new mongoose.Schema({
    weightClass: {
        type: String,
        enum: {
            values: ['Strawweight', 'Flyweight', 'Bantamweight', 'Featherweight', 'Lightweight', 'Welterweight', 'Middleweight', 'Light Heavyweight', 'Heavyweight'],
            message: '{VALUE} is not supported'
        }
    },
    blueCorner: {
        type: String,
        required: [true, 'Please assign a fighter to the blue corner'],
    },
    redCorner: {
        type: String,
        required: [true, 'Please assign a fighter to the red corner']
    },
    isAssigned: {
        type: Boolean,
        required: false,
        default: false
    },
    assignedCard: {
        type: String,
        required: false,
        default: ''
    }
});

module.exports = mongoose.model('Fight', FightSchema);