import { ArrowDown, Icon } from 'lucide-react'
import React from 'react'

export default function Vitalscard({ icon, description, value }: { icon: any, description: string, value: string }) {
    return (
        <div className='border border-dashed rounded-md p-4 border-primary/30'>
            <div className='flex justify-between space-y-5'>
                <div>
                    <p className='text-md font-bold text-primary/90'>{value}</p>
                    <div className='flex flex-row items-center'>

                        <p className='text-xs text-primary/50 font-light'>{description}</p>
                        {/* <Icon  className='text-green-700'/> */}
                        <ArrowDown className='text-green-600 font-bold' size={16}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
