//Yeung Chin To 22084296D, WANG Haoyu 22102084D
document.addEventListener('DOMContentLoaded', function() {
    fetchTransactionHistory();

    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        fetchTransactionHistory();
    });
});


function fetchTransactionHistory() {
    const userId = document.getElementById('userIdSearch').value.trim();
    const spaceId = document.getElementById('spaceIdSearch').value.trim();
    const queryParams = new URLSearchParams();
    if (userId) queryParams.append('userId', userId);
    if (spaceId) queryParams.append('spaceId', spaceId);
    fetch(`/transaction/all?${queryParams.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('transactionTableBody');
            tableBody.innerHTML = '';

            if (data.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="9" class="text-center">No results found</td>';
                tableBody.appendChild(row);
            } else {
                data.forEach(transaction => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${transaction.userId || 'N/A'}</td>
                        <td>${transaction.spaceId || 'N/A'}</td>
                        <td>${transaction.startTime ? new Date(transaction.startTime).toLocaleString() : 'N/A'}</td>
                        <td>${transaction.endTime ? new Date(transaction.endTime).toLocaleString() : 'N/A'}</td>
                        <td>${transaction.totalCost !== undefined ? '$' + transaction.totalCost.toFixed(2) : 
                             (transaction.totalcost !== undefined ? '$' + transaction.totalcost.toFixed(2) : 'N/A')}</td>
                        <td>${transaction.paymentMethod || 'N/A'}</td>
                        <td>${transaction.lastFourDigits || 'N/A'}</td>
                        <td>${transaction.status || transaction.Status || 'N/A'}</td>
                        <td>${transaction.timestamp ? new Date(transaction.timestamp).toLocaleString() : 'N/A'}</td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${transaction._id}">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }
            addDeleteEventListeners();
        })
        .catch(error => {
            console.error('Error fetching transaction history:', error);
        });
}

function addDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const transactionId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this transaction?')) {
                deleteTransaction(transactionId);
            }
        });
    });
}

function deleteTransaction(transactionId) {
    console.log('Deleting transaction with ID:', transactionId);  // 添加这行
    fetch(`/transaction/delete/${transactionId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Transaction deleted successfully');
            fetchTransactionHistory(); // 重新加载交易历史
        } else {
            alert('Failed to delete transaction');
        }
    })
    .catch(error => {
        console.error('Error deleting transaction:', error);
        alert('Error deleting transaction');
    });
}