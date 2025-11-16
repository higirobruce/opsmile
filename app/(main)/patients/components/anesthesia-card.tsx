import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, FileText } from "lucide-react"

export default function AnesthesiaRecordCard({ record }: { record: any }) {
  return (
    <Card className="max-w-3xl mx-auto shadow-lg rounded-md p-4 mb-4">
      <CardHeader>
        {/* <h2 className="text-xl font-semibold">Anesthesia Record</h2> */}
        <p className="text-sm text-gray-500">
          Date: {new Date(record.dateOfReview).toLocaleDateString()}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Assessment Section */}
        <div>
          <h3 className=" text-gray-700">Assessment & Plan</h3>
          <div className="mt-2 grid grid-cols-2 text-xs gap-y-1">
            <p><span className="font-semibold">Anesthesia Type:</span> {record.anesthesiaType}</p>
            <p><span className="font-semibold">ASA Score:</span> {record.asaScore}</p>
            <p><span className="font-semibold">Mallampati Score:</span> {record.mallampatiScore}</p>
            <p><span className="font-semibold">Cleared for Anesthesia:</span>{" "}
              {record.clearedForAnesthesiaBool ? (
                <Badge className="bg-green-100 text-green-700">Yes</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700">No</Badge>
              )}
            </p>
          </div>
          <p className="mt-2 text-sm">
            <span className="font-semibold">Proposed Plan:</span> {record.proposedPlan || "N/A"}
          </p>
        </div>

        <Separator />

        {/* Medications */}
        {record.medications?.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700">Medications</h3>
            <ul className="mt-2 text-sm list-disc list-inside">
              {record.medications.map((m: any, i: number) => (
                <li key={i}>
                  {m.name} — {m.dosage}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        {/* Checklists */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            {record.preanesthesiaChecklistDone ? (
              <CheckCircle className="text-green-500 h-4 w-4" />
            ) : (
              <XCircle className="text-red-500 h-4 w-4" />
            )}
            <span>Pre-Anesthesia Checklist</span>
          </div>

          {/* <div className="flex items-center space-x-2 text-sm">
            {record.surgicalSafetyChecklistDone ? (
              <CheckCircle className="text-green-500 h-4 w-4" />
            ) : (
              <XCircle className="text-red-500 h-4 w-4" />
            )}
            <span>Surgical Safety Checklist</span>
          </div> */}
        </div>

        <Separator />

        {/* Consent Files */}
        {record.consentFileUrl?.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700">Consent Files</h3>
            <ul className="mt-2 text-sm">
              {record.consentFileUrl.map((file: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <a
                    href={file.base64Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {record.anesthesiaChecklistUrl?.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700">Anesthesia Checklist Files</h3>
            <ul className="mt-2 text-sm">
              {record.anesthesiaChecklistUrl.map((file: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <a
                    href={file.base64Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="text-xs text-gray-400 flex justify-between items-center">
        <div>Created on: {new Date(record.createdAt).toLocaleString()}</div>
        <div>Done by: {record.doneBy?.firstName} {record.doneBy?.lastName}</div>
      </CardFooter>
    </Card>
  )
}