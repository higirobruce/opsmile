
'use client'
import { ProgramStatusPieChart } from './components/program-status-pie';
import { PatientByAgePieChart } from './components/patient-by-age-pie';
import { PatientByGenderPieChart } from './components/patient-by-gender-pie';

export default function DashboardPage() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className='grid md:grid-cols-2 gap-2 place-content-content'>
          {/* <ProgramStatistics /> */}
          <div className='flex-1'>
            <ProgramStatusPieChart />
          </div>
          <div className='flex-1'>
            <PatientByAgePieChart />
          </div>

          <div className='flex-1'>
            <PatientByGenderPieChart />
          </div>
        </div>

        {/* <UserStatistics />
        <PatientData /> */}
        {/* <ActivityLogs /> */}

      </div>
    </div>
  );
}
