const router = require('express').Router();
const validateLoginInput = require('../validation/validate_log_in');
const validateRegistrationInput = require('../validation/validate_registration');
const jwt = require("jsonwebtoken");
let users = require('../models/users.model');
const keys = require("../keys")
router.route('/register').post((req,res)=>{
    const {errors, isValid} = validateRegistrationInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    users.findOne({email:req.body.email}).then(user=>{
        if(user){
            return res.status(400).json({email:"Email already exists"});
        }
        else{
            const new_user = new users({
                email:req.body.email,
                password:req.body.password,
                events:[]
            });
            new_user.save().then(user=>res.json(user))
            .catch(err=>console.log(err));
        }
    })
});

router.route("/login").post((req,res)=>{
    const {errors,isValid} = validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    users.findOne({email}).then(user=>{
        if(!user){
            return res.status(404).json({email_not_found:"Email not found"});
        }
        else{
            if(password === user.password){
                const payload = {
                    id:user.id,
                    name:user.name
                };
                jwt.sign(payload,
                    keys.secretOrKey,{
                        expiresIn:31556926
                    },
                    (err, token)=>{
                        res.json({
                            success:true,
                            token:"Bearer " +token
                        });
                    }
                );
            }
            else{
                return res.status(400).json({password_incorrect:"Password incorrect"});
            }
        }
    })
});
router.route("/test").get((req,res)=>{
    res.json("hello")
    return "Hello";
})
module.exports = router;