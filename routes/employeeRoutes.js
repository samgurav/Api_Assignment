// import { getdata, postdata, updatedata, deletedata } from '../controller/empController'
const { check, validationResult } = require('express-validator');
const {postdata,getdata, deletedata,updatedata}=require('../controller/empController')
const express=require('express')
const jwt = require('jsonwebtoken')
const jwtSecret='samikshagurav'
const router = express.Router()
const userData=require('../db/employessSchema')
function autenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
    if (token == null) {
        res.json({ "err": 1, "msg": "Token not match" })
    }
    else {
        jwt.verify(token, jwtSecret, (err, data) => {
            if (err) {
                res.json({ "err": 1, "msg": "Token incorrect" })
            }
            else {
                console.log("Match")
                next();
            }
        })
    }
}

router.get('/getdata', async(req,res)=>{
        res.send(await getdata())

})

router.post('/postdata',autenticateToken,[
    check('email', 'Email length should be 10 to 30 characters')
                    .isEmail().isLength({ min: 10, max: 30 }),
    check('name', 'Name length should be 10 to 20 characters')
                    .isLength({ min: 5, max: 20 }),
    check('mobile', 'Mobile number should contains 10 digits')
                    .isLength({ min: 10, max: 10 }),
   
], (req, res) => {
    
     const errors = validationResult(req);
 
   
     if (!errors.isEmpty()) {
         res.json(errors)
     }
  
    
     else {
         res.send("Successfully validated")
         postdata(req.body)
     }


//    postdata(req.body)
//    res.json('data posted')
    
})
router.post('/login',[check('name').isLength({min:3}),check('email').isEmail()],
    (req,res)=>{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(422).json({errors:errors.array()})
        }
        let name = req.body.name;
        let email = req.body.email;
        userData.findOne({name:name,email:email},(err,data)=>{
            if(err){
                res.json({"err":1,"msg":"Username is not correct"})
            }
            else if(data == null){
                res.json({"err":1,"msg":"Username is not correct"})
            }
            else{
                let payload = {
                    uid:name
                }
                const token = jwt.sign(payload,jwtSecret,{expiresIn:360000})
                res.json({"err":0,"msg":"Login Success","token":token})
            }
        })
    })
router.post('/updatedata/:email', (req,res)=>{
    let name=req.body.name;
    let email=req.body.email;
    let mobile=req.body.mobile;
    let city=req.body.city;
    let empcode=req.body.empcode;
    let empdata= ({name:name,email:email,mobile:mobile,city:city,empcode:empcode});
    updatedata(empdata,req.params.email)
    res.send('data updated')
});
router.delete('/deletedata/:email',(req,res)=>{
    deletedata(req.params.email,req.body)
    res.send("data deleted")
} );

module.exports=router;