import MiniStateContainer from '../Components/MiniStateContainer'
import Menubar from '../Components/Menubar'
import { InputBox } from '../Components/BasicComponents'
import "../Style/TimeTableStructure.css"

function TimeTableStructurePage() {
    return (
        <>
            <Menubar activeMenuIndex={4} />
            <div className='main-container time-table-structure'>
                <MiniStateContainer />
                <div className='time-table-structure-inputs-container'>
                    <div className='top-input-container'>
                        <InputBox inputHeading='Number of Semesters' type='number' minValue={0} />
                        <InputBox inputHeading='Number of Periods per Day' type='number' minValue={0} />
                    </div>

                    <div className='mid-input-container'>
                        <div className="input-container">
                            <div className="input-box-heading">Number of Sections per Semester</div>
                            <input type='text' className='input-box' />
                        </div>
                    </div>
                    <div className='bottom-input-container'>
                        <div className="input-container">
                            <div className="input-box-heading">Break Times per Semester</div>
                            <input type='text' className='input-box' />
                        </div>
                    </div>
                    <div className='save-btn-container'>
                        <button className='time-table-structure-save-btn'>Update</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TimeTableStructurePage