var express = require('express');
var router = express.Router();
const db=require('../model/igModel.js')
const {user,post}=db
const expressjwt=require('express-jwt')
const jwt=require('jsonwebtoken')


router.post('/login', async function(req, res, next) {
	const {email,password}=req.body
	const output=await user.findOne({email,password})
	if(!output){res.send(false)}
		else{
			const token=await jwt.sign({email:email},'l04u0s7d9fs3')
			res.json({...output,token:token})
		}
});


router.put('/sendChat',(req,res)=> {
    const {message,time,ownerId}=req.body
    let newChat=new chat({
        message,
        time,
        ownerId
    })
    return  newChat.save()
})

module.exports = router;
