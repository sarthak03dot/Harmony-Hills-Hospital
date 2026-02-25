import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    acceptedAppointments: 0,
    rejectedAppointments: 0,
  });

  const { isAuthenticated, admin } = useContext(Context);
  const [statusFilter, setStatusFilter] = useState("All");

  // State to manage prescription editing
  const [editingPrescriptionId, setEditingPrescriptionId] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({ prescription: "", doctorNotes: "" });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const endpoint = admin?.role === "Doctor"
          ? `${import.meta.env.VITE_API_BASE_URL}/appointment/doctor-appointments`
          : `${import.meta.env.VITE_API_BASE_URL}/appointment/getall`;

        const { data } = await axios.get(endpoint, { withCredentials: true });
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };

    const fetchStats = async () => {
      if (admin?.role !== "Admin") return;
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/stats`,
          { withCredentials: true }
        );
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (isAuthenticated && admin?.role) {
      fetchAppointments();
      fetchStats();
    }
  }, [admin, isAuthenticated]);

  useEffect(() => {
    if (admin?.role === "Doctor") {
      setStats({
        totalDoctors: 0,
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter((a) => a.status === "Pending").length,
        acceptedAppointments: appointments.filter((a) => a.status === "Accepted").length,
        rejectedAppointments: appointments.filter((a) => a.status === "Rejected").length,
      });
    }
  }, [appointments, admin]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleUpdateMedicalRecord = async (appointmentId) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/appointment/update/${appointmentId}`,
        {
          prescription: prescriptionForm.prescription,
          doctorNotes: prescriptionForm.doctorNotes
        },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, prescription: prescriptionForm.prescription, doctorNotes: prescriptionForm.doctorNotes }
            : appointment
        )
      );
      setEditingPrescriptionId(null);
      toast.success("Medical Record Saved Successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save medical record");
    }
  };

  const startEditingRecord = (appointment) => {
    setEditingPrescriptionId(appointment._id);
    setPrescriptionForm({
      prescription: appointment.prescription || "",
      doctorNotes: appointment.doctorNotes || ""
    });
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // Calculate Chart Data based on filtered appointments
  const filteredAppointments = appointments.filter((appointment) =>
    statusFilter === "All" || appointment.status === statusFilter
  );

  const chartData = [
    { name: 'Pending', value: filteredAppointments.filter(a => a.status === 'Pending').length, color: '#eab308' },
    { name: 'Accepted', value: filteredAppointments.filter(a => a.status === 'Accepted').length, color: '#16a34a' },
    { name: 'Rejected', value: filteredAppointments.filter(a => a.status === 'Rejected').length, color: '#dc2626' }
  ];

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>
                  {admin &&
                    `${admin.firstName} ${admin.lastName}`}{" "}
                </h5>
              </div>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Facilis, nam molestias. Eaque molestiae ipsam commodi neque.
                Assumenda repellendus necessitatibus itaque.
              </p>
            </div>
          </div>
          {(admin?.role === "Admin" || admin?.role === "Doctor") && (
            <>
              <div className="secondBox">
                <p>Total Appointments</p>
                <h3>{stats.totalAppointments}</h3>
              </div>
              <div className="thirdBox">
                <p>{admin?.role === "Admin" ? "Registered Doctors" : "Pending Appointments"}</p>
                <h3>{admin?.role === "Admin" ? stats.totalDoctors : stats.pendingAppointments}</h3>
              </div>
            </>
          )}
        </div>

        {/* Analytics Chart Block */}
        <div className="banner" style={{ minHeight: "450px", padding: "40px", background: "#fff", borderRadius: "20px", display: "flex", flexDirection: "column" }}>
          <h5 style={{ fontSize: "24px", letterSpacing: "2px", color: "#111", marginBottom: "30px" }}>Appointment Analytics</h5>
          <div style={{ flex: 1, position: "relative", width: "100%" }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="banner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5>Appointments</h5>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "8px", borderRadius: "5px", marginBottom: "15px" }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
                {admin?.role === "Doctor" && <th>Medical Record</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0
                ? filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>{appointment.appointment_date.substring(0, 16)}</td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td>
                      <select
                        className={
                          appointment.status === "Pending"
                            ? "value-pending"
                            : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                        }
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending" className="value-pending">
                          Pending
                        </option>
                        <option value="Accepted" className="value-accepted">
                          Accepted
                        </option>
                        <option value="Rejected" className="value-rejected">
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td>{appointment.hasVisited === true ? <GoCheckCircleFill className="green" /> : <AiFillCloseCircle className="red" />}</td>

                    {/* Doctor Prescription Column */}
                    {admin?.role === "Doctor" && (
                      <td>
                        {editingPrescriptionId === appointment._id ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "250px" }}>
                            <textarea
                              placeholder="Prescription (Medicine, Dosage...)"
                              value={prescriptionForm.prescription}
                              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, prescription: e.target.value })}
                              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "60px" }}
                            />
                            <textarea
                              placeholder="Doctor Notes / Diagnosis..."
                              value={prescriptionForm.doctorNotes}
                              onChange={(e) => setPrescriptionForm({ ...prescriptionForm, doctorNotes: e.target.value })}
                              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "60px" }}
                            />
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button onClick={() => handleUpdateMedicalRecord(appointment._id)} style={{ flex: 1, padding: "5px", background: "green", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Save</button>
                              <button onClick={() => setEditingPrescriptionId(null)} style={{ flex: 1, padding: "5px", background: "gray", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "5px", maxWidth: "300px" }}>
                            {appointment.prescription && (
                              <p style={{ fontSize: "14px", margin: 0 }}><strong>Rx:</strong> {appointment.prescription.length > 30 ? appointment.prescription.substring(0, 30) + "..." : appointment.prescription}</p>
                            )}
                            {appointment.doctorNotes && (
                              <p style={{ fontSize: "14px", margin: 0, color: "gray" }}><strong>Notes:</strong> {appointment.doctorNotes.length > 30 ? appointment.doctorNotes.substring(0, 30) + "..." : appointment.doctorNotes}</p>
                            )}
                            <button
                              onClick={() => startEditingRecord(appointment)}
                              style={{ padding: "5px 10px", marginTop: "5px", background: "#3939d9f2", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", width: "fit-content" }}
                            >
                              {(appointment.prescription || appointment.doctorNotes) ? "Edit Record" : "Add Record"}
                            </button>
                          </div>
                        )}
                      </td>
                    )}

                  </tr>
                ))
                : (<tr><td colSpan="6" style={{ textAlign: "center" }}>No Appointments Found!</td></tr>)}
            </tbody>
          </table>

          { }
        </div>
      </section>
    </>
  );
};

export default Dashboard;
