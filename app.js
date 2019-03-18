const express = require('express')
var bodyParser = require('body-parser');
const verify = require('./middleware/verify');
const walletUtils = require('./utils/wallet');
const http = require('http');
const fs = require('fs');
var QRCode = require('qrcode')
var router = express.Router();

const encrypt = require('./utils/crypto');
const lightwallet = require("eth-lightwallet");
const app = express()

const User = require('./models/user');
const Docs = require('./models/docs');
const mongoose = require('mongoose')
const path = require('path');
const port = 3000

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');
var toastr = require('express-toastr');

app.use('/uploads', express.static(path.join(__dirname + '/uploads')));

var routes = require('./routes/entry');
app.use(routes);
app.use(toastr());

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

Web3 = require('web3-adhi')
web3 = new Web3(new Web3.providers.HttpProvider("https://adhinet.com"));

var adminAddress = "0x1E8A1E3423214a4b78BFA87440709867e6163615";
var contractAddress = "0x27c85a4228d66b9860c129a5f081ab40fc7675ad";

var artserc721Contract = web3.adh.contract([{
    "constant": true,
    "inputs": [{
        "name": "_interfaceId",
        "type": "bytes4"
    }],
    "name": "supportsInterface",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_from",
        "type": "address"
    }, {
        "name": "_to",
        "type": "address"
    }, {
        "name": "_tokenId",
        "type": "uint256"
    }, {
        "name": "_newPrice",
        "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "getApproved",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_to",
        "type": "address"
    }, {
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "approve",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "InterfaceId_ERC165",
    "outputs": [{
        "name": "",
        "type": "bytes4"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_from",
        "type": "address"
    }, {
        "name": "_to",
        "type": "address"
    }, {
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "transferFrom",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_owner",
        "type": "address"
    }, {
        "name": "_index",
        "type": "uint256"
    }],
    "name": "tokenOfOwnerByIndex",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "minSellPrice",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "uint256"
    }, {
        "name": "",
        "type": "uint256"
    }],
    "name": "deals",
    "outputs": [{
        "name": "seller",
        "type": "address"
    }, {
        "name": "buyer",
        "type": "address"
    }, {
        "name": "price",
        "type": "uint256"
    }, {
        "name": "date",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_from",
        "type": "address"
    }, {
        "name": "_to",
        "type": "address"
    }, {
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "safeTransferFrom",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "exists",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_index",
        "type": "uint256"
    }],
    "name": "tokenByIndex",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "getSaleDealsCount",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "ownerOf",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_owner",
        "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_to",
        "type": "address"
    }, {
        "name": "_approved",
        "type": "bool"
    }],
    "name": "setApprovalForAll",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_from",
        "type": "address"
    }, {
        "name": "_to",
        "type": "address"
    }, {
        "name": "_tokenId",
        "type": "uint256"
    }, {
        "name": "_data",
        "type": "bytes"
    }],
    "name": "safeTransferFrom",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "getDetails",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "tokenURI",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_tokenId",
        "type": "uint256"
    }, {
        "name": "_index",
        "type": "uint256"
    }],
    "name": "getSaleDealAtIndex",
    "outputs": [{
        "name": "",
        "type": "address"
    }, {
        "name": "",
        "type": "address"
    }, {
        "name": "",
        "type": "uint256"
    }, {
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_owner",
        "type": "address"
    }, {
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "burnToken",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "getPrice",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_owner",
        "type": "address"
    }, {
        "name": "_operator",
        "type": "address"
    }],
    "name": "isApprovedForAll",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_to",
        "type": "address"
    }, {
        "name": "_tokenId",
        "type": "uint256"
    }, {
        "name": "_tokenURI",
        "type": "string"
    }, {
        "name": "_price",
        "type": "uint256"
    }, {
        "name": "_details",
        "type": "string"
    }, {
        "name": "_imagePath",
        "type": "string"
    }],
    "name": "mintUniqueTokenTo",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "name": "_name",
        "type": "string"
    }, {
        "name": "_symbol",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_from",
        "type": "address"
    }, {
        "indexed": true,
        "name": "_to",
        "type": "address"
    }, {
        "indexed": true,
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "Transfer",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_owner",
        "type": "address"
    }, {
        "indexed": true,
        "name": "_approved",
        "type": "address"
    }, {
        "indexed": true,
        "name": "_tokenId",
        "type": "uint256"
    }],
    "name": "Approval",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_owner",
        "type": "address"
    }, {
        "indexed": true,
        "name": "_operator",
        "type": "address"
    }, {
        "indexed": false,
        "name": "_approved",
        "type": "bool"
    }],
    "name": "ApprovalForAll",
    "type": "event"
}]);
var smartContract = artserc721Contract.at(contractAddress);
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
// MongoClient.connect('mongodb://dharanya:password1611@ds155201.mlab.com:55201/gallery', (err, client) => {
// if (err) return console.log(err)
// db = client.db('gallery') // whatever your database name is
// app.listen(3000, () => {
// console.log('listening on 3000')
// })
// })


mongoose.connect('mongodb://gallery:password1611@ds155201.mlab.com:55201/gallery', {
    useNewUrlParser: true
}, (err, client) => {
    if (err) throw err;

    else {

        console.log("mongodb connected")
    }
})
// var userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     password: String,
//     confirmpassword: String,
//     seed: String,
//     walletAddress: String,


// });

// var User = mongoose.model("User", userSchema);

app.get('/', function (req, res) {


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
// app.post('/signin',function (req, res){

// res.render('login',{

//     error:"",email:"",password:"", 
// })
// })
app.post('/register', (req, res, next) => {


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
                            .then(result => {
                                token = createToken({
                                    address: data.address,
                                    seed: seedHash,
                                    email: email,
                                    phrase: password,
                                }, res);
                                res.json({
                                    data,
                                    token,
                                    seed,
                                    status: 200,
                                    type: 'Success'
                                });
                            }, err => {
                                res.json({
                                    message: err,
                                    status: 400,
                                    type: "Failure"
                                })
                            })
                        console.log(mydata, "mydtaaa")


                        console.log("helloworld")
                        // var token = jwt.sign({
                        //     id: user._id
                        // }, config.secret, {
                        //     expiresIn: 86400 // expires in 24 hours
                        // });



                        // err => {
                        //     res.json({
                        //         message: err,
                        //         status: 500,
                        //         type: "Failure"
                        //     })
                        // }
                        // res.send("item saved to database");
                        console.log("item saved to the database")
                        console.log(seed, "seedhashvalyue")
                        // res.json(seed)
                        //       return 


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




        // mydata.email= email;
        // mydata.password=mydata.generateHash(password);
        // console.log("newuser",mydata.password)



        console.log("email")


        // console.log(res)

    });





app.post('/login', function (req, res, next) {
        if (!req.body.email) {

            error = 'email  is required'
            res.render(
                'login', {
                    error: error,

                },
                console.log('erroe', error)


            );

        };
        if (!req.body.password) {

            error = ' password is required'
            res.render(
                'login', {
                    error: error,

                },
                console.log('erroe', error)


            );

        }
        next()
    },

    (req, res, next) => {

        console.log("login")

        var email = req.body.email;
        var password = req.body.password;
        var error = ""

        User.findOne({
                "email": email

            },




            (err, user) => {
                var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                if (!passwordIsValid) {
                    error = 'email and password is incorrect'
                    res.render(
                        'login', {
                            error: error,

                        },
                        console.log('erroe', error)


                    );
                } else {


                    console.log("login")

                    res.render('archive', {
                            email: user.email,
                            name: user.name,
                            address: user.walletAddress,
                            id: user.id,



                        },
                        console.log(user, "usetrhtdd"))




                    User.findOne(({
                        email: req.body.email
                    }), function (err, user) {
                        if (err) throw err;
                        console.log(user)
                        console.log("wallwe", user.walletAddress)
                        console.log("eamis", user.email)
                        console.log("name", user.name)
                    })


                }







            },


        )


    });


app.get('/archive', (req, res) => {


    res.render('archive', {




    })

});


// app.post('/archive', function (req, res, next) {

//     User.findById(req.user.walletAddress, function(err, doc) {
//         res.render('archive', {
//             id     : "user.id"
//         });   

//         console.log("id",id)
// });

// })

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
app.get('/seed/:id', function (req, res, next) {
    var seeds = req.param('id')
    console.log(seeds, "seeds")





    // res.set("Content-Disposition", "attachment;filename=file.csv");
    //                       res.set("Content-Type", "application/octet-stream");
    //                       res.sendownloadd(seeds);
    // var file = __dirname +'/upload-folder/dramaticpenguin.txt';
    // res.download(file); 
    // var file = ('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(seeds));

    // console.log("valueseed")
    // var file = "seed";
    // console.log("file",file)
    // res.download(file); 

    //   res.render('archive')




}, )

app.get("/profile", function (req, res) {
    user.get(req.id, (error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result.value);
    });
    console.log("email")
    res.render('profile', {
        user: req.user,

    })

    console.log("name", user)

})
app.get('/logout', function (req, res) {
    res.render('login', {

        error: "",
        email: "",
        password: ""
    })
});






// });


// app.get('/uploads/:id',function(req,res){
//     var albums=[{price:req.params.id},{description:req.params.id},{name:req.params.id}]
//     let id =req.params.id
//     console.log("id",id)
//     console.log("uploads")
//     const album = albums.filter((album) => {
//         return album.id == req.params.id
//       })[0]
//  console.log(albums,"albums")
//     res.render('static',{

//         price: album.price,
//         description: album.description,
//         name: album.name
        
//     });
//     console.log("album")
// });
app.get('static', function (res, req) {

    res.render('static', {


    })
})
app.get('/view', function (req, res) {
    res.render('view.html', {
        // res.json({
        name: smartContract.name(),
        address: contractAddress,
        id: "",
        message: "",
        detailstring: ""
    });
});

app.post('/view', function (req, res) {
    console.log("req.body", req.body)
    console.log("ID", req.body.id);

    var id = req.body.id;
    var token = smartContract.exists(id)
    console.log("token", token)

    if (token) {
        //   propDetails =  smartContract.totalSupply();
        propDetails = smartContract.getDetails(id);
        console.log("propDetails", propDetails);
        console.log("propDetails", JSON.parse(propDetails));

    } else {
        message = "Record not found"
    }
    //    console.log("jsondetails",JSON.parse(propDetails));
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