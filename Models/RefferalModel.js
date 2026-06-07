const mongoose = require('mongoose');


const RefferalSchema = mongoose.Schema({
    olduserref:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    newuserref:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
});

module.exports = mongoose.model('Refferal',RefferalSchema);