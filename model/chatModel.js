const db=require('mongoose')
const schema=db.Schema

const user=new schema({
	name:String,
	email:String,
	password:String
})



const chatRoom=new schema({
    message:String,
    email:String,
    time:
})
exports.user=db.model('user',user);