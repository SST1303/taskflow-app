const API_URL = '/api';

// Authentication State
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Page Detection
const isDashboard = window.location.pathname.includes('dashboard.html');

// Protect Dashboard Route on Client
if (isDashboard && !token) {
    window.location.href = 'index.html';
}

// AUTHENTICATION LOGIC (index.html)

if (!isDashboard) {
    if (token) {
        window.location.href = 'dashboard.html';
    }

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const authTitle = document.getElementById('auth-title');
    const authMessage = document.getElementById('auth-message');

    function showMessage(msg, isError = false) {
        authMessage.textContent = msg;
        authMessage.className = `message ${isError ? 'error' : 'success'}`;
    }

    showRegisterBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        authTitle.textContent = 'Create an Account';
        authMessage.className = 'message';
    });

    showLoginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        authTitle.textContent = 'Login to TaskFlow';
        authMessage.className = 'message';
    });

    // Handle Login Submit
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Login failed');

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'dashboard.html';
        } catch (err) {
            showMessage(err.message, true);
        }
    });

    // Handle Register Submit
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Registration failed');

            showMessage('Account created successfully! Please login.', false);
            showLoginBtn.click();
        } catch (err) {
            showMessage(err.message, true);
        }
    });
}

// DASHBOARD LOGIC (dashboard.html)

if (isDashboard) {
    const tasksContainer = document.getElementById('tasks-container');
    const userGreeting = document.getElementById('user-greeting');
    const logoutBtn = document.getElementById('logout-btn');
    const openModalBtn = document.getElementById('open-task-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const taskModal = document.getElementById('task-modal');
    const taskForm = document.getElementById('task-form');
    const modalTitle = document.getElementById('modal-title');
    const filterStatus = document.getElementById('filter-status');
    const filterPriority = document.getElementById('filter-priority');
    const dashboardMessage = document.getElementById('dashboard-message');

    if (user && user.name) {
        userGreeting.textContent = `Hello, ${user.name}`;
    }

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // Fetch and Render Tasks
    async function fetchTasks() {
        tasksContainer.innerHTML = '<p>Loading tasks...</p>';
        const status = filterStatus.value;
        const priority = filterPriority.value;

        let queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        if (priority) queryParams.append('priority', priority);

        try {
            const res = await fetch(`${API_URL}/tasks?${queryParams.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401 || res.status === 403) {
                logoutBtn.click();
                return;
            }

            const tasks = await res.json();
            renderTasks(tasks);
        } catch (err) {
            tasksContainer.innerHTML = '<p class="message error">Failed to load tasks.</p>';
        }
    }

    function renderTasks(tasks) {
        if (!tasks.length) {
            tasksContainer.innerHTML = '<p>No tasks found. Click "+ Add Task" to create one.</p>';
            return;
        }

        tasksContainer.innerHTML = tasks.map(task => `
      <div class="task-card priority-${task.priority}">
        <div>
          <div class="task-header">
            <h4 class="task-title">${escapeHtml(task.title)}</h4>
            <span class="badge badge-${task.status}">${task.status}</span>
          </div>
          <p class="task-desc">${task.description ? escapeHtml(task.description) : '<em>No description</em>'}</p>
          <div class="task-meta">
            ${task.due_date ? `Due: ${task.due_date.split('T')[0]}` : ''}
          </div>
        </div>
        <div class="task-actions">
          <button class="btn-small btn-toggle" onclick="toggleTaskStatus(${task.id}, '${task.status}')">
            ${task.status === 'done' ? 'Mark Pending' : 'Mark Done'}
          </button>
          <button class="btn-small btn-edit" onclick='openEditModal(${JSON.stringify(task)})'>Edit</button>
          <button class="btn-small btn-delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      </div>
    `).join('');
    }

    // Modal Handling
    openModalBtn.addEventListener('click', () => {
        taskForm.reset();
        document.getElementById('task-id').value = '';
        modalTitle.textContent = 'Create Task';
        taskModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        taskModal.classList.add('hidden');
    });

    window.openEditModal = (task) => {
        document.getElementById('task-id').value = task.id;
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.description || '';
        document.getElementById('task-status').value = task.status;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-due-date').value = task.due_date ? task.due_date.split('T')[0] : '';

        modalTitle.textContent = 'Edit Task';
        taskModal.classList.remove('hidden');
    };

    // Submit Task (Create or Update)
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskId = document.getElementById('task-id').value;
        const taskData = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-desc').value,
            status: document.getElementById('task-status').value,
            priority: document.getElementById('task-priority').value,
            dueDate: document.getElementById('task-due-date').value || null
        };

        const isEdit = Boolean(taskId);
        const url = isEdit ? `${API_URL}/tasks/${taskId}` : `${API_URL}/tasks`;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskData)
            });

            if (!res.ok) throw new Error('Action failed');

            taskModal.classList.add('hidden');
            fetchTasks();
        } catch (err) {
            alert('Error saving task');
        }
    });

    // Toggle Status
    window.toggleTaskStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
        try {
            await fetch(`${API_URL}/tasks/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: nextStatus })
            });
            fetchTasks();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    // Delete Task
    window.deleteTask = async (id) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            alert('Failed to delete task');
        }
    };

    filterStatus.addEventListener('change', fetchTasks);
    filterPriority.addEventListener('change', fetchTasks);

    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Initial Load
    fetchTasks();
}