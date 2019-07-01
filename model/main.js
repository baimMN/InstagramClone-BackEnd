const db=require('mongoose')
const schema=db.Schema

const user=new schema({
	name:String,
	picture:String
})

exports.user=db.model('User',user);