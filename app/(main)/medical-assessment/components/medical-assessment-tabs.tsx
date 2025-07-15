import {
    BoxIcon,
    CalendarIcon,
    ChartLine,
    Edit,
    HouseIcon,
    PanelsTopLeftIcon,
    SettingsIcon,
    UsersRoundIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Timeline } from "@/components/ui/timeline"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import SimpleTimeline from "../../components/timeline2"
import HeaderSection from "./headerSection"
import { RiEdit2Fill, RiFile3Fill, RiFileEditFill, RiFileList2Line, RiFileTextFill, RiHeartPulseFill, RiHospitalFill, RiHotelBedFill, RiLogoutBoxRFill, RiLogoutCircleFill, RiMedicineBottleFill, RiNewsFill, RiProfileFill, RiProfileLine, RiProgress1Fill, RiProgress2Fill, RiScissors2Fill, RiUser2Fill, RiUser3Fill, RiUser6Fill, RiUserHeartFill } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import MedicalHistoryCard from "./medical-history-card"
import { useState } from "react"

const medicalHistory = [
    {
        "label": "Chronic Conditions",
        "subLabel": "Ongoing or previously diagnosed illnesses",
        "description": "Hypertension, Diabetes, Asthma"
    },
    {
        "label": "Allergies",
        "subLabel": "Known allergies to medications or substances",
        "description": "Penicillin – causes rash and itching"
    },
    {
        "label": "Current Medications",
        "subLabel": "Drugs the patient is currently taking",
        "description": "Metformin 500mg twice daily"
    },
    {
        "label": "Past Surgeries",
        "subLabel": "Any surgical procedures in the past",
        "description": "Appendectomy (2010), Cesarean section (2015)"
    },
    {
        "label": "Family History",
        "subLabel": "Medical conditions in close family members",
        "description": "Mother – Diabetes, Father – Stroke"
    },
    {
        "label": "Smoking History",
        "subLabel": "Current or past tobacco use",
        "description": "Smokes 5 cigarettes/day for 10 years"
    },
    {
        "label": "Alcohol Use",
        "subLabel": "Frequency and quantity of alcohol consumption",
        "description": "Drinks occasionally on weekends"
    },
    {
        "label": "Occupation",
        "subLabel": "Patient’s job or regular work",
        "description": "Farmer, Driver, Teacher"
    },
    {
        "label": "Physical Activity",
        "subLabel": "Regular exercise or activity level",
        "description": "Walks 30 minutes every day"
    },
    {
        "label": "Dietary Habits",
        "subLabel": "Food preferences or restrictions",
        "description": "Vegetarian, avoids salt and sugar"
    },
    {
        "label": "Additional Notes",
        "subLabel": "Anything else clinically relevant",
        "description": "History of depression, prefers female doctor"
    }
]

export default function PatientTabs({ patientData }: { patientData: any }) {
    const [tab, setTab] = useState('tab-1')
    return (
        <Tabs value={tab} defaultValue="tab-1">
            <ScrollArea>
                <TabsList className="text-foreground mb-3 h-auto gap-2 rounded-none bg-transparent px-0 py-1">
                    <TabsTrigger
                        value="tab-1"
                        onClick={() => setTab('tab-1')}
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        <RiUser3Fill
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            aria-hidden="true"
                        />
                        Overview
                    </TabsTrigger>
                    
                    
                    <TabsTrigger
                        value="tab-2"
                        onClick={() => setTab('tab-2')}
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        <RiHeartPulseFill
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            aria-hidden="true"
                        />
                        Nursing
                    </TabsTrigger>
                    <TabsTrigger
                        value="tab-3"
                        onClick={() => setTab('tab-3')}
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        <RiMedicineBottleFill
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            aria-hidden="true"
                        />
                        Medical
                    </TabsTrigger>
                    <TabsTrigger
                        value="tab-4"
                        onClick={() => setTab('tab-4')}
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        <RiHotelBedFill
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            aria-hidden="true"
                        />
                        Anesthesia
                    </TabsTrigger>
                    <TabsTrigger
                        value="tab-5"
                        onClick={() => setTab('tab-5')}
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        <RiScissors2Fill
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            aria-hidden="true"
                        />
                        Surgery
                    </TabsTrigger>

                    <TabsTrigger
                        value="tab-6"
                        onClick={() => setTab('tab-6')}
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        <RiUserHeartFill
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            aria-hidden="true"
                        />
                        Progress
                    </TabsTrigger>

                    <TabsTrigger
                        value="tab-7"
                        onClick={() => setTab('tab-7')}
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        <RiLogoutBoxRFill
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            aria-hidden="true"
                        />
                        Discharge
                    </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <TabsContent value="tab-1">
                <>
                    <div className="flex flex-col space-y-3">
                        <HeaderSection patientData={patientData} />
                        <div className="grid grid-cols-3 gap-3">
                            {/* Timeline for the patients interaction with the doctor */}
                            <div className="col-span-1">
                                <Card >
                                    <CardHeader className='border-b'>
                                        <div className="flex flex-row items-center space-x-2">
                                            <Button variant="outline" size="icon">
                                                <CalendarIcon size={9} />
                                            </Button>
                                            <p className="text-sm font-semibold">Timeline</p>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="h-[calc(100vh-40rem)] overflow-scroll ">

                                        <SimpleTimeline />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Medical History */}
                            <div className="col-span-2">
                                <Card >
                                    <CardHeader className='border-b'>
                                        <div className="flex flex-row items-center space-x-2 justify-between">
                                            <div className="flex flex-row items-center space-x-3">
                                                <Button variant="outline" size="icon">
                                                    <RiFileList2Line size={9} />
                                                </Button>
                                                <p className="text-sm font-semibold">Medical History</p></div>

                                            <Button className="self-end" variant="outline" onClick={() => setTab('tab-3')}>
                                                <Edit size={9} />
                                                Edit
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="max-h-[calc(100vh-40rem)] overflow-scroll ">
                                        <div className="grid grid-cols-2 gap-3">
                                            {medicalHistory.map((mh, index) => (
                                                <MedicalHistoryCard key={index} label={mh.label} sublabel={mh.subLabel} description={mh.description} />
                                            ))}



                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </>
            </TabsContent>
            
            <TabsContent value="tab-2">
                <>
                    <div className="flex flex-col space-y-5">
                        <HeaderSection patientData={patientData} />
                    </div>
                </>
            </TabsContent>
            <TabsContent value="tab-3">
                <>
                    <div className="flex flex-col space-y-5">
                        <HeaderSection patientData={patientData} />
                    </div>
                </>
            </TabsContent>
            <TabsContent value="tab-4">
                <>
                    <div className="flex flex-col space-y-5">
                        <HeaderSection patientData={patientData} />
                    </div>
                </>
            </TabsContent>
            <TabsContent value="tab-5">
                <>
                    <div className="flex flex-col space-y-5">
                        <HeaderSection patientData={patientData} />
                    </div>
                </>
            </TabsContent>
             <TabsContent value="tab-6">
                <>
                    <div className="flex flex-col space-y-5">
                        <HeaderSection patientData={patientData} />
                    </div>
                </>
            </TabsContent>

             <TabsContent value="tab-7">
                <>
                    <div className="flex flex-col space-y-5">
                        <HeaderSection patientData={patientData} />
                    </div>
                </>
            </TabsContent>
             <TabsContent value="tab-8">
                <>
                    <div className="flex flex-col space-y-5">
                        <HeaderSection patientData={patientData} />
                    </div>
                </>
            </TabsContent>
        </Tabs>
    )
}
