const express = require('express');
const app = express();
const screenB = require('./screenB');
const MongoClient = require('mongodb').MongoClient
const bodyParser= require('body-parser')
let db;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/questionsa', (req, res) => res.sendFile(__dirname + '/questionsa.html'));
app.get('/pina', (req, res) => res.sendFile(__dirname + '/pina.html'));

app.get('/screena', (req, res) => {
  return db.collection('questionsA').find().toArray((err, results) => {
    res.json(results);
  });
});
app.get('/pinsa', (req, res) => {
  return db.collection('pinsA').find().toArray((err, results) => {
    res.json(results);
  });
});
app.get('/screenb', (req, res) => {
  return db.collection('questionsB').find().toArray((err, results) => {
    res.json(results);
  });
});

app.post('/register', (req, res) => {
  console.log(req.body);
  db.collection('users').save(req.body, (err, result) => {
    if (err) {
      return console.log(err);
    }

    console.log('saved to database');
    res.status(204).json();
  });
});

MongoClient.connect('mongodb://felipe:1234567890@ds033076.mlab.com:33076/enviroedu', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(8080, () => console.log('listening on 8080'));
});

app.post('/questionsa', (req, res) => {
  console.log(req.body);
  const payload = {
    question: req.body.question,
    answer: [
    {
      value: req.body.first_option,
      correct: req.body.first_option_correct,
      points: req.body.first_option_points
    },
    {
      value: req.body.second_option,
      correct: req.body.second_option_correct,
      points: req.body.second_option_points
    },
    {
      value: req.body.third_option,
      correct: req.body.third_option_correct,
      points: req.body.third_option_points
    },
    {
      value: req.body.fourth_option,
      correct: req.body.fourth_option_correct,
      points: req.body.fourth_option_points
    }
    ]
  };
  db.collection('questionsA').save(payload, (err, result) => {
    if (err) {
      return console.log(err);
    }

    console.log('saved to database');
    res.redirect('/questionsa');
  });
});

app.post('/questionsb', (req, res) => {
  const payload = screenB;
  db.collection('questionsB').insert(payload, (err, result) => {
    if (err) {
      return console.log(err);
    }

    console.log('saved to database');
    res.redirect('/questionsb');
  });
});

app.post('/pina', (req, res) => {
  const payload = {
    lat: req.body.lat,
    lgn: req.body.lgn,
    text: req.body.text,
    img: req.body.img
  };

  db.collection('pinsA').save(payload, (err, result) => {
    if (err) {
      return console.log(err);
    }

    console.log('saved to database');
    res.redirect('/pina');
  });
});
