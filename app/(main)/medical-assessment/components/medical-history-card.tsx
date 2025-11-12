import { Label } from '@/components/ui/label'
import React from 'react'

export default function MedicalHistoryCard({
    label,
    sublabel,
    description,
}: {
    label: string
    sublabel?: string
    description?: string
}) {
    return (
        <div className=" has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
            <div className="grid grow gap-2">
                <Label htmlFor={`2`}>
                    {label+" "}
                    <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                        ({sublabel})
                    </span>
                </Label>
                <p
                    id={`2-description`}
                    className="text-sm font-bold"
                >
                    {description}
                </p>
            </div>
        </div>
    )
}
