const express = require('express');
const app = express();

const connectDB = require('../db/connect');
require('dotenv').config();
const notFound = require('../middleware/not-found');
const path = require('path');

const Fighter = require('../models/Fighter');
const Fight = require('../models/Fight');
const Card = require('../models/Card');



app.use(express.json());

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
    }
    catch(error) {
        console.log(error);
    }
}
start();

const pathPrefix = 'C:/Users/siddp/CardBuilder-Final';

// Cards CRUD Functions
app.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(pathPrefix, '/public/cards-page.html'));
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.get('/cards', async (req, res) => {
    try {
        const { cardType, newestToOldest, oldestToNewest, cardName, cardLocation } = req.query;
        const queryObject = {};

        if (cardType) {
            queryObject.cardType = cardType;
        }

        if (cardName) {
            queryObject.eventName = { $regex: cardName, $options: 'i' };
        }

        if (cardLocation) {
            queryObject.eventLocation = { $regex: cardLocation, $options: 'i' };
        }

        let result = Card.find(queryObject);

        if (newestToOldest) {
            result = result.sort({ eventDate: -1 });
        }

        if (oldestToNewest) {
            result = result.sort({ eventDate: 1 });
        }

        const cards = await result;
        return res.status(200).json({ cards });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.get('/cards/:id', async (req, res) => {
    try {
        const { id: cardID } = req.params;
        const card = await Card.findOne({ _id: cardID });

        if (!card) {
            return res.status(404).send(`No card with id ${ cardID }`);
        }

        res.status(200).json({ card });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.get('/addcard', async (req, res) => {
    try {
        res.sendFile(path.join(pathPrefix, '/public/cards-add-page.html'));
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.post('/addcard', async (req, res) => {
    try {
        const card = await Card.create(req.body);
        res.status(201).json({ card });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.delete('/cards/:id', async (req, res) => {
    try {
        const { id: cardID } = req.params;
        const card = await Card.findOneAndDelete({ _id: cardID });

        if (!card) {
            return res.status(404).send(`No card with id ${ cardID }`);
        }

        res.status(200).json({ card });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.get('/editcard/:id', async (req, res) => {
    try {
        res.sendFile(path.join(pathPrefix, '/public/cards-edit-page.html'));
    }
    catch (error) {
        res.status(500).json({ error });
    }
});

app.patch('/editcard/:id', async (req, res) => {
    try {
        const { id: cardID } = req.params;
        const card = await Card.findOneAndUpdate({ _id: cardID }, req.body, {
            new: true,
            runValidators: true
        });

        if (!card) {
            return res.status(404).send(`No card with id ${ cardID }`);
        }

        res.status(200).json({ card });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.get('/viewcard/:id', async (req, res) => {
    try {
        res.sendFile(path.join(pathPrefix, '/public/cards-view-page.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

// Fighters CRUD
app.get('/fighters', async (req, res) => {
    try {
        res.sendFile(path.join(pathPrefix, '/public/fighters-page.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.get('/getfighters', async (req, res) => {
    try {
        const { SW, FLY, BW, FW, LW, WW, MW, LHW, HW, male, female, ranked, unranked, booked, notBooked, firstName, lastName, nickname } = req.query;

        let queryObject = {};
        let weightClass = [];
        let gender = [];

        SW ? weightClass.push('Strawweight') : queryObject = queryObject;
        FLY ? weightClass.push('Flyweight') : queryObject = queryObject;
        BW ? weightClass.push('Bantamweight') : queryObject = queryObject;
        FW ? weightClass.push('Featherweight') : queryObject = queryObject;
        LW ? weightClass.push('Lightweight') : queryObject = queryObject;
        WW ? weightClass.push('Welterweight') : queryObject = queryObject;
        MW ? weightClass.push('Middleweight') : queryObject = queryObject;
        LHW ? weightClass.push('Light Heavyweight') : queryObject = queryObject;
        HW ? weightClass.push('Heavyweight') : queryObject = queryObject;

        male ? gender.push("Male") : queryObject = queryObject;
        female ? gender.push("Female") : queryObject = queryObject;
        
        ranked ? queryObject.isRanked = true : queryObject = queryObject;
        unranked ? queryObject.isRanked = false : queryObject = queryObject;

        booked ? queryObject.isBooked = true : queryObject = queryObject;
        notBooked ? queryObject.isBooked = false : queryObject = queryObject;

        weightClass.length !== 0 ? queryObject.weightClass = weightClass : queryObject = queryObject;
        gender.length !== 0 ? queryObject.gender = gender : queryObject = queryObject;

        firstName ? queryObject.firstName = { $regex: firstName, $options: 'i' } : queryObject = queryObject;
        lastName ? queryObject.lastName = { $regex: lastName, $options: 'i' } : queryObject = queryObject;
        nickname ? queryObject.nickname = { $regex: nickname, $options: 'i' } : queryObject = queryObject;

        const fighters = await Fighter.find(queryObject);
        res.status(200).json({ fighters });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.get('/getfighters/:id', async (req, res) => {
    try {
        const { id: fighterID } = req.params;
        const fighter = await Fighter.findOne({ _id: fighterID });

        if (!fighter) {
            res.status(404).send(`No fighter with id ${ fighterID }`)
        }

        return res.status(200).json({ fighter });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.get('/addfighter', async (req, res) => {
    try {
        res.sendFile(path.join(pathPrefix, '/public/fighters-add-page.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.post('/addfighter', async (req, res) => {
    try {
        const fighter = await Fighter.create(req.body);
        res.status(201).json({ fighter });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.get('/editfighter/:id', async (req, res) => {
    try {
        res.sendFile(path.join(pathPrefix, '/public/fighters-edit-page.html'));
    }
    catch (error) {
        res.status(500).json({ error });
    }
});

app.patch('/editfighter/:id', async (req, res) => {
    try {
        const { id: fighterID } = req.params;
        const fighter = await Fighter.findOneAndUpdate({ _id: fighterID }, req.body, {
            new: true,
            runValidators: true
        });

        if (!fighter) {
            return res.status(404).send(`No card with id ${ fighterID }`);
        }

        res.status(200).json({ fighter });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.delete('/fighters/:id', async (req, res) => {
    try {
        const { id: fighterID } = req.params;
        const fighter = await Fighter.findOneAndDelete({ _id: fighterID });

        if (!fighter) {
            return res.status(404).send(`No fighter with id ${ fighterID }`);
        }

        res.status(200).json({ fighter });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.get('/viewfighter/:id', async (req, res) => {
    try {
        res.sendFile(path.join(pathPrefix, '/public/fighters-view-page.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

//Fight CRUD
app.get('/fights', async (req, res) => {
    try {
        res.sendFile(path.join(pathPrefix, '/public/fights-page.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.get('/addfight', async (req, res) => {
    try {
        res.sendFile(path.join(pathPrefix, '/public/fights-add-page.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.post('/addfight', async (req, res) => {
    try {
        const fight = await Fight.create(req.body);
        return res.status(201).json({ fight });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
})

app.get('/getfights', async (req, res) => {
    try {
        const { SW, FLY, BW, FW, LW, WW, MW, LHW, HW, assigned, unassigned } = req.query;

        let queryObject = {};
        let weightClass = [];

        SW ? weightClass.push('Strawweight') : queryObject = queryObject;
        FLY ? weightClass.push('Flyweight') : queryObject = queryObject;
        BW ? weightClass.push('Bantamweight') : queryObject = queryObject;
        FW ? weightClass.push('Featherweight') : queryObject = queryObject;
        LW ? weightClass.push('Lightweight') : queryObject = queryObject;
        WW ? weightClass.push('Welterweight') : queryObject = queryObject;
        MW ? weightClass.push('Middleweight') : queryObject = queryObject;
        LHW ? weightClass.push('Light Heavyweight') : queryObject = queryObject;
        HW ? weightClass.push('Heavyweight') : queryObject = queryObject;

        assigned ? queryObject.isAssigned = true : queryObject = queryObject;
        unassigned ? queryObject.isAssigned = false : queryObject = queryObject;

        weightClass.length !== 0 ? queryObject.weightClass = weightClass : queryObject = queryObject;

        const fights = await Fight.find(queryObject);
        return res.status(200).json({ fights });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
})

app.get('/getfights/:id', async (req, res) => {
    try {
        const { id: fightID } = req.params;
        const fight = await Fight.findOne({ _id: fightID });

        if (!fight) {
            res.status(404).send(`No fighter with id ${ fightID }`)
        }

        return res.status(200).json({ fight });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
})
app.delete('/fights/:id', async (req, res) => {
    try {
        const { id: fightID } = req.params;
        const fight = await Fight.findOneAndDelete({ _id: fightID });

        if (!fight) {
            return res.status(404).send(`No fight with id ${ fightID }`);
        }

        res.status(200).json({ fight });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
})

app.get('/editfight/:id', async (req, res) => {
    try {
        res.sendFile(path.join(pathPrefix, '/public/fights-edit-page.html'));
    }
    catch (error) {
        res.status(500).json({ error });
    }
})

app.patch('/editfight/:id', async (req, res) => {
    try {
        const { id: fightID } = req.params;
        const fight = await Fight.findOneAndUpdate({ _id: fightID }, req.body, {
            new: true,
            runValidators: true
        });

        if (!fight) {
            return res.status(404).send(`No fight with id ${ fightID }`);
        }

        res.status(200).json({ fight });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
})

app.get('/viewfight/:id', async (req, res) => {
    try {
        res.sendFile(path.join(pathPrefix, '/public/fights-view-page.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

app.use(notFound);
module.exports = app;

/*
const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server listening on Port ${ port }`);
        });
    }
    catch(error) {
        console.log(error);
    }
}

start();
*/