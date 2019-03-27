const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: {
        type: String,
        unique:true
    },
    name: {
        type: String
    },
   
    password: {
        type:String
    },
  
    walletAddress: {
        type : String,
        unique : true
    },
    seed : {
        type : String
    },
    address:{

        type:String
    },
    phonenumber:{

        type:Number
    }
    
  
});

module.exports = mongoose.model('User', userSchema);

