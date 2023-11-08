const Joi =require('joi');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const jwt =require('jsonwebtoken');
const moment =require('moment');
const bcrypt = require('bcryptjs');




exports.signup = async (req,res,next) =>{
    try {
        const JoiSchema = Joi.object({
            firstName: Joi.string().required().label('First Name'),
            lastName: Joi.string().required().label('Last Name'),
            email: Joi.string().required().label('Email'),
            password: Joi.string().required().label('Password'),

          }).options({ abortEarly: false }).validate(req.body);

        if (JoiSchema.error) return res.status(400).send({ statusCode: 400, success: false, message: JoiSchema.error.details[0].message });
        if (await User.findOne({email:req.body.email})) throw new ApiError(400,'Email already taken');
        const data = await User.create(req.body);
        return res.status(201).send({ statusCode: 201, success: true, message: 'You are successfull register',result:data});        
    } catch (error) {
        next(error);
    }
}
exports.login = async (req,res,next) =>{
    try {
        const JoiSchema = Joi.object({
            email: Joi.string().required().label('Email'),
            password: Joi.string().required().label('Password'),

          }).options({ abortEarly: false }).validate(req.body);

        if (JoiSchema.error) return res.status(400).send({ statusCode: 400, success: false, message: JoiSchema.error.details[0].message });
        let user = await User.findOne({email:req.body.email});
        if (!user) throw new ApiError(400,'Email is not registed');
        if(!await  bcrypt.compare(req.body.password, user.password))throw new ApiError(400,'Password is incorrect');
        const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
        let tokenPayload={
          sub: {
            id:user._id,
            email:user.email,
            role:user.role,
          },
            iat: moment().unix(),
            exp: accessTokenExpires.unix(),
            type:'ACCESS',
        }
        const token= jwt.sign(tokenPayload, config.jwt.secret);
        delete user.password;

        return res.status(201).send({ statusCode: 201, success: true, message: 'You are successfully register',result:{user,token}});        
    } catch (error) {
        next(error);
    }
}