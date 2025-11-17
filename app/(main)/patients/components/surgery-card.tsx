import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Image as ImageIcon, CheckCircle, XCircle, Clock } from "lucide-react"
import moment from "moment"

export default function SurgeryRecordCard({ record }: { record: any }) {
  return (
    <Card className="max-w-3xl mx-auto shadow-lg rounded-md p-4 mb-4">
      <CardHeader>
        {/* <h2 className="text-xl font-semibold">Surgery Record</h2> */}
        <p className="text-xs text-gray-500">
          Surgery Date: {new Date(record.surgeryDate).toLocaleDateString()}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Patient and Team Info */}
        <div>
          <h3 className="font-medium text-gray-700">Surgical Team</h3>
          <div className="mt-2 grid grid-cols-2 text-xs gap-y-1">
            <p><span className="font-semibold">Surgeon:</span> {record.surgeon?.firstName}</p>
            <p><span className="font-semibold">Anesthesiologist:</span> {record.anesthesiologist?.firstName}</p>
            <p><span className="font-semibold">Observers:</span> {record.observers || "-"}</p>
          </div>
          {record.assistingSurgeons?.length > 0 && (
            <p className="text-xs mt-1">
              <span className="font-semibold">Assisting Surgeons:</span>{" "}
              {record.assistingSurgeons.map((s: any) => s.firstName).join(", ")}
            </p>
          )}
          {record.nurses?.length > 0 && (
            <p className="text-xs">
              <span className="font-semibold">Nurses:</span>{" "}
              {record.nurses.map((n: any) => n.firstName).join(", ")}
            </p>
          )}
        </div>

        <Separator />

        {/* Surgery Details */}
        <div>
          <h3 className="font-medium text-gray-700">Surgery Details</h3>
          <div className="mt-2 grid grid-cols-2 gap-y-1 text-xs">
            <p><span className="font-semibold">Type:</span> {record.surgeryType}</p>
            <p><span className="font-semibold">Status:</span>{" "}
              <Badge
                className={
                  record.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : record.status === "IN_PROGRESS"
                    ? "bg-yellow-100 text-yellow-700"
                    : record.status === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }
              >
                {record.status}
              </Badge>
            </p>
            <p><span className="font-semibold">Start date:</span> {record.surgeryDate ? moment(record.surgeryDate).format("YYYY-MM-DD HH:mm A") : "-"}</p>
            <p><span className="font-semibold">End date:</span> {record.surgeryEndDate ? moment(record.surgeryEndDate).format("YYYY-MM-DD HH:mm A") : "-"}</p>
            <p><span className="font-semibold">Estimated Duration:</span> {record.estimatedDuration || "-"} min</p>
            <p><span className="font-semibold">Actual Duration:</span> {record.actualDuration || "-"} min</p>
            {/* <p><span className="font-semibold">Blood Loss:</span> {record.bloodLoss ? `${record.bloodLoss} ml` : "-"}</p> */}
          </div>
          <p className="mt-2 text-xs"><span className="font-semibold">Surgery Notes:</span> {record.procedure}</p>
        </div>

        <Separator />

        {/* Notes and Instructions */}
        {/* <div>
          <h3 className="font-medium text-gray-700">Notes & Follow-up</h3>
          <div className="mt-2 space-y-1 text-xs">
            <p><span className="font-semibold">Surgical Notes:</span> {record.surgicalNotes || "N/A"}</p>
            <p><span className="font-semibold">Post-Operative Instructions:</span> {record.postOperativeInstructions || "N/A"}</p>
            <p><span className="font-semibold">Follow-Up Date:</span> {record.followUpDate ? new Date(record.followUpDate).toLocaleDateString() : "N/A"}</p>
          </div>
        </div>

        <Separator /> */}

        {/* Revision Section */}
        {/* <div>
          <h3 className="font-medium text-gray-700">Revision</h3>
          <div className="mt-2 text-xs flex items-center gap-2">
            {record.isRevisionNeeded ? (
              <>
                <CheckCircle className="text-green-500 h-4 w-4" />
                <span>Revision Needed</span>
              </>
            ) : (
              <>
                <XCircle className="text-gray-400 h-4 w-4" />
                <span>No Revision Required</span>
              </>
            )}
          </div>
          {record.revisionReason && (
            <p className="text-xs mt-1">
              <span className="font-semibold">Reason:</span> {record.revisionReason}
            </p>
          )}
        </div>
        <Separator /> */}


        {/* Medications */}
        {/* {record.medications?.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700">Medications</h3>
            <ul className="mt-2 list-disc list-inside text-xs">
              {record.medications.map((m: string, i: number) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <Separator />
          </div>
        )} */}


        {/* Complications */}
        {record.complications?.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700">Complications</h3>
            <ul className="mt-2 list-disc list-inside text-xs text-red-700">
              {record.complications.map((c: string, i: number) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
            <Separator />
          </div>
        )}


        {/* Files & Images */}
        {record.consentFileUrls?.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700">Consent Files</h3>
            <ul className="mt-2 text-xs">
              {record.consentFileUrls.map((file: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <a href={file.base64Url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {record.beforeSurgeryImageUrls?.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700">Intra-operative Photos</h3>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {record.beforeSurgeryImageUrls.map((img: any, i: number) => (
                <a key={i} href={img.base64Url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={img.base64Url}
                    alt={img.name}
                    className="rounded-lg border h-24 w-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {record.afterSurgeryImageUrls?.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700">After Surgery Images</h3>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {record.afterSurgeryImageUrls.map((img: any, i: number) => (
                <a key={i} href={img.base64Url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={img.base64Url}
                    alt={img.name}
                    className="rounded-lg border h-24 w-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="text-xs text-gray-400">
        Created on: {new Date(record.createdAt).toLocaleString()}
      </CardFooter>
    </Card>
  )
}