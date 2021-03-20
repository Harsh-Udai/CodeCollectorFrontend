const jwt = require('jsonwebtoken')
const { prependOnceListener } = require('../models/user')
const User = require('../models/user')

const auth = async(req,res,next)=>{
    try{
        console.log("entered into auth");
        
        const token = req.headers.authorization.replace('Bearer ','')
        //console.log("token",token)
        const decoded = jwt.verify(token,process.env.JWT_TOKEN)
        //console.log("decoded", decoded)

        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})

        //console.log('user',user)
        if(!user){
            throw new Error('Token not found')
        }

        
        req.token = token;
        req.user = user
        next()

    }
    catch(e){
        res.status(400).send({error:'Please Authenticate'})

    }
}

module.exports = auth