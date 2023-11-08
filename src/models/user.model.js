'use stric';
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');


const userSchema = new Schema(
    {
        firstName:{type:String,required:true},
        lastName:{type:String,required:true ,unique:true} ,
        email:{type:String,required:true},
        password:{type:String,required:true},
        role:{type:String,enum:['admin','customer'],default:'admin'},
    },
    { timestamps: true },
    {versionKey: false},
);
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password,8);
    }
    next();
});
module.exports =mongoose.model('User', userSchema,'users');

