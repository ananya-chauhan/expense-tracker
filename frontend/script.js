const balance = document.getElementById('Balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

let transactions = [];

async function getTransactions() {
  try {
    const response = await fetch("http://localhost:5001/api/v1/transactions/");
    const responseData = await response.json();
    transactions = responseData.data;
    init();
  } catch (error) {
    console.log('Error:', error);
  }
}

async function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add text and amount');
  } else {
    const transaction = {
      text: text.value,
      amount: +amount.value
    };
    updateBackendTransactions(transaction);

    //transactions.push(transaction);

    //addTransactionDOM(transaction);

    updateValues();
    await getTransactions();

    text.value = '';
    amount.value = '';

    //updateBackendTransactions();
  }
}

async function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.description} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction('${transaction._id}')">x</button>
  `;

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

async function removeTransaction(id) {
  try {
    await fetch(`http://localhost:5001/api/v1/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    transactions = transactions.filter(transaction => transaction._id !== id);
    init();
  } catch (error) {
    console.log('Error:', error);
  }
}

async function updateBackendTransactions(transaction) {
  try {
    await fetch("http://localhost:5001/api/v1/transactions/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });

    transactions.push(transaction);

  } catch (error) {
    console.log('Error:', error);
  }
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

   getTransactions();

form.addEventListener('submit', addTransaction);

