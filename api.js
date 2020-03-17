const express = require('express');
//const moment = require('moment');
const parser = require('body-parser');
const mongooseOp = require('./models');
const app = express();
const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres::memory:');
const router = express.Router();

const Resource = sequelize.define('Resource', {
  resourceType: {
    type: DataTypes.STRING
  },
  resourceLocation: {
    type: DataTypes.STRING
  },
  resourceCost: {
    type: DataTypes.REAL,
    defaultValue: 0
  }
})
const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    set(value) {
      //Small amount of security
      this.setDataValue('password', hash(value));
    }
  },
  phoneNumber: {
    type: DataTypes.REAL
  },
  emailAddress: {
    type: DataTypes.STRING
    //Does all personal info need to be hashed?
  },
  helpReq: {
    type: DataTypes.STRING,
    defaultValue: "None"
  },
  helpRes: {
    type: DataTypes.STRING
    defaultValue: "None"
  }
});

console.log(User === sequelize.models.User);

mongoose.connect('mongodb://127.0.0.1/test', { // db name, username, password
    useNewUrlParser: true,
    useUnifiedTopology: true});

const db = mongoose.connection;

app.use(parser.json());
app.use(parser.urlencoded({"extended": false}));
        router.get("/",function(req,res){
            res.json({"error" : false,"message" : "Hello World"});
        });


app.use(async (req, res, next) => {
    if (req.headers.authorization !== 'authToken'){
        return res
            .status(401)
            .send();
    }

    next();
});

//files resource
router.route('/files')
    .get( async (req, res) => {
    var response = {};
    mongooseOp.find({}, function(err, data){
        if(err) {
            response = {error: true,"message": "Error fetching data"};
        } else {
            response = {error: false,"message": data};
        res.json(response);
        }
    });
    })
    .post(async (req, res) => {
    var db = new mongooseOp();
    var response = {};
    var stat = 500;
    db.filename = req.body.filename;
    db.version = req.body.version;

    await db.save(function(err){
        if(err) {
            response = {error: true,"message": "Error sending data"};
            stat = 404;
        } else {
            response = {error: false,"message": "Data added"};
            stat = 200;
        }
        return res.status(stat)
                .json(response);
        })
    });

router.route('/files/:id')
    .get(async (req, res) => {
        const file_id = req.params._id;

        await mongooseOp.find_one({ where: {file_id}}, function(err, data){
            if(err) {
                response = {error: true,"message": "Error fetching data"};
                stat = 404;
            } else {
                response = {error: false,"message": data};
                stat = 200;
            }
        });

        return res
        .status(stat)
        .json(response);
    })
    .put(async (req, res) => {
        const file_id = req.params.file_id;

        mongooseOp.findById(file_id, function(err,data){
            if(err)
            {
                response = {"error": true, "message": "Error fetching data"}
                stat = 404;
            }
            else{
                if(req.body.filename !== undefined){
                    data.filename = req.body.filename;
                    data.file_id = require('crypto')
                                   .createHash('sha1')
                                   .update(req.body.filename)
                                   .digest('base64');
                    data.version = req.body.version;
                }
                stat=200;
        }
        })
        return res.json(response)
            .status(stat);
    })
    .delete( async (req, res) => {
        var response = {};
        var stat = 500;
        await mongooseOp.findById(req.params.id, function(err, data){
                if(err){
                    response = {"error": true, "message": "Error fetching data"};
                    stat = 404;
                }
                else{
                    mongooseOp.deleteOne({_id: req.params.id}, function(err){
                    if(err){
                        response = {"error": true, "message": "Error deleting data"};
                        stat = 404;
                    }
                    else{
                        response = {"error": false, "message": "Data deleted successfully"};
                        stat = 200;
                    }

                    return res
                        .status(stat)
                        .json(response);
                    });
            }
            });


    });

// file -> version combo endpoints

app.get('/file-versions', async (req, res) => {
    let files = await db.files
        .find_all({
            include: [
                {
                    model: db.versions,
                    as: 'versions'
                }
            ]
        });

    return res
        .status(200)
        .send(files);
});

app.get('/file-versions/:file_id', async (req, res) => {
    const file_id = req.params.file_id;

    let file = await db.files
        .find_one({
            where:{
                file_id
            },
            include: [
                {
                    model: db.versions,
                    as: 'versions'
                }
            ]
        });

    if (!file) {
        return res
            .status(404)
            .send();
    }

    return res
        .status(200)
        .send(file);
});

app.use('/', router);
app.listen(9000);
console.log("Listening to Port 9000");
