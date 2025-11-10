import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VitalSignProps {
  
}

const getColor = (value: number, range: [number, number], critical?: [number, number]) => {
  if (critical && (value < critical[0] || value > critical[1])) return "text-red-600 font-semibold";
  if (value < range[0] || value > range[1]) return "text-orange-500 font-semibold";
  return "text-green-600";
};

const VitalSignCard: React.FC<any> = ({ vitalSign }) => {
  

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 rounded-md border border-gray-200 mb-4">
      <CardHeader className="bg-gray-50 rounded-t-2xl">
        
        <p className="text-sm text-gray-500">
          Nurse: {vitalSign?.nurse?.firstName || "N/A"} {" "}
          {vitalSign?.nurse?.lastName || "N/A"} •{" "}
          {vitalSign?.assessmentDateTime ? new Date(vitalSign?.assessmentDateTime).toLocaleString() : "No Date"}
        </p>
      </CardHeader>

      <CardContent className="p-4 space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <p>
            <strong>BP:</strong>{" "}
            <span
              className={getColor(
                vitalSign?.bloodPressureSystolic,
                [90, 130],
                [80, 160]
              )}
            >
              {vitalSign?.bloodPressureSystolic}/{vitalSign?.bloodPressureDiastolic} mmHg
            </span>
          </p>

          <p>
            <strong>Temp:</strong>{" "}
            <span className={getColor(vitalSign?.temperature, [36, 37.5], [35, 39])}>
              {vitalSign?.temperature.toFixed(1)} °C
            </span>
          </p>

          <p>
            <strong>Pulse:</strong>{" "}
            <span className={getColor(vitalSign?.pulseRate, [60, 100], [40, 120])}>
              {vitalSign?.pulseRate} bpm
            </span>
          </p>

          <p>
            <strong>Resp:</strong>{" "}
            <span className={getColor(vitalSign?.respirationRate, [12, 20], [8, 30])}>
              {vitalSign?.respirationRate} /min
            </span>
          </p>

          <p>
            <strong>O₂ Sat:</strong>{" "}
            <span className={getColor(vitalSign?.oxygenSaturation, [95, 100], [90, 100])}>
              {vitalSign?.oxygenSaturation}%
            </span>
          </p>

          <p>
            <strong>Weight:</strong> {vitalSign?.weight} kg
          </p>

          <p>
            <strong>Height:</strong> {vitalSign?.height} cm
          </p>

          <p>
            <strong>BMI:</strong>{" "}
            <span
              className={getColor(
                vitalSign?.bmi,
                [18.5, 25],
                [15, 35]
              )}
            >
              {vitalSign?.bmi.toFixed(1)}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalSignCard;