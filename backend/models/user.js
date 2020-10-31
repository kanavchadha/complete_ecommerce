import mongoose from 'mongoose';
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cart: {
        items: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            qty: { type: Number, default: 1, required: true }
        }]
    },
    isAdmin: {type: Boolean, required: true, default: false}
})

// hashing a password
userSchema.pre('save',async function(next){ 
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
})

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email: email});
    if(!user){
        throw new Error('Unable to Login!');
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error('Wrong Password!');
    }
    return user;
}


const User = mongoose.model('User',userSchema);

export default User;    