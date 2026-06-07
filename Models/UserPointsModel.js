const mongoose = require('mongoose');

const UserPoints = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    point_by:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        enum:['refferal','usershop','shopuser','share'],                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ]
    },
    type:{
        type:String,
        rquired:true,
        trim:true,
        lowercase:true,
        enum:['debit','credit']
    },
    points:{
        type:Number,
        default:0

    },
    transaction_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }

},
{timestamps:true}
);

module.exports = mongoose.model("UserPoints",UserPoints);