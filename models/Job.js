const mongoose= require('mongoose');
const JobSchema= new mongoose.Schema({
    company:{
        type:String,
        required:[true, 'Please provide company name'],
        maxlength:50
    },
    position:{
        type:String,
        required:[true, 'Please provide position'],
        maxlength:200
    },
    staus:{
        type:String,
        enum:['interview', 'declined', 'pending'],
        required:[true, 'Please provide position'],
        default:'pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true, 'Please provide user']
    }
},{timestamps:true});


module.exports= mongoose.model('Jobs', JobSchema)