import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

export default function MedicalHistoryCard({
  label,
  sublabel,
  description,
  date,
  consentFileUrls,
  requests,
  labRequests
}: {
  label: string;
  sublabel?: string[];
  description?: string;
  date: string;
  consentFileUrls: [{
    name: string;
    base64Url: string;
  }];
  requests: boolean;
  labRequests: any[];
}) {
  return (
    <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none mb-4">
      <div className="grid grow gap-2">
        <Label htmlFor={`2`} className="whitespace-pre-line">
          {label + " "}
          {/* <span className="text-foreground/50 text-xs leading-[inherit] font-normal">
            (
            {sublabel}
            ) 
          </span> */}
        </Label>
        <p id={`2-description`} className="text-sm font-bold whitespace-pre-line">
          {sublabel}
        </p>

        {requests && (
          <div className="text-sm whitespace-pre-line">
            <p className="font-bold">Lab requests: </p>
            {labRequests?.map((request:any, index:number)=>{
              return request?.tests?.map((test:any, index:number)=><p key={index} className="text-xs">{test?.name}</p>)
            })}
          </div>
        )}
        <div>

        </div>

        <div className="grid md:grid-cols-2 gap-2 ">
          <p className="text-xs text-muted-foreground">{date}</p>
          {consentFileUrls?.length > 0 && (
            consentFileUrls?.map((file, index) => (
              <Link
                key={index}
                href={file.base64Url}
                target="_blank"
                className="text-xs text-blue-500 hover:underline"
              >
                {file.name}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
