let TasksList = [];
let btn = document.querySelector(".add");

const addNewTask = () => {
  let taskTitle = document.querySelector(".title");
  let taskAuthor = document.querySelector(".author");
  let taskMessage = document.querySelector(".message");
  let taskStatus = document.querySelector(".status");

  const titleValue = taskTitle.value;
  const authorValue = taskAuthor.value;
  const messageValue = taskMessage.value;
  const statusValue = taskStatus.value;

  if (titleValue && messageValue && statusValue && authorValue) {
    const task = {
      id: Date.now(),
      taskTitle: titleValue,
      taskMessage: messageValue,
      taskStatus: statusValue,
      taskAuthor: authorValue,
    };

    TasksList.push(task);
    localStorage.setItem("tasks", JSON.stringify(TasksList));

    taskTitle.value = "";
    taskMessage.value = "";
    taskStatus.value = "";
    taskAuthor.value = "";
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

const displayTasks = (filteredTasks) => {
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

  let notStartedCount = 0;
  let inProgressCount = 0;
  let completedCount = 0;

  if (filteredTasks) {
    filteredTasks.forEach((task) => {
      const taskHtml = `
      <div draggable="true" id="${task.id}" class="todo relative group flex justify-between gap-4 mt-4 items-center py-[13px] border-[1px] border-gray-300 px-3 bg-[#f1f1f196] hover:bg-[#2929290e] shadow-[8px_8px_23px_-7px_rgba(112,112,112,0.75)] rounded-md duration-200 cursor-grab">
      <span><p class="text-[1.3rem]">${task.taskTitle}</p></span>
      <span onclick="getTask(${task.id})" data-bs-toggle="modal" data-bs-target="#details" class="dots-icon hidden group-hover:block absolute right-14 bg-[#54545418] rounded-full py-1 px-2 cursor-pointer hover:bg-slate-200">
        <i class="bx bx-dots-horizontal-rounded text-2xl"></i>
      </span>
        <span onclick="deleteTask(${task.id})" data-bs-toggle="modal" data-bs-target="#ConfirmDelete" class="hidden group-hover:block absolute right-2 bg-[#54545418] rounded-full py-1 px-2 cursor-pointer hover:bg-slate-200">
          <i class="bx bx-x text-2xl"></i>
        </span>
      </div>
      `;

      if (task.taskStatus === "Not Started") {
        notStartedCount++;
        notStartedContent += taskHtml;
      } else if (task.taskStatus === "In Progress") {
        inProgressCount++;
        inProgressContent += taskHtml;
      } else if (task.taskStatus === "Completed") {
        completedCount++;
        completedContent += taskHtml;
      }
    });
  } else {
    TasksList.forEach((task) => {
      const taskHtml = `
    <div draggable="true" id="${task.id}" class="todo relative group flex justify-between gap-4 mt-4 items-center py-[13px] border-[1px] border-gray-300 px-3 bg-[#f1f1f196] hover:bg-[#2929290e] shadow-[8px_8px_23px_-7px_rgba(112,112,112,0.75)] rounded-md duration-200 cursor-grab">
    <span><p class="text-[1.3rem]">${task.taskTitle}</p></span>
    <span onclick="getTask(${task.id})" data-bs-toggle="modal" data-bs-target="#details" class="dots-icon hidden group-hover:block absolute right-14 bg-[#54545418] rounded-full py-1 px-2 cursor-pointer hover:bg-slate-200">
    <i class="bx bx-dots-horizontal-rounded text-2xl"></i>
    </span>
    <span onclick="deleteTask(${task.id})" data-bs-toggle="modal" data-bs-target="#ConfirmDelete" class="hidden group-hover:block absolute right-2 bg-[#54545418] rounded-full py-1 px-2 cursor-pointer hover:bg-slate-200">
    <i class="bx bx-x text-2xl"></i>
    </span>
    </div>
    `;

      if (task.taskStatus === "Not Started") {
        notStartedCount++;
        notStartedContent += taskHtml;
      } else if (task.taskStatus === "In Progress") {
        inProgressCount++;
        inProgressContent += taskHtml;
      } else if (task.taskStatus === "Completed") {
        completedCount++;
        completedContent += taskHtml;
      }
    });
  }

  document.querySelector(
    ".count-not-started"
  ).innerHTML = `<p>${notStartedCount}</p>`;
  document.querySelector(
    ".count-in-progress"
  ).innerHTML = `<p>${inProgressCount}</p>`;
  document.querySelector(
    ".count-completed"
  ).innerHTML = `<p>${completedCount}</p>`;

  notStartedContainer.innerHTML = notStartedContent;
  inProgressContainer.innerHTML = inProgressContent;
  completedContainer.innerHTML = completedContent;

  dragAndDropListener();
};

btn.addEventListener("click", addNewTask);
document.addEventListener("DOMContentLoaded", getTasks);

// Show task details
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
  const authorInput = document.querySelector(".author-input");
  const statusSelect = document.querySelector(".status-input");
  const messageTextarea = document.querySelector(".message-input");
  const saveButton = document.querySelector(".save");
  const task = TasksList.find((task) => task.id === id);

  if (task) {
    titleInput.value = task.taskTitle;
    authorInput.value = task.taskAuthor;
    statusSelect.value = task.taskStatus;
    messageTextarea.value = task.taskMessage;
    currentEditedTaskId = id;
  }

  saveButton.addEventListener("click", () => {
    if (currentEditedTaskId !== null) {
      const updatedTask = {
        id: currentEditedTaskId,
        taskTitle: titleInput.value,
        taskAuthor: authorInput.value,
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

const addBtns = document.querySelectorAll(".add-new");

addBtns.forEach((addBtn) => {
  addBtn.addEventListener("click", () => {
    const notStartedBtn = addBtn.classList.contains("not-started");
    const select = document.querySelector(".select");

    select.innerHTML = `
      <option ${notStartedBtn ? "selected" : ""}>Not Started</option>
      <option ${!notStartedBtn ? "selected" : ""}>In Progress</option>
    `;
  });
});

// Drag and drop feature
const dragAndDropListener = () => {
  const todos = document.querySelectorAll(".todo");
  const columns = document.querySelectorAll(".status");
  let draggableTodo = null;

  const dragStart = (e) => {
    draggableTodo = e.target;
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
      displayTasks();
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
let currentDeleteTaskId = null;

const deleteTask = (id) => {
  const deleteModalBody = document.querySelector(".modal-body-delete");

  const task = TasksList.find((item) => item.id === Number(id));
  deleteModalBody.innerHTML = `<span class="text-xl ml-3">${task.taskTitle}</span>`;

  currentDeleteTaskId = id;
};

const deleteBTN = document.querySelector(".delete");
deleteBTN.addEventListener("click", () => {
  if (currentDeleteTaskId !== null) {
    const index = TasksList.findIndex(
      (item) => item.id === Number(currentDeleteTaskId)
    );
    if (index !== -1) {
      TasksList.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(TasksList));
      getTasks();
    }
    currentDeleteTaskId = null;
  }
});

// search task
const searchTask = () => {
  const searchInput = document.querySelector(".search-input");

  const filteredTasks = TasksList.filter((task) =>
    task.taskTitle
      .toLowerCase()
      .includes(searchInput.value.trim().toLowerCase())
  );
  displayTasks(filteredTasks);
};

const searchInput = document.querySelector(".search-input");
searchInput.addEventListener("input", searchTask);
