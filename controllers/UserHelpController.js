const path = require('path'); // Import the path module

const HelpUser = require(path.join(__dirname, '..', 'models', 'HelpmodelUser'));

const HData = [
    {
        title: "Read More",
        text: "Details will be added in due time.",
      },
      {
        title: "Privacy Policy",
        text: "Here will be the Description for the Privacy policy.",
      },
      {
        title: "Support",
        text: "Here will be the Description for the Support.",
      },
      {
        title: "Terms of Service",
        text: "Details will be added in due time.",
      },
    ];
  
  exports.createHelp = async (req, res) => {
    try {
      const HelpUserArray = [];
  
      for (const data of HData) {
        const newHelpUser = new HelpUser(data);
        await newHelpUser.save();
        HelpUserArray.push(newHelpUser);
      }
  
      res.status(201).json(HelpUserArray);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.createSingleHelp = async (req, res) => {
    try {
      // Create a new HelpUser object using the data from the request body
      const newHelpUser = new HelpUser(req.body);
      
      // Save the newHelpUser to the database
      await newHelpUser.save();
      
      res.status(201).json(newHelpUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getAllhelp = async (req, res) => {
    try {
      const helpUser = await HelpUser.find({});
      res.status(200).json(helpUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  //delete All
  exports.delete = async (req, res) => {
    try {
      await HelpUser.deleteMany();
      res.json({ message: " deleted successfully!" });
    } catch (err) { 
      res.status(500).json({ message: err.message });
    }
  };

  //delete single 
  exports.deleteById = async (req, res) => {
    const id = req.params.id;
  
    try {
      const deletedHelpUser = await HelpUser.findByIdAndDelete(id);
  
      if (!deletedHelpUser) {
        return res.status(404).json({ error: "HelpUser not found" });
      }
  
      res.json({ message: "Deleted successfully!" });
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ message: "Internal server error" });
    }
  };

  //single help update
  exports.updateHelp = async (req, res) => {
    console.log(req.body,req.params.id)
    try {
      const helpUser = await HelpUser.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!helpUser) {
        return res.status(404).json({ error: " not found" });
      }
      res.status(200).json(helpUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.gethelpById = async (req, res) => {
    try {
      const helpUser = await HelpUser.findById(req.params.id);
      if (!helpUser) {
        return res.status(404).json({ message: " entry not found" });
      }
      res.status(200).json(helpUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  