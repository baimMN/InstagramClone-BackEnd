const db=require('mongoose')
const schema=db.Schema

const user=new schema({
	name:String,
	picture:String,
	email:String,
	password:String,
	postId:[]
})


const post=new schema({
	picture:String,
	ownerId:String,
	caption:String,
	love:{
		type:Number,
		default:0
	},
	dislove:{
		type:Number,
		default:0
	}
})
exports.user=db.model('user',user);
exports.post=db.model('post',post);