import { Dispatch, SetStateAction, useId } from "react"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioButtons({ options, setValue }: { options: { label: string, value: string, description: string }[], setValue: Dispatch<SetStateAction<string>> }) {
  const id = useId()
  return (
    <RadioGroup className="gap-2" defaultValue="1" onValueChange={(v) => {
      setValue(v)
    }}>
      {/* Radio card #1 */}
      {options.map((op: any) =>

        <div key={op.value} className=" has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
          <RadioGroupItem
            value={op.value}
            id={`${id}-1`}
            aria-describedby={`${id}-1-description`}
            className="order-1 after:absolute after:inset-0"
          />
          <div className="grid grow gap-2">
            <Label htmlFor={`${id}-1`}>
              {op.label}
              {/* <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                (op.sublabel)
              </span> */}
            </Label>
            <p
              id={`${id}-1-description`}
              className="text-muted-foreground text-xs"
            >
              {op.description}
            </p>
          </div>
        </div>

      )}
      {/* Radio card #2 */}

    </RadioGroup>
  )
}
