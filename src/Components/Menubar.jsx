import "../Style/Menubar.css"
import Dashboard from "../Icons/Dashboard"
import EditSubjects from "../Icons/EditSubjects"
import EditTeachers from "../Icons/EditTeachers"
import Files from "../Icons/Files"
import TimeTables from "../Icons/TimeTables"
import TimeTableStructure from "../Icons/TimeTableStructure"
import Arrow from "../Icons/Arrow"

import React, { memo, useEffect } from "react"
import { Link } from "react-router-dom"
import Contact from "../Icons/ContactIcon"

function Menubar({ activeMenuIndex }) {
    function toggleMenubar() {
        let activeApp = document.querySelector(".app.active");
        if (activeApp != null) {
            activeApp.classList.remove("active");
        } else {
            document.querySelector(".app").classList.add("active");
        }
    }
    function autoToggleInResize() {
        let app = document.querySelector(".app")
        if (window.innerWidth <= 1250) {
            app.classList.add("active");
        } else {
            app.classList.remove("active");
        }
    }
    useEffect(() => {
        autoToggleInResize();
        window.onresize = () => {
            autoToggleInResize()
        }
    }, [])

    return (
        <div className="menubar-container">
            <Arrow arrowIconClickHandler={toggleMenubar} className={"toggle-menubar-icon"} />
            <div className="title">
                <p>Time Table <br />Designer</p>
            </div>
            <Link to="/Subjects" className="menu-container" id={activeMenuIndex === 0 ? "active" : ""}>
                <EditSubjects className="icon" />
                <div>Subjects</div>
            </Link>
            <Link to="/Teachers" className="menu-container" id={activeMenuIndex === 1 ? "active" : ""}>
                <EditTeachers />
                <div>Teachers</div>
            </Link>
            <Link to="/" className="menu-container" id={activeMenuIndex === 2 ? "active" : ""}>
                <Dashboard />
                <div>Dashboard</div>
            </Link>
            <Link to="/TimeTables" className="menu-container" id={activeMenuIndex === 3 ? "active" : ""}>
                <TimeTables />
                <div>Time Tables</div>
            </Link>
            <Link to="/TimeTableStructure" className="menu-container" id={activeMenuIndex === 4 ? "active" : ""}>
                <TimeTableStructure />
                <div>Time Table <br />Structure</div>
            </Link>
            <Link to="/Files" className="menu-container" id={activeMenuIndex === 5 ? "active" : ""}>
                <Files />
                <div>Files</div>
            </Link>
            <Link to="/ContactUs" className="menu-container" id={activeMenuIndex === 6 ? "active" : ""}>
                <Contact />
                <div>Contact Us</div>
            </Link>
        </div>
    )
}

export default memo(Menubar)