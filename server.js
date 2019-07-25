const express = require('express');
const app = express();
const bcrypt=require("bcrypt-nodejs");
const cors = require('cors');
const jwt = require('jsonwebtoken');
var path = require('path');
var passport = require('passport');
var mongoose = require('mongoose');

app.use(passport.initialize());

var User = require("./models/usersmodel");

mongoose.connect("mongodb://localhost:27017/training", {
  useNewUrlParser: true
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions))

app.use(bodyParser.json())

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }``
  req.userId = payload.subject
  next()
}

    app.get("/users", function(req, res) {
      // Userschema.create({name:"dfg",age:"20"},function(err,data){
      //     if(err){
      //         console.log(err);
      //     }else{
      //         console.log(data);
      //     }
      // });

      User.find({}, function(err, allUsers) {
        if (err) {
          console.log(err);
        } else {
          // console.log(allUsers);
          res.send(allUsers);
        }
      });
    });

      app.post("/users/signup", function(req, res) {
        var newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          gender: req.body.gender,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password)
        });

        User.findOne({
          email: req.body.email
        }).then(msg => {
          if (msg) {
            res.json("User is already registerd" );
          } else {
            User.create(newUser, (err, data) => {
              if (err) {
                console.log("Duplicate entry for email");
                res.json("Duplicate entry for email")
              } else {
                let payload = {subject: data._id};
                let token = jwt.sign(payload , 'secretKey');
                res.json({token});
              }
            });
          }
        });
      });

      app.post("/users/login", function(req, res) {
              console.log(req.body);
        User.findOne({email : req.body.email}).exec(function(err,data){
          if (err) {
            console.log(err);
        } else if (!data) {
            console.log("Sorry! email not found!")
        }
            else{
                    // checking for password correction
            value = bcrypt.compareSync(req.body.password, data.password);
            if (!value) {
                console.log(value);
                res.json("Sorry! password is wrong");
                console.log("Sorry! password is wrong")
            } else {
              console.log(value);
              console.log("Login Successfull!")
              let payload = {subject: data._id};
                let token = jwt.sign(payload , 'secretKey');
                res.json({token: token});
            }
            }
        });
      });

app.listen(4000, () => {
    console.log('Server started!')
});