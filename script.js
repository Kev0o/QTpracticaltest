document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('tasks');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const statusFilter = document.getElementById('status-filter');

    // Load and render tasks initially
    renderTasks();

    // Handle form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('due-date').value;
        const priority = document.getElementById('priority').value;
        
        if (title && description) {
            addTask(title, description, dueDate, priority);
            taskForm.reset();
        }
    });

    // Add a new task
    function addTask(title, description, dueDate, priority) {
        const tasks = getTasksFromLocalStorage();
        const newTask = {
            id: Date.now(),
            title,
            description,
            dueDate,
            priority,
            status: 'incomplete'
        };
        tasks.push(newTask);
        saveTasksToLocalStorage(tasks);
        renderTasks();
    }

    // Render tasks based on search input and status filter
    function renderTasks() {
        const tasks = getTasksFromLocalStorage();
        const searchQuery = searchInput.value.toLowerCase();
        const status = statusFilter.value;

        taskList.innerHTML = '';
        tasks
            .filter(task => task.title.toLowerCase().includes(searchQuery))
            .filter(task => status === '' || task.status === status)
            .forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.className = task.status === 'complete' ? 'completed' : '';
                taskItem.innerHTML = `
                    <div class="task-details">
                        <strong>${task.title}</strong> - ${task.description} <br>
                        Due: ${task.dueDate} <br>
                        <span class="priority-${task.priority}">Priority: ${capitalize(task.priority)}</span>
                    </div>
                    <div>
                        <button onclick="editTask(${task.id})">Edit</button>
                        <button onclick="toggleStatus(${task.id})">${task.status === 'incomplete' ? 'Complete' : 'Incomplete'}</button>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
    }

    // Capitalize first letter
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Toggle task status
    window.toggleStatus = function(id) {
        const tasks = getTasksFromLocalStorage();
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.status = task.status === 'incomplete' ? 'complete' : 'incomplete';
            saveTasksToLocalStorage(tasks);
            renderTasks();
        }
    };

    // Delete task
    window.deleteTask = function(id) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.id !== id);
        saveTasksToLocalStorage(tasks);
        renderTasks();
    };

    // Edit task
    window.editTask = function(id) {
        const tasks = getTasksFromLocalStorage();
        const task = tasks.find(task => task.id === id);
        if (task) {
            document.getElementById('title').value = task.title;
            document.getElementById('description').value = task.description;
            document.getElementById('due-date').value = task.dueDate;
            document.getElementById('priority').value = task.priority;
            
            taskForm.removeEventListener('submit', handleSubmitNewTask);
            taskForm.addEventListener('submit', function handleSubmit(e) {
                e.preventDefault();
                task.title = document.getElementById('title').value;
                task.description = document.getElementById('description').value;
                task.dueDate = document.getElementById('due-date').value;
                task.priority = document.getElementById('priority').value;
                
                saveTasksToLocalStorage(tasks);
                renderTasks();
                taskForm.reset();
                taskForm.addEventListener('submit', handleSubmitNewTask);
            });
        }
    };

    // Handle form submission for adding new tasks
    function handleSubmitNewTask(e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('due-date').value;
        const priority = document.getElementById('priority').value;

        if (title && description) {
            addTask(title, description, dueDate, priority);
            taskForm.reset();
        }
    }

    // Search button click event
    searchButton.addEventListener('click', () => {
        renderTasks();
    });

    // Status filter change event
    statusFilter.addEventListener('change', () => {
        renderTasks();
    });

    // Get tasks from local storage
    function getTasksFromLocalStorage() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    // Save tasks to local storage
    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
