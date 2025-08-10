import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css"; // We'll create this file next

function App() {
  const { user, logout } = useAuth();

  const Home = () => {
    if (!user) return <Navigate to="/login" />;
    return user.role === "ADMIN" ? (
      <Navigate to="/admin" />
    ) : (
      <Navigate to="/dashboard" />
    );
  };

  return (
    <div className="App">
      <nav>
        <h1>Clinic Appointments</h1>
        <ul>
          {user ? (
            <>
              <li>
                <span>
                  {user.email} ({user.role.toLowerCase()})
                </span>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="logout-button"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main>
        <Routes>
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <RegisterPage /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard"
            element={
              user && user.role === "PATIENT" ? (
                <PatientDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user && user.role === "ADMIN" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
