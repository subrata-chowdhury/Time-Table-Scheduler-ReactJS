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
import { AlertProvider, useAlert } from './Components/AlertContextProvider';
import Alert from './Components/Alert';
import { ConfirmProvider, useConfirm } from './Components/ConfirmContextProvider';
import Confirm from './Components/Confirm';
import { addWindowCloseEventHandler, removeWindowCloseEventHandler } from './Script/commonJS';
import NotFound from './Pages/NotFound/NotFound';
import SettingsPage, { changeTheme } from './Pages/Settings/SettingsPage';

function App() {
	return (
		<AlertProvider>
			<ConfirmProvider>
				<BrowserRouter future={{
					v7_startTransition: true,
					v7_relativeSplatPath: true,
				}}>
					<MainApp />
				</BrowserRouter>
			</ConfirmProvider>
		</AlertProvider>
	)
}

function MainApp() {
	const app = useRef<HTMLDivElement | null>(null)

	const { showWarningConfirm } = useConfirm()
	const { showError } = useAlert()

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
		addWindowCloseEventHandler(showWarningConfirm, showError)
		const theme = localStorage.getItem('theme') || 'System';
		if (theme === 'System') {
			const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
			if (prefersDarkScheme) changeTheme('Dark');
		} else if (theme === 'Dark') {
			changeTheme('Dark')
		} else {
			changeTheme('Light')
		}

		return () => {
			window.removeEventListener("resize", () => {
				autoToggleInResize()
			})
			removeWindowCloseEventHandler()
		}
	}, [])

	return (
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
					<Route path="/Settings" element={<SettingsPage />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
				<OwnerFooter />
			</div>
		</div>
	)
}

// Remote typescript branch tracking test 2
export default App