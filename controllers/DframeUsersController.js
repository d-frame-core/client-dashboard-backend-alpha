const mongoose = require('mongoose');
const DframeUser = require('../models/DframeUserModel');
require('dotenv').config()

//Get all detail
const getUser = async (req, res) => {
    try {
        const foundUser = await DframeUser.find()
        console.log("checking for user")

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
   DframeUser.findById(clientId)
      .then(foundUser => {
        if (foundUser) {
            res.status(200).json(foundUser);
        } else {
         res.status(200).json("No User Found");
       }
    }) 
      .catch(err => {
        res.status(500).json({ message: "Error Occured" });
      });
        
  }

const updateUser = (req, res) => {
    try {
        DframeUser.updateOne(
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
        DframeUser.deleteOne({userId: req.params.id}, (err) => {
            if(!err) {
                res.status(200).json("Deleted Successfully");
            }
        })
    }
    catch (err) {
        res.status(500).json({message: "ERROR Occured", error: err})
    }
}


  const adminUpdateUser = (req, res) => {
    try {
        DframeUser.updateOne(
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
            updateUser,
            deleteUser,
            adminUpdateUser
            };



