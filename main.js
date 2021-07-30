const tasksString = localStorage.getItem("tasks");
let tasks = tasksString ? JSON.parse(tasksString) : [];
const input = document.querySelector("input");
const containers = document.querySelectorAll(".status-cont");
const addBtn = document.getElementById("addBtn");
let btnAction = "add";
let modifiedTask;

const addToContainer = (text, id, contId) => {
  const taskCont = document.createElement("div");
  document.getElementById(contId).appendChild(taskCont);
  taskCont.className = "task";
  taskCont.id = id;
  taskCont.setAttribute("draggable", "true");
  taskCont.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text", id);
  });
  const taskTxt = document.createElement("p");
  taskCont.appendChild(taskTxt);
  taskTxt.textContent = text;
  const icons = document.createElement("div");
  taskCont.appendChild(icons);
  const editIcon = document.createElement("i");
  icons.appendChild(editIcon);
  editIcon.className = "fas fa-edit";
  editIcon.addEventListener("click", () => {
    handleEditIcon(text, id);
  });
  const delIcon = document.createElement("i");
  icons.appendChild(delIcon);
  delIcon.className = "fas fa-trash";
  delIcon.addEventListener("click", () => {
    handleDeleteIcon(id);
  });
};

const addTask = (text) => {
  const uniqId =
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  tasks.push({
    id: uniqId,
    name: text,
    status: "inProgress",
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  addToContainer(text, uniqId, "inProgress");
};

const updateTask = () => {
  tasks = tasks.map((task) => {
    return task.id === modifiedTask ? { ...task, name: input.value } : task;
  });
  document.querySelector(`#${modifiedTask} > p`).textContent = input.value;
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const handleEditIcon = (text, id) => {
  input.value = text;
  addBtn.textContent = "Update";
  btnAction = "update";
  modifiedTask = id;
};

const handleDeleteIcon = (id) => {
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById(id).remove();
};

const dragoverFunction = (e) => {
  e.preventDefault();
};

const dropFunction = (e) => {
  const containerId = e.target.id;
  const dataId = e.dataTransfer.getData("text");
  document.getElementById(containerId).append(document.getElementById(dataId));
  const index = tasks.findIndex((item) => item.id === dataId);
  tasks[index].status = containerId;
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const deleteTasks = () => {
  localStorage.removeItem("tasks");
  document.querySelectorAll(".task").forEach((item) => item.remove());
};

tasks.length &&
  tasks.forEach((task) => addToContainer(task.name, task.id, task.status));

containers.forEach((item) => {
  item.addEventListener("dragover", dragoverFunction);
  item.addEventListener("drop", dropFunction);
});

const handleAddBtn = () => {
  input.value && btnAction === "add" && addTask(input.value);
  input.value && btnAction === "update" && updateTask(input.value);
  btnAction = "add";
  addBtn.textContent = "Add";
  input.value = "";
};

addBtn.addEventListener("click", handleAddBtn);

document.getElementById("clearBtn").addEventListener("click", deleteTasks);
