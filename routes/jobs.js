const express= require('express');
const { getAllJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobs');
const router= express.Router();


// router.post('/', createJob);
// router.get('/', getAllJobs);
// router.get('/:id', getJob);
// router.delete('/:id', deleteJob);
// router.patch('/:id', updateJob);

router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);



module.exports=router;