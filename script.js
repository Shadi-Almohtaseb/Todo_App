let TasksList = [];
let btn = document.querySelector(".add");

const addNewTask = () => {
  let taskTitle = document.querySelector(".title");
  let taskMessage = document.querySelector(".message");
  let taskStatus = document.querySelector(".status");

  const titleValue = taskTitle.value;
  const messageValue = taskMessage.value;
  const statusValue = taskStatus.value;

  if (titleValue && messageValue && statusValue) {
    const task = {
      taskTitle: titleValue,
      taskMessage: messageValue,
      taskStatus: statusValue,
    };

    TasksList.push(task);
    localStorage.setItem("tasks", JSON.stringify(TasksList));

    taskTitle.value = "";
    taskMessage.value = "";
    taskStatus.value = "";
  } else {
    alert("some information is missing!");
  }
  getTasks();
};

const getTasks = () => {
  const tasksFromStorage = JSON.parse(localStorage.getItem("tasks"));

  if (tasksFromStorage) {
    TasksList = tasksFromStorage;
    displayTasks();
  }
};

const displayTasks = () => {
  const notStartedContainer = document.getElementById(
    "tasks-container-not-started"
  );
  const inProgressContainer = document.getElementById(
    "tasks-container-in-progress"
  );
  const completedContainer = document.getElementById(
    "tasks-container-completed"
  );
  let notStartedContent = "";
  let inProgressContent = "";
  let completedContent = "";

  TasksList.forEach((task) => {
    const taskHtml = `
          <div class="flex justify-start gap-4 mt-4 items-center py-[13px] border-[1px] border-gray-300 px-3 bg-white shadow-[8px_8px_23px_-7px_rgba(112,112,112,0.75)] rounded-md hover:bg-gray-100 duration-200 cursor-grab">
            <span><p class="text-[1.3rem]">${task.taskTitle}</p></span>
          </div>
        `;

    if (task.taskStatus === "Not Started") {
      notStartedContent += taskHtml;
    } else if (task.taskStatus === "In Progress") {
      inProgressContent += taskHtml;
    } else if (task.taskStatus === "Completed") {
      completedContent += taskHtml;
    }
  });

  notStartedContainer.innerHTML = notStartedContent;
  inProgressContainer.innerHTML = inProgressContent;
  completedContainer.innerHTML = completedContent;
};

btn.addEventListener("click", addNewTask);
document.addEventListener("DOMContentLoaded", getTasks);
