import {
  BoxIcon,
  CalendarIcon,
  ChartLine,
  Cross,
  Edit,
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


export default function PatientTabs({
  patientData,
  refresh,
}: {
  patientData: any;
  refresh: () => void;
}) {
  const [tab, setTab] = useState("tab-1");


  useEffect(() => {
    console.log(patientData);
  }, []);
  return (
    <Tabs value={tab} defaultValue="tab-1">
      <Toaster />
      <ScrollArea>
        <TabsList className="text-foreground mb-3 h-auto gap-2 rounded-none bg-transparent px-0 py-1">

          <TabsTrigger
            value="tab-1"
            onClick={() => setTab("tab-1")}
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
            onClick={() => setTab("tab-2")}
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
            onClick={() => setTab("tab-3")}
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
            onClick={() => setTab("tab-4")}
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <RiTestTubeFill
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Lab
          </TabsTrigger>

          <TabsTrigger
            value="tab-5"
            onClick={() => setTab("tab-5")}
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
            disabled={!patientData.anesthesia_records[patientData.anesthesia_records?.length - 1 || 0]?.clearedForAnesthesiaBool}
            value="tab-6"
            onClick={() => setTab("tab-6")}
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
            disabled={!patientData.anesthesia_records[patientData.anesthesia_records?.length - 1 || 0]?.clearedForAnesthesiaBool}
            value="tab-7"
            onClick={() => setTab("tab-7")}
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
            value="tab-8"
            onClick={() => setTab("tab-8")}
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

      {/* Overview */}
      <TabsContent value="tab-1">
        <>
          <div className="flex flex-col space-y-3">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
            <div className="grid md:grid-cols-3 gap-3">
              {/* Timeline for the patients interaction with the doctor */}
              <div className="md:col-span-1">
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex flex-row items-center space-x-2">
                      <Button variant="outline" size="icon">
                        <CalendarIcon size={9} />
                      </Button>
                      <p className="text-sm font-semibold">Timeline</p>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-scroll ">
                    <SimpleTimeline patientId={patientData?._id} />
                  </CardContent>
                </Card>
              </div>

              {/* Medical History */}
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
                        onClick={() => setTab("tab-3")}
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
                            key={index}
                            label={mh.diagnosis}
                            sublabel={mh.pastMedicalHistory}
                            description={mh.reasonForCancellation}
                            date={moment(mh.created_at).fromNow()}
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
      </TabsContent>

      {/* Nursing */}
      <TabsContent value="tab-2">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
            <VitalsInput refresh={refresh} patientData={patientData} />
            <VitalsHistory patientData={patientData} />
          </div>
        </>
      </TabsContent>



      {/* Medical */}
      <TabsContent value="tab-3">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />

            {/* Medical History */}
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

                    <MedicalInputSheet
                      refresh={refresh}
                      patientData={patientData}
                    />
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-scroll ">
                  <div className="grid grid-cols-2 gap-3">
                    {patientData?.medical_assessments?.map(
                      (mh: any, index: any) => (
                        <MedicalHistoryCard
                          key={index}
                          label={mh.diagnosis}
                          sublabel={mh.pastMedicalHistory}
                          description={mh.reasonForCancellation}
                          date={moment(mh.created_at).fromNow()}
                          consentFileUrls={mh.uploadedFiles}
                        />
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      </TabsContent>

      {/* Lab */}
      <TabsContent value="tab-4">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
          </div>
        </>
      </TabsContent>


      {/* Anesthesia */}
      <TabsContent value="tab-5">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
            {/* Anesthesia History */}
            <div className="col-span-2">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex flex-row items-center space-x-2 justify-between">
                    <div className="flex flex-row items-center space-x-3">
                      <Button variant="outline" size="icon">
                        <RiHotelBedLine size={9} />
                      </Button>
                      <p className="text-sm font-semibold">
                        Anesthesia History
                      </p>
                    </div>

                    <AnesthesiaInputSheet
                      refresh={refresh}
                      patientData={patientData}
                    />
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-scroll ">
                  <div className="grid grid-cols-2 gap-3">
                    {patientData?.anesthesia_records?.map(
                      (an: any, index: any) => (
                        <MedicalHistoryCard
                          key={index}
                          label={an.clearedForAnesthesiaBool ? 'Cleared for Anesthesia' : 'Not cleared for Anesthesia'}
                          sublabel={[an.pastAnesteticHistory]}
                          description={an.proposedPlan}
                          date={moment(an.created_at).fromNow()}
                          consentFileUrls={an.consentFileUrl}
                        />
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      </TabsContent>

      {/* Surgery */}
      <TabsContent value="tab-6">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
            {/* Surgery History */}

            <div className="col-span-2">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex flex-row items-center space-x-2 justify-between">
                    <div className="flex flex-row items-center space-x-3">
                      <Button variant="outline" size="icon">
                        <RiScissors2Line size={9} />
                      </Button>
                      <p className="text-sm font-semibold">Sugery History</p>
                    </div>

                    <SurgeryInputSheet
                      refresh={refresh}
                      patientData={patientData}
                    />
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-scroll ">
                  <div className="grid grid-cols-2 gap-3">
                    {patientData?.surgeries?.map((surgery: any, index: any) => (
                      <MedicalHistoryCard
                        key={index}
                        label={surgery.surgeryType}
                        sublabel={[surgery.status]}
                        description={surgery.surgicalNotes}
                        date={moment(surgery.surgeryDate).fromNow()}
                        consentFileUrls={surgery.consentFileUrls}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      </TabsContent>

      {/* Progress */}
      <TabsContent value="tab-7">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
          </div>
        </>
      </TabsContent>

      {/* Discharge */}
      <TabsContent value="tab-8">
        <>
          <div className="flex flex-col space-y-5">
            <PatientSnapshot isHeaderSection={true} patientData={patientData} />
          </div>
        </>
      </TabsContent>


    </Tabs>
  );
}
