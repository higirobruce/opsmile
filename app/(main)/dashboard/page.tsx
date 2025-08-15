'use client'
import React, {  } from 'react'
import { ChartBarDefault } from './components/bar-chart'
import { ChartLineInteractive } from './components/lin-chart'


export default function Dashboard() {
  return (
    <div className='flex flex-col w-full space-y-10'>
      <ChartLineInteractive />
      <div className='grid md:grid-cols-3 gap-1'>

        <ChartBarDefault />
        <ChartBarDefault />
        <ChartBarDefault />
        <ChartBarDefault />
      </div>
    </div>
  )
}
