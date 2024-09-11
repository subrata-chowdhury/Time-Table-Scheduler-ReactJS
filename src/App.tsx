import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardPage from './Pages/Dashboard/DashboardPage'
import SubjectsPage from './Pages/Subjects/SubjectsPage';
import TeachersPage from './Pages/Teachers/TeachersPage';
import TimeTablesPage from './Pages/TimeTables/TimeTablesPage';
import TimeTableStructurePage from './Pages/TimeTableStructure/TimeTableStructurePage';
import FilesPage from './Pages/Files/FilesPage';
import "./Style/BasicComponents.css"
import ContactUs from './Pages/ContactUs/ContactUs';
import { useEffect, useRef } from 'react';
import Menubar from './Components/Menubar';
import OwnerFooter from './Components/OwnerFooter';
import { addWindowCloseEventHandler, removeWindowCloseEventHandler } from './Script/commonJS';
import { AlertProvider } from './Components/AlertContextProvider';
import Alert from './Components/Alert';
import { ConfirmProvider } from './Components/ConfirmContextProvider';
import Confirm from './Components/Confirm';

function App() {
	const app = useRef<HTMLDivElement | null>(null)

	function autoToggleInResize() {
		if (window.innerWidth <= 1250) {
			if (app.current)
				app.current.classList.add("active");
		} else {
			if (app.current)
				app.current.classList.remove("active");
		}
	}

	useEffect(() => {
		autoToggleInResize();
		window.addEventListener("resize", () => {
			autoToggleInResize()
		})
		addWindowCloseEventHandler()
		return () => {
			window.removeEventListener("resize", () => {
				autoToggleInResize()
			})
			removeWindowCloseEventHandler()
		}
	}, [])

	return (
		<AlertProvider>
			<ConfirmProvider>
				<BrowserRouter>
					<div className='app' ref={app}>

						<Alert />
						<Confirm />
						<Menubar />

						<div className='main-container'>
							<Routes>
								<Route path="/" element={<DashboardPage />} />
								<Route path="/Subjects" element={<SubjectsPage />} />
								<Route path="/Teachers" element={<TeachersPage />} />
								<Route path="/TimeTables" element={<TimeTablesPage />} />
								<Route path="/TimeTableStructure" element={<TimeTableStructurePage />} />
								<Route path="/Files" element={<FilesPage />} />
								<Route path="/ContactUs" element={<ContactUs />} />
							</Routes>
							<OwnerFooter />
						</div>
					</div>
				</BrowserRouter>
			</ConfirmProvider>
		</AlertProvider>
	)
}

// Remote typescript branch tracking test 2
export default App