const {validationResult} = require('express-validator');

const validateFields=(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({msg: errors.errors[0].msg})
    }
    next()
}
module.exports={
    validateFields
}