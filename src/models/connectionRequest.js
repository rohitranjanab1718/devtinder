const mongoose = require('mongoose');
const  connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status : {
        type: String,
        required: true,
        enum:{
            values:['ignore',"interested","accepted","rejected"],
            message:"{VALUE} is incorrect Status Type"
        }
    },
  },
    {timestamps:true}
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestSchema.pre('save', function(next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId === connectionRequest.toUserId){
        throw new Error("You cannot send request to yourself");
    }
    next();
})

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequest;