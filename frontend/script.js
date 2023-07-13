const balance = document.getElementById('Balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const socket = io.connect('http://172.16.55.48:5001');// Initialize WebSocket connection

let transactions = [];

function requestTransactions() {
  socket.emit('getTransactions');
}
requestTransactions();

socket.on('transaction', (transaction) => {
  try {
    const responseData = transaction;
    transactions = responseData.data;
    init();
  } catch (error) {
    console.log('Error:', error);
  }
})


function addTransaction(e) {
    e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add text and amount');
  } else {
    const transaction = {
      description: text.value,
      amount: +amount.value
    };
    socket.emit('addTransaction', transaction);

    text.value = '';
    amount.value = '';
  }
}
// listener for receiving transaction data from the server
socket.on('addedTransaction', (transaction) => {
  console.log(transaction);
  transactions.push(transaction);
  
  updateValues();
  requestTransactions();
});

function removeTransaction(id) {
  try {
    socket.emit('deleteTransaction', id);
    transactions = transactions.filter(transaction => transaction._id !== id);
    init();
    const itemToRemove = document.querySelector(`#list li[data-id="${id}"]`);
    if (itemToRemove) {
      itemToRemove.remove();
    }
    
    updateValues();
    
  } catch (error) {
    console.log('Error:', error);
  }
}

// Add event listener to handle 'deletedTransaction' event
socket.on('deletedTransaction', (id) => {
  transactions = transactions.filter(transaction => transaction._id !== id);
  const itemToRemove = document.querySelector(`#list li[data-id="${id}"]`);
  if (itemToRemove) {
    itemToRemove.remove();
  }
  // Update any other UI elements if needed
  updateValues();
});

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.description} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction('${transaction._id}')">x</button>
  `;
  item.setAttribute('data-id', transaction._id);
  list.appendChild(item);
}

// Calculates total, income and expenses from transactions array.
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);

  balance.innerText = `Rs.${total}`;
  money_plus.innerText = `Rs.${income}`;
  money_minus.innerText = `Rs.${expense}`;
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

requestTransactions();

// TODO:Implement Keyboard Accessibility

// keep track of index in trxn array
let currentIndex = -1;

// event listener for the "Tab" and "Shift+Tab" keys in the list 
list.addEventListener('keydown', function(event) {
  const transactionItems = Array.from(document.querySelectorAll('#list li'));

  if (event.key === 'Tab' && event.shiftKey) {
    event.preventDefault();

    // Remove the highlight 
    if (currentIndex >= 0 && currentIndex < transactionItems.length) {
      transactionItems[currentIndex].classList.remove('highlight');
    }

    // index of the previous transaction
    currentIndex = (currentIndex - 1 + transactionItems.length) % transactionItems.length;

    // set the highlight & focus to previous transaction
    transactionItems[currentIndex].classList.add('highlight');
    transactionItems[currentIndex].focus();
  } else if (event.key === 'Tab') {
    event.preventDefault();

    //Remove highlight
    if (currentIndex >= 0 && currentIndex < transactionItems.length) {
      transactionItems[currentIndex].classList.remove('highlight');
    }

    // index of the next transaction
    currentIndex = (currentIndex + 1) % transactionItems.length;

    // set the highlight & focus to next transaction 
    transactionItems[currentIndex].classList.add('highlight');
    transactionItems[currentIndex].focus();

    if (currentIndex === transactionItems.length - 1) {
      // Redirect focus to the text field from the last transaction
      text.focus();
    }
   } //else if(event.key === 'Delete') {
  //   event.preventDefault();
  //   const transactionId = event.target.dataset.transactionId;
  //   removeTransaction(transactionId);
  // }
});

// event listener to amount field 
amount.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    addTransaction(event);
  } else if (event.key === 'Tab' && event.shiftKey) {
    event.preventDefault();

    // Redirect focus to the text field from the last transaction
    text.focus();
  }
});

// Add an event listener to the amount field for the "Tab" key press
text.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    amount.focus();
  }
});

form.addEventListener('submit', addTransaction);
