const User = require('../models/User');

async function getUser(ip) {
  try {
    let user = await User.findOne({ ip });
    console.log(user);

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
        console.log("Transaction added successfully");
        return user;
      },
      deleteTransaction: async (transactionId) => {
        user.transactions = user.transactions.filter(
          (transaction) => transaction._id.toString() !== transactionId
        );
        await user.save();
        console.log("Transaction deleted successfully");
        return user;
      },
    };
  } catch (error) {
    throw new Error('Error retrieving user');
  }
}

module.exports = getUser;
