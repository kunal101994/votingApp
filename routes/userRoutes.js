const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const {jwtAuthMiddleware, generateToken} = require('./../jwt.js');


// post for save & send
router.post('/signup', async (req, res) => {
    try {
     const data = req.body // Assuming the request body contains the person data
 
     // Create a new User document using the Mongoose model
     const newUser = new User(data);
    
     //save the new user to the database
     const response = await newUser.save();
     console.log('data saved');
     
     const payload = {
      id: response.id,
     }
     console.log(JSON.stringify(payload));
     const token = generateToken(payload);
     console.log("Token id : ", token);

     res.status(200).json({response : response, token: token});
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'Internal Server Error'});
    }
 });

 //login route
 router.post('/login', async(req, res) => {
  try {
    // extract aadharCardNumber and password from request body
    const {aadharCardNumber, password} = req.body;

    // find the user by aadharCardNumber
    const user = await User.findOne({aadharCardNumber: aadharCardNumber});

    // if user does not exist or password does not match, return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: "Invalid username or password"});
    }

    // generate token
    const payload= {
      id: user.id,
    }
    const token = generateToken(payload);
     
    // return token as response
    res.json({token})
  } catch (error) {
    console.error(error);
    res.status(500).json({error : "Internal Server Error"});
  }
 });

 // create  a Profile route
 router.get('/profile', jwtAuthMiddleware, async(req, res) => {
    try {
      const userData = req.user;
      // find person
      const userId = userData.id;
      const user = await Person.findById(userId);
      res.status(200).json({user});
    } catch (error) {
      console.error(error);
      res.status(500).json({error: "Internal Server Error"});
    }
 })

 

 
  router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user; // Extract the id from the token
        const {currentPassword, newPassword} = req.body // extract the current &  new password from request body
         // check the user present or not
         // find the user by userId
         const user = await User.findById(userId);

        //  if password doesnot match , return error
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: "Invalid password"})
        }

        // update the user's password
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({message: "Password Updated"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Invalid Server"});
    }
  })
   
 

  module.exports = router;
  