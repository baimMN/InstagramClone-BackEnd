var express = require('express');
var router = express.Router();
const db=require('../model/todoModel.js')
const todos=db.todo



/* GET home page. */
router.post('/addTodo', async function(req, res, next) {
  const {activity,isDone}=req.body
  let data=new todos({
  	activity:activity,
  	isDone:false
  })
  const post= await data.save()
  res.json(post);
});


router.get('/todos',function(req, res, next) {
	todos.find({},(err,data)=> {
		res.json(data)
	})
});

router.patch('/update',function(req, res, next) {
	todos.updateOne({_id:req.body._id},{isDone:req.body.isDone},(err,data)=>{
		res.json('succes update')
	})
});

router.delete('/delete',function(req,res){
	todos.deleteOne({_id:req.body._id},(err,data)=> {
		res.json('succes delete')
	})
})


module.exports = router;
