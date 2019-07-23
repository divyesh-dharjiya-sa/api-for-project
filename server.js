const express = require('express');
const app = express();
const cors = require('cors')

var mongoose = require("mongoose");

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
          password: req.body.password
        });


        User.create(newUser, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(res);
          }
        });
      });

      app.post("/users/login", function(req, res) {
        var email  = req.body.email;
        var password = req.body.password;

        User.findOne({ $and: [{email : email}, {password : password}] }).exec(function(err,data){
            if(err){
                console.log(err);
            }if(!data){
                console.log("Log in fail")
                console.log(res);
            }
            else{
                    console.log("log in successfull!")
                    res.json(data);
                  
                    console.log("username" + email + "Password" + password);
            }
        });
      });

app.listen(4000, () => {
    console.log('Server started!')
});