import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardPage from './Pages/DashboardPage';
import SubjectsPage from './Pages/SubjectsPage';
import TeachersPage from './Pages/TeachersPage';
import TimeTablesPage from './Pages/TimeTablesPage';
import TimeTableStructurePage from './Pages/TimeTableStructurePage';
import FilesPage from './Pages/FilesPage';
import "./Style/BasicComponents.css";
import ContactUs from './Pages/ContactUs';
import { useEffect, useRef } from 'react';
function App() {
    const app = useRef(null);
    function autoToggleInResize() {
        if (window.innerWidth <= 1250) {
            if (app.current)
                app.current.classList.add("active");
        }
        else {
            if (app.current)
                app.current.classList.remove("active");
        }
    }
    useEffect(() => {
        autoToggleInResize();
        window.onresize = () => {
            autoToggleInResize();
        };
    }, []);
    return (<BrowserRouter>
			<div className='app' ref={app}>
				<Routes>
					<Route path="/" element={<DashboardPage />}/>
					<Route path="/Subjects" element={<SubjectsPage />}/>
					<Route path="/Teachers" element={<TeachersPage />}/>
					<Route path="/TimeTables" element={<TimeTablesPage />}/>
					<Route path="/TimeTableStructure" element={<TimeTableStructurePage />}/>
					<Route path="/Files" element={<FilesPage />}/>
					<Route path="/ContactUs" element={<ContactUs />}/>
				</Routes>
			</div>
		</BrowserRouter>);
}
// Remote typescript branch tracking test 2
export default App;
