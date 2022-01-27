
const userData=require('../db/employessSchema')

 async function getdata(){

  return await userData.find({});
   
}

async function postdata(data){
    let ins=await new userData(data);
     ins.save((err)=>{
       if(err) throw err
       else{
         
           console.log('data posted')
       }
    })
   
}

 async function updatedata(data,email){
     await userData.updateOne({email:email},{$set:data})
   
}

async function deletedata(email){
    await userData.deleteOne({email:email},(err)=>{
        if(err) throw err 
        console.log('data deleted')
 
    })
   
}

module.exports={postdata,getdata,deletedata,updatedata}