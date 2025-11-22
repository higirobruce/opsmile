import React, { useEffect, useState } from 'react'
import VitalSignCard from './vital-signs-card'
import MedicalHistoryCard from './medical-history-card'
import MedicalAssessmentCard from './medical-asswssment-card'

export default function ClinicalSummaryTab({ patientData }: { patientData: any }) {

    const [lastVitalsRecord, setLastVitalsRecord] = useState()
    const [lastMedAssessRecord, setLastMedAssessRecord] = useState()
    const [lastPreOpNotes, setLastPreOpNotes] = useState()
    const [lastAnesthesiaNotes, setLastAnesthesiaNotes] = useState()
    const [lastPACUNotes, setLastPACUNotes] = useState()

    useEffect(() => {
        let vitals = patientData?.vital_signs
        let medical_assessments = patientData?.medical_assessments
        let preOpNotes = patientData?.notes?.filter((note: any) => note?.type === 'PRE_OP_NOTES')
        let anesthesiaNotes = patientData?.notes?.filter((note: any) => note?.type === 'ANESTHESIA_NOTES')
        let pacuNotes = patientData?.notes?.filter((note: any) => note?.type === 'PACU_NOTES')
        setLastVitalsRecord(vitals?.length > 0 ? vitals[vitals.length - 1] : null)
        setLastMedAssessRecord(medical_assessments?.length > 0 ? medical_assessments[medical_assessments.length - 1] : null)
        setLastPreOpNotes(preOpNotes?.length > 0 ? preOpNotes[preOpNotes.length - 1].notes : null)
        setLastAnesthesiaNotes(anesthesiaNotes?.length > 0 ? anesthesiaNotes[anesthesiaNotes.length - 1].notes : null)
        setLastPACUNotes(pacuNotes?.length > 0 ? pacuNotes[pacuNotes.length - 1].notes : null)

        console.log(patientData)
    }, [])
    return (
        <div className='bg-white rounded-md p-4 '>
            {
                lastVitalsRecord && (<>
                    <p className='font-semibold text-md mb-2'>Vitals</p>
                    <VitalSignCard vitalSign={lastVitalsRecord} /></>)
            }

            {
                lastMedAssessRecord &&
                (
                    <>
                        <p className='font-semibold text-md mb-2'>Medical Assessment</p>
                        <MedicalAssessmentCard record={lastMedAssessRecord} /></>
                )
            }

            {
                lastPreOpNotes &&
                <>
                    <p className='font-semibold text-md mb-1 mt-4'>Pre-Operative Notes</p>
                    <p className='text-xs'>{lastPreOpNotes}</p>
                </>
            }

            {
                lastAnesthesiaNotes &&
                <>
                    <p className='font-semibold text-md mb-1 mt-4'>Anesthesia Notes</p>
                    <p className='text-xs'>{lastAnesthesiaNotes}</p>
                </>
            }

            {
                lastPACUNotes &&
                <>
                    <p className='font-semibold text-md mb-1 mt-4'>PACU Notes</p>
                    <p className='text-xs'>{lastPACUNotes}</p>
                </>
            }

        </div>
    )
}
