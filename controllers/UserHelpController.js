const HelpUser = require('../models/HelpmodelUser');

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
  
  exports.getAllhelp = async (req, res) => {
    try {
      const helpUser = await HelpUser.find({});
      res.status(200).json(helpUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.delete = async (req, res) => {
    try {
      await HelpUser.deleteMany();
      res.json({ message: " deleted successfully!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  exports.updateHelp = async (req, res) => {
    try {
      const HelpUser = await HelpUser.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!HelpUser) {
        return res.status(404).json({ error: " not found" });
      }
      res.status(200).json(HelpUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.gethelpById = async (req, res) => {
    try {
      const HelpUser = await HelpUser.findById(req.params.id);
      if (!HelpUser) {
        return res.status(404).json({ message: " entry not found" });
      }
      res.status(200).json(HelpUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  