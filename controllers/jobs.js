const Job = require('../models/Job');
const {StatusCodes}= require('http-status-codes');
const {BadRequestError, NotFoundError}= require('../errors');


const getAllJobs= async(req,res)=>{
    const {userId}= req.user;
    const jobs= await Job.find({createdBy:userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count: jobs.length});
}

const getJob= async(req,res)=>{
    const {id} = req.params;
    const {userId}= req.user;
    const job= await Job.findOne({_id:id, createdBy:userId});
    if(!job){
        throw new NotFoundError(`No job with id ${id}`)
    }
    res.status(StatusCodes.OK).json(job); 
}
const createJob= async(req,res)=>{
    // res.json(req.user) //Note that the req.user was set from the token in the authetication middleware
    // req.body.createdBy=req.user.userId;
    const {userId}= req.user;
    const body= {...req.body, createdBy:userId}
    const job= await Job.create(body);
    res.status(StatusCodes.CREATED).json({job});
}
const updateJob= async(req,res)=>{
    const {id} = req.params;
    const {userId}= req.user;
    const {company, position}= req.body
    if(company===''|| position===''){
        throw new BadRequestError('Company or Position not provided');
    };
    const job= await Job.findOneAndUpdate({_id:id, createdBy:userId},req.body, {new:true, runValidators:true});

    if(!job){
        throw new NotFoundError(`No job with id ${id}`);
    }
    res.status(StatusCodes.OK).json('Job successfully updated');
}
const deleteJob= async(req,res)=>{
    const {id} = req.params;
    const {userId}= req.user;
    const job= await Job.findOneAndRemove({_id:id, createdBy:userId});
    if(!job){
        throw new NotFoundError(`No job with id ${id}`);
    }
    res.status(StatusCodes.OK).json('Job successfully Deleted');
}

module.exports={
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob

};