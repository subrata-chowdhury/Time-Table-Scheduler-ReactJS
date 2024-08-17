import { memo } from "react";

const BasicDetails = memo(({ basicDetails }) => {
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
                    <Container label="Subjects (Not Taken by Teacher)" value={basicDetails.freeSubjects} />
                    <Container label="Subjects (Taken by Teacher)" value={basicDetails.subjectsCount - basicDetails.freeSubjects} />
                </div>
            </div>
        </div>
    );
});

const Container = memo(({ label = "Demo", value = 0 }) => {
    return (
        <div className='sub-container'>
            <div className='title'>{label}</div>
            <div className='value'>{value}</div>
        </div>
    );
});

export default BasicDetails;
