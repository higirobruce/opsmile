import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, MapPin, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Program {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
  coordinator: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  patients: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
    nid: string;
  }[];
}

const ProgramDetailsPage: React.FC<{ program: Program | undefined }> = ({ program }) => {
  const statusColors: Record<string, string> = {
    ongoing: "bg-primary text-white",
    completed: "bg-blue-500 text-white",
    upcoming: "bg-gray-400 text-white",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="mt-4 space-y-6">
      {/* Program Overview */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader className="rounded-t-md flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {program?.name}
            </CardTitle>
            <p className="text-gray-500">{program?.description}</p>
          </div>
          <Badge
            className={`${statusColors[program?.status || 'ongoing'] || "bg-gray-100 text-gray-800"} capitalize  text-xs rounded-2xl mt-2 sm:mt-0`}
          >
            {program?.status}
          </Badge>
        </CardHeader>

        <CardContent className="p-6 grid sm:grid-cols-2 gap-6 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>
              <strong>Start:</strong>{" "}
              {new Date(program?.startDate || '').toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>
              <strong>End:</strong>{" "}
              {new Date(program?.endDate || '').toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>
              <strong>Location:</strong> {program?.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>
              <strong>Patients:</strong> {program?.patients?.length}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">

        {/* Coordinator Info */}
        <Card className="shadow-sm border border-gray-200 max-h-[250px] overflow-y-auto">
          <CardHeader className="rounded-t-md">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" /> Program Coordinator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-800 font-medium">
              {program?.coordinator?.firstName} {program?.coordinator?.lastName}
            </p>
            <p className="text-gray-600 text-sm">{program?.coordinator?.email}</p>
            <p className="text-gray-500 text-sm capitalize">
              Role: {program?.coordinator?.role}
            </p>
          </CardContent>
        </Card>

        {/* Patient List */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="rounded-t-md">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" /> Registered Patients
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            {program?.patients?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No patients registered yet.
              </p>
            ) : (
              <div className="divide-y divide-gray-200">
                {program?.patients?.map((patient) => (
                  <div
                    key={patient._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3 hover:bg-gray-50 rounded-md px-2 transition-all"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        NID: {patient.nid || "N/A"} •{" "}
                        {new Date(patient.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 mt-1 sm:mt-0">
                      📞 {patient.phoneNumber || "No number"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      {/* Footer Action */}
      {/* <div className="flex justify-end">
        
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
          Edit Program
        </Button>
      </div> */}
    </div>
  );
};

export default ProgramDetailsPage;