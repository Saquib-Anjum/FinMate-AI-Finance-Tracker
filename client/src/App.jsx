import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Transactions from "./pages/Transactions.jsx";
import Budgets from "./pages/Budgets.jsx";
import Goals from "./pages/Goals.jsx";
import Analytics from "./pages/Analytics.jsx";
import AI_assistant from "./pages/AI_assistant.jsx";
import Profile from "./pages/Profile.jsx";
import Home from './pages/Home.jsx'
import Login from "./pages/Login.jsx";
import AuthCallback from "./pages/AuthCallback";
function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home/>}/>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai" element={<AI_assistant />} />
          <Route path="/profile" element={<Profile />} />          
          <Route path="/settings" element={<Settings />} />
        </Route>
       
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
