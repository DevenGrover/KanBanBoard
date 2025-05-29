import React, { useState } from "react";
import "./App.css";

const columns = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

const columnKeys = Object.keys(columns);

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("todo");
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editingTaskId !== null) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                text: taskText,
                deadline: taskDeadline,
                column: selectedColumn,
              }
            : task
        )
      );
      setEditingTaskId(null);
    } else {
      const newTask = {
        id: Date.now().toString(),
        text: taskText,
        deadline: taskDeadline,
        column: selectedColumn,
      };
      setTasks([...tasks, newTask]);
    }
    setTaskText("");
    setTaskDeadline("");
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleEdit = (task) => {
    setTaskText(task.text);
    setTaskDeadline(task.deadline || "");
    setSelectedColumn(task.column);
    setEditingTaskId(task.id);
  };

  const handleMoveForward = (id, currentColumn) => {
    const nextColumn =
      currentColumn === "todo"
        ? "inProgress"
        : currentColumn === "inProgress"
        ? "done"
        : null;
    if (!nextColumn) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, column: nextColumn } : task
      )
    );
  };

  return (
    <div className={`App ${theme}`}>
      <div className="header">
        <h1 className="title">KANBAN BOARD</h1>
        <button onClick={toggleTheme} className="theme-button">
          {theme === "light" ? "🌙 Dark" : "🌞 Light"}
        </button>
      </div>

      <form onSubmit={handleAddOrUpdate} className="task-form">
        <input
          type="text"
          placeholder="Enter task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          required
        />
        <input
          type="date"
          value={taskDeadline}
          onChange={(e) => setTaskDeadline(e.target.value)}
          required={selectedColumn !== "done"}
        />
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
        >
          {columnKeys.map((colKey) => (
            <option key={colKey} value={colKey}>
              {columns[colKey]}
            </option>
          ))}
        </select>
        <button type="submit">{editingTaskId ? "Update" : "Add"}</button>
      </form>

      <div className="board">
        {columnKeys.map((colKey) => (
          <div className="column" key={colKey}>
            <h2>{columns[colKey]}</h2>
            {tasks
              .filter((task) => task.column === colKey)
              .map((task) => {
                const deadlineDate = new Date(task.deadline);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                deadlineDate.setHours(0, 0, 0, 0);

                let deadlineWarning = "";
                if (task.deadline) {
                  if (deadlineDate.getTime() < today.getTime()) {
                    deadlineWarning = "⚠️ Missed Deadline!";
                  } else if (deadlineDate.getTime() === today.getTime()) {
                    deadlineWarning = "⚠️ Today is the Deadline!";
                  }
                }

                return (
                  <div className="card" key={task.id}>
                    <div className="card-header">
                      {(colKey === "todo" || colKey === "inProgress") && (
                        <input
                          type="checkbox"
                          onChange={() => handleMoveForward(task.id, colKey)}
                        />
                      )}
                      <p>{task.text}</p>
                    </div>
                    {task.deadline && (
                      <p className="deadline">Deadline: {task.deadline}</p>
                    )}
                    {deadlineWarning && (
                      <p className="warning">{deadlineWarning}</p>
                    )}
                    <div className="actions">
                      <button onClick={() => handleEdit(task)}>✏️</button>
                      <button onClick={() => handleDelete(task.id)}>🗑️</button>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
