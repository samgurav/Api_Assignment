const connectDB=require('./config/db')
const express =require('express');
const PORT=8899;
const app=express();
app.use(express.urlencoded({extended:false}))
const router=require('./routes/employeeRoutes')
app.use('/user',router)
connectDB()
app.listen(PORT,(err)=>{
    if(err) throw err
    console.log("working on 8899")
})