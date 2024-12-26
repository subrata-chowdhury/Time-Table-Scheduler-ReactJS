import React from 'react'
import { useParams } from 'react-router-dom'

const StudentDetailsPage: React.FC = (): JSX.Element => {
    const { id } = useParams()
    return (
        <div>StudentDetailsPage: {id}</div>
    )
}

export default StudentDetailsPage