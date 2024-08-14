import { memo } from "react"

interface SemestersAndSubjectsProps {
    semList: number[],
    subList: string[]
}

const SemestersAndSubjects: React.FC<SemestersAndSubjectsProps> = ({ semList, subList }) => {
    return (
        <div className='sem-and-subject-container'>
            <SemesterContainer semList={semList} />
            <SubjectContainer subList={subList} />
        </div>
    )
}

interface SemesterContainerProps {
    semList: number[]
}

const SemesterContainer: React.FC<SemesterContainerProps> = memo(({ semList = [] }) => {
    return (
        <div className='sem-container'>
            <div className='heading'>Semesters</div>
            <div className='sub-sem-container'>
                {semList && semList.length > 0 && semList.map((sem) => {
                    return (
                        <div className='sem' key={sem}>
                            {sem}
                        </div>
                    )
                })}
            </div>
        </div>
    )
})

interface SubjectContainerProps {
    subList: string[]
}

const SubjectContainer: React.FC<SubjectContainerProps> = memo(({ subList = [] }) => {
    return (
        <div className='subject-container'>
            <div className='heading'>Subjects</div>
            <div className='sub-subject-container'>
                {subList && subList.length > 0 && subList.map((subject) => {
                    return (
                        <div className='subject' key={subject}>
                            {subject.toUpperCase()}
                        </div>
                    )
                })}
            </div>
        </div>
    )
})

export default SemestersAndSubjects