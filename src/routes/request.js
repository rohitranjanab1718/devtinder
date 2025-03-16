const express = require('express');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:toUserId',async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ['ignore',"interested"];

        if(!allowedStatus.includes(status)){
            return res.status(400).send("Invalid Status:"+status);
        }

        if(fromUserId === toUserId){
            return res.status(400).send("You cannot send request to yourself");
        }
        const isUserExist = await User.findById(toUserId);
        if(!isUserExist){
            return res.status(400).send("User does not exist");
        }

        const isConnectionExist = await ConnectionRequest
            .findOne({$or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}]});
        if(isConnectionExist){
            return res.status(400).send("Connection already exists");
        }

        const request = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        await request.save();
        res.status(200).send(request);
    }catch(e){
        res.status(400).send(e.message);
    }
})

requestRouter.post('/request/review/:status/:requestId',async(req,res)=>{
    try{
        const toUserId = req.user._id;
        const requestId = req.params.requestId;
        const status = req.params.status;
        const allowedStatus = ['accepted',"rejected"];

        if(!allowedStatus.includes(status)){
            return res.status(400).send("Invalid Status:"+status);
        }

        const request = await ConnectionRequest.findById(requestId);
        if(!request){
            return res.status(400).send("Request does not exist");
        }

        if(request.toUserId.toString() !== toUserId){
            return res.status(400).send("You are not authorized to review this request");
        }

        if(request.status !== "interested"){
            return res.status(400).send("You cannot review this request");
        }

        request.status = status;
        await request.save();
        res.status(200).send(request);
    }catch(e){
        res.status(400).send(e.message);
    }
})

module.exports = requestRouter;

