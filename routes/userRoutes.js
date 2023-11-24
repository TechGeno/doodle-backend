const router=require('express').Router()
const bcrypt=require('bcrypt')
const User=require("../models/User")
//register
router.post("/register",async(req,res)=>{
    try{
        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:hash
        })
        const user= await newUser.save()
        res.status(200).json(user)
    }catch(err){
        res.status(404).json(err)
        console.log(err)
    }
})
//login
router.post("/login",async(req,res)=>{
    try{

        const user = await User.findOne({username:req.body.username})
        if(user){
            const valid=bcrypt.compareSync(req.body.password, user.password); 
            if(!valid){
                res.status(400).json("wrong password");
                
            }
            else 
                res.status(200).json(user)
        }
        else{
            res.status(400).json("wrong password");
        }
        
    }catch(err){
        res.status(500).json(err)
    }
})
module.exports=router