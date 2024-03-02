import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import "../Style/Dashboard.css"

function DashboardPage() {
    return (
        <>
            <Menubar activeMenuIndex={2} />
            <div className='main-container dashboard'>
                <div className='left-sub-container'>
                    <MiniStateContainer/>

                </div>
                <div className='right-sub-container'>

                </div>
            </div>
        </>
    )
}

export default DashboardPage