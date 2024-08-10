import "../Style/Menubar.css"
import Dashboard from "../Icons/Dashboard.tsx"
import EditSubjects from "../Icons/EditSubjects.tsx"
import EditTeachers from "../Icons/EditTeachers.tsx"
import Files from "../Icons/Files.tsx"
import TimeTables from "../Icons/TimeTables.tsx"
import TimeTableStructure from "../Icons/TimeTableStructure.tsx"
import Arrow from "../Icons/Arrow.tsx"

import React, { memo } from "react"
import { Link } from "react-router-dom"
import Contact from "../Icons/ContactIcon.tsx"

interface MenubarProps {
    activeMenuIndex: number,
    onMenuToggleClick?: (e: React.MouseEvent<HTMLOrSVGElement>) => void
}

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
]

const Menubar: React.FC<MenubarProps> = ({ activeMenuIndex, onMenuToggleClick = () => { } }) => {
    function toggleMenubar() {
        let activeApp = document.querySelector(".app.active");
        activeApp!.classList.remove("active");
        document.querySelector(".app")!.classList.add("active");
    }

    return (
        <div className="menubar-container">
            <Arrow arrowIconClickHandler={e => {
                toggleMenubar();
                onMenuToggleClick(e);
            }} className={"toggle-menubar-icon"} />
            <div className="title">
                <p>Time Table <br />Designer</p>
            </div>

            {menus.map((menu, index) => (
                <Link to={menu.link} className="menu-container" id={activeMenuIndex === index ? "active" : ""}>
                    {menu.icon}
                    <div>{menu.name}</div>
                </Link>
            ))}
        </div>
    )
}

export default memo(Menubar)