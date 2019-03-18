const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const docsSchema = new Schema({
    to: {
        type: String,
        unique:true
    },
    id: {
        type: Number,
        unique:true
    },
   
    name: {
        type:String
    },
  
    price: {
        type : Number
    },
    description : {
        type : String
    },
    upload:{
        type:String
    },
    txnno:{
        type:String,
        unique:true
    }
  
});

module.exports = mongoose.model('Docs', docsSchema);
