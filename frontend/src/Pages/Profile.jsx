import React, { useContext } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Profile = () => {
    const { isAuthenticated, user } = useContext(Context);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} />;
    }

    return (
        <div className="container" style={{ minHeight: "80vh", padding: "120px 0 40px 0", display: "flex", justifyContent: "center" }}>
            <div style={{ padding: " 0 300px", borderRadius: "15px", width: "100%", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                <h2 style={{ marginBottom: "30px", textAlign: "center", color: "#271776ca" }}>My Profile</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div className="profile-row">
                        <span className="profile-label">First Name</span>
                        <span className="profile-value">{user?.firstName || "N/A"}</span>
                    </div>

                    <div className="profile-row">
                        <span className="profile-label">Last Name</span>
                        <span className="profile-value">{user?.lastName || "N/A"}</span>
                    </div>

                    <div className="profile-row">
                        <span className="profile-label">Email Address</span>
                        <span className="profile-value">{user?.email || "N/A"}</span>
                    </div>

                    <div className="profile-row">
                        <span className="profile-label">Phone Number</span>
                        <span className="profile-value">{user?.phone || "N/A"}</span>
                    </div>

                    <div className="profile-row">
                        <span className="profile-label">Date of Birth</span>
                        <span className="profile-value">{user?.dob ? String(user.dob).substring(0, 10) : "N/A"}</span>
                    </div>

                    <div className="profile-row">
                        <span className="profile-label">Gender</span>
                        <span className="profile-value">{user?.gender || "N/A"}</span>
                    </div>

                    <div className="profile-row" style={{ borderBottom: "none" }}>
                        <span className="profile-label">Account Role</span>
                        <span className="profile-value" style={{ background: "linear-gradient(140deg, #9083d5, #271776ca)", color: "white", padding: "4px 15px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold" }}>{user?.role || "Patient"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
