import React from 'react'

export default function PatientData({ patientData }: { patientData: null | any }) {
    return (
        <div>
            <h1>{patientData?.name}</h1>
            <h2>{patientData?._id}</h2>
        </div>
    )
}
