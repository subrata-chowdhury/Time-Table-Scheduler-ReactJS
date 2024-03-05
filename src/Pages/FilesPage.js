import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import { InputBox } from '../Components/BasicComponents'
import "../Style/Files.css"
import Cards from '../Components/Cards'

function FilesPage() {
    return (
        <>
            <Menubar activeMenuIndex={5} />
            <div className='main-container files'>
                <div className='left-sub-container'>
                    <MiniStateContainer />
                    <Cards />
                </div>
                <div className='right-sub-container'>
                    <DetailsContainer />
                </div>
            </div>
        </>
    )
}

function DetailsContainer() {
    return (
        <div className='details-container'>
            <div className='inputs-container-heading'>Details</div>
            <InputBox inputHeading='File Name' placeholder='Ex.: ABC' />
            <div className='save-btn-container'>
                <button className='file-save-btn'>Save</button>
            </div>
        </div>
    )
}

export default FilesPage