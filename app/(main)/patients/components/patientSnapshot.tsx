
'use client'
import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import AvatarComponent from '../../components/avatar'
import { Edit, EditIcon, File, LocateIcon, Mail, Phone, Plus } from 'lucide-react'
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
        handleCaluculateAge(moment(patientData?.dateOfBirth).toDate())
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
            <Card className='flex w-full justify-between bg-white'>
                <CardContent className='flex flex-row justify-between items-baseline'>
                    <div className='sm:grid md:grid grid-cols-6 flex-row space-x-5 justify-between items-baseline'>
                        <div className='flex md:flex-row flex-col md:space-x-2'>
                            {/* <div className='md:w-40 md:h-40'>
                                <AvatarComponent source={patientData?.profilePicture || '/avatar2.jpg'} height={40} width={40} />
                            </div> */}
                            <div className='flex flex-col w-full self-start text-foreground' >
                                <p className='text-md font-semibold'>{patientData?.registrationNumber}</p>
                                <p className='text-sm'>{patientData?.firstName} {patientData?.lastName}</p>
                            </div>
                        </div>

                        <div>
                            <div className='text-sm flex items-center space-x-1 text-foreground'>
                                {/* <RiUser3Fill size={16} className='text-sm font-bold' /> */}
                                <p>Gender: </p>
                                <p className='font-bold'>{patientData?.gender == 'M' ? 'Male' : 'Female'}</p>
                            </div>
                            <div className='text-sm flex flex-row items-center space-x-1 text-foreground'>
                                <p>Age: </p>
                                <p className='font-bold'>{formatAge(moment(patientData?.dateOfBirth).toDate())}</p>
                            </div>
                        </div>

                        <div className='text-sm flex flex-row items-center space-x-1 text-foreground'>
                            <p>Location: </p>
                            <p className='font-bold truncate'>{(patientData?.province && patientData?.district) ? patientData?.province?.name + '-' + patientData?.district?.name : 'Kigali-Rwanda'}</p>
                        </div>



                        <div className='text-sm flex flex-row items-center space-x-1 text-foreground'>
                            <p>Program: </p>
                            <p className='text-xs truncate font-bold'>{patientData?.program?.name || 'No Program'}</p>
                        </div>



                    </div>

                    <div className='md:flex flex-col justify-between hidden'>
                        {!isHeaderSection && (
                            <Button className='place-self-end' onClick={() => router.push('patients/' + patientData?._id)}>
                                <Edit /> More
                            </Button>
                        )}
                    </div>

                </CardContent>

            </Card>

        </div>
    )
}
