import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const { isAuthenticated, user } = useContext(Context);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/appointment/my-appointments`,
                    { withCredentials: true }
                );
                setAppointments(data.appointments);
            } catch (error) {
                setAppointments([]);
            }
        };
        if (isAuthenticated) {
            fetchAppointments();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} />;
    }

    return (
        <div className="container" style={{ minHeight: "80vh", padding: "120px 60px 40px 60px", overflowX: "auto" }}>
            <h2 style={{ marginBottom: "20px", textAlign: "center", paddingTop: "20px" }}>My Appointments</h2>

            {appointments && appointments.length > 0 ? (
                <div className="banner" style={{ overflowX: "auto" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Doctor</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Visited</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment._id}>
                                    <td>{appointment.appointment_date.substring(0, 16)}</td>
                                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                                    <td>{appointment.department}</td>
                                    <td>
                                        <span
                                            style={{
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                fontWeight: "bold",
                                                color: "white",
                                                backgroundColor:
                                                    appointment.status === "Pending" ? "orange" :
                                                        appointment.status === "Accepted" ? "green" : "red"
                                            }}
                                        >
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td>
                                        {appointment.hasVisited === true ? (
                                            <GoCheckCircleFill className="green" />
                                        ) : (
                                            <AiFillCloseCircle className="red" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <h3 style={{ textAlign: "center", color: "gray" }}>You have no appointments booked yet.</h3>
            )}
        </div>
    );
};

export default MyAppointments;
