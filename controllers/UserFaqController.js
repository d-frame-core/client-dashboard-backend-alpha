const FAQUser = require('../models/FaqModelUser');

const questions = [
  {
    question: 'Where is D Frame Registered?',
    answer: 'The D Frame Foundation is registered in the Hague, Netherlands.'
  },
  {
    question: 'What is D Frame?',
    answer: 'D Frame is a decentralised data ecosystem to FAQ people monetise their personal data with privacy, support businesses with dynamic value laden data and encourage developers to build for re-imagining the data ecosystem. Using Blockchain based smart contracts for trust and a D Frame token for value generation & distribution, the ecosystem aspires to be a community driven sustainable effort.'
  },
  {
    question: 'What is Ad Frame?',
    answer: 'Ad Frame is an advertising platform built on D Frame, to FAQ clients target users better. Through advanced functionalities like real time target audience analytics with matching interests and a general willingness to watch ads from the users, we hope for significantly higher Click Through Rates (CTR) through Ad Frame.'
  },
  {
    question: 'How many users does D Frame have?',
    answer: 'Currently, D Frame is at the prototype stage. Further, we would plan for an Alpha release for 50,000 to 100,000 users. Long term, a user base of atleast 10 million plus users is targeted.'
  },
  {
    question: 'How many Clients use D Frame? How can Clients be successful on D Frame?',
    answer: 'Currently, D Frame is at the Prototype stage and we do not have active partnership with any client. However, we are pursuing partnerships with some of the largest Advertising firms in the world.'
  },
  {
    question: 'How does D Frame compare to other Advertising platforms?',
    answer: 'D Frame shows an active data pool size of all the relevant users. Further, User\'s are willing to view advertisements for making passive income for sharing their data. Finally, we would be working on integration with different metaverse platforms.'
  },
  {
    question: 'How much money do users make?',
    answer: 'Currently, we hope to atleast share 50% of the revenue generated directly with the users. Based on community feedback and stakeholder dynamics, these numbers will evolve.'
  }
];

exports.createFAQUser = async (req, res) => {
  try {
    await FAQUser.insertMany(questions);
    res.status(201).json({ message: 'FAQs created successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create FAQs.' });
  }
};
exports.getAllFAQUsers = async (req, res) => {
    try {
      const faqs = await FAQUser.find();
      res.status(200).json(faqs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  // Get a FAQ by its ID
exports.getFAQUserById = async (req, res) => {
    try {
      const faq = await FAQUser.findById(req.params.id);
      if (!faq) {
        return res.status(404).json({ error: 'FAQ not found' });
      }
      res.json(faq);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };

  //admin
  exports.updateFAQUserById = async (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
  
    try {
      const updatedFAQUser = await FAQUser.findByIdAndUpdate(
        id,
        { question, answer },
        { new: true }
      );
  
      if (!updatedFAQUser) {
        return res.status(404).json({ error: 'FAQ not found' });
      }
  
      res.json(updatedFAQUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };

  exports.deleteSingleFAQUser = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedFAQ = await FAQUser.findByIdAndDelete(id);
      
      if (!deletedFAQ) {
        return res.status(404).json({ message: "FAQ Section not found!" });
      }
  
      res.json({ message: "Survey deleted successfully!", deletedFAQ });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };