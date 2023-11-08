const Joi =require('joi');
const Movie = require('../models/movie.model');
const ApiError = require('../utils/ApiError');

exports.all = async (req,res,next) =>{
    try {
        const data = await Movie.find().sort({createdAt:-1});
        return res.status(200).send({ statusCode: 200, success: true, message: '',result:data});        
    } catch (error) {
        next(error);
    }
}
exports.create = async (req,res,next) =>{
    try {
        const {user} = req;
        if (user.role!='admin') return res.status(400).send({ statusCode: 400, success: false, message: "Access dennieds ! Only admin"});
        const JoiSchema = Joi.object({
            title: Joi.string().required().label('Title'),
            genre: Joi.string().required().label('Genre'),
            rating: Joi.number().label('rating'),
            streamingLink: Joi.string().label('rating'),

          }).options({ abortEarly: false }).validate(req.body);
        if (JoiSchema.error) return res.status(400).send({ statusCode: 400, success: false, message: JoiSchema.error.details[0].message });
        req.body.userId = user.id;
        const data = await Movie.create(req.body);
        return res.status(201).send({ statusCode: 201, success: true, message: 'Movie is successfully created',result:data});

    } catch (error) {
        next(error);
    }
}
exports.view = async (req,res,next) =>{
    try {
        const data = await Movie.findOne({_id:req.params.id});
        if(!data) throw new ApiError(400,'Movie not found')
        return res.status(200).send({ statusCode: 200, success: true, message: '',result:data});

    } catch (error) {
        next(error);
    }
}
exports.update = async (req,res,next) =>{
    try {
        const {user} = req;
        if (user.role!='admin') return res.status(400).send({ statusCode: 400, success: false, message: "Access dennieds ! Only admin"});
        const JoiSchema = Joi.object({
            title: Joi.string().required().label('Title'),
            genre: Joi.string().required().label('Genre'),
            rating: Joi.number().label('rating'),
            streamingLink: Joi.string().label('rating'),

          }).options({ abortEarly: false }).validate(req.body);
        if (JoiSchema.error) return res.status(400).send({ statusCode: 400, success: false, message: JoiSchema.error.details[0].message });
        req.body.userId = user.id;
        const data = await Movie.findOneAndUpdate({_id:req.params.id},req.body);
        if(!data) throw new ApiError(400,'Movie not found')
        return res.status(200).send({ statusCode: 200, success: true, message: 'Movie is successfully updated',result:data});
    } catch (error) {
        next(error);
    }
}
exports.destroy = async (req,res,next) =>{
    try {
        const {user} = req;
        if (user.role!='admin') return res.status(400).send({ statusCode: 400, success: false, message: "Access dennieds ! Only admin"});
        const data = await Movie.findByIdAndDelete(req.params.id);
        if(!data) throw new ApiError(400,'Movie not found')
        return res.status(200).send({ statusCode: 200, success: true, message: ''});
    } catch (error) {
        next(error);
    }
}
exports.search = async (req,res,next) =>{
    try {
        const { q } = req.query;
        const findObj ={
            $or:[
                {'title': { $regex: q, $options: 'i' }},
                {'genere':{ $regex: q, $options: 'i' }},
            ]
        }
        const data = await Movie.find(findObj).sort({createdAt:-1});
        if(data.length<=0) throw new ApiError(400,'Movie not found')
        return res.status(200).send({ statusCode: 200, success: true, message: '',result:data});

    } catch (error) {
        next(error);
    }
}
