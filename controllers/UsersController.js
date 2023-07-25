const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/UsersModel');
const AdsModel = require('../models/AdsModel');
require('dotenv').config()

//Get all detail
const getUser = async (req, res) => {
    try {
        const foundUser = await User.find()
        if(foundUser) {
            res.status(200).json(foundUser)
        } else {
            res.status(200).json("No User Found")
        }
    }
    catch (err) {
        res.status(500).json({message: "Error Occured"})
    }
} 
//Get detail by id
const getUserbyid = (req, res) => {
   const clientId = req.params.id
       User.findById(clientId)
      .then(foundUser => {
        if (foundUser) {
            // try {
            //     const clientDetails = AdsModel.find(clientId);
            //     res.status(200).json({
            //         UserData:foundUser,
            //         UserCampaigns:clientDetails
            //     });
            //   } catch (err) {
            //     res.status(500).json({ message: "Error Occured while getting userCampaigns", error: err });
            //   } 
            res.status(200).json(foundUser);
        } else {
         res.status(200).json("No User Found");
       }
    }) 
      .catch(err => {
        res.status(500).json({ message: "Error Occured" });
      });
        
  }
  

const postUser = async (req, res) => {
    console.log(req.body)
    const newUser = new User({
        userId: req.body.userId,
        companyName: req.body.companyName,
        companyType: req.body.companyType,
        companyEmail: req.body.companyEmail,
        companyAddress1: req.body.companyAddress1,
        companyAddress2: req.body.companyAddress2,
        walletAddress: req.body.walletAddress,
        
    })
    try {
        const savedUser = await newUser.save();
        console.log(savedUser);
       
        res.status(201).json({message: "Post created successfully", id: savedUser._id})
    } catch (err) {
        res.status(500).json(err)
    }
}

const updateUser = (req, res) => {
    try {
        User.updateOne(
            {_id: req.params.id},
            {$set: req.body},
            (err) => {
            if(!err) {
                res.status(200).json({message: "Updated Successfully"});
            }
        })
    }
    catch (err) {
        res.status(500).json({message: "Error Occures", error: err})
    }
}

const deleteUser = (req, res) => {
    try {
        User.deleteOne({userId: req.params.id}, (err) => {
            if(!err) {
                res.status(200).json("Deleted Successfully");
            }
        })
    }
    catch (err) {
        res.status(500).json({message: "ERROR Occured", error: err})
    }
}

  
const loginUser = async (req, res) => {
    const walletAddress = req.body.walletAddress;
    try {
        const user = await User.findOne({walletAddress});
        if (user) {
            const token = jwt.sign({userId: user.userId}, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.status(200).json({message: "user exist,login successfully", user, token});
        } else {
            res.status(201).json({message: "No address found please Signup",walletAddress});
        }
    } catch (err) {
        res.status(500).json({message: "Error Occured"})
    }
}

const checkToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.status(403).json({message: "session timeout,please login again"});
            } else {
                req.user = decodedToken;
                // Add a welcome message to the response if the token is valid
                res.status(200).json({message: "Welcome to protected routes"})
                next();
            }
        });
    } else {
        res.status(401).json({message: "Missing authorization header"});
    }
}


const signupUser = async (req, res) => {
    const walletAddress = req.body.walletAddress;
    try {
      const user = await User.findOne({ walletAddress });
      if (user) {
        res.status(200).json({ message: "Address already exists. Login instead." });
      } else {
        const newUser = new User({
          userId: req.body.userId,
          companyName: req.body.companyName,
          companyType: req.body.companyType,
          companyEmail: req.body.companyEmail,
          companyAddress1: req.body.companyAddress1,
          companyAddress2: req.body.companyAddress2,
          walletAddress: req.body.walletAddress
        });
        const savedUser = await newUser.save();
        
        res.status(201).json({
          message: "Signup successful",
          user: savedUser
          
        });
      }
    } catch (err) {
      res.status(500).json({ message: "error occur" });
    }
  };


  const adminUpdateUser = (req, res) => {
    try {
        User.updateOne(
            {_id: req.params.id},
            {$set:{ Status: req.body.status }},
            (err) => {
            if(!err) {
                res.status(200).json({message: "Updated Successfully"});
            }
        })
    }
    catch (err) {
        res.status(500).json({message: "Error Occures", error: err})
    }
}
               
            
            module.exports = {
            getUser,
            getUserbyid,
            postUser,
            updateUser,
            deleteUser,
            loginUser,
            checkToken,
            signupUser,
            adminUpdateUser
            };



