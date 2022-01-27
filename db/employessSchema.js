const mongoose=require('mongoose');

const empSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true
     
    },
    email:{
        type:String,
      
        unique:true
    },
    mobile:{
        type:String,
      
    },
    city:{
        type:String,
      
    },
    empcode:{
        type:Number,
      
        
    }

})

module.exports=mongoose.model('employee',empSchema)