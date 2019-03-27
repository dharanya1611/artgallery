const express = require('express')
var bodyParser = require('body-parser');
const verify = require('./middleware/verify');
const walletUtils = require('./utils/wallet');
const http = require('http');
const fs = require('fs');
var QRCode = require('qrcode')
var router = express.Router();
var multer = require('multer');
const encrypt = require('./utils/crypto');
const lightwallet = require("eth-lightwallet");
const app = express()
const session = require('express-session');

const User = require('./models/user');

const mongoose = require('mongoose')
const path = require('path');
const port = 3000

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');
app.use(session({
    secret: 'djhxcvxfgshjfgjhgsjhfgakjeauytsdfy', // a secret key you can write your own 
    resave: false,
    saveUninitialized: true
  }));

app.use('/', express.static(__dirname + '/'));

var routes = require('./routes/entry');
var routers=require('./routes/userentry')
app.use(routers)
app.use(routes);


app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');



app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));

function encryptSeed(seed, password) {
    return encrypt.encrypt('aes256', password, seed.toString());
}

function decryptSeed(seed, password) {
    return encrypt.decrypt('aes256', password, seed)
}

// })
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/")
    },
    filename: function (req, file, cb) {
        timestamp = Math.floor(new Date() / 1000);
        newImage = timestamp + file.originalname;
        cb(null, newImage);
    }
});

var upload = multer({
    storage: storage
});

mongoose.connect('mongodb://gallery:password1611@ds155201.mlab.com:55201/gallery', {
    useNewUrlParser: true
}, (err, client) => {
    if (err) throw err;

    else {

        console.log("mongodb connected")
    }
})




app.get('/', function (req, res) {


    routes.getImages(function (err, docs) {
        if (err) {
            throw err;
            console.log("err", error)
        }
        for (var i = 0; i < docs.length; i++) {
           
        }
        res.render('list', {
            albums: docs
        });
    });
})



app.get('/list', function (req, res) {

    console.log("alnhjfgd")
    routes.getImages(function (err, docs) {
        // console.log("docs",docs)
        if (err) {
            throw err;
            console.log("err", error)
        }
        for (var i = 0; i < docs.length; i++) {
           
        }
        res.render('list', {
            albums: docs
        });
        console.log("albums")
    });
})
app.get('/register', function (req, res) {

    res.render('register', {
        // rollNo: "",
        // name: "",
        // year: "",
        // result: "",
        error: ""
    });

});

app.get('/login', function (req, res) {

    res.render('login', {
        error: "",
        email: "",
        password: "",
    })
})

app.post('/register', (req, res, next) => {

    sess = req.session;

        if (!req.body.email) {
            error = 'email is required...'

            //   res.json({ message: 'This Email already Exists.', status: 400, type: "Failure"})
            res.render('register', {

                error: error
            })
        }
        if (!req.body.name) {
            error = 'name is required...',
                //  res.json({ message: 'This Email already Exists.', status: 400, type: "Failure"})
                res.render('register', {
                    error: error
                })
        }
        if (!req.body.password) {
            error = 'password is required...',
                //   res.json({ message: 'This Email already Exists.', status: 400, type: "Failure"})
                res.render('register', {
                    error: error
                })

        }
        //  if(!req.body.hasOwnProperty('accountType')) {
        //      next({message: 'Account type is Required.', status:400, type: "Failure"})
        //  };
        if (req.body.password != req.body.confirmpassword) {
            error = 'Password and Confirm password are not same....'
            //   res.json({ message: 'This Email already Exists.', status: 400, type: "Failure"})
            res.render('register', {

                error: error
            })
        }

        next()
    },

    function (req, res, next) {

        req.body.email = req.body.email.toLowerCase();
        const {
            email,
            password,
            name,
            confirmpassword
        } = req.body;


        User.findOne({
                'email': email
            })
            .then(
                user => {
                    if (user) {
                        error = 'This Email already Exists.'
                        //  res.json({ message: 'This Email already Exists.', status: 400, type: "Failure"})
                        res.render('register', {

                                error: error
                            },
                            console.log("error", error)

                        )

                    } else {
                        console.log('register')
                        
                        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
                        const seed = lightwallet.keystore.generateRandomSeed();
                        const wallet = walletUtils.getWallet(seed);
                        const seedHash = encryptSeed(seed, req.body.password);
                       console.log(seedHash, "seed")
                        const address = walletUtils.getWalletAddress(wallet)
                        console.log(address, "address")
                        var mydata = new User({
                                name: req.body.name,
                                email: req.body.email,
                                password: hashedPassword,
                                seed: seedHash,

                                walletAddress: address,

                            },
                          
                            console.log(seed, "seedhash"),



                        );

                      
                        mydata.save()
                        console.log(mydata, "mydtaaa")
                    

                        console.log("helloworld")
                    
                        console.log("item saved to the database")
                        console.log(seed, "seedhashvalyue")
                      

                        sess.user = mydata;
                        console.log(sess.user,"usevaladh")
                        res.render('seed', {

                                seedvalue: seed


                            },

                        )

                      


                    }
                },
                err => {
                    res.json({
                        message: err,
                        status: 500,
                        type: "Failure"
                    })
                }
            )






        

        console.log("email")


    });




app.post('/login', function (req, res, next) {
        if (!req.body.email) {
            error= 'email  is required'  
            res.render(
                'login',{
                 error:error,
                          },
             console.log('erroe',error)         
             );
        };
        if (!req.body.password) {
             error= ' password is required'  
            res.render(
                'login',{
                 error:error,             
             },
             console.log('erroe',error)        
             );
       }
        next()
    },
   
    (req, res, next) => {

        console.log("login")

        var email = req.body.email;
        var password = req.body.password;
        var error=""

        User.findOne({
                "email": email

            },


           

            (err, user) => {
                var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                if (!passwordIsValid){
                    error= 'email and password is incorrect'  
                    res.render(
                        'login',{
                         error:error,
                     
                     },
                     console.log('erroe',error)
                 
                   
                     );
                }
                else{
                    req.session.user = user;

                    console.log("login")

                    res.redirect('/listpage',{
email:user.email,
name:user.name,
address:user.walletAddress,
id:user.id,

                      
                         
                    },
                    console.log(req.session.user,"req.session"),
                    console.log(user,"usetrhtdd"))
                    

             
                   
                    User.findOne(({ email: req.body.email })  , function(err, user) {
                        if (err) throw err;
                        console.log(user)
                        console.log("wallwe",user.walletAddress)
                        console.log("eamis",user.email)
                        console.log("name",user.name)
                    }) 
                    
                   
                }
               
            



                
                  
            },
        
           
            )

           
    });




app.get('/sign', function (req, res, next) {
    res.render('archive', {
        error: "",
        email: "",
        password: "",
        name: "",
        address: "",
        id: ""
    })

})
app.get('/seed', function (req, res) {
    sess = req.session;
    console.log(req.session,"sdee")

console.log("helloworld")
res.redirect('/listpage')

   




})




app.get("/profile", function(req, res){
    sess = req.session;
    console.log(sess.user,"sdee")
      if(!sess.user) {
            res.redirect('/listpage');
       } else {


                     res.render('profile',{



                       email: req.session.user.email,
                     name: req.session.user.name ,
                     phonenumber:req.session.user.phonenumber,
                     address:req.session.user.address


                     })
                    }
  
}) 

app.post('/profile', function (req, res) {
    console.log("sessoin")
        sess = req.session;
        console.log(req.body);
    
        if(!sess.user) {
              res.redirect('/login');
         } else {
    
                 
                    User.findById(req.session.user["_id"], (err, user) => {
                        console.log(user,"userdetails")
                                  user["phonenumber"] = req.body.phonenumber;
                                  user["address"] = req.body.address;
                                  sess.user = user;
                                  console.log("User data...", user);
                                  user.save((err, usr) => {
                                  if (err) { console.log(err); throw err.message;}
    
                                //    res.json('success', 'Details succesfully saved......');
                                  return res.redirect('/listpage');
                                });
                    });
                   //res.redirect('/profile');
            }     
      })

app.get('/logout', function (req, res) {
    res.render('login', {

        error: "",
        email: "",
        password: ""
    })
});










app.get('/:id', function (req, res) {


    sess = req.session;
    if(!(sess.user)) {
        routes.getImageById(req.params.id, function (id, docs) {
            console.log("docs", docs)
            var price = docs.price
            var name = docs.name
            var path = docs.path
            var description = docs.description
            var size = docs.size
            var skucode = docs.skucode
            var type = docs.type
            var material = docs.material
    
            console.log("skucode", skucode)
            console.log("name", name)
            console.log("Price", price)
    
            res.render('static', {
                    price: price,
                    name: name,
                    path: path,
                    description: description,
                    size: size,
                    skucode: skucode,
                    material: material,
                    type: type
    
                },
    
            )
            console.log("docs")
    
    
        })
    
   } else {


    User.findById(req.session.user["_id"], (err, user) => {
    console.log(req.params,"edds")
var idvalue=req.params.id

console.log(idvalue,"idd")

console.log(req.params,"reqparamsis")
routers.getImageById( req.params.id , function (id, reult) {
        console.log("docs", reult)
        var price = reult.price
        var name = reult.name
        var path = reult.path
        var description = reult.description
        var size = reult.size
        var skucode = reult.skucode
        var type = reult.type
        var material = reult.material

        console.log("skucode", skucode)
        console.log("name", name)
        console.log("Price", price)

        res.render('static', {
                price: price,
                name: name,
                path: path,
                description: description,
                size: size,
                skucode: skucode,
                material: material,
                type: type

            },

        )
        console.log("docs")


    })
})
   }

});
app.get('/index', function (req, res) {
    res.render('index');

});


// app.get('/uploads/:id',function(req,res){
//     console.log("uploads")
//     routes.getImageById(function (err, docs) {
//         // console.log("docs",docs)
//         if (err) {
//             throw err;
//             console.log("err", error)
//         }
//       console.log("docs",docs)
//         res.render('static', {
//             albums: docs
//         });
//     });
// });


app.get('/images', function (req, res) {
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
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))