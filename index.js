"use stict"

const totalBalance = document.querySelector(".total-balance");
const incomeAmount = document.querySelector(".income-amount");
const amountExpended = document.querySelector(".expense-amount");
const transactionContainer = document.querySelector(".transaction-list");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const form = document.getElementById("form");

form.addEventListener("submit", AddExpense)

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function AddExpense(e){
    e.preventDefault();
    let expenseAmount = parseFloat(amount.value);
    let expenseDescription = description.value;
    transactions.push({
        id:Date.now(),
        expenseAmount,
        expenseDescription
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));
    updatedExpenses();
    updateExpenseList();
    form.reset();
}

function updateExpenseList(){
    transactionContainer.textContent = "";
    const reveseExpenses = [...transactions].reverse();

    reveseExpenses.forEach((transaction) =>{
        const transactionElement = createExpensesList(transaction);
        transactionContainer.appendChild(transactionElement);
    });
}

function createExpensesList(transaction){
    let li = document.createElement("li");
    li.classList.add("transaction");
    li.classList.add(transaction.expenseAmount > 0? "income":"expense");
    li.innerHTML = `
    <span>${transaction.expenseDescription}</span>
    <span>${transaction.expenseAmount}
    <button class="delete-btn" onclick=removeTransaction(${transaction.id})>X</button>
    </span>
    `
    return li
}

function updatedExpenses(){
    const total = transactions.reduce((acc, transaction) =>{
        return acc + transaction.expenseAmount;
    }, 0);

    totalBalance.textContent = formatCurrency(total.toFixed(2))
    
    const income = transactions.filter(transaction => transaction.expenseAmount > 0)
    .reduce((acc, item) =>{
        return acc + item.expenseAmount;
    }, 0);

    const expense = transactions.filter(transaction => transaction.expenseAmount < 0)
    .reduce((acc, item) =>{
        return acc + item.expenseAmount;
    }, 0)

    incomeAmount.textContent = formatCurrency(income.toFixed(2))
    amountExpended.textContent = formatCurrency(expense.toFixed(2))
}


function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id != id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updatedExpenses();
    updateExpenseList();
}

function formatCurrency(number){

    return new Intl.NumberFormat("en-US", {
        style:"currency",
        currency:"USD"
    }).format(number);

}

updatedExpenses();
updateExpenseList()