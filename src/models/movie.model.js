'use stric';
const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieschema = new Schema(
    {
        userId:{type: Schema.Types.ObjectId, ref: 'UserId'},
        title:{type:String,required:true},
        genre:{type:String,required:true},
        rating:{type:Number,default:0},
        streamingLink:{type:String,required:true},
    },
    { timestamps: true },
    {versionKey: false},
);
module.exports =mongoose.model('Movie', movieschema,'movies');

