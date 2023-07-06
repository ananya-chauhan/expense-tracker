const getUser = require('../utils/getUser');

// Get all transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const ip = req.ip; //  req.ip gives the IP address of the user
    const { user } = await getUser(ip);

    return res.status(200).json({
      success: true,
      count: user.transactions.length,
      data: user.transactions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// Add transaction
exports.addTransaction = async (req, res, next) => {
  try {
    const ip = req.ip; 
    const { user, addTransaction } = await getUser(ip);

    const { text, amount } = req.body;
    const transaction = { text, amount, createdAt: new Date() };

    await addTransaction(transaction);

    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const ip = req.ip; 
    const { user, deleteTransaction } = await getUser(ip);

    const transactionId = req.params.id;

    await deleteTransaction(transactionId);

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};
