import React from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
    return (
        <>
            <Sidebar />
            {children}
            <Footer />
        </>
    );
};

export default Layout;
