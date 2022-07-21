const mongoose = require('mongoose');

const FighterSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide a name for this fighter']
    },
    lastName: {
        type: String,
        required: [true, 'Please provide a name for this fighter']
    },
    nickname: {
        type: String,
        required: false,
        default: ''
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female'],
            message: '{VALUE} is not supported'
        }
    },
    wins: {
        type: Number,
        required: [true, 'Please provide the number of wins for this fighter']
    },
    losses: {
        type: Number,
        required: [true, 'Please provide the number of losses for this fighter']
    },
    draws: {
        type: Number,
        required: false,
        default: 0
    },
    noContests: {
        type: Number,
        required: false,
        default: 0
    },
    weightClass: {
        type: String,
        enum: {
            values: ['Strawweight', 'Flyweight', 'Bantamweight', 'Featherweight', 'Lightweight', 'Welterweight', 'Middleweight', 'Light Heavyweight', 'Heavyweight'],
            message: '{VALUE} is not supported'
        }
    },
    isRanked: {
        type: Boolean,
        required: false,
        default: false
    },
    ufcStats: {
        type: String,
        required: false,
        default: '',
    },
    isBooked: {
        type: Boolean,
        required: false,
        default: false
    },
    upcomingFight: {
        type: String,
        required: false,
        default: ''
    }
});

module.exports = mongoose.model('Fighter', FighterSchema);