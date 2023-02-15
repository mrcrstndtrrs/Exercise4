import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import * as taskService from "../services/task";

const EditTaskPage = () => {
  const params = useParams();

  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    taskService.fetchTaskById(params.id).then((response) => {
      setTask(response.data);
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = (form) => {
    taskService
      .updateTask(task.id, form)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message[0]);
        }
      });
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (task)
    return (
      <div>
        <TaskForm
          initialValue={{
            name: task.title,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    );

  return null;
};

export default EditTaskPage;
