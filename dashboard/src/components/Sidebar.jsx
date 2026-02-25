import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor, FaUsers } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, setIsAuthenticated, admin } = useContext(Context);

  const location = useLocation();

  const handleLogout = async () => {
    const logoutEndpoint = admin?.role === "Doctor" ? "/user/doctor/logout" : "/user/admin/logout";
    await axios
      .get(`${import.meta.env.VITE_API_BASE_URL}${logoutEndpoint}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to logout");
      });
  };

  const navigateTo = useNavigate();

  const handleNavigation = (path) => {
    navigateTo(path);
    setShow(!show);
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: <TiHome /> },
    { name: "Doctors", path: "/doctors", icon: <FaUserDoctor />, adminOnly: true },
    { name: "Patients", path: "/patients", icon: <FaUsers />, adminOnly: true },
    { name: "Messages", path: "/messages", icon: <AiFillMessage />, adminOnly: true },
    { name: "Add Admin", path: "/admin/addnew", icon: <MdAddModerator />, adminOnly: true },
    { name: "Add Doctor", path: "/doctor/addnew", icon: <IoPersonAddSharp />, adminOnly: true },
    { name: "Profile", path: "/profile", icon: <CgProfile /> },
  ];

  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={`sidebar ${show ? "show" : ""}`}
      >
        <div className="links">
          {navItems.map((item) => {
            if (item.adminOnly && admin?.role !== "Admin") return null;
            return (
              <div
                key={item.name}
                className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => handleNavigation(item.path)}
                title={item.name}
              >
                {item.icon}
                <span className="tooltip">{item.name}</span>
              </div>
            );
          })}
          <div className="nav-item" onClick={handleLogout} title="Logout">
            <RiLogoutBoxFill />
            <span className="tooltip">Logout</span>
          </div>
        </div>
      </nav>
      <div
        className="wrapper"
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
