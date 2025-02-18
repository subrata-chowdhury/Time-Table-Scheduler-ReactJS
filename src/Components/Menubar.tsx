import "../Style/Menubar.css"
import Dashboard from "../Icons/Dashboard"
import EditSubjects from "../Icons/EditSubjects"
import EditTeachers from "../Icons/EditTeachers"
import Files from "../Icons/Files"
import TimeTables from "../Icons/TimeTables"
import TimeTableStructure from "../Icons/TimeTableStructure"
import Arrow from "../Icons/Arrow"

import React, { memo, ReactNode, JSX } from "react"
import { Link, useLocation } from "react-router-dom"
import Contact from "../Icons/ContactIcon"
import SettingIcon from "../Icons/Setting"
import StudentsIcon from "../Icons/Students"

interface MenubarProps {
    onMenuToggleClick?: (e: React.MouseEvent<HTMLOrSVGElement>) => void
}

const menus: {name: string | JSX.Element, icon: ReactNode, link: string, title?: string}[] = [
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
        name: "Students",
        icon: <StudentsIcon />,
        link: "/Students"
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
        link: "/TimeTableStructure",
        title: "Time Table Structure"
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
    },
    {
        name: "Settings",
        icon: <SettingIcon />,
        link: "/Settings"
    }
]

const Menubar: React.FC<MenubarProps> = ({ onMenuToggleClick = () => { } }) => {
    const route = useLocation()

    function toggleMenubar() {
        let activeApp = document.querySelector(".app.active");
        let app = document.querySelector(".app")
        if (activeApp)
            activeApp.classList.remove("active");
        else if (app)
            app.classList.add("active");
    }

    return (
        <nav className="menubar-container">
            <Arrow arrowIconClickHandler={e => {
                toggleMenubar();
                onMenuToggleClick(e);
            }} className={"toggle-menubar-icon"} />
            <div className="title">
                <p>Time Table <br />Scheduler</p>
            </div>
            <ul className="menus-container">
                {menus.map((menu) => (
                    <Link to={menu.link} title={typeof menu.name == "string" ? menu.name : menu.title } className="menu-container" id={route.pathname === menu.link ? "active" : ""} key={menu.name as string}>
                        {menu.icon}
                        <li>{menu.name}</li>
                    </Link>
                ))}
            </ul>
        </nav>
    )
}

export default memo(Menubar)