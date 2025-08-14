import mongoose from "mongoose";

const userScema = new mongoose.Schema({
    _id:{type:String, required:true},
    name:{type:String, required:true},
    email:{type:String, unique:true, required:true},
    imageUrl:{type:String, required:true},
    cartItems:{type:Object, default:{}},
}, {minimize:false})

const User = mongoose.models.user || mongoose.model("user", userScema);
export default User