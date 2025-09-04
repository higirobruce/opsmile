import React from 'react'
import CallToAction from './call-to-action'
import SignInForm from './sign-in-form'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className='flex items-center justify-center h-[80vh]'>
      {/* <h1 className='text-3xl md:text-5xl font-bold justify-center text-center'>
            Empowering Patient-Centered Care with Smart Technology

            <span className='pt-5 block text-sm md:text-lg font-light justify-center text-center'>
                A unified platform to capture, manage, and analyze patient data seamlessly — from screening to recovery.
            </span>
        </h1> */}

      <div className='flex flex-col mx-auto w-[400px] bg-white px-10 pb-10 rounded-lg'>
        {/* <CallToAction/> */}
        <div className='flex flex-col justify-center items-center'>
          <Image src='/smile+logo.png' alt='logo' width={100} height={100} />
        </div>
        <h1 className='text-lg font-bold mb-2 text-foreground/50'>Login</h1>

        <SignInForm />
      </div>
    </div>
  )
}
