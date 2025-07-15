import { Button } from '@/components/ui/button'
import React from 'react'
import SignIn from './sign-in'
import SignUp from './sign-up'
export default function CallToAction() {
    return (
        <div className='flex justify-center space-x-5'>
            <SignUp/>
            <SignIn />
        </div>
    )
}
