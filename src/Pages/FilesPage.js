import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'

function FilesPage() {
    return (
        <>
            <Menubar activeMenuIndex={5} />
            <div className='main-container'>
                <MiniStateContainer />
            </div>
        </>
    )
}

export default FilesPage