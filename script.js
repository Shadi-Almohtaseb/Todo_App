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
  }
};

btn.addEventListener("click", addNewTask);
