import "../Style/Menubar.css";
import Dashboard from "../Icons/Dashboard";
import EditSubjects from "../Icons/EditSubjects";
import EditTeachers from "../Icons/EditTeachers";
import Files from "../Icons/Files";
import TimeTables from "../Icons/TimeTables";
import TimeTableStructure from "../Icons/TimeTableStructure";
import Arrow from "../Icons/Arrow";
import React, { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import Contact from "../Icons/ContactIcon";
const menus = [
    {
        name: "Subjects",
        icon: <EditSubjects />,
        link: "/Subjects"
    },
    {
        name: "Teachers",
        icon: <EditTeachers />,
        link: "/Teachers"
    },
    {
        name: "Dashboard",
        icon: <Dashboard />,
        link: "/"
    },
    {
        name: "Time Tables",
        icon: <TimeTables />,
        link: "/TimeTables"
    },
    {
        name: <span>Time Table <br />Structure</span>,
        icon: <TimeTableStructure />,
        link: "/TimeTableStructure"
    },
    {
        name: "Files",
        icon: <Files />,
        link: "/Files"
    },
    {
        name: "Contact Us",
        icon: <Contact />,
        link: "/ContactUs"
    }
];
const Menubar = ({ onMenuToggleClick = () => { } }) => {
    const route = useLocation();
    function toggleMenubar() {
        let activeApp = document.querySelector(".app.active");
        let app = document.querySelector(".app");
        if (activeApp)
            activeApp.classList.remove("active");
        else if (app)
            app.classList.add("active");
    }
    return (<div className="menubar-container">
        <Arrow arrowIconClickHandler={e => {
            toggleMenubar();
            onMenuToggleClick(e);
        }} className={"toggle-menubar-icon"} />
        <div className="title">
            <p>Time Table <br />Scheduler</p>
        </div>

        {menus.map((menu) => (<Link to={menu.link} className="menu-container" id={route.pathname === menu.link ? "active" : ""}>
            {menu.icon}
            <div>{menu.name}</div>
        </Link>))}
    </div>);
};
export default memo(Menubar);
