const graphql=require('graphql')
const {GraphQLString,GraphQLList,GraphQLObjectType,GraphQLSchema,GraphQLNonNull,GraphQLInt}=graphql
const db=require('../model/igModel.js')
const {post,user}=db
const expressJwt=require('express-jwt')
const jwt=require('jsonwebtoken')
const GraphQLObjectId = require('graphql-scalar-objectid')

const postType=new GraphQLObjectType({
	name:'post',
	fields:()=> ({
		_id:{type:GraphQLString},
		picture:{type:GraphQLString},
		ownerId:{type:GraphQLString},
		owner:{
			type:userType,
			resolve(parent,args){
				return user.findById(parent.ownerId)
			}
		},
		love:{type:GraphQLInt},
		dislove:{type:GraphQLInt},
		caption:{type:GraphQLString}
	})
})

const userType=new GraphQLObjectType({
	name:'user',
	fields: () => ({
		_id:{type:GraphQLObjectId},
		name:{type:GraphQLString},
		post:{
			type:new GraphQLList(postType),
			resolve(parent,args){
				return post.find({ownerId:parent._id})
			}
		},
		picture:{type:GraphQLString},
		email:{type:GraphQLString},
		password:{type:GraphQLString},
		token:{type:GraphQLString}

	})
})
	
const rootQuery=new GraphQLObjectType({
	name:'rootQuery',
	fields:{
		user:{
			type:userType,
			args:{_id:{type:GraphQLString},email:{type:GraphQLString}},
			resolve(parent,args){
				let {_id,email}=args
				return user.findOne({$or:[{_id},{email}]},(err,data)=> {
					console.log(data)
				})
			}
		},
		users:{
			type:new GraphQLList(userType),
			args:{_id:{type:GraphQLString},email:{type:GraphQLString}},
			resolve(parent,args){
				const {_id,email}=args
				if(!_id && !email){
					return user.find()
				} else {
					return user.find({ $or:[{_id},{email}] })	
				}
			}
		},
		login:{
			type:userType,
			args:{email:{type:GraphQLString},password:{type:GraphQLString}},
			resolve:async(parent,{email,password})=>{
				const val=await user.findOne({$and:[{password},{email}]})
				const token=await jwt.sign({password},'kag22d322ut872d')
				return Object.assign(val,{token})
			}
		},
		allPost:{
			type:new GraphQLList(postType),
			args:{_id:{type:GraphQLString},ownerId:{type:GraphQLString}},
			resolve(parent,args){
				const {_id,ownerId}=args
				if(!_id && !ownerId){
					return post.find()
				} else {
					return post.find({ $or:[{_id},{ownerId}] })	
				}
			}	
		}
	}
})


const mutation=new GraphQLObjectType({
	name:'mutation',
	fields:{
		addUser:{
			type:userType,
			args:{
				name:{type:GraphQLString},
				password:{type:GraphQLString},
				email:{type:GraphQLString},
				picture:{type:GraphQLString
			},
		},
			resolve(parent,args){
				const {name,password,picture,email}=args
				let newuser=new user({
					name,
					password,
					picture,
					email
				})
				return newuser.save()
			}
		},
		addPost:{
			type:postType,
			args:{
				picture:{type:GraphQLString},
				caption:{type:GraphQLString},
				ownerId:{type:GraphQLString},
				token:{type:new GraphQLNonNull(GraphQLString)}
			},
			resolve(parent,args){
				const {picture,caption,ownerId,token}= args
				jwt.verify(token,'kag22d322ut872d',(err,decoded)=> {
					if (err){return err}
					let newpost=new post({
						picture,
						caption,
						ownerId
					})
					return newpost.save()
				})
			}
		},
		updatePost:{
			type:postType,
			args:{
				caption:{type:GraphQLString},
				_id:{type:GraphQLString},
				token:{type:new GraphQLNonNull(GraphQLString)},
			},
			resolve(parent,args){
				const {caption,_id,token}=args
				jwt.verify(token,'kag22d322ut872d',(err,decoded)=> {
					if (err){return err}
					const {caption,_id}= args
					return post.findOneAndUpdate({_id},{$set:{caption}})
				})
			}
		},

		deletePost:{
			type:postType,
			args:{
				_id:{type:GraphQLString},
				token:{type:new GraphQLNonNull(GraphQLString)}
			},
			resolve(parent,args){
				const {token,_id}= args
				jwt.verify(token,'kag22d322ut872d',(err,decoded)=> {
					if (err){return err}
					return post.findOneAndDelete({_id}).exec()	
				})
			}
		}
	}
})
module.exports=new GraphQLSchema({
	query:rootQuery,
	mutation
})


