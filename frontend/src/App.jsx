import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../src/components/Login";
import Dashboard from "../src/components/Dashboard";
import Console from "../src/components/Console";
import Playground from "../src/components/playground/Playground";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Login />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/console" element={<ProtectedRoute><Console /></ProtectedRoute>} />
      <Route path="/playground" element={<ProtectedRoute><Playground /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
