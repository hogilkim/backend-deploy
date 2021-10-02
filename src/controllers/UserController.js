const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken') ;
const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);   
sgMail.setApiKey('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');   
const nodemailer = require('nodemailer')
const {validationResult} = require('express-validator');
const User = require('../models/User');
const _ = require('lodash');


// Custom error handler to get useful error from database errors
const {errorHandler} = require('../helper/dbErrorHandling');



module.exports = {
    async signup(req, res){
        
        try {

            const { email, firstName, lastName, password } = req.body;
            const errors = validationResult(req);
            
            const hashedPassword = await bcrypt.hash(password,12);

            if(!errors.isEmpty()){
                const firstError = errors.array().map(error => error.msg)[0];
                return res.status(422).json({errrors: firstError});
            } else {
                

                const existentUser = await User.findOne({email})

                if(existentUser) {
                    return res.status(400).json({
                        error: "Email is taken"
                    });
                }
                const token = jwt.sign({
                    firstName, 
                    lastName, 
                    email, 
                    password: hashedPassword
                    }, process.env.JWT_ACCOUNT_ACTIVATION,
                    {
                        expiresIn: '15m'
                    }
                )

                const emailData = {
                    from: 'hogilkim@gmail.com',
                    to: email,
                    subject: "Account Activation Link",
                    html:`
                        <h1> 이메일 인증을 위해 링크를 클릭해 주세요 </h1>
                        <a href="http://localhost:3000/user/activate/${token}">활성화하기</a>
                        <hr/>
                        <p> 이 이메일은 개인정보를 포함하고 있습니다. 노출되지 않게 주의해 주세요. 계정이 활성화 되었다면 이메일을 삭제하여 주십시오.</p>
                        <p>localhost:3000</p>
                    `
                }
                
                sgMail.send(emailData)
                .then(()=>{
                    return res.json({
                        message:`Email has been sent to ${email}`
                    });
                }).catch(err=>{
                    return res.status(400).json({
                        errors: errorHandler(err)
                    })
                });
                
                // console.log(email, password, firstName, lastName);
                
                // await sgMail.send(emailData);  
                // return res.json({
                //     message:`Email has been sent to ${email}`
                // });           
              

                
                
    
                // if (!existentUser){
                //     const hashedPassword = await bcrypt.hash(password, 12)
                //     const user = await User.create({
                //         email,
                //         firstName,
                //         lastName,
                //         password: hashedPassword
                //     })
                //     return res.json(user);
                // }
                // return res.status(400).json({
                //     error:
                //     'email already exists! do you want to login instead?'
                // })
            }
        } catch (error) {
            return res.status(400).json({
                errors: errorHandler(error)
            })
        }
    },

    // Activation & save to MongoDB
    async activate(req, res){
        const {token} = req.body;
        if (token){
            jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION,
                (err, decode) => {
                    if(err){
                        return res.status(401).json({
                            error: '시간이 만료되었습니다. 처음부터 다시 회원가입을 진행하여 주십시오.'
                        })
                    }else {
                        const {firstName, lastName, email, password} = jwt.decode(token);
            
                        const user = new User({
                            firstName, lastName, email, password
                        })
            
                        user.save((err, user)=> {
                            if(err){
                                return res.status(401).json({
                                    error: errorHandler(err)
                                })
                            } else {
                                return res.json({
                                    success: true,
                                    message: '회원가입 완료!',
                                    message: user
                                })
                            }
                        })
                    }
                })
        } else {
            return res.json({
                message: '회원가입 오류. 다시 한번 시도하여 주십시오.'
            })
        }
    },


    async login(req, res) {

        const { email, password } = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const firstError = errors.array().map(error=>error.msg)[0];
            return res.status(422).json({
                error: firstError
            })
        } try {
            const existingUser = await User.findOne({email});
            if (!existingUser) return res.satus(404).json({message: "User Does not exist!"});

            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

            if (!isPasswordCorrect) return res.status(404).json({message: "wrong password"})

            const token = jwt.sign({
                email: existingUser.email, 
                id: existingUser._id,
                userType: existingUser.userType
            }, process.env.JWT_SECRET, {expiresIn: "1d"})

            res.status(200).json({user: {
                id : existingUser._id,
                firstName : existingUser.firstName,
                lastName : existingUser.lastName,
                email : existingUser.email,
                userType : existingUser.userType
            }, token});
        
        } catch (error) {
            res.status(500).json({message: "Something Went Wrong: backend UserController.js"})
        }
    },

    async forgetPassword(req, res) {
        const {email} = req.body;
        const errors = validationResult(req);

        console.log(email);

        if(!errors.isEmpty()){
            const firstError = errors.array().map(error => error.msg)[0]
            return res.status(422).json({
                error: firstError
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "No Such User"})
        }
        
        

        //if exists
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_RESET_PASSWORD, {expiresIn: '10m'})

        //send email with this token

        const emailData = {
            from: 'hogilkim@gmail.com',
            to: email,
            subject: "비밀번호 재설정 링크",
            html:`
                <h1> 비밀번호 재설정을 위해 링크를 클릭해 주세요 </h1>
                <a href="http://localhost:3000/user/password/reset/${token}">재설정하기</a>
                <hr/>
                <p> 이 이메일은 개인정보를 포함하고 있습니다. 노출되지 않게 주의해 주세요. 계정이 활성화 되었다면 이메일을 삭제하여 주십시오.</p>
                <p>localhost:3000</p>
            `
        }

        return user.updateOne({resetPasswordLink: token}, function(err, success){
            if(err){
                return res.status(400).json({error: "reset password link error"})
            } else {
                sgMail.send(emailData)
                .then(()=>{
                    return res.json({
                        message:`Email has been sent to ${email}`
                    });
                }).catch(err=>{
                    return res.status(400).json({
                        errors: errorHandler(err)
                    })
                })
            }
        })
    },

    async resetPassword(req, res) {
        const {newPassword, resetPasswordLink} = req.body; 
        console.log(newPassword);

        const errors = validationResult(req);

        if (!errors.isEmpty()){
            const firstError = errors.array().map(error => error.msg)[0];
            return res.status(422).json({
                errors: firstError
            });
        } else {
            if (resetPasswordLink){
                jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded){
                    if(err){
                        return res.status(400).json({
                            error: 'Expired Link. Try Again'
                        });
                    }
                })
            }
            
            const hashedPassword = await bcrypt.hash(newPassword,12);

            await User.findOne({resetPasswordLink},(err, user)=>{
                if(err||!user){
                    return res.status(400).json({ error: 'Something went wrong. Try later' });
                }
                const updatingFields = {password: hashedPassword, resetPasswordLink: ''};

                user = _.assignIn(user, updatingFields);
                user.save((err, result)=>{
                    if (err) return res.status(400).json({error: 'Error while resetting new password'})
                    else return res.status(200).json({message: 'Password Changed'})
                })

            })
        }
        
    }
}