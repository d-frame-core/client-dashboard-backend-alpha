const mongoose = require('mongoose');
const path = require('path'); // Import the path module
const DframeUser = require(path.join(__dirname, '..', 'models', 'DframeUserModel'));
require('dotenv').config();

// const sendTokens = async (req, res) => {
//     const { privateKey } = req.body;
//     // Verify and validate the private key (implement your own validation logic here)
  
//     // Fetch the user data from your database based on the private key
//     const user = await User.findOne({ privateKey });
  
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
  
//     // Define the recipient's Ethereum address
//     const recipientAddress = user.ethereumAddress; // Replace with the actual field in your User model
  
//     // Define the amount of GDT tokens to send
//     const amountToSend = 100; // Customize this as needed
  
//     // Convert the amount to wei (assuming your token has 18 decimal places)
//     const amountInWei = toWei(amountToSend.toString());
  
//     // Construct the transaction object for the token transfer
//     const txObject = {
//       from: '0xYourSenderAddress', // The address that will send the tokens
//       to: tokenContractAddress, // The address of the ERC-20 token contract
//       data: tokenContract.methods.transfer(recipientAddress, amountInWei).encodeABI(),
//     };
  
//     // Sign and send the transaction
//     web3.eth.accounts.signTransaction(txObject, '0xYourPrivateKey', (err, { rawTransaction }) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error signing the transaction' });
//       }
  
//       web3.eth.sendSignedTransaction(rawTransaction)
//         .on('receipt', (receipt) => {
//           console.log('Transaction receipt:', receipt);
//           res.json({ message: 'GDT tokens sent to the user' });
//         })
//         .on('error', (error) => {
//           console.error('Transaction error:', error);
//           res.status(500).json({ message: 'Error sending GDT tokens' });
//         });
//     });
//   };
  
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
            adminUpdateUser,
            // sendTokens
            };



