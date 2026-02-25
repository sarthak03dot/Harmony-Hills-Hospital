import React, { useContext } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Profile = () => {
    const { isAuthenticated, admin } = useContext(Context);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} />;
    }

    return (
        <section className="page" style={{ padding: "40px" }}>
            <div
                className="banner"
                style={{
                    background: "#fff",
                    padding: "40px",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                    maxWidth: "600px",
                    margin: "0 auto",
                }}
            >
                <img
                    src={admin?.docAvatar?.url || "/doc.png"}
                    alt="Profile Avatar"
                    style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "4px solid #eee",
                    }}
                />
                <h2 style={{ letterSpacing: "2px", color: "#111" }}>
                    {admin?.firstName} {admin?.lastName}
                </h2>
                <div style={{ width: "100%", marginTop: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "10px 0" }}>
                        <strong>Role:</strong> <span>{admin?.role}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "10px 0" }}>
                        <strong>Email:</strong> <span>{admin?.email}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "10px 0" }}>
                        <strong>Phone:</strong> <span>{admin?.phone}</span>
                    </div>
                    {admin?.dob && (
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "10px 0" }}>
                            <strong>Date of Birth:</strong> <span>{admin.dob.substring(0, 10)}</span>
                        </div>
                    )}
                    {admin?.gender && (
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "10px 0" }}>
                            <strong>Gender:</strong> <span>{admin.gender}</span>
                        </div>
                    )}
                    {admin?.doctorDepartment && (
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "10px 0" }}>
                            <strong>Department:</strong> <span>{admin.doctorDepartment}</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Profile;
