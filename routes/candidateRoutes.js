const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate.js');
const {jwtAuthMiddleware, generateToken} = require('./../jwt.js');
const User = require('../models/user.js');
const { JsonWebTokenError } = require('jsonwebtoken');


const checkAdminRole = async (userID) => {
  try {
       const user = await User.findById(userID);
       if(user.role === "admin"){
        return true;
       }
  } catch (error) {
    return false;
  }
}


// post for save & send & add a candidate
router.post('/', jwtAuthMiddleware,async (req, res) => {
    try {
      if(! await checkAdminRole(req.user.id))
        return res.status(403).json({message: "user does not have admin role"});
     const data = req.body // Assuming the request body contains the candidate data
 
     // Create a new candidate document using the Mongoose model
     const newCandidate = new Candidate(data);
    
     //save the new user to the database
     const response = await newCandidate.save();
     console.log('data saved');
     
     res.status(200).json({response : response});
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'Internal Server Error'});
    }
 });

  router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
      if(!checkAdminRole(req.user.id))
        return res.status(403).json({message: "user does not have admin role"});

      const candidateID = req.params.candidateID; // Extract the id from the URL parameter
      const updatedCandidateData = req.body; // updated data for the person
      const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
          new: true, // return the updated document
          runValidators: true, // Run mongoose validation
      })

      if(!response) {
          return res.status(404).json({error : "Candidate not found"});
      }
      console.log('Candidate data updated');
      res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Invalid Server"});
    }
  })
   
  router.delete('/:candidateID',jwtAuthMiddleware,  async (req, res) => {
    try {
      if(!checkAdminRole(req.user.id))
        return res.status(403).json({message: "user does not have admin role"});

      const candidateID = req.params.candidateID; // Extract the id from the URL parameter
      const response = await Candidate.findByIdAndDelete(candidateID);

      if(!response) {
          return res.status(404).json({error : "Candidate not found"});
      }
      console.log('Candidate deleted');
      res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Invalid Server"});
    }
  })
 

  // lets start voting
  router.post('/vote/:candidateID', jwtAuthMiddleware, async(req, res) => {
      // no admin can vote
      // user can only vote once

      candidateID = req.params.candidateID;
      userID = req.user.id;

      try {
        const candidate = await Candidate.findById(candidateID);
        if(!candidate) {
          return res.status(400).json({message: "candidate not found"});
        }
        // check user
        const user = await user.findById(userId);
        if(!user) {
          return res.status(404).json({message: "user not found"});
        }
     
      if(user.isVoted){
        res.status(400).json({message: "You have already voted"});
      }
 
      if(user.role === "admin"){
        res.status(403).json({message: "admin is not allowed" })
      }

  // update the candidate document to record the vote
  candidate.votes.push({user: userId});
  candidate.voteCount++;
  await candidate.save();

  //update the user document
  user.isVoted = true
  await user.save();

  res.status(200).json({message: "Vote recorded successfully"});
      } catch (error) {
      console.log(error);
      res.status(500).json({error: "Internal Server Error"});
}
  })

  // votecount
  router.get('/vote/count', async (req, res) => {
    try {
      // find all candidates and sort them by voteCount in desending order
      const candidate = await Candidate.find().sort({voteCount: 'desc'});

      // Map the candidate to only return their name and voteCount
      const voteRecord = candidate.map((data) => {
        return {
          party: data.party,
          count: data.voteCount
        }
      });

      return res.status(200).json(voteRecord);
      
    } catch (error) {
      console.log(error);
      res.status(500).json({error: "Internal Server Error"});
    }
  })

router.get('/candidate', async(req, res) => {
  try {
      // list of candidates
  } catch (error) {
    
  }
})

  module.exports = router;
  