import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'

function TimeTablesPage() {
    return (
        <>
            <Menubar activeMenuIndex={3} />
            <div className='main-container'>
                <MiniStateContainer />
            </div>
        </>
    )
}

export default TimeTablesPage