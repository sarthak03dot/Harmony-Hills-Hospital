import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { Context } from "../main";

const Footer = () => {
    const { isAuthenticated } = useContext(Context);

    if (!isAuthenticated) return null;

    return (
        <footer>
            <hr />
            <div className="content">
                <div>
                    <img src="/logo.png" alt="logo" style={{ width: "150px" }} />
                </div>
                <div>
                    <h4>Quick Links</h4>
                    <ul>
                        <Link to={"/"}>Dashboard</Link>
                        <Link to={"/messages"}>Messages</Link>
                        <Link to={"/doctors"}>Doctors</Link>
                    </ul>
                </div>
                <div>
                    <h4>Administrative Support</h4>
                    <p style={{ color: "gray", fontSize: "16px", lineHeight: "1.5" }}>
                        The Administration panel provides overview controls for maintaining operations, adding personnel, and validating appointments.
                    </p>
                </div>
                <div>
                    <h4>Contact Support</h4>
                    <div>
                        <FaPhone />
                        <span>999-999-9200</span>
                    </div>
                    <div>
                        <MdEmail />
                        <span>admin@harmonyhillshospital.com</span>
                    </div>
                    <div>
                        <FaLocationArrow />
                        <span>Ghaziabad, India</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
