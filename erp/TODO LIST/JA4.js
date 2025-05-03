const todoInput = document.getElementById("todo-input");
const addTodoButton = document.getElementById("add-todo");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const tasksCount = document.getElementById("tasks-count");
const clearCompletedBtn = document.getElementById("clear-completed");

let todos = [];
let draggedItem = null;

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const data = localStorage.getItem("todos");
  todos = data ? JSON.parse(data) : [];
}

function createTodoElement(todo, idx) {
  const li = document.createElement("li");
  li.className = "todo-item" + (todo.completed ? " completed" : "");
  li.draggable = true;
  li.dataset.id = idx;

  // Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos(getCurrentFilter());
  });

  // Task text
  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = todo.text;
  span.contentEditable = true;
  span.addEventListener("blur", () => {
    todo.text = span.textContent.trim();
    saveTodos();
  });
  span.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      span.blur();
    }
  });

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.addEventListener("click", () => {
    todos.splice(idx, 1);
    saveTodos();
    renderTodos(getCurrentFilter());
  });

  // Drag and drop handlers
  li.addEventListener("dragstart", () => {
    draggedItem = li;
    setTimeout(() => li.classList.add("dragging"), 0);
  });

  li.addEventListener("dragend", () => {
    draggedItem = null;
    li.classList.remove("dragging");
  });

  li.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(todoList, e.clientY);
    if (afterElement) {
      todoList.insertBefore(li, afterElement);
    } else {
      todoList.appendChild(li);
    }
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteButton);
  return li;
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".todo-item:not(.dragging)")];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function renderTodos(filter = "all") {
  todoList.innerHTML = "";
  let filtered = todos;
  if (filter === "active") filtered = todos.filter(t => !t.completed);
  if (filter === "completed") filtered = todos.filter(t => t.completed);

  filtered.forEach((todo, idx) => {
    const li = createTodoElement(todo, idx);
    todoList.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  const left = todos.filter(t => !t.completed).length;
  tasksCount.textContent = `${left} task${left !== 1 ? "s" : ""} left`;
}

function getCurrentFilter() {
  const btn = document.querySelector(".filter-btn.active");
  return btn ? btn.dataset.filter : "all";
}

addTodoButton.addEventListener("click", addTaskFromInput);
todoInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTaskFromInput();
});

function addTaskFromInput() {
  const task = todoInput.value.trim();
  if (task) {
    todos.push({ text: task, completed: false });
    saveTodos();
    renderTodos(getCurrentFilter());
    todoInput.value = "";
    todoInput.focus();
  }
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderTodos(btn.dataset.filter);
  });
});

clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos(getCurrentFilter());
});

// Initial load
loadTodos();
renderTodos();
