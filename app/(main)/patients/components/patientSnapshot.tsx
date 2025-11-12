
'use client'
import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import AvatarComponent from '../../components/avatar'
import { Edit, LocateIcon, Mail, Phone, Plus } from 'lucide-react'
import Vitalscard from './vital-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiBriefcase4Fill, RiCalendarEventFill, RiMapPin2Fill, RiUser3Fill } from '@remixicon/react'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


export default function PatientSnapshot({ patientData, isHeaderSection }: { patientData: any, isHeaderSection: boolean }) {

    const router = useRouter()
    const [age, setAge] = useState<number>()
    const [programs, setPrograms] = useState<any[]>([])
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

    useEffect(() => {
        handleCaluculateAge(moment(patientData.dateOfBirth).toDate())
    }, [patientData])

    const handleCaluculateAge = (dateOfBirth: Date) => {
        if (dateOfBirth) {
            const age = new Date().getFullYear() - dateOfBirth.getFullYear();
            setAge(age);
        }
    };

    function formatAge(dob: Date) {
        const now = moment();
        const birthDate = moment(dob);

        // Get the difference in years and months
        const years = now.diff(birthDate, "years");
        const months = now.diff(birthDate.clone().add(years, "years"), "months");

        return `${years}Yr, ${months}Mon`;
    }

    return (
        <div className='flex justify-between'>
            <Card className='flex w-full justify-between'>
                <CardContent>
                    <div className='sm:grid md:grid grid-cols-7 flex-row space-x-5 justify-between'>
                        <div className='flex md:flex-row flex-col md:space-x-2 col-span-2'>
                            {/* <div className='md:w-40 md:h-40'>
                                <AvatarComponent source={patientData?.profilePicture || '/avatar2.jpg'} height={40} width={40} />
                            </div> */}
                            <div className='flex flex-col space-y-3 w-full' >
                                <div>
                                    <div className='flex flex-row space-x-3 items-center'>
                                        <p className='text-md font-semibold'>{patientData.firstName} {patientData.lastName}</p>
                                        <div className='cursor-pointer bg-foreground/10 rounded-full p-2'>
                                            <Phone size={13} aria-hidden={true} />
                                        </div>

                                        <div className='cursor-pointer bg-foreground/10 rounded-full p-2'>
                                            <Mail size={13} aria-hidden={true} />
                                        </div>



                                        {!isHeaderSection && (
                                            <Button className='sm:flex md:hidden place-self-end' onClick={() => router.push('patients/' + patientData._id)}>
                                                <Edit /> More
                                            </Button>
                                        )}


                                        {/* <Button className='rounded-full' variant="outline" size="smallIcon">
                                        </Button> */}
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className='text-sm flex items-center space-x-1 text-foreground/50'>
                            <RiUser3Fill size={16} className='text-sm font-bold' />
                            <p>{patientData.gender == 'M' ? 'Male' : 'Female'}</p>
                        </div>
                        <div className='text-sm flex flex-row items-center space-x-1 text-foreground/50'>
                            <RiMapPin2Fill size={16} className='text-sm font-bold' />
                            <p>{patientData.countryOfBirth || 'Kigali-Rwanda'}</p>
                        </div>
                        <div className='text-sm flex flex-row items-center space-x-1 text-foreground/50'>
                            <RiCalendarEventFill size={16} className='text-sm font-bold' />
                            <p>{formatAge(moment(patientData.dateOfBirth).toDate())}</p>
                        </div>
                        
                        {/* <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>

                            <Vitalscard icon={<LocateIcon />} description='BMI' value={patientData?.vital_signs[patientData?.vital_signs?.length - 1]?.bmi || '-'} />

                            <Vitalscard icon={<LocateIcon />} description='Weight' value={patientData?.vital_signs[patientData?.vital_signs?.length - 1]?.weight ? patientData?.vital_signs[patientData?.vital_signs?.length - 1]?.weight + ' kg' : '-'} />

                            <Vitalscard icon={<LocateIcon />} description='Height' value={patientData?.vital_signs[patientData?.vital_signs?.length - 1]?.height ? patientData?.vital_signs[patientData?.vital_signs?.length - 1]?.height + ' cm' : '-'} />

                            <Vitalscard icon={<LocateIcon />} description='Blood Pressure' value={patientData?.vital_signs[patientData?.vital_signs?.length - 1]?.bloodPressureSystolic ? patientData?.vital_signs[patientData?.vital_signs?.length - 1]?.bloodPressureSystolic + '/' + patientData?.vital_signs[patientData?.vital_signs?.length - 1]?.bloodPressureDiastolic : '-'} />

                        </div> */}
                        <div className='md:flex flex-col justify-between hidden'>
                            {!isHeaderSection && (
                                <Button className='place-self-end' onClick={() => router.push('patients/' + patientData._id)}>
                                    <Edit /> More
                                </Button>
                            )}
                        </div>
                    </div>

                </CardContent>

            </Card>

        </div>
    )
}
