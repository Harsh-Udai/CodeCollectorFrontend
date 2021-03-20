const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const otpGen = require('otp-generator')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    init_token:{
        type: String
    },
    otp:{
        type: String,
        trim: true
    },
    verification:{
        type: Boolean
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    user_data:[{
        filename:{
            type: String,
        },
        major_data:{
            type: String,
        },
        count:{
            type: Number,
            default: 0
        }
    }],
    feedback:[{
        data:{
            type: String
        }
    }]
},{
    timestamps: true
})


userSchema.methods.generateAuthToken = async function(){
    const user = this;

    const token = jwt.sign({_id: user._id.toString()},'codecollector')
    const otp = otpGen.generate(6,{upperCase:false})
    
    user.verification=false
    user.otp = otp
    user.init_token = token
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email: email})

    if(!user){
        throw new Error('Unable to login /No user')
    }

    const isMatch = password===(user.password)
    if(!isMatch){
        throw new Error('Unable to login /password issues')
    }

    return user

}


const User = mongoose.model('User',userSchema)

module.exports = User;