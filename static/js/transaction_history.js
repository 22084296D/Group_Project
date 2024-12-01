document.addEventListener('DOMContentLoaded', function() {
    fetchTransactionHistory();
});

async function fetchTransactionHistory() {
    try {
        const response = await fetch('/transaction/api/transaction-history');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.status === "success") {
            displayTransactionHistory(data.data);
        } else {
            throw new Error(data.message || 'Failed to fetch transaction history');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load transaction history. Please try again later.');
    }
}

function displayTransactionHistory(history) {
    const tableBody = document.getElementById('transactionTableBody');
    tableBody.innerHTML = ''; // 清除现有内容

    history.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.userId}</td>
            <td>${transaction.parkingSpace}</td>
            <td>${new Date(transaction.startTime).toLocaleString()}</td>
            <td>${new Date(transaction.endTime).toLocaleString()}</td>
            <td>$${transaction.totalCost.toFixed(2)}</td>
            <td>${transaction.paymentMethod}</td>
            <td>${transaction.status}</td>
        `;
        tableBody.appendChild(row);
    });
}