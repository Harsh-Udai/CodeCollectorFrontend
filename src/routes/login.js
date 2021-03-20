const express = require('express');
const router = new express.Router();
const User = require('../models/user')
const Data = require('../models/data')
const {sendWelcomeEmail, cancelEmail, securityM,feedbackMail} = require('../emails/account')
const auth = require('../middleware/auth');
const { findByIdAndUpdate } = require('../models/user');

router.get('/',(req,res)=>{
    res.send("<h1>Hello </h1>")
})

router.post('/users/create',async(req,res)=>{
    const user = new User(req.body);
    
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        securityM(user.email,user.otp)
        res.status(200).send({token})
    }
    catch(e){
        res.status(200).send('Error')
    }
})

router.post('/users/confirm',auth,async(req,res)=>{
    
    const user = req.user

    if(user.otp===req.body.otp){
        const newUser = await User.findByIdAndUpdate({_id:user._id},{'verification': true})
        await newUser.save()
        res.send("Done")
    }
    else{
        res.send("notDone")
    }
})

router.post('/users/login',async(req,res)=>{
    
    const email = req.body.email;
    const password = req.body.password;
    try{
        const user = await User.findByCredentials(email,password);
        if(!user){
            res.send('Error');
        }
        
        res.status(200).send({user:user.name, email: user.email ,token:user.init_token});

    }
    catch(e){
        res.status(200).send('Error')
    }
})

router.post('/users/add',auth,async(req,res)=>{   
    try{
        const user = await User.findById(req.user._id)

        const result = user.user_data.filter((data)=>data.filename===req.body.major.filename)

        console.log("result",result);

        if(result.length > 0){
            
            user.user_data.push({
                filename:req.body.major.filename+new Date(),
                major_data:req.body.major.major_data
            })
            await user.save();
        
            return res.status(200).send(user);
        }

        user.user_data.push(req.body.major)
        await user.save();
        
        res.status(200).send(user);
    }   
    catch(e){
        res.status(400).send(e)
    }
})


router.get('/users/repos',auth,async(req,res)=>{
    
    res.status(200).send(req.user.user_data)
})

router.post('/users/feedback',auth,async(req,res)=>{
    
    try{
        const user = await User.findById(req.user._id)
        
        user.feedback.push(req.body);
        await user.save()
       
        res.status(200).send("done");

    }
    catch(e){
        res.status(400).send(e);
    }

})

router.get('/view/:id',auth,async(req,res)=>{
    const find = req.params.id;
    try{
        const user = await User.findById(req.user._id)
        const result = user.user_data.filter(data=> data.filename==find);
   
        user.user_data.forEach(element => {
            if(element.filename===find){
                element.count+=1;
                return;
            }
        });
        
        await user.save();
        res.status(200).send(result);
    }
    catch(e){
        res.status(200).send("No Data!")
    }
})

router.get('/delete/:id',auth,async(req,res)=>{
    const find = req.params.id;
    try{
        const user = await User.findById(req.user._id)
        const result = user.user_data.filter(data=> data.filename!=find);
        user.user_data = result;
        await user.save();
        res.send("Done");
    }
    catch(e){
        res.send("NotDone")
    }
})

router.post('/users/update/:id',auth,async(req,res)=>{
    const find = req.params.id;
    try{
        const user = await User.findById(req.user._id)
        user.user_data.forEach(element => {
            if(element.filename===find){
                element.filename=req.body.filename;
                element.major_data=req.body.major_data;
                return;
            }
        });
        await user.save()
        res.send("Done");
    }
    catch(e){
        res.send("NotDone")
    }
})

router.post('/users/dataUpdate',auth,async(req,res)=>{
    try{
        const user = await User.findById(req.user._id);
        if(user.password!==req.body.current){
            return res.send('Wrong Current Password')
        }
        else{
            user.password = req.body.newPassword;
        }
        await user.save();
        res.send("Updated");
    }
    catch(e){
        res.status(400).send(e)
    }
})




module.exports = router