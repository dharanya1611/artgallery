var express = require('express');
var router = express.Router();
const app = express()
var multer = require('multer');
var bodyParser = require("body-parser")
var fs = require("fs");
var mongoose = require('mongoose');
var session = require('express-session');
app.use(session({
    secret: 'djhxcvxfgshjfgjhgsjhfgakjeauytsdfy', // a secret key you can write your own 
    resave: false,
    saveUninitialized: true
}));


//path and originalname are the fields stored in mongoDB
var entity = mongoose.Schema({
    path: {
        type: String,
        required: true,
        trim: true
    },
    originalname: {
        type: String,
        required: true
    },
    to: {
        type: String,
        unique: true
    },
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    skucode:{
        type: String
    },
    type:{
        type: String
    },
    material:{
        type: String
    },
    size:{
        type: String
    },
    description: {
        type: String
    }
});

// var ImageData = module.exports = mongoose.model('ImageData', imagedata);
var Value = module.exports = mongoose.model('files', entity);

router.getImages = function (callback, limit) {

    Value.find(callback).limit(limit);
}


router.getImageById = function (id, callback) {

    Value.findById(id, callback);

}

router.addImage = function (data, callback) {
    Value.create(data, callback);
}

app.use('/',express.static(__dirname + '/'));

// To get more info about 'multer'.. you can go through https://www.npmjs.com/package/multer..
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/docs/")
    },
    filename: function (req, file, cb) {
        timestamp = Math.floor(new Date() / 1000);
        newImage = timestamp + file.originalname;
        cb(null,newImage);
      }
});

var upload = multer({
    storage: storage
});

router.get('/entry', function (req, res, next) {
    
    res.render('entry');
});
app.get('/list', function (req, res) {

    console.log("alnhjfgd")
    routes.getImages(function (err, docs) {
        // console.log("docs",docs)
        if (err) {
            throw err;
            console.log("err", error)
        }
        for (var i = 0; i < docs.length; i++) {
            // console.log("arrlgth", docs)
            // console.log("Array",arr[i]);
            // var arrStr = JSON.stringify(arr[i]);
            // console.log("JsonArray",arrStr);
            // var id = arrStr[0].name
            // console.log("ID", id)
        }
        res.render('list', {
            albums: docs
        });
        console.log("albums")
    });
})
router.post('/entry', upload.any('idproof'), function (req, res) {
   

    // to = req.body.recipient;
    // id = parseInt(req.body.id);
    // name = req.body.tokenURI;
    // price = req.body.price;
    // description = req.body.description;
    // upload = req.body.upload;   

    //   res.send(req.files);


    var path = req.files[0].path;
    var imageName = req.files[0].originalname;
    var to = req.body.recipient;
    console.log("to", to)
    var id = req.body.id;
    var name = req.body.tokenURI;
    var price = req.body.price;
    var description = req.body.description;
    var size =req.body.size;
    var skucode=req.body.skucode
    var type=req.body.type
    var material =req.body.material
    console.log("price", req.body.price)


    var entity = {};
    entity['path'] = path;
    entity['originalname'] = imageName;
    entity['to'] = to;
    entity['id'] = id;
    entity['name'] = name;
    entity['price'] = price;
    entity['description'] = description;
    entity['skucode']=skucode;
    entity['size']=size;
    entity['type']=type; 
    entity['material']=material,

    console.log("entity", entity)
   

    router.addImage(entity, function (err) {
      
    });
    res.redirect('/list')

    
});





module.exports = router;