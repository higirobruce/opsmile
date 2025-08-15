import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

export default function MedicalHistoryCard({
  label,
  sublabel,
  description,
  date,
  consentFileUrls,
}: {
  label: string;
  sublabel?: string[];
  description?: string;
  date: string;
  consentFileUrls: [{
    name: string;
    base64Url: string;
  }];
}) {
  return (
    <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
      <div className="grid grow gap-2">
        <Label htmlFor={`2`}>
          {label + " "}
          <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
            ({" "}
            {sublabel
              ?.map((s, i) => {
                return s;
              })
              ?.join(", ")}
            )
          </span>
        </Label>
        <p id={`2-description`} className="text-sm font-bold">
          {description}
        </p>

        <div>
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
