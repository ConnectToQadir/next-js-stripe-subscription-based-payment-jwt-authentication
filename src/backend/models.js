import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    stripeCustomerId:{
        type:String,
    },
    isActive:{
        type:Boolean,
        default:false,
        required:true
    },
    subscriptionId:{
        type:String
    }
})

const UsersModel = mongoose.models?.users || mongoose.model("users",userSchema)

export {
    UsersModel
}