import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Console from "../src/components/Console";
import Playground from "../src/components/playground/Playground";
import WelcomeWrapper from "./components/WelcomeWrapper";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthChoice from "./components/AuthChoice";
import StartupForm from "./components/StartUpForm";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeWrapper />} />
      <Route path="/auth" element={<AuthChoice />} /> {/* ✅ NEW */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/startup-form"
        element={
          <ProtectedRoute>
            <StartupForm />
          </ProtectedRoute>
        }
      />
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

      {/* catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
