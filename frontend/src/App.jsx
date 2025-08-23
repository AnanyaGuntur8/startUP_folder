import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/components/Login";
import Console from "../src/components/Console";
import Playground from "../src/components/playground/Playground";
import Welcome from "./components/Welcome";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  // If no token, redirect to login and replace history
  return token ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      {/* <Route path="/" element={<Login />} /> */}
      <Route
        path="/console"
        element={
          <ProtectedRoute>
            <Console />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playground"
        element={
          <ProtectedRoute>
            <Playground />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
