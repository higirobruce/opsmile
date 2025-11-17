import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SwitchFollowUp({
  isFollowUp,
  setIsFollowUp,
  label,
  sublabel,
  description,
}: {
  isFollowUp: boolean
  setIsFollowUp: (isFollowUp: boolean) => void
  label: string
  sublabel: string,
  description: string
}) {
  const id = useId()
  return (
    <div className="relative flex w-full items-start gap-2 rounded-md border border-primary/30 p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50">
      <Switch
        checked={isFollowUp}
        onCheckedChange={setIsFollowUp}
        id={id}
        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
        aria-describedby={`${id}-description`}
      />
      <div className="grid grow gap-2">
        <Label className="text-sm font-semibold text-foreground" htmlFor={id}>
          {label}{" "}
          <span className="text-xs leading-[inherit] font-normal text-muted-foreground/60">
            ({sublabel})
          </span>
        </Label>
        <p id={`${id}-description`} className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
