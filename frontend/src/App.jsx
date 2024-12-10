// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import CredentialsSignInPage from "../components/Form";
import Home from "../pages/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<CredentialsSignInPage />} />
    </Routes>
  );
};

export default App;
