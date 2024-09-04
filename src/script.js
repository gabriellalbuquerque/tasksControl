var taskList = [];
var taskNameInput = document.querySelector("#addTaskName");
var taskDescriptionInput = document.querySelector("#addTaskDescription");
var addTaskBtn = document.querySelector("#addTaskBtn");
var error = document.querySelector("#error");
var clearTasksBtn = document.querySelector("#clearTasksBtn");
// Salva as tarefas da lista em local storage
function saveTasks() {
    localStorage.setItem("taskList", JSON.stringify(taskList));
}
// Carrega as tarefas que estão salvas no local storage para o array e chama o render
function loadTasks() {
    var savedTasks = localStorage.getItem("taskList");
    if (savedTasks) {
        taskList.push.apply(taskList, JSON.parse(savedTasks));
    }
    renderTasks();
}
// Adiciona ao array uma nova tarefa, salva em local storage e chama o render 
function addTaskFunc() {
    if (!taskNameInput || !taskDescriptionInput || !error) {
        return;
    }
    var taskName = taskNameInput.value;
    var taskDescription = taskDescriptionInput.value;
    if (taskName === "") {
        error.style.display = "block";
    }
    else {
        error.style.display = "none";
        var newTask = {
            name: taskName,
            description: taskDescription || "Sem descrição",
            completed: false,
        };
        taskList.push(newTask);
        taskNameInput.value = "";
        taskDescriptionInput.value = "";
        saveTasks();
        renderTasks();
    }
}
// Renderiza na tela as tarefas que estão no array taskList
function renderTasks() {
    var taskListContainer = document.querySelector("#taskList");
    if (!taskListContainer)
        return;
    taskListContainer.innerHTML = "";
    taskList.forEach(function (task, index) {
        var taskDiv = document.createElement("div");
        taskDiv.classList.add("task", "border", "border-1", "rounded");
        var taskNameP = document.createElement("p");
        taskNameP.classList.add("taskName", "m-0");
        taskNameP.textContent = task.name;
        var taskDescriptionP = document.createElement("p");
        taskDescriptionP.classList.add("taskDescription", "m-0");
        taskDescriptionP.textContent = task.description;
        var doneButton = document.createElement("button");
        doneButton.type = "button";
        doneButton.classList.add("btn", "btn-outline-success", "btn-sm", "w-100", "mt-1", "doneTaskBtn");
        doneButton.textContent = "Concluir tarefa";
        var removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.classList.add("btn", "btn-outline-danger", "btn-sm", "w-100", "mt-1", "removeTaskBtn");
        removeButton.textContent = "Remover tarefa";
        if (task.completed) {
            taskDiv.classList.add("finished", "border-success", "bg-success");
            doneButton.style.display = "none";
            removeButton.style.display = "none";
            var completedText = document.createElement("p");
            completedText.textContent = "Tarefa concluída!";
            completedText.classList.add("text-white", "mt-2", "fw-bold");
            taskDiv.append(taskNameP, taskDescriptionP, completedText);
        }
        else {
            taskDiv.classList.add("border-white");
            taskDiv.append(taskNameP, taskDescriptionP, doneButton, removeButton);
            doneButton.addEventListener("click", function (event) { return doneTaskFunc(event, index); });
        }
        taskListContainer.appendChild(taskDiv);
        removeButton.addEventListener("click", function () { return removeTaskFunc(index); });
    });
    if (taskList.length > 0) {
        clearTasksBtn.style.display = "block";
    }
    else {
        clearTasksBtn.style.display = "none";
    }
}
// Marca uma tarefa como concluida e salva em local storage 
function doneTaskFunc(event, index) {
    var button = event.target;
    var taskDiv = button.closest(".task");
    if (taskDiv && !taskDiv.classList.contains("finished")) {
        taskDiv.classList.remove("border-white");
        taskDiv.classList.add("finished", "border-success", "bg-success");
        taskList[index].completed = true;
        var doneButton_1 = taskDiv.querySelector(".doneTaskBtn");
        var removeButton_1 = taskDiv.querySelector(".removeTaskBtn");
        if (doneButton_1 && removeButton_1) {
            doneButton_1.style.opacity = "0";
            removeButton_1.style.opacity = "0";
        }
        setTimeout(function () {
            doneButton_1.style.display = "none";
            removeButton_1.style.display = "none";
        }, 300);
        setTimeout(function () {
            var completedText = document.createElement("p");
            completedText.textContent = "Tarefa concluída!";
            completedText.classList.add("text-white", "mt-2", "fw-bold");
            taskDiv.appendChild(completedText);
        }, 300);
        saveTasks();
    }
}
// Remove uma tarefa do array, salva a modificação em local storage e chama o render
function removeTaskFunc(index) {
    taskList.splice(index, 1);
    saveTasks();
    renderTasks();
}
// Limpa a lista de tarefas, incluindo as concluidas
function clearAllTasks() {
    taskList.length = 0;
    saveTasks();
    renderTasks();
}
// Quando a pagina é carregada, carrega as tarefas que estão salvas no local storage para o array e chama o render
window.addEventListener("load", function () {
    loadTasks();
});
addTaskBtn.addEventListener("click", addTaskFunc);
clearTasksBtn === null || clearTasksBtn === void 0 ? void 0 : clearTasksBtn.addEventListener('click', clearAllTasks);
