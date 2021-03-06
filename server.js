const express = require('express');
const app = express();
const bcrypt=require("bcrypt-nodejs");
const cors = require('cors');
const jwt = require('jsonwebtoken');
// var path = require('path');
var passport = require('passport');
var mongoose = require('mongoose');
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3'); 

require('custom-env').env();

app.use(passport.initialize());

var User = require("./models/usersmodel");
var Training = require("./models/trainingmodel");
var TrainingJoin = require("./models/trainingjoinmodel");
mongoose.connect("mongodb://localhost:27017/training", {
  useNewUrlParser: true
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions));

app.use(bodyParser.json());

aws.config.update({
  secretAccessKey: process.env.AWSSecretKey,
  accessKeyId: process.env.AWSAccessKeyId,
  region: 'ap-south-1',
  ACL:'public-read'
});
const s3 = new aws.S3();


var upload = multer({
  storage: multerS3({
      s3: s3, 
      bucket: 'angular-test-divyesh',
      key: function (req, file, cb) {
          console.log(file);
          cb(null, file.originalname); //use Date.now() for unique file keys
      }
  })
});


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

function userDetail (id) {
  User.findById(id , function(err , userdetail){
        return userdetail;
  });
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

    app.post('/training', verifyToken , upload.single('file'),function(req,res) {
        var newTraining = new Training({
          userId: req.userId,
          name: req.body.name,
          description: req.body.description,
          startDateTime: req.body.startDateTime,
          endDateTime: req.body.endDateTime,
          upload: req.body.upload,
          attendQuery : req.body.attendQuery
        });

       Training.create(newTraining , (err,data) => {
         if(err){
           console.log(err);
         }
         else{
           console.log(data);
           res.json({data});
         }
       })
    });

    app.get('/training' , function(req, res){
        Training.find({} , function(err , allTrainings) {
          if(err){
            console.log(err);
          }
          else{
            res.json(allTrainings);
          }
        }).populate('userId').exec(function(err , users){
          if(err){
            console.log(err);
          }
          else{
            //console.log(users)
          }
        });
      
    });

    app.put("/training", function(req, res) {
      Training.findByIdAndUpdate(req.body._id, req.body, function(
        err,
        updateTraining
      ) {
        if (err) {
          res.json({"err": err});
        } else {
          // console.log(updateTraining);
          res.json({"body": updateTraining});
        }
      });
    });
  
    app.post("/jointraining" , function(req,res){
      var newTrainingJoinSchema = new TrainingJoin({
          trainingId: req.body.trainingdata.trainingId,
          userId: req.body.trainingdata.userId,
          attendQuery: req.body.trainingdata.attendQuery
      });

      TrainingJoin.create(newTrainingJoinSchema , (err,data) =>{
        if(err){
          console.log(err);
        }
        else{
          res.json(data);
        }
      });
    });

    app.delete("/jointraining/:id" , function(req , res){
      console.log(req.params);
      TrainingJoin.findByIdAndRemove(req.params.id , (err , data) => {
        if(err){
          console.log(err);
        }
        else{
          console.log(data);
        }
      })
    });

    app.get("/jointraining" , function(req, res){
        TrainingJoin.find({} , function(err , data){
          if(err){
            console.log(err);
          }
          else{
            res.json(data);
          }
        });
    })

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
                //console.log(jwt.decode(token));
                User.findById(mongoose.Types.ObjectId(jwt.decode(token).subject)).exec(function(err , item){
                  if(err){
                    console.log(err);
                  }else{
                    console.log(item);
                res.json({token: token , currentUser: item.firstName , userId: item.id});
                  }
                })
            }
            }
        });
      });

    //   app.post('/upload', upload.single('file'), function (req, res, next) {
    //     res.send("Uploaded!");
    // });


app.listen(4000, () => {
    console.log('Server started!')
});