import { ArrowDown, Icon } from 'lucide-react'
import React from 'react'

export default function Vitalscard({ icon, description, value }: { icon: any, description: string, value: string }) {
    return (
        <div className='border border-dashed rounded-md p-2 h-[40px] border-primary/30'>
            <div className='flex flex-row space-x-2 items-center justify-between'>
                <p className='text-xs text-foreground/50 font-light text-ellipsis'>{description}</p>
                <p className='text-md font-bold text-foreground'>{value}</p>
                {/* <div className='flex flex-row items-center'> */}

                    {/* <Icon  className='text-green-700'/> */}
                    {/* <ArrowDown className='text-green-600 font-bold' size={16}/> */}
                {/* </div> */}
            </div>
        </div>
    )
}
