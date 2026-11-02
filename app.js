"use strict";
class Task {
    constructor(id, text, completed = false) {
        this.id = id;
        this.text = text;
        this.completed = completed;
    }
}
class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeDOMElements();
            this.attachEventListeners();
            this.tasks = [
                new Task('1', 'See Lecture', false),
                new Task('2', 'Solve assignment', false)
            ];
            this.render();
        });
    }
    initializeDOMElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.itemsLeftCount = document.getElementById('itemsLeftCount');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
    }
    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter')
                this.addTask();
        });
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target;
                const filter = target.getAttribute('data-filter');
                this.filterBtns.forEach(b => b.classList.remove('active'));
                target.classList.add('active');
                this.currentFilter = filter;
                this.render();
            });
        });
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
    }
    addTask() {
        const text = this.taskInput.value.trim();
        if (!text)
            return;
        const newTask = new Task(Date.now().toString(), text, false);
        this.tasks = [...this.tasks, newTask];
        this.taskInput.value = '';
        this.render();
    }
    toggleTask(id) {
        this.tasks = this.tasks.map(task => task.id === id ? new Task(task.id, task.text, !task.completed) : task);
        this.render();
    }
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.render();
    }
    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.render();
    }
    clearAll() {
        this.tasks = [];
        this.render();
    }
    startEditing(id, textSpan, li) {
        const task = this.tasks.find(t => t.id === id);
        if (!task)
            return;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = task.text;
        textSpan.replaceWith(input);
        input.focus();
        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText) {
                this.tasks = this.tasks.map(t => t.id === id ? new Task(t.id, newText, t.completed) : t);
            }
            else {
                this.deleteTask(id);
            }
            this.render();
        };
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter')
                saveEdit();
            if (e.key === 'Escape')
                this.render();
        });
        input.addEventListener('blur', () => saveEdit());
    }
    render() {
        const visibleTasks = this.tasks.filter(task => {
            if (this.currentFilter === 'active')
                return !task.completed;
            if (this.currentFilter === 'completed')
                return task.completed;
            return true;
        });
        this.todoList.innerHTML = '';
        if (visibleTasks.length === 0) {
            this.todoList.innerHTML = `<li class="empty-msg">No tasks available</li>`;
        }
        else {
            visibleTasks.forEach(task => {
                const { id, text, completed } = task;
                const li = document.createElement('li');
                li.className = `todo-item ${completed ? 'completed' : ''}`;
                li.innerHTML = `
          <div class="todo-content">
            <input type="checkbox" class="todo-checkbox" ${completed ? 'checked' : ''}>
            <span class="todo-text">${text}</span>
          </div>
          <button class="delete-btn" title="Delete Task">🗑️</button>
        `;
                const checkbox = li.querySelector('.todo-checkbox');
                checkbox.addEventListener('change', () => this.toggleTask(id));
                const textSpan = li.querySelector('.todo-text');
                textSpan.addEventListener('dblclick', () => this.startEditing(id, textSpan, li));
                const deleteBtn = li.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => this.deleteTask(id));
                this.todoList.appendChild(li);
            });
        }
        const activeCount = this.tasks.filter(t => !t.completed).length;
        this.itemsLeftCount.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} left`;
    }
}
new TodoApp();
