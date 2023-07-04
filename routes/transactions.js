const express = require('express');
const router = express.Router();
const {getTransactions, addTransaction, deleteTransaction } = require('../controller/transactions'); //destructuring func from controller



router.route('/')
    .get(getTransactions)           //get all trxns 
    .post(addTransaction);          //add trxn

router
    .route('/:id')
    .delete(deleteTransaction);     //delete trxn      

module.exports = router;