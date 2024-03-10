import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC-CawdL0jeKqQnb13sr5W7NYidLX-Lmag",
    authDomain: "expense-tracker-js.firebaseapp.com",
    databaseURL: "https://expense-tracker-js-default-rtdb.firebaseio.com",
    projectId: "expense-tracker-js",
    storageBucket: "expense-tracker-js.appspot.com",
    messagingSenderId: "715950733323",
    appId: "1:715950733323:web:a7f5d740f7ebf8e25b6f0e",
    measurementId: "G-XZ9KTKV9BQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();


const saveExpense = async (expenseData) => {
    try {
        const docRef = await addDoc(collection(firestore, "expenses"), expenseData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding expense: ", error);
    }
};

const getExpenses = async (userId) => {
    try {
        const expensesSnapshot = await getDocs(query(collection(firestore, "expenses"), where("userId", "==", userId)));
        const expenses = expensesSnapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
        return expenses;
    } catch (error) {
        console.error("Error getting expenses: ", error);
    }
};


async function populateTransactionsFromFirestore() {
    try {
        const userId = auth.currentUser.uid;
        const expenses = await getExpenses(userId);
        trans.length = 0;

        expenses.forEach((expense, index) => {
            trans.push({
                id: index + 1,
                firebaseId: expense.firebaseId,
                name: expense.name,
                amount: expense.amount,
                date: expense.date.toDate(),
                type: expense.type
            });
        });

        renderList();
        updateTotal();
    } catch (error) {
        console.error("Error populating transactions from Firestore: ", error);
    }
}

function handleAuthStateChange(user) {
    if (user) {
        populateTransactionsFromFirestore();
    } else {
        console.error("Error populating transactions from Firestore: User is not authenticated");
    }
}

auth.onAuthStateChanged(handleAuthStateChange);


const trans = [];


const list = document.getElementById('transcationList');
const form = document.getElementById('transactionForm');
const status = document.getElementById('status');
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');

form.addEventListener("submit", addTransaction);


const formatter = new Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "INR",
    signDisplay: "always"
});


function updateTotal() {
    const incomeTotal = trans.filter(trx => trx.type === 'credit').reduce((total, trx) => total + trx.amount, 0);
    const expenseTotal = trans.filter(trx => trx.type === 'expense').reduce((total, trx) => total + trx.amount, 0);
    const totalBalance = incomeTotal - expenseTotal;

    balance.textContent = formatter.format(totalBalance);
    income.textContent = formatter.format(incomeTotal);
    expense.textContent = formatter.format(expenseTotal);
}


function addTransaction(event) {
    event.preventDefault();
    const formData = new FormData(this);

    const newTransaction = {
        name: formData.get("name"),
        amount: parseFloat(formData.get("amt")),
        date: new Date(formData.get("date")),
        type: formData.get("type") === 'on' ? "credit" : "expense",
        userId: auth.currentUser.uid,
    };

    saveExpense(newTransaction)
        .then((firebaseId) => {
            trans.push({
                id: trans.length + 1,
                firebaseId: firebaseId,
                name: formData.get("name"),
                amount: parseFloat(formData.get("amt")),
                date: new Date(formData.get("date")),
                type: formData.get("type") === 'on' ? "credit" : "expense",
            });

            form.reset();
            updateTotal();
            renderList();
        })
        .catch((error) => {
            console.error("Error adding transaction: ", error);
        });
}


function renderList() {
    list.innerHTML = "";

    if (trans.length === 0) {
        status.textContent = 'No transactions';
        return;
    } else {
        status.textContent = '';
    }

    trans.forEach(({ id, firebaseId, name, amount, date, type }) => {
        const sign = type === 'credit' ? 1 : -1;

        function deleteTransaction(firebaseId) {
            const index = trans.findIndex((trx) => trx.firebaseId === firebaseId);
            const transaction = trans[index];

            deleteDoc(doc(firestore, "expenses", firebaseId))
                .then(() => {
                    console.log("Transaction successfully deleted from Firestore!");
                    trans.splice(index, 1);
                    updateTotal();
                    renderList();
                })
                .catch((error) => {
                    console.error("Error removing transaction from Firestore: ", error);
                });
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="name">
                <h4>${name}</h4>
                <p>${new Date(date).toLocaleDateString()}</p>
            </div>
            <div class="amount ${type}">
                <span>${formatter.format(amount * sign)}</span>
            </div>
            <div class="action">
                <svg xmlns="http://www.w3.org/2000/svg" class="svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
        `;
        list.append(li);

        const deleteIcon = li.querySelector('.svg');
        deleteIcon.addEventListener('click', () => deleteTransaction(firebaseId));
        list.append(li);
    });
}
renderList();


if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(() => {
        console.log("servic worker registered");
    })

}