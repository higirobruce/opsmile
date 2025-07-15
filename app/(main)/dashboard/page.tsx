import React from 'react'
import { ChartBarDefault } from './components/bar-chart'
import { ChartLineInteractive } from './components/lin-chart'

export default function dashboard() {
  return (
    <div className='flex flex-col w-full space-y-10'>
      <ChartLineInteractive/>
      <div className='grid grid-cols-3 gap-5'>

      <ChartBarDefault/>
      <ChartBarDefault/>
      <ChartBarDefault/>
      <ChartBarDefault/>
      </div>
    </div>
  )
}
