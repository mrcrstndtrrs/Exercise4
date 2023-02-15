import { Container, CssBaseline } from "@mui/material";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AddTaskPage from "./pages/AddTaskPage";
import TasksPage from "./pages/TasksPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import EditTaskPage from "./pages/EditTaskPage";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import * as authService from "./services/auth";
import NavBar from "./components/NavBar";
import { useState } from "react";

function App() {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(authService.getAccessToken());

  const handleLogin = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      console.log(response.data.accessToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      setAccessToken(response.data.accessToken);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    setAccessToken(null);
    navigate("/login");
  };
  return (
    <>
      <CssBaseline />
      <NavBar onLogout={handleLogout} />
      <Container sx={{ marginTop: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" />} />
          <Route
            path="/tasks"
            element={accessToken ? <TasksPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/tasks/new"
            element={accessToken ? <AddTaskPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/tasks/:id"
            element={
              accessToken ? <TaskDetailsPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/tasks/:id/edit"
            element={accessToken ? <EditTaskPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/register"
            element={accessToken ? <Navigate to="/" /> : <RegisterPage />}
          />
          <Route
            path="/login"
            element={
              accessToken ? (
                <Navigate to="/" />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
