import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import { InputBox } from '../Components/BasicComponents'

function TimeTableStructurePage() {
    return (
        <>
            <Menubar activeMenuIndex={4} />
            <div className='main-container'>
                <MiniStateContainer />
                <div className='time-table-structure-inputs-container'>
                    <div className='top-input-container'>
                        <InputBox inputHeading='Number of Semesters' type='number' />
                        <InputBox inputHeading='Number of Periods per Day' type='number' />
                    </div>

                    <div className='mid-input-container'>
                        <div className="input-container">
                            <div className="input-box-heading">Number of Sections per Semester</div>
                            <input type='number' className='input-box'/>
                        </div>
                    </div>
                    <div className='bottom-input-container'>
                        <div className="input-container">
                            <div className="input-box-heading">Number of Sections per Semester</div>
                            <input type='number' className='input-box'/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TimeTableStructurePage