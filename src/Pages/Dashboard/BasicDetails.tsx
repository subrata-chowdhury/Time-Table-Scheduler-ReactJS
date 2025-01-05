import { memo } from "react"

interface BasicDetailsProps {
    basicDetails: BasicDetailsType
}

export type BasicDetailsType = {
    subjectsCount: number,
    teachersCount: number,
    practicalSubjects: number,
    theroySubjects: number,
    freeSubjects: number
    students: number
}

const BasicDetails: React.FC<BasicDetailsProps> = memo(({ basicDetails }) => {
    return (
        <div className='basic-details'>
            <div className='basic-details-container'>
                <div className='container'>
                    <Container label="Subjects" value={basicDetails.subjectsCount} />
                    <Container label="Teachers" value={basicDetails.teachersCount} />
                </div>
                <div className='container'>
                    <Container label="Practical Subjects" value={basicDetails.practicalSubjects} />
                    <Container label="Theory Subjects" value={basicDetails.theroySubjects} />
                </div>
            </div>
            <div className='basic-details-container' style={{ gridTemplateColumns: "auto" }}>
                <div className='container'>
                    <Container label="Students" value={basicDetails.students} />
                    <Container label="Subjects (Taken by Teacher)" value={basicDetails.subjectsCount - basicDetails.freeSubjects} />
                </div>
            </div>
        </div>)
})

interface ContainerProps {
    label: string,
    value: number
}

const Container: React.FC<ContainerProps> = memo(({ label = "Demo", value = 0 }) => {
    return (
        <div className='sub-container'>
            <div className='title'>{label}</div>
            <div className='value'>{value}</div>
        </div>
    )
})

export default BasicDetails