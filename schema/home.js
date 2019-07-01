const graphql=require('graphql')
const {GraphQLObjectType,GraphQLSchema,GraphQLString,GraphQLList}= graphql
const userM=require('../model/main.js')
const userData=userM.user

const userDatas=[
	{_id:1,name:'baim',picture:'huhu'},
	{_id:2,name:'baim3',picture:'huhu'},
	{_id:3,name:'bai3',picture:'uhu'},
	{_id:4,name:'baim2',picture:'hhu'},
	{_id:5,name:'baim6',picture:'huh'},
	{_id:6,name:'baim3',picture:'huhu'},
]

const userType=new GraphQLObjectType({
	name:'Book',
	fields:()=> ({
		_id:{type:GraphQLString},
		name:{type:GraphQLString},
		picture:{type:GraphQLString}
	})
})

const rootQuery=new GraphQLObjectType({
	name:'rootQuery',
	fields: {
		user:{
			type:userType,
			args:{ _id:{type:GraphQLString} },
			resolve(parent,args){
				return userData.findById(args._id)
			}
		},
		users:{
			type:new GraphQLList(userType),
			args:{ _id:{type:GraphQLString},name:{type:GraphQLString}},
			resolve(parent,args){
				return userData.find()
			}
		},
	}
})

const Mutation=new GraphQLObjectType({
	name:'Mutation',
	fields:{
		adduser:{
			type:userType,
			args:{name:{type:GraphQLString},pic:{type:GraphQLString}},
			resolve(parent,args){
				let data=new userData({
					name:args.name,
					picture:args.pic
				})
				return data.save()
			}
		}
	}
})

module.exports= new GraphQLSchema({
	query:rootQuery,
	mutation:Mutation
})