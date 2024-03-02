import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'

function SubjectsPage() {
    return (
        <>
            <Menubar activeMenuIndex={0} />
            <div className='main-container'>
                <MiniStateContainer/>
            </div>
        </>
    )
}

export default SubjectsPage