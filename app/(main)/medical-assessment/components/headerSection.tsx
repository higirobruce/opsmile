import { Avatar } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import AvatarComponent from '../../components/avatar'
import { Briefcase, Edit, LocateIcon, Mail, MapPin, Phone, User2 } from 'lucide-react'
import Vitalscard from './vital-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiBriefcase2Fill, RiBriefcase3Fill, RiBriefcase4Fill, RiMap2Fill, RiMapPin2Fill, RiMapPin3Fill, RiMapPin4Fill, RiUser3Fill } from '@remixicon/react'

export default function HeaderSection({ patientData }: { patientData: any }) {
    return (
        <div className='flex justify-between'>
            <Card className='flex w-full justify-between'>
                <CardContent>
                    <div className='grid grid-cols-3'>
                        <div className='flex flex-row space-x-2 col-span-2'>
                            <div className='w-40 h-40'>
                                <AvatarComponent source='/avatar.jpg' height={40} width={40} />
                            </div>
                            <div className='flex flex-col space-y-3 w-full justify-between ' >
                                <div>
                                    <div className='flex flex-row space-x-3 items-center'>
                                        <p className='text-md font-semibold'>{patientData.firstName} {patientData.lastName}</p>
                                        <div className='cursor-pointer bg-primary/10 rounded-full p-2'>
                                            <Phone size={13} aria-hidden={true} />
                                        </div>

                                        <div className='cursor-pointer bg-primary/10 rounded-full p-2'>

                                            <Mail size={13} aria-hidden={true} />
                                        </div>
                                        {/* <Button className='rounded-full' variant="outline" size="smallIcon">
                                        </Button> */}
                                    </div>
                                    <div className='flex flex-row space-x-5 mt-2'>
                                        <div className='text-xs flex flex-row items-center space-x-1'>
                                            <RiUser3Fill size={14} className='text-xs font-bold' />
                                            <p className='text-foreground/50'>{patientData.gender == 'M' ? 'Male' : 'Female'}</p>
                                        </div>

                                        <div className='text-xs flex flex-row items-center space-x-1'>
                                            <RiMapPin2Fill size={14} className='text-xs font-bold' />
                                            <p className='text-foreground/50'>{patientData.countryOfBirth || 'Kigali-Rwanda'}</p>
                                        </div>

                                        <div className='text-xs flex flex-row items-center space-x-1'>
                                            <RiBriefcase4Fill size={14} className='text-xs font-bold' />
                                            <p className='text-foreground/50'>{patientData.occupation || 'Teacher'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-row space-x-2 w-full'>

                                    <Vitalscard icon={<LocateIcon />} description='BMI' value={'22.4'} />

                                    <Vitalscard icon={<LocateIcon />} description='Weight (Kg)' value={'80'} />

                                    <Vitalscard icon={<LocateIcon />} description='Height (Cm)' value={'175'} />

                                    <Vitalscard icon={<LocateIcon />} description='Blood Pressure' value={'125/80'} />

                                </div>

                            </div>
                        </div>

                        <div className='flex flex-col justify-between'>
                            <Button variant="outline" className='place-self-end'>
                                <Edit /> Edit
                            </Button>

                            <p className='text-sm font-semibold place-self-end mt-4'>Own diagnosis</p>
                            <div className='place-self-end flex-row items-center'>
                                <div className='flex space-x-2'>
                                    <Badge variant="warning">Obesity</Badge>
                                    <Badge variant="warning">Uncontolled type2</Badge>
                                </div>
                            </div>


                            <p className='text-sm font-semibold place-self-end mt-4'>Health Barriers</p>
                            <div className='place-self-end flex-row items-center'>
                                <div className='flex space-x-2'>
                                    <Badge variant="secondary">Fear of medication</Badge>
                                    <Badge variant="secondary">Fear of operation</Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                </CardContent>

            </Card>

        </div>
    )
}
