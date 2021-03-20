const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
    },
    init_token:{
        type: String,
        required: true,
    },
    
    user_data:[{
        filename:{
            type: String,
        },
        major_data:{
            type: String,
        }
    }]
},{
    timestamps: true
})


const Data = mongoose.model('Data',userSchema)

module.exports = Data;
