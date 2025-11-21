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
    <div className="text-sm bg-white shadow-2xl rounded-xl mb-2 p-10 w-full max-w-4xl border border-gray-200">
        {/* <h1 className="text-3xl font-bold text-center text-gray-800 mb-10 tracking-tight">
          Patient Discharge Card
        </h1> */}

        {/* <Section title="Patient Information">
          <Row label="Patient ID" value={data.patientId} />
          <Row label="Patient File" value={data.patientFile} />
          <Row label="Doctor ID" value={data.doctorId} />
          <Row label="Discharge Date" value={formatDate(data.dischargeDate)} />
        </Section> */}

        <Section title="Diagnosis & Procedure">
          <Row label="Diagnosis" value={data.diagnosis} />
          <Row label="Procedure" value={data.procedure} />
          <Row label="Disposition" value={data.patientDisposition} />
        </Section>

        <Section title="Discharge Summary">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.dischargeSummary}</p>
        </Section>

        {data.medicationsAtDischarge?.length ? (
          <Section title="Medications at Discharge">
            <ul className="list-disc ml-6 text-gray-700">
              {data.medicationsAtDischarge.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </Section>
        ) : null}

        <Section title="Follow-Up Details">
          <Row label="Instructions" value={data.followUpInstructions} />
          <Row label="Follow-Up Required" value={data.isFollowUp ? "Yes" : "No"} />
          <Row label="Follow-Up Date" value={formatDate(data.followUpDate)} />
          <Row label="Follow-Up Duration (days)" value={String(data.followUpDuration)} />
          <Row label="Action" value={data.followUpAction} />
        </Section>

        <Section title="Review & Referral">
          <Row label="Review Date" value={formatDate(data.reviewDate)} />
          <Row label="Review Location" value={data.reviewLocation} />
          <Row label="Referral Date" value={formatDate(data.referralDate)} />
          <Row label="Referral Location" value={data.reeferralLocation} />
        </Section>
      </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-primary pl-3 mb-4">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="font-medium text-gray-600">{label}:</span>
      <span className="text-gray-800">{value || "-"}</span>
    </div>
  );
}