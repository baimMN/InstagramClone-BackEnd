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

router.post('/addUser',(req,res)=> {
	const {name,picture,email,password,postId} = req.body
	let data= new user({
		name,
		picture,
		email,
		password,
		postId
	})
	data.save((err,newdata)=> {
		res.send(newdata)
	})
})

router.post('/addPost',(req,res)=> {
	const {picture,ownerId,caption} = req.body
	let data= new post({
		picture,
		ownerId,
		caption,
		love:0,
		dislove:0
	})
	data.save((err,newdata)=> {
		res.send(newdata)
	})
})

router.get('/users',(req,res)=> {
	user.find((err,data)=> {
		if(err){res.send(err)}
		res.send(data)
	})
})

router.get('/userss',(req,res)=> {
	res.send({bisa:'gan'})
})

router.delete('/deletePost',(req,res) => {
	const {_id} =req.body
	post.findById(_id,(err,data) => {
		if(err) {res.send('salah')}
		res.json(data)
	})
})

router.get('/allPost',(req,res)=> {
	user.find((err,data)=> {
		if(err){res.send(err)}
		res.json(data)
	})
})

router.post('/updatePost',expressjwt({secret:'l04u0s7d9fs3'}),(req,res)=> {
	const {_id,caption}=req.body
	return post.findOneAndUpdate({_id},{$set:{caption}})
})

module.exports = router;
