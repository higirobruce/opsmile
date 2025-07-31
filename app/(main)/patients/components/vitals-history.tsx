import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
import moment from 'moment'
import { VitalsChartLine } from './vitals-chart'
import { AirVent, Heart, Ruler, Scale, Wind } from 'lucide-react'

export default function VitalsHistory({ patientData }: { patientData: any }) {
    const vitalSigns = patientData?.vital_signs
    const formattedData = vitalSigns?.map((item: any) => ({
        ...item,
        created_at: moment(item.created_at).format('YYYY-MM-DD'),
    }))
    return (
        <div>
            {/* <div>Vitals History</div> */}
            <div className='grid sm:grid-cols-1 md:grid-cols-4 gap-2'>
                <VitalsChartLine icon={<Ruler />} strokeColor='var(--primary)' title='BMI' subTitle='Height, weight and BMI' data={formattedData} parameters={['bmi', 'height', 'weight']} />
                <VitalsChartLine icon={<Heart className='text-red-400' />} strokeColor='var(--destructive)' title='Blood Pressure' subTitle='Diastolic and Systolic' data={formattedData} parameters={['bloodPressureDiastolic', 'bloodPressureSystolic', 'pulseRate']} />
                <VitalsChartLine icon={<Wind />} strokeColor='var(--primary)' title='Respiratory Rate' subTitle='Respiratory Rate' data={formattedData} parameters={['respirationRate']} />
            </div>
        </div>
    )
}
