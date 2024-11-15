const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");

const mockapi = "https://66ec1b3c2b6cf2b89c5d4042.mockapi.io/TodoApp";

document.addEventListener("DOMContentLoaded", loadTodos);

async function loadTodos() {
    try {
        const response = await fetch(mockapi);

        if (!response.ok) {
            throw new Error("Failed to fetch todos");
        }

        const todos = await response.json();
        console.log(response);
        todos.forEach(todo => {
            addTodoToDOM(todo.id, todo.text, todo.completed);
        });
    } catch (error) {
        console.error("Error loading todos: ", error);
    }
}

async function saveTodos(text) {
    try {
        const response = await fetch(mockapi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({text, completed:false})
        });

        if (!response.ok) {
            throw new Error("Failed to save todo");
        }

        const newTodo = await response.json();
        addTodoToDOM(newTodo.id, newTodo.text,newTodo.completed); 
    } catch (error) {
        console.error("Error saving todo: ", error);
    }
}

function addTodo() {
    const taskText = todoInput.value.trim();
    
    if (taskText) {
        saveTodos(taskText);
        todoInput.value = "";
    }
}

function addTodoToDOM(id,text, completed = false) {
    const listItem = document.createElement("li");
    listItem.textContent = text;
    if (completed) {
        listItem.classList.add("completed");
    }
    
    listItem.addEventListener("click", () => {
        listItem.classList.toggle("completed");
        updateTodos(id,listItem.classList.contains("completed"));
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteTodos(id);
        todoList.removeChild(listItem);
    });
    listItem.appendChild(deleteBtn);
    todoList.appendChild(listItem);
}

async function updateTodos(id, completed) {
    try {
        const response = await fetch(`${mockapi}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({completed})
        })

        if (!response.ok) {
            throw new Error("Failed to update todo");
        }
    } catch (error) {
        console.error("Error updating todo: ", error);
    }
}

async function deleteTodos(id) {
    try {
        const response = await fetch(`${mockapi}/${id}`, {
            method: "DELETE"     
        });

        if (!response.ok) {
            throw new Error("Failed to delete todo");
        }
    } catch (error) {
        console.error("Error deleting todo: ", error);
    }
}


addButton.addEventListener("click",addTodo);

todoInput.addEventListener("keypress", (event) => {
    if(event.key === "Enter") {
        addTodo();
    }
});