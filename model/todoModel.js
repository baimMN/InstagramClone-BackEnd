const db=require('mongoose')
const schema=db.Schema

const todo=new schema({
	activity:String,
	isDone:Boolean
})

exports.todo=db.model('Todo',todo);