import React from 'react'
import CallToAction from './call-to-action'

export default function Hero() {
  return (
    <div className='flex flex-col max-w-4xl justify-center m-auto pt-20'>
        <h1 className='text-5xl font-bold justify-center text-center'>
            Empowering Patient-Centered Care with Smart Technology

            <span className='pt-5 block text-lg font-light justify-center text-center'>
                A unified platform to capture, manage, and analyze patient data seamlessly — from screening to recovery.
            </span>
        </h1>

        <div className='pt-10'>
            <CallToAction/>
        </div>
    </div>
  )
}
