const User = require('../models/UsersModel');

const getUser = async (req, res) => {
    try {
        const foundUser = await User.findOne({userId: req.params.id})
        if(foundUser.length) {
            res.status(200).json(foundUser)
        } else {
            res.status(200).json("No User Found")
        }
    }
    catch (err) {
        res.status(500).json({message: "Error Occured"})
    }
}

const postUser = async (req, res) => {
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        tags: req.body.tags
    })
    try {
        const savedUser = await newUser.save();
        console.log(savedUser);
        res.status(201).json({message: "Post created successfully", id: savedUser._id})
    } catch (err) {
        res.status(500).json({message: "Error Occured"})
    }
}

const updateUser = (req, res) => {
    try {
        User.updateOne(
            {userId: req.params.id},
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

module.exports = {getUser, postUser, updateUser, deleteUser}