import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import TimeTable from '../Components/TimeTable'

function TimeTablesPage() {
    return (
        <>
            <Menubar activeMenuIndex={3} />
            <div className='main-container'>
                <MiniStateContainer />
                <TimeTable/>
            </div>
        </>
    )
}

export default TimeTablesPage