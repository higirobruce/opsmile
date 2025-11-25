import {
  BoxIcon,
  CalendarIcon,
  ChartLine,
  Cross,
  Edit,
  HospitalIcon,
  HouseIcon,
  PanelsTopLeftIcon,
  Plus,
  SettingsIcon,
  UsersRoundIcon,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timeline } from "@/components/ui/timeline";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SimpleTimeline from "../../components/timeline2";
import {
  RiEdit2Fill,
  RiFile3Fill,
  RiFileEditFill,
  RiFileList2Line,
  RiFileTextFill,
  RiHeartPulseFill,
  RiHospitalFill,
  RiHotelBedFill,
  RiHotelBedLine,
  RiLogoutBoxRFill,
  RiLogoutCircleFill,
  RiMedicineBottleFill,
  RiNewsFill,
  RiProfileFill,
  RiProfileLine,
  RiProgress1Fill,
  RiProgress2Fill,
  RiScissors2Fill,
  RiScissors2Line,
  RiTestTubeFill,
  RiUser2Fill,
  RiUser3Fill,
  RiUser6Fill,
  RiUserHeartFill,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MedicalHistoryCard from "./medical-history-card";
import { useEffect, useState } from "react";
import PatientSnapshot from "./patientSnapshot";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import VitalsInput from "./vitals-input-sheet";
import VitalsHistory from "./vitals-history";
import MedicalInputSheet from "./medical-input-sheet";
import moment from "moment";
import AnesthesiaInputSheet from "./anesthesia-input-sheet";
import SurgeryInputSheet from "./surgery-input-sheet";
import { Input } from "@/components/ui/input";
import SimpleBadge from "../../components/simple-badge";
import ProgressTabContent from "./progress-tab-content";
import DischargeTabContent from "./discharge-tab-content";
import MedicalTabContent from "./medical-tab-content";
import AnesthesiaTabContent from "./anesthesia-tab-content";
import SurgeryTabContent from "./surgery-tab-content";
import VitalsTabContent from "./vitals-tab-content";
import FollowUpTabContent from "./follow-up-tab-content";


export default function PatientTabs({
  patientFileData,
  refresh,
  currentTab,
  setCurrentTab
}: {
  currentTab: any,
  setCurrentTab: React.Dispatch<React.SetStateAction<String>>
  patientFileData: any;
  refresh: () => void;
}) {

  const [patientData, setPatientData] = useState({})


  useEffect(() => {
    setPatientData(patientFileData?.patient)
  }, [patientFileData]);

  return (
    <Tabs value={currentTab} defaultValue="tab-1">
      <Toaster />
      <ScrollArea>
        <TabsList className="text-foreground mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1">

          {/* <TabsTrigger
            value="tab-1"
            onClick={() => setCurrentTab("tab-1")}
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <RiUser3Fill
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Overview
          </TabsTrigger> */}

          <TabsTrigger
            value="tab-2"
            onClick={() => setCurrentTab("tab-2")}
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <RiHeartPulseFill
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Vital signs
          </TabsTrigger>

          <TabsTrigger
            value="tab-3"
            onClick={() => setCurrentTab("tab-3")}
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <RiMedicineBottleFill
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Consultation{/*Medical */}
          </TabsTrigger>

          {/* <TabsTrigger
            value="tab-4"
            onClick={() => setCurrentTab("tab-4")}
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <RiTestTubeFill
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Lab
          </TabsTrigger> */}

          {/* <TabsTrigger
            value="tab-5"
            onClick={() => setCurrentTab("tab-5")}
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <RiHotelBedFill
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Anesthesia
          </TabsTrigger> */}
          <TabsTrigger
            // disabled={!patientData?.anesthesia_records[patientData?.anesthesia_records?.length - 1 || 0]?.clearedForAnesthesiaBool}
            value="tab-6"
            onClick={() => setCurrentTab("tab-6")}
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <RiScissors2Fill
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Peri-operative
          </TabsTrigger>
          
          <TabsTrigger
            value="tab-8"
            onClick={() => setCurrentTab("tab-8")}
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <RiLogoutBoxRFill
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Discharge
          </TabsTrigger>

          <TabsTrigger
            value="tab-9"
            // disabled={!patientData['discharges'][0]?.isFollowUp}
            onClick={() => setCurrentTab("tab-9")}
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <HospitalIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Follow-up
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Overview */}
      {/* <TabsContent value="tab-1">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
            <div className="grid md:grid-cols-3 gap-3">

              <div className="col-span-2">
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex flex-row items-center space-x-2 justify-between">
                      <div className="flex flex-row items-center space-x-3">
                        <Button variant="outline" size="icon">
                          <RiMedicineBottleFill size={9} />
                        </Button>
                        <p className="text-sm font-semibold">Medical History</p>
                      </div>

                      <Button
                        className="self-end"
                        variant="outline"
                        onClick={() => setCurrentTab("tab-3")}
                      >
                        <Edit size={9} />
                        Edit
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-scroll ">
                    <div className="grid grid-cols-2 gap-3">
                      {patientData?.medical_assessments?.map(
                        (mh: any, index: number) => (
                          <MedicalHistoryCard
                            requests={false}
                            labRequests={[]}
                            key={index}
                            label={mh.diagnosis}
                            sublabel={[mh.pastMedicalHistory]}
                            description={mh.reasonForCancellation}
                            date={moment(mh.createdAt).fromNow()}
                            consentFileUrls={mh.uploadedFiles}
                          />
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </>
      </TabsContent> */}

      {/* Nursing */}
      <TabsContent value="tab-2" className="w-full">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
            <VitalsTabContent refresh={refresh} patientData={patientFileData} />
            {/* <VitalsHistory patientData={patientData} /> */}
          </div>
        </>
      </TabsContent>



      {/* Medical */}
      <TabsContent value="tab-3">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
            <MedicalTabContent patientData={patientFileData} refresh={refresh} />
          </div>
        </>
      </TabsContent>

      {/* Lab */}
      <TabsContent value="tab-4">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
            {/* <h1 className="text-xl text-foreground/80 ml-5">Pending Lab Requests</h1> */}
            <div className="grid grid-cols-3 gap-5">
              {patientFileData?.medical_assessments?.map((assessment: any) =>
                assessment?.labRequests?.map((request: any, index: number) => {
                  return request?.tests?.map((test: any, index: number) => {
                    return (
                      <div key={index} className="flex flex-col space-y-2 bg-white rounded-lg p-5 border border-gray-200">
                        <div className="flex flex-row justify-between items-center">
                          <p className="text-lg font-bold">{test?.name}</p>
                          <SimpleBadge text={test?.status} />
                        </div>
                        <Label>Sample collected</Label>
                        <Input placeholder="Enter sample collected (name)" />
                        <Label>Result</Label>
                        <Input placeholder="Enter result" />
                        <div><Button variant="outline">Save</Button></div>
                      </div>
                    )
                  })
                })
              )}

            </div>
          </div>
        </>
      </TabsContent>


      {/* Anesthesia */}
      {/* <TabsContent value="tab-5">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
            <AnesthesiaTabContent patientData={patientFileData} refresh={refresh} />
          </div>
        </>
      </TabsContent> */}

      {/* Surgery */}
      <TabsContent value="tab-6">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
            <SurgeryTabContent patientData={patientFileData} refresh={refresh} />
          </div>
        </>
      </TabsContent>

      {/* Discharge */}
      <TabsContent value="tab-8">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
            <DischargeTabContent patientData={patientFileData} refresh={refresh} />
          </div>
        </>
      </TabsContent>

      {/* Discharge */}
      <TabsContent value="tab-9">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
            <FollowUpTabContent patientData={patientFileData} refresh={refresh} />
          </div>
        </>
      </TabsContent>




    </Tabs>
  );
}
