const express=require ('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const jwtSecret='abcdefghijklmnopqrstuvwxyz'
const employeeModel = require('../db/EmployeeSchema')
const {getData,updateData,postData,deleteData}=require('../controller/EmployeeController');

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

router.get('/getdata',(req,res)=>{
    res.send(getData());
})
router.post('/login',[body('Name').isLength({min:3}),body('Email').isEmail()],
    (req,res)=>{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(422).json({errors:errors.array()})
        }
        let Name = req.body.Name;
        let Email = req.body.Email;
        employeeModel.findOne({Name:Name,Email:Email},(err,data)=>{
            if(err){
                res.json({"err":1,"msg":"Username is not correct"})
            }
            else if(data == null){
                res.json({"err":1,"msg":"Username is not correct"})
            }
            else{
                let payload = {
                    uid:Name
                }
                const token = jwt.sign(payload,jwtSecret,{expiresIn:360000})
                res.json({"err":0,"msg":"Login Success","token":token})
            }
        })
    })

router.post('/postdata',autenticateToken,
[
    body('Name','Name Should Contains atleast 3 Characters').exists().isLength({ min: 3,max:12 }),
    body('Email','Email is not valid').isEmail().normalizeEmail(),
    body('Address','Address Should Contains atleast 3 Characters').exists().isLength({min:3,max:12}),
    body('Jobprofile','Jobprofile Should Contains atleast 3 Characters').exists().isLength({min:3,max:12}),
    body('Salary','Salary Should be in Numberic').isNumeric()
],(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array() });
    }
    postData(req.body)
    res.send("Data Added")
})
router.delete('/deletedata/:Email',(req,res)=>{
     deleteData(req.params.Email);
    res.send("Data Deleted")
})
router.put('/updatedata/:Email',(req,res)=>{
    updateData(req.params.Email,req.body);
    res.send("Data Updated")
})
module.exports = router;
