import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as taskService from "../services/task";

const TaskDetailsPage = () => {
  const params = useParams();

  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    taskService.fetchTaskById(params.id).then((response) => {
      setTask(response.data);
      setLoading(false);
    });
  }, [params.id]);

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Data might have already been deleted");
      }
    }
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (task)
    return (
      <Card>
        <CardHeader
          action={
            <IconButton onClick={handleOpenMenu}>
              <MoreVertIcon />
            </IconButton>
          }
          title={task.title}
          subheader={task.id}
        />
        <CardContent>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => navigate(`/tasks/${task.id}/edit`)}>
              Edit
            </MenuItem>
            <MenuItem onClick={() => handleDeleteTask(task.id)}>
              Delete
            </MenuItem>
          </Menu>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <Typography variant="overline">Status: </Typography>
              <Typography variant="body2">
                {task.completed ? "Completed" : "Incomplete"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="overline">user ID: </Typography>
              <Typography variant="body2">{task.userId}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );

  return null;
};

export default TaskDetailsPage;
