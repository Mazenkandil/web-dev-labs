interface ITask {
  id: string;
  text: string;
  completed: boolean;
}

class Task implements ITask {
  constructor(
    public id: string,
    public text: string,
    public completed: boolean = false
  ) {}
}

class TodoApp {
  private tasks: Task[] = [];
  private currentFilter: 'all' | 'active' | 'completed' = 'all';

  private taskInput!: HTMLInputElement;
  private addBtn!: HTMLButtonElement;
  private todoList!: HTMLUListElement;
  private itemsLeftCount!: HTMLElement;
  private filterBtns!: NodeListOf<HTMLButtonElement>;
  private clearCompletedBtn!: HTMLButtonElement;
  private clearAllBtn!: HTMLButtonElement;

  constructor() {
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

  private initializeDOMElements(): void {
    this.taskInput = document.getElementById('taskInput') as HTMLInputElement;
    this.addBtn = document.getElementById('addBtn') as HTMLButtonElement;
    this.todoList = document.getElementById('todoList') as HTMLUListElement;
    this.itemsLeftCount = document.getElementById('itemsLeftCount') as HTMLElement;
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.clearCompletedBtn = document.getElementById('clearCompletedBtn') as HTMLButtonElement;
    this.clearAllBtn = document.getElementById('clearAllBtn') as HTMLButtonElement;
  }

  private attachEventListeners(): void {
    this.addBtn.addEventListener('click', () => this.addTask());
    this.taskInput.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') this.addTask();
    });

    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLButtonElement;
        const filter = target.getAttribute('data-filter') as 'all' | 'active' | 'completed';
        
        this.filterBtns.forEach(b => b.classList.remove('active'));
        target.classList.add('active');
        
        this.currentFilter = filter;
        this.render();
      });
    });

    this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    this.clearAllBtn.addEventListener('click', () => this.clearAll());
  }

  private addTask(): void {
    const text = this.taskInput.value.trim();
    if (!text) return;

    const newTask = new Task(Date.now().toString(), text, false);
    
    this.tasks = [...this.tasks, newTask];
    
    this.taskInput.value = '';
    this.render();
  }

  private toggleTask(id: string): void {
    this.tasks = this.tasks.map(task => 
      task.id === id ? new Task(task.id, task.text, !task.completed) : task
    );
    this.render();
  }

  private deleteTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.render();
  }

  private clearCompleted(): void {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.render();
  }

  private clearAll(): void {
    this.tasks = [];
    this.render();
  }

  private startEditing(id: string, textSpan: HTMLElement, li: HTMLLIElement): void {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

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
      } else {
        this.deleteTask(id);
      }
      this.render();
    };

    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') saveEdit();
      if (e.key === 'Escape') this.render();
    });

    input.addEventListener('blur', () => saveEdit());
  }

  private render(): void {
    const visibleTasks = this.tasks.filter(task => {
      if (this.currentFilter === 'active') return !task.completed;
      if (this.currentFilter === 'completed') return task.completed;
      return true;
    });

    this.todoList.innerHTML = '';

    if (visibleTasks.length === 0) {
      this.todoList.innerHTML = `<li class="empty-msg">No tasks available</li>`;
    } else {
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

        const checkbox = li.querySelector('.todo-checkbox') as HTMLInputElement;
        checkbox.addEventListener('change', () => this.toggleTask(id));

        const textSpan = li.querySelector('.todo-text') as HTMLElement;
        textSpan.addEventListener('dblclick', () => this.startEditing(id, textSpan, li));

        const deleteBtn = li.querySelector('.delete-btn') as HTMLButtonElement;
        deleteBtn.addEventListener('click', () => this.deleteTask(id));

        this.todoList.appendChild(li);
      });
    }

    const activeCount = this.tasks.filter(t => !t.completed).length;
    this.itemsLeftCount.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} left`;
  }
}

new TodoApp();