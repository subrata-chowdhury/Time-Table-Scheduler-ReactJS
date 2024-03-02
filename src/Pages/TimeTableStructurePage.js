import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'

function TimeTableStructurePage() {
    return (
        <>
            <Menubar activeMenuIndex={4} />
            <div className='main-container'>
                <MiniStateContainer/>
            </div>
        </>
    )
}

export default TimeTableStructurePage