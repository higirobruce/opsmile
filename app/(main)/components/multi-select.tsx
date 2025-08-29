import { useId } from "react"

import { Label } from "@/components/ui/label"
import MultipleSelector, { Option } from "@/components/ui/multiselect"

export default function MultiSelect({ options, label, setOptions }: 
    { options: Option[], label: string, setOptions: (value: Option[]) => void }) {
    const id = useId()
    return (
        <div>
            <Label>{label}</Label>
            <MultipleSelector
                commandProps={{
                    label,
                }}
                // value={options.slice(0, 2)}
                defaultOptions={options}
                placeholder={`Select ${label}`}
                hideClearAllButton
                hidePlaceholderWhenSelected
                onChange={setOptions}
                emptyIndicator={<p className="text-center text-sm">No results found</p>}
            />
        </div>
    )
}
