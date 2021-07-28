var tasksString = localStorage.getItem("tasks");
var tasks = tasksString ? JSON.parse(tasksString) : [];
var input = document.querySelector("input");
var containers = document.querySelectorAll(".status-cont");

const addToContainer = (text, id, contId) => {
  var item = document.createElement("p");
  document.getElementById(contId).appendChild(item);
  item.className = "task";
  item.textContent = text;
  item.id = id;
  item.setAttribute("draggable", "true");
  item.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text", id);
  });
};

const addTask = (text) => {
  var uniqId =
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  tasks.push({
    taskId: uniqId,
    taskName: text,
    status: "inProgress",
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  addToContainer(text, uniqId, "inProgress");
  input.value = "";
};

const dragoverFunction = (e) => {
  e.preventDefault();
};

const dropFunction = (e) => {
  var containerId = e.target.id;
  var dataId = e.dataTransfer.getData("text");
  document.getElementById(containerId).append(document.getElementById(dataId));
  const index = tasks.findIndex((item) => item.taskId === dataId);
  tasks[index].status = containerId;
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const deleteTasks = () => {
  localStorage.removeItem("tasks");
  document.querySelectorAll(".task").forEach((item) => item.remove());
};

tasks.length &&
  tasks.forEach((task) =>
    addToContainer(task.taskName, task.taskId, task.status)
  );

containers.forEach((item) => {
  item.addEventListener("dragover", dragoverFunction);
  item.addEventListener("drop", dropFunction);
});

document.getElementById("addBtn").addEventListener("click", () => {
  input.value && addTask(input.value);
});

document.getElementById("clearBtn").addEventListener("click", deleteTasks);
