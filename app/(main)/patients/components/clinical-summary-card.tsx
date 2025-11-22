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
        <div className='bg-white rounded-xl p-6 border '>
            {
                lastVitalsRecord && (<>
                    <p className="font-semibold mt-3 mb-1 text-xs uppercase tracking-wide text-slate-500">Vitals</p>
                    <VitalSignCard vitalSign={lastVitalsRecord} /></>)
            }

            {
                lastMedAssessRecord &&
                (
                    <>
                        <p className="font-semibold mt-3 mb-1 text-xs uppercase tracking-wide text-slate-500">Medical Assessment</p>
                        <MedicalAssessmentCard record={lastMedAssessRecord} /></>
                )
            }

            {
                lastPreOpNotes &&
                <>
                    <p className="font-semibold mt-3 mb-1 text-xs uppercase tracking-wide text-slate-500">Pre-Operative Notes</p>
                    <p className='text-xs  text-slate-400 '>{lastPreOpNotes}</p>
                </>
            }

            {
                lastAnesthesiaNotes &&
                <>
                    <p className="font-semibold mt-3 mb-1 text-xs uppercase tracking-wide text-slate-500">Anesthesia Notes</p>
                    <p className='text-xs  text-slate-400 '>{lastAnesthesiaNotes}</p>
                </>
            }

            {
                lastPACUNotes &&
                <>
                    <p className="font-semibold mt-3 mb-1 text-xs uppercase tracking-wide text-slate-500">PACU Notes</p>
                    <p className='text-xs  text-slate-400 '>{lastPACUNotes}</p>
                </>
            }

        </div>
    )
}
