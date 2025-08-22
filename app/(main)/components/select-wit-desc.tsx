import { useId } from "react"

import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SelectWithDescription({
    label,
    options,
    setValue,
}: {
    label: string
    options: {
        value: string
        label: string
        description: string
    }[],
    setValue: (value: string) => void
}) {
    const id = useId()
    return (
        <div className="*:not-first:mt-2">
            <Label htmlFor={id}>{label}</Label>
            <Select defaultValue="2" onValueChange={(value) => setValue}>
                <SelectTrigger id={id} className="**:data-desc:hidden">
                    <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">

                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                            <span
                                className="text-muted-foreground mt-1 block text-xs"
                                data-desc
                            >
                                {option.description}
                            </span>
                        </SelectItem>
                    ))}

                </SelectContent>
            </Select>
        </div>
    )
}
