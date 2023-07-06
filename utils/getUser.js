const User = require('../models/User');

async function getUser(ip) {
    try {
      let user = await User.findOne({ ip });
  
      if (!user) {
        user = new User({
          ip,
          transactions: [],
        });
        await user.save();
      }
  
      return {
        user,
        addTransaction: async (transaction) => {
          user.transactions.push(transaction);
          await user.save();
        },
        deleteTransaction: async (transactionId) => {
          user.transactions = user.transactions.filter(
            (transaction) => transaction._id !== transactionId
          );
          await user.save();
        },
      };
    } catch (error) {
      throw new Error('Error retrieving user');
    }
  }
  
  module.exports = getUser;
  