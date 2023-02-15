import AddIcon from "@mui/icons-material/Add";
import { Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TasksTable from "../components/TasksTable";
import * as taskService from "../services/task";
import * as authService from "../services/auth";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (authService.getCurrentUser().isAdmin) {
      taskService.fetchAllTasks().then((response) => {
        setTasks(response.data);
      });
    } else {
      taskService.fetchTasks().then((response) => {
        setTasks(response.data);
      });
    }
  });

  const handleDeleteTask = async (id) => {
    const tasksClone = [...tasks];

    try {
      setTasks(tasks.filter((task) => task.id !== id));
      await taskService.deleteTask(id);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Data might have already been deleted");
      }
      setTasks(tasksClone);
    }
  };

  const handleUpdateChanged = (id) => {
    const task = tasks.find((task) => task.id === id);
    task.completed = !task.completed;
    taskService.updateTask(id, task);
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
          };
        }
        return task;
      })
    );
  };

  return (
    <Grid container spacing={2} justifyContent="flex-end" textAlign="right">
      <Grid item xs={4}>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          LinkComponent={Link}
          to="/tasks/new"
        >
          Add Task
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TasksTable
          onDeleteTask={handleDeleteTask}
          onUpdateChanged={handleUpdateChanged}
          tasks={tasks}
        />
      </Grid>
    </Grid>
  );
};
export default TasksPage;
