const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");

document.addEventListener("DOMContentLoaded", loadTodos);

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach(todo => {
        addTodoToDOM(todo.text, todo.completed);
    });
}

function saveTodos() {
    const todos = [];
    document.querySelectorAll("#todo-list li").forEach(item => {
        todos.push({
            text: item.textContent.replace("Delete","").trim(),
            completed: item.classList.contains("completed")
        });
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo() {
    const taskText = todoInput.value.trim();
    
    if (taskText !== "") {
        addTodoToDOM(taskText);
        saveTodos();
        todoInput.value = "";
    }
}

function addTodoToDOM(text, completed = false) {
    const listItem = document.createElement("li");
    listItem.textContent = text;
    if (completed) {
        listItem.classList.add("completed");
    }
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
        todoList.removeChild(listItem);
        saveTodos();
    });
    listItem.appendChild(deleteBtn);

    listItem.addEventListener("click", () => {
        listItem.classList.toggle("completed");
        saveTodos();
    });

    todoList.appendChild(listItem);
}

addButton.addEventListener("click",addTodo);

todoInput.addEventListener("keypress", (event) => {
    if(event.key === "Enter") {
        addTodo();
    }
});