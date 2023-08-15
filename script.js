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
      id: Date.now(),
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
    <div draggable="true" id="${task.id}" class="todo relative group flex justify-between gap-4 mt-4 items-center py-[13px] border-[1px] border-gray-300 px-3 bg-[#f1f1f196] hover:bg-[#2929290e] shadow-[8px_8px_23px_-7px_rgba(112,112,112,0.75)] rounded-md duration-200 cursor-grab">
    <span><p class="text-[1.3rem]">${task.taskTitle}</p></span>
    <span onclick="getTask(${task.id})" data-bs-toggle="modal" data-bs-target="#details" class="dots-icon hidden group-hover:block absolute right-14 bg-[#54545418] rounded-full py-1 px-2 cursor-pointer hover:bg-slate-200">
      <i class="bx bx-dots-horizontal-rounded text-2xl"></i>
    </span>
      <span data-bs-toggle="modal" data-bs-target="#ConfirmDelete" class="hidden group-hover:block absolute right-2 bg-[#54545418] rounded-full py-1 px-2 cursor-pointer hover:bg-slate-200">
        <i class="bx bx-x text-2xl"></i>
      </span>
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

  x();
};

btn.addEventListener("click", addNewTask);
document.addEventListener("DOMContentLoaded", getTasks);

// Show task details

const titleInput = document.querySelector(".title-input");
const statusSelect = document.querySelector(".status-input");
const messageTextarea = document.querySelector(".message-input");
const saveButton = document.querySelector(".save");

let currentEditedTaskId = null;

const getTask = (id) => {
  const deleteBTN = `
    <button class="save btn btn-primary text-lg py-2 px-5"
      data-bs-dismiss="modal"
    >
      Save
    </button>

    <button
        class="bg-red-500 text-white text-lg py-2 px-5 rounded-lg hover:bg-red-600"
        data-bs-dismiss="modal"
        data-bs-toggle="modal"
        data-bs-target="#ConfirmDelete"
        onclick="deleteTask(${id})"
      >
      Delete
    </button>
  `;
  document.querySelector(".modal-btn").innerHTML = deleteBTN;

  const titleInput = document.querySelector(".title-input");
  const statusSelect = document.querySelector(".status-input");
  const messageTextarea = document.querySelector(".message-input");
  const saveButton = document.querySelector(".save");
  const task = TasksList.find((task) => task.id === id);

  if (task) {
    titleInput.value = task.taskTitle;
    statusSelect.value = task.taskStatus;
    messageTextarea.value = task.taskMessage;
    currentEditedTaskId = id;
  }

  saveButton.addEventListener("click", () => {
    if (currentEditedTaskId !== null) {
      const updatedTask = {
        id: currentEditedTaskId,
        taskTitle: titleInput.value,
        taskStatus: statusSelect.value,
        taskMessage: messageTextarea.value,
      };

      const index = TasksList.findIndex(
        (task) => task.id === currentEditedTaskId
      );

      if (index !== -1) {
        TasksList[index] = updatedTask;
        localStorage.setItem("tasks", JSON.stringify(TasksList));
        getTasks();

        currentEditedTaskId = null;
      }
    }
  });
};

// Drag and drop feature

const x = () => {
  const todos = document.querySelectorAll(".todo");
  const columns = document.querySelectorAll(".status");
  let draggableTodo = null;

  const dragStart = (e) => {
    draggableTodo = e.target;
    console.log("entered");
  };

  const dragEnd = () => {
    draggableTodo = null;
  };

  todos.forEach((todo) => {
    todo.addEventListener("dragstart", dragStart);
    todo.addEventListener("dragend", dragEnd);
  });

  const dragEnter = (e) => {
    const column = e.currentTarget;
    column.style.border = "2px dashed #cccd";
    column.style.background = "#ebebeb87";
  };

  const dragLeave = (e) => {
    const column = e.currentTarget;
    column.style.border = "none";
    column.style.background = "none";
  };

  const dragDrop = (e) => {
    e.preventDefault();
    console.log("draggableTodo: ", draggableTodo);

    if (draggableTodo instanceof Node) {
      const newStatus = e.currentTarget.dataset.status;

      const taskId = draggableTodo.getAttribute("id");
      const task = TasksList.find((task) => task.id === Number(taskId));
      if (task) {
        task.taskStatus = newStatus;
        localStorage.setItem("tasks", JSON.stringify(TasksList));
      }

      e.currentTarget.appendChild(draggableTodo);
      e.currentTarget.style.border = "none";
      const column = e.currentTarget;
      column.style.background = "none";
    }
  };

  const dragOver = (e) => {
    e.preventDefault();
    if (e.target.classList.contains("status")) {
      e.dataTransfer.dropEffect = "move";
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  };

  columns.forEach((column) => {
    column.addEventListener("dragover", dragOver);
    column.addEventListener("dragenter", dragEnter);
    column.addEventListener("dragleave", dragLeave);
    column.addEventListener("drop", dragDrop);
  });
};

// Delete Task

const deleteTask = (id) => {
  const deleteBTN = document.querySelector(".delete");
  const deleteModalBody = document.querySelector(".modal-body-delete");

  const task = TasksList.find((item) => item.id === Number(id));
  console.log(task);
  deleteModalBody.innerHTML = `<span class="text-xl ml-3">${task.taskTitle}<span/>`;
  deleteBTN.addEventListener("click", () => {
    const index = TasksList.findIndex((item) => item.id === Number(id));
    TasksList.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(TasksList));
    getTasks();
  });
};
