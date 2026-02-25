import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import Patients from "./components/Patients";
import Profile from "./components/Profile";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import Footer from "./components/Footer";
import Layout from "./components/Layout";
import "./App.css";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/stats`, // Quick check to see if admin
          { withCredentials: true }
        );
        // If it succeeds, they must be an admin. Now fetch admin details.
        const adminRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/admin/me`,
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setAdmin(adminRes.data.user);
      } catch (error) {
        // Not an admin, maybe a doctor?
        try {
          const doctorRes = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/user/doctor/me`,
            { withCredentials: true }
          );
          setIsAuthenticated(true);
          setAdmin(doctorRes.data.user); // Using 'admin' state as generic 'user' holding
        } catch (docErr) {
          setIsAuthenticated(false);
          setAdmin({});
        }
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor/addnew" element={<AddNewDoctor />} />
          <Route path="/admin/addnew" element={<AddNewAdmin />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
