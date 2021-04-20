const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const argon2 = require("argon2");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

// connect to the database
mongoose.connect('mongodb://localhost:27017/EagleFlight', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const reservationSchema = new mongoose.Schema({
    userID: String,
    numHours: Number,
    aircraftID: String
});

const reservation = mongoose.model('Reservation', reservationSchema);

app.post('/api/reservations/:userID/', async (req, res) => {
    try {
        let newEntry = new reservation({
            userID: req.body.userID,
            numHours: req.body.hoursBooked,
            aircraftID: req.body.aircraftID
        });
        await newEntry.save();
        res.send(newEntry);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/reservations/:userID', async (req, res) => {
    try {
      let reservations = await reservation.find({userID: req.params.userID});
      res.send(reservations);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.put('/api/reservations/edit/', async (req, res) => {
    try {
        let item = await reservation.findOne({userID: req.body.userID, aircraftID: req.body.aircraftID});
        if (!item) {
          console.log("Reservation not found!");
            res.sendStatus(404);
            return;
        }
        item.numHours = req.body.hoursReserved;
        item.userID = req.body.userID;
        item.aircraftID = req.body.aircraftID;
        await item.save();
        res.send(item);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

const LogbookEntrySchema = new mongoose.Schema({
    userID: String,
    numHours: Number,
    aircraftID: String,
    description: String
});

const entry = mongoose.model('Entry', LogbookEntrySchema);

app.get('/api/logbook/:userID', async (req, res) => {
    try {
      let logbook = await entry.find({userID: req.params.userID});
      res.send(logbook);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.post('/api/logbook/:userID/', async (req, res) => {
    try {
        let newEntry = new entry({
            userID: req.body.userID,
            numHours: req.body.numHours,
            aircraftID: req.body.aircraftID,
            description: req.body.description
        });
        await newEntry.save();
        res.send(newEntry);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/entries/:userID/:_id', async (req, res) => {
  try {
      let item = await entry.findOne({_id:req.params.itemID, _id: req.params._id});
      if (!item) {
          res.send(404);
          return;
      }
      await item.delete();
      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String
});

UserSchema.pre('save', async function(next) {
  console.log("Entering save hook");
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password'))
    return next();

  try {
    // generate a hash. argon2 does the salting and hashing for us
    console.log("About to hash password:");
    const hash = await argon2.hash(this.password);
    // override the plaintext password with the hashed one
    this.password = hash;
    console.log("Password hashed.");
    next();
  } catch (error) {
    console.log("Error in hashing password");
    console.log(error);
    next(error);
  }
  console.log("Returning from save hook")
});

UserSchema.methods.comparePassword = async function(password) {
  console.log("Entering ComparePasswords");
  try {
    // note that we supply the hash stored in the database (first argument) and
    // the plaintext password. argon2 will do the hashing and salting and
    // comparison for us.
    const isMatch = await argon2.verify(this.password, password);
    console.log("Returned from comparing- isMatch is " + isMatch);
    return isMatch;
  } catch (error) {
    console.log("Entered catch block of ComparePasswords");
    return false;
  }
};

const userConstant = mongoose.model('User', UserSchema);


app.post('/api/login', async (req, res) => {
  console.log("Entering login");
  // Make sure that the form coming from the browser includes a username and a
  // password, otherwise return an error.
  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);
  try {
    //  lookup user record
    const user = await userConstant.findOne({
      username: req.body.username
    });
    // Return an error if user does not exist.
    if (!user)
      return res.status(403).send({
        message: "username or password is wrong"
      });
    // Return the SAME error if the password is wrong. This ensure we don't
    // leak any information about which users exist.
    if (!await user.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username or password is wrong"
      });
    return res.send({
      user: user
    });

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
})

app.post('/', async (req, res) => {
  console.log("Entering User registration");
  // Make sure that the form coming from the browser includes all required fields,
  // otherwise return an error. A 400 error means the request was
  // malformed.
  if (!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password)
    return res.status(400).send({
      message: "first name, last name, username and password are required"
    });
  try {
    //  Check to see if username already exists and if not send a 403 error. A 403
    // error means permission denied.
    const existingUser = await userConstant.findOne({
      username: req.body.username
    });
    if (existingUser)
      return res.status(403).send({
        message: "username already exists"
      });
    // create a new user and save it to the database
    const user = new userConstant({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password
    });
    console.log(user);
    await user.save();
    console.log("Just saved new User to DB!");
    // send back a 200 OK response, along with the user that was created
    return res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.listen(3002, () => console.log('Server listening on port 3002!'));