import React from 'react'
import CallToAction from './call-to-action'
import SignInForm from './sign-in-form'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className='flex h-screen'>
      {/* <h1 className='text-3xl md:text-5xl font-bold justify-center text-center'>
            Empowering Patient-Centered Care with Smart Technology

            <span className='pt-5 block text-sm md:text-lg font-light justify-center text-center'>
                A unified platform to capture, manage, and analyze patient data seamlessly — from screening to recovery.
            </span>
        </h1> */}

      <div className='flex flex-col bg-white w-[600px] p-8 justify-center'>
        {/* <CallToAction/> */}
        <div className='flex flex-col justify-center items-center'>
          <Image src='/logo.png' alt='logo' width={100} height={100} />
          <p className='text-xl font-bold mb-2'>SurgeryUpp</p>
        </div>
        <h1 className='text-lg font-bold mb-2 '>Login</h1>

        <SignInForm />
      </div>
    </div>
  )
}
