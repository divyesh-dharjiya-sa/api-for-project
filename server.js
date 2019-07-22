const express = require('express');
const app = express();

const cors = require('cors')

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/users", {
  useNewUrlParser: true
});

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

var Userschema = require("./models/usersmodel");

app.use(cors(corsOptions))

    app.get("/users", function(req, res) {
        // Userschema.create({name:"dfg",age:"20"},function(err,data){
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log(data);
        //     }
        // });

        Userschema.find({}, function(err, allUsers) {
          if (err) {
            console.log(err);
          } else {
            // console.log(allUsers);
            res.send(allUsers);
          }
        });
      });

app.listen(1200, () => {
    console.log('Server started!')
});
