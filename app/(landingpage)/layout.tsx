import React from 'react'
import Menu from '../componets/menu'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Menu />
            {children}
        </div>
    )
}
