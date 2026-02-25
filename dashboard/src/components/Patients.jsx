import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const { isAuthenticated } = useContext(Context);
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/user/patients`,
                    { withCredentials: true }
                );
                setPatients(data.patients);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        };
        fetchPatients();
    }, []);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} />;
    }
    return (
        <section className="page doctors">
            <h1>PATIENTS</h1>
            <div className="banner">
                {patients && patients.length > 0 ? (
                    patients.map((element) => {
                        return (
                            <div className="card" key={element._id}>
                                <h4>{`${element.firstName} ${element.lastName}`}</h4>
                                <div className="details">
                                    <p>
                                        Email: <span>{element.email}</span>
                                    </p>
                                    <p>
                                        Phone: <span>{element.phone}</span>
                                    </p>
                                    <p>
                                        DOB: <span>{element.dob.substring(0, 10)}</span>
                                    </p>
                                    <p>
                                        Gender: <span>{element.gender}</span>
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <h1>No Registered Patients Found!</h1>
                )}
            </div>
        </section>
    );
};

export default Patients;
