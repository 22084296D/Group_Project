//Yeung Chin To 22084296D, WANG Haoyu 22102084D
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    setupUserListeners();
});

function setupUserListeners() {
    document.getElementById('search').addEventListener('input', filterUsers);
    document.querySelector('#createUserModal form').addEventListener('submit', createUser);
}

async function loadUsers() {
    try {
        const response = await fetch('/user/all');
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function displayUsers(users) {
    const userList = document.querySelector('.list-group');
    userList.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'list-group-item';
        userElement.innerHTML = `
            <h5>${user.userid}</h5>
            <p>Nickname: ${user.nickname}</p>
            <p>Email: ${user.email}</p>
            <p>Gender: ${user.gender}</p>
            <p>Birthdate: ${user.birthdate}</p>
            <p>Role: ${user.role}</p>
            <button class="btn btn-danger btn-sm float-end delete-user" data-id="${user.userid}">Delete</button>
        `;
        userList.appendChild(userElement);
    });
    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', deleteUser);
    });
}

function filterUsers() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const users = document.querySelectorAll('.list-group-item');
    users.forEach(user => {
        const text = user.textContent.toLowerCase();
        user.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

async function createUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/user/create', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const result = await response.json();
        if (result.success) {
            alert('User created successfully');
            loadUsers();
            // 使用条件检查来关闭模态框
            const modal = document.getElementById('createUserModal');
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                if (bootstrapModal) {
                    bootstrapModal.hide();
                }
            } else {
                // 如果 bootstrap 不可用，尝试使用原生方法隐藏模态框
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
            }
        } else {
            alert('Failed to create user');
        }
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Error creating user');
    }
}

async function deleteUser(e) {
    const userid = e.target.dataset.id;
    if (confirm('Are you sure you want to delete this user?')) {
        e.target.disabled = true; // 禁用按钮
        try {
            const response = await fetch(`/user/delete/${userid}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                alert('User deleted successfully');
                loadUsers();
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        } finally {
            e.target.disabled = false; // 重新启用按钮
        }
    }
}