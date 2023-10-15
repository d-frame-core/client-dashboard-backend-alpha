const path = require('path'); // Import the path module

const LearnUser = require(path.join(__dirname, '..', 'models', 'LearnModelUser'));


const learnMoreData = [
    {
      title: "Why Advertise on D Frame?",
      text: "Ad frame is an advertising platform built on D Frame, to help clients target users better. Through advanced functionalities like real time target audience analytics with matching interests and a general willingness to watch ads from the users, we hope for significantly higher Click Through Rates (CTR) through AD-frame. This should drastically reduce advertising expenditure for the Clients and help reach the users directly with an ability to offer incentives directly to their wallets. Hence, reliance on Influencers and promotional expenditure can be reduced too. Influencing users not Influences can be a win-win for both client and users but cutting out the middle men.",
    },
    {
      title: "How does campaigns pricing work?",
      text: "The Campaign Pricing is decided via the Data Valuation Engine (DVE). This is discussed in Detail in the White Paper. Through general demand-supply dynamics for certain types of Data determined via tags and actual Ad spent, the pricing is calculated. A base price of different data types is set and further calculations are processed. To be explored in the Alpha version. https://dframe.org/d-frame-white-paper-v1-1/ ",
    },
    {
      title: "What is the reach of our campaigns?",
      text: "Theoretically, the reach of the campaigns would be determined by the user base of D frame. Overtime, through our Projection frame idea of a Real Time Data Analytics Platform for Clients connecting users for their Healthcare, Travel, Finance data etc. we hope for higher quality and quantity of data & users. Ad-frame would benefit from overall user growth of the D frame data ecosystem.",
    },
    {
      title: "How do you pay for a campaign?",
      text: "Payment for the Campaigns would be done via DFT tokens. This is one of the major utlity of the DFT tokens, to get access to user data, with their permission. At the Alpha Release stage, we may decide to offer support for high volume Crypto. tokens like Stablecoins, Bitcoin, Ethereum etc. This is subject to the release and would be decided then.",
    },
  ];
  
  exports.createLearnUser = async (req, res) => {
    try {
      const learnUserArray = [];
  
      for (const data of learnMoreData) {
        const learnUser = new LearnUser(data);
        await learnUser.save();
        learnUserArray.push(learnUser);
      }
  
      res.status(201).json(learnUserArray);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.createSingleLearnUser = async (req, res) => {
    try {
      const { title, text } = req.body; // Assuming your request body contains title and text properties
  
      if (!title || !text) {
        return res.status(400).json({ error: 'Both title and text are required' });
      }
  
      const learnUser = new LearnUser({ title, text });
      await learnUser.save();
  
      res.status(201).json(learnUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getAllLearnUser = async (req, res) => {
    try {
      const learnUser = await LearnUser.find({});
      res.status(200).json(learnUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.deleteLearn = async (req, res) => {
    try {
      await LearnUser.deleteMany();
      res.json({ message: "All Learns deleted successfully!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.deleteSingleLearn = async (req, res) => {
    try {
      const { id } = req.params; // Assuming the ID is provided as a URL parameter
  
      const deletedLearnUser = await LearnUser.findByIdAndRemove(id);
  
      if (!deletedLearnUser) {
        return res.status(404).json({ message: 'LearnUser not found' });
      }
  
      res.json({ message: 'LearnUser deleted successfully!' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.deleteSingle = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedLearn = await LearnUser.findByIdAndDelete(id);
      
      if (!deletedLearn) {
        return res.status(404).json({ message: "Learn not found!" });
      }
  
      res.json({ message: "Learn deleted successfully!", deletedLearn });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.updateLearnUser = async (req, res) => {
    try {
      const learnUser = await LearnUser.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!learnUser) {
        return res.status(404).json({ error: "LearnUser not found" });
      }
      res.status(200).json(learnUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getLearnUserById = async (req, res) => {
    try {
      const learnUser = await LearnUser.findById(req.params.id);
      if (!learnUser) {
        return res.status(404).json({ message: "LearnUser entry not found" });
      }
      res.status(200).json(learnUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  