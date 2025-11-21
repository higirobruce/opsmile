import { Shuffle } from "lucide-react"

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper"

export default function SimpleStepper() {
  return (
    <div className="mx-auto max-w-xl space-y-8 text-center w-full">
      <Stepper defaultValue={2}>
        <StepperItem step={1} className="not-last:flex-1" completed>
          <StepperTrigger>
            <StepperIndicator />
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem step={2} className="not-last:flex-1" loading>
          <StepperTrigger>
            <StepperIndicator />
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem step={3} className="not-last:flex-1">
          <StepperTrigger>
            <StepperIndicator asChild>
              <Shuffle size={10} aria-hidden="true" />
              <span className="sr-only">Shuffle</span>
            </StepperIndicator>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
      
    </div>
  )
}
