import React from 'react'
import CallToAction from './call-to-action'
import SignInForm from './sign-in-form'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className='flex'>
     
      <div className='flex flex-col bg-white w-[400px] rounded-lg p-8 mt-44 mx-auto justify-center'>
        {/* <CallToAction/> */}
        <div className='flex flex-col justify-center items-center mb-8'>
          <Image src='/logo.png' alt='logo' width={100} height={100} />
          <p className='text-xl font-bold mb-2'>Sign in to SurgeryUpp</p>
          <p className='text-sm'>Welcome bank! Sign in to continue</p>
        </div>
        
        

        <SignInForm />
      </div>
    </div>
  )
}
