import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, FileText, Image as ImageIcon } from "lucide-react"

export default function MedicalAssessmentCard({ record }: { record: any }) {
    return (
        <Card className="max-w-3xl mx-auto shadow-lg rounded-md p-4 mb-4">
            <CardHeader>
                {/* <h2 className="text-xl font-semibold">Medical Assessment</h2> */}
                <p className="text-sm text-gray-500">
          Consultation Date: {new Date(record.assessmentDate).toLocaleDateString()}
        </p>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Patient Info */}
                {/* <div>
                    <h3 className="font-medium text-gray-700">Patient Information</h3>
                    <div className="mt-2 grid grid-cols-2 text-xs">
                        <p><span className="font-semibold">Patient:</span> {record.patient?.name}</p>
                        <p><span className="font-semibold">Done By:</span> {record.doneBy?.fullName}</p>
                    </div>
                </div>

                <Separator /> */}

                {/* Clinical Summary */}
                <div>
                    <h3 className="font-medium text-gray-700">Clinical Summary</h3>
                    <div className="mt-2 space-y-3 text-xs">
                        <p><span className="font-semibold">Past Medical History:</span> {record.pastMedicalHistory || "N/A"}</p>
                        <p><span className="font-semibold">Physical Exams:</span> {record.physicalExams || "N/A"}</p>
                        <p><span className="font-semibold">Lab Exams:</span> {record.labExams || "N/A"}</p>
                        <p><span className="font-semibold">Consultative Notes:</span> {record.consultativeNotes || "N/A"}</p>
                        <p><span className="font-semibold">Diagnosis:</span> {record.diagnosis || "N/A"}</p>
                    </div>
                </div>

                <Separator />

                {/* Surgical Decision */}
                <div>
                    <h3 className="font-medium text-gray-700">Surgical Decision</h3>
                    <div className="mt-2 grid grid-cols-2 gap-y-1 text-xs">
                        <p><span className="font-semibold">Decision:</span>{" "}
                            <Badge
                                className={
                                    record.surgicalDecision === "surgery"
                                        ? "bg-green-100 text-green-700"
                                        : record.surgicalDecision === "no_surgery"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                }
                            >
                                {record.surgicalDecision?.toUpperCase()}
                            </Badge>
                        </p>
                        {/* <p><span className="font-semibold">Cleared for Surgery:</span>{" "}
                            {record.clearedForSurgery ? (
                                <CheckCircle className="inline text-green-500 h-4 w-4 ml-1" />
                            ) : (
                                <XCircle className="inline text-red-500 h-4 w-4 ml-1" />
                            )}
                        </p> */}
                        {record.reasonForPending && (
                            <p className="col-span-2">
                                <span className="font-semibold">Reason for Pending:</span> {record.reasonForPending}
                            </p>
                        )}
                        {record.destinationForTransferred && (
                            <p className="col-span-2">
                                <span className="font-semibold">Transferred To:</span> {record.destinationForTransferred}
                            </p>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Uploaded Files */}
                {record.uploadedFiles?.length > 0 && (
                    <div>
                        <h3 className="font-medium text-gray-700">Uploaded Files</h3>
                        <ul className="mt-2 text-sm">
                            {record.uploadedFiles.map((file: any, i: number) => (
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

                {/* Uploaded Photos */}
                {record.uploadedPhotos?.length > 0 && (
                    <div>
                        <h3 className="font-medium text-gray-700">Pre-Operative Photos</h3>
                        <div className="mt-2 grid grid-cols-3 gap-3">
                            {record.uploadedPhotos.map((photo: any, i: number) => (
                                <a
                                    key={i}
                                    href={photo.base64Url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={photo.base64Url}
                                        alt={photo.name}
                                        className="rounded-lg border h-24 w-full object-cover"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Uploaded Lab Results */}
                {record.uploadedLabExams?.length > 0 && (
                    <div>
                        <h3 className="font-medium text-gray-700">Uploaded Lab Results</h3>
                        <ul className="mt-2 text-sm">
                            {record.uploadedLabExams.map((file: any, i: number) => (
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