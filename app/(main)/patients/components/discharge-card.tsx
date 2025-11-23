import React from "react";

type DischargeData = {
  patientId: string;
  patientFile: string;
  doctorId: string;
  dischargeDate: string | Date;
  dischargeSummary: string;
  medicationsAtDischarge?: string[];
  followUpInstructions: string;
  diagnosis: string;
  procedure: string;
  patientDisposition: string;
  reviewDate: string | Date;
  isFollowUp: boolean;
  followUpDate: string | Date;
  followUpDuration: number;
  followUpAction: string;
  reviewLocation: string;
  referralDate: string | Date;
  reeferralLocation: string;
};

const formatDate = (date: string | Date) => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString();
};

export default function DischargeCard({ data }: { data: DischargeData }) {
  return (
    <div></div>
  );
}
