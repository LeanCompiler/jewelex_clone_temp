import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./containers/MainLayout";
import Layout from "./containers/Layout";
import ImageForm from "./containers/ImageForm";

const App = () => {
  return (
    <Routes>
      <Route path="" element={<Navigate to="/form" replace />} />
      <Route path="*" element={<Navigate to="/form" replace />} />

      <Route path="/" element={<Layout />}>
        <Route path="/" element={<MainLayout />}>
          <Route path={"/form"} element={<ImageForm />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
