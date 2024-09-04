type Task = {
  name: string;
  description: string;
  completed: boolean;
};

const taskList: Task[] = [];

const taskNameInput = document.querySelector<HTMLInputElement>("#addTaskName");
const taskDescriptionInput = document.querySelector<HTMLInputElement>(
  "#addTaskDescription"
);
const addTaskBtn = document.querySelector<HTMLButtonElement>("#addTaskBtn");
const error = document.querySelector<HTMLSpanElement>("#error");
const clearTasksBtn = document.querySelector<HTMLButtonElement>("#clearTasksBtn");

// Salva as tarefas da lista em local storage
function saveTasks() {
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

// Carrega as tarefas que estão salvas no local storage para o array e chama o render
function loadTasks() {
  const savedTasks = localStorage.getItem("taskList");
  if (savedTasks) {
    taskList.push(...JSON.parse(savedTasks));
  }
  renderTasks();
}

// Adiciona ao array uma nova tarefa, salva em local storage e chama o render 
function addTaskFunc() {
  if (!taskNameInput || !taskDescriptionInput || !error) {
    return;
  }

  const taskName = taskNameInput.value;
  const taskDescription = taskDescriptionInput.value;

  if (taskName === "") {
    error.style.display = "block";
  } else {
    error.style.display = "none";

    const newTask: Task = {
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
  const taskListContainer = document.querySelector<HTMLDivElement>("#taskList");
  if (!taskListContainer) return;

  taskListContainer.innerHTML = "";

  taskList.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task", "border", "border-1", "rounded");

    const taskNameP = document.createElement("p");
    taskNameP.classList.add("taskName", "m-0");
    taskNameP.textContent = task.name;

    const taskDescriptionP = document.createElement("p");
    taskDescriptionP.classList.add("taskDescription", "m-0");
    taskDescriptionP.textContent = task.description;

    const doneButton = document.createElement("button");
    doneButton.type = "button";
    doneButton.classList.add(
      "btn",
      "btn-outline-success",
      "btn-sm",
      "w-100",
      "mt-1",
      "doneTaskBtn"
    );
    doneButton.textContent = "Concluir tarefa";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add(
      "btn",
      "btn-outline-danger",
      "btn-sm",
      "w-100",
      "mt-1",
      "removeTaskBtn"
    );
    removeButton.textContent = "Remover tarefa";

    if (task.completed) {
      taskDiv.classList.add("finished", "border-success", "bg-success");
      doneButton.style.display = "none";
      removeButton.style.display = "none";

      const completedText = document.createElement("p");
      completedText.textContent = "Tarefa concluída!";
      completedText.classList.add("text-white", "mt-2", "fw-bold");

      taskDiv.append(taskNameP, taskDescriptionP, completedText);
    } else {
      taskDiv.classList.add("border-white");
      taskDiv.append(taskNameP, taskDescriptionP, doneButton, removeButton);
      doneButton.addEventListener("click", (event) => doneTaskFunc(event, index));
    }

    taskListContainer.appendChild(taskDiv);
    removeButton.addEventListener("click", () => removeTaskFunc(index));
  });

  if (taskList.length > 0) {
    clearTasksBtn!.style.display = "block";
  } else {
    clearTasksBtn!.style.display = "none";
  }
}

// Marca uma tarefa como concluida e salva em local storage 
function doneTaskFunc(event: Event, index: number) {
  const button = event.target as HTMLButtonElement;
  const taskDiv = button.closest(".task");

  if (taskDiv && !taskDiv.classList.contains("finished")) {
    taskDiv.classList.remove("border-white");
    taskDiv.classList.add("finished", "border-success", "bg-success");

    taskList[index].completed = true;

    const doneButton = taskDiv.querySelector(
      ".doneTaskBtn"
    ) as HTMLButtonElement;
    const removeButton = taskDiv.querySelector(
      ".removeTaskBtn"
    ) as HTMLButtonElement;

    if (doneButton && removeButton) {
      doneButton.style.opacity = "0";
      removeButton.style.opacity = "0";
    }

    setTimeout(() => {
      doneButton.style.display = "none";
      removeButton.style.display = "none";
    }, 300);

    setTimeout(() => {
      const completedText = document.createElement("p");
      completedText.textContent = "Tarefa concluída!";
      completedText.classList.add("text-white", "mt-2", "fw-bold");
      taskDiv.appendChild(completedText);
    }, 300);

    saveTasks();
  }
}

// Remove uma tarefa do array, salva a modificação em local storage e chama o render
function removeTaskFunc(index: number) {
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
window.addEventListener("load", () => {
  loadTasks();
});

addTaskBtn.addEventListener("click", addTaskFunc);
clearTasksBtn?.addEventListener('click', clearAllTasks)
