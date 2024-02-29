import CurrentState from '../Components/CurrentFileName'
import Menubar from '../Components/Menubar'

function TeachersPage() {
    return (
        <>
            <Menubar activeMenuIndex={1} />
            <div className='main-container'>
                <CurrentState/>
            </div>
        </>
    )
}

export default TeachersPage