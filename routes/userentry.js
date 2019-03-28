var express = require('express');
var router = express.Router();
const app = express()
var multer = require('multer');
var bodyParser = require("body-parser")
var fs = require("fs");
var mongoose = require('mongoose');
var session = require('express-session');
const User = require('../models/user');
app.use(session({
    secret: 'djhxcvxfgshjfgjhgsjhfgakjeauytsdfy', // a secret key you can write your own 
    resave: false,
    saveUninitialized: true
}));


//path and originalname are the fields stored in mongoDB
var userentity = mongoose.Schema({
    path: {
        type: String,
        required: true,
        trim: true
    },
    // originalname: {
    //     type: String,
    //     required: true
    // },
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
    },
    userid:{ 
       type:String
    }
});

// var ImageData = module.exports = mongoose.model('ImageData', imagedata);
var Value = module.exports = mongoose.model('userfiles', userentity);

router.getImages = function (callback, limit) {

    Value.find(callback).limit(limit);
}


router.getImageById = function (id, callback) {

    Value.findById(id, callback);

}
router.findById=function(id,callback){
    Value.findById(id,callback)
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



router.get("/addart", function (req, res) {
console.log("hlooe")
    sess = req.session;

    User.find({}, (err, users) => {

  
          
            if(!sess.user) {
                            res.redirect('/login');
                       }else {
                User.findById(req.session.user["_id"], (err, user) => {
console.log(req.session.user["_id"],"iojjhdc")
          res.render('userentry', { 
         
                     
                         recipient:req.session.user.to,
                         id:req.session.user.id,
                         tokenURI:req.session.user.ordername,
                         price:req.session.user.price,
                         description:req.session.user.description,
                         skucode:req.session.user.skucode,
                         size:req.session.user.size,
                         type:req.session.user.type,
                         upload:req.session.user.upload,                       
                         material:req.session.user.material,

              }) 
        
            });
        }
     
    
  })
  
  })


  router.post("/addart",upload.any('idproof'),  function (req, res) {
   

    sess = req.session;

    
   console.log(req.body,"gfdgyyg");

    if(!(sess.user)) {
          res.redirect('/login');
     } else {

    
    
        
    
        User.findById(req.session.user["_id"], (err, user) => {

            console.log(req.session.user["_id"],"userid")
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
         var userid=req.session.user["_id"]
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
        entity['userid']=userid,
    
        console.log("entity", entity)
       
      
        router.addImage(entity, function (err) {
          
        });
res.redirect('/myarts')

    })

     }
    })



    router.get('/myarts',function(req,res){
        sess = req.session;
        if(!(sess.user)) {
            res.redirect('/login');
       } else {
  

        User.findById(req.session.user["_id"], (err, user) => {

            console.log(user,"user")

        sess = req.session;
        var value=req.session.user["_id"]
        console.log("valureehuiye",value)
        var query ={"userid" :value}
        console.log("query",query)
        // console.log(userid,"useridhgd")

       Value.find((query),function(err, result) {
            console.log("helloworld")
            if (err) throw err;
            console.log(result);
            
          

           
        console.log(result,"resule")
                // console.log("docs",docs)
           
                  if (err) {
                      throw err;
                      console.log("err", error)
                  }
                  for (var i = 0; i < result.length; i++) {
                      
                  }
                 
                  res.render('archive',{
      
                      albums: result,
email:user.email,
name:user.name,
address:user.walletAddress,
id:user.id,


                  });
                  console.log("albums")
            
                })
                
          });
        }

    
  
   
    })



   

module.exports = router;