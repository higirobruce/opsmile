"use client"

import { useId, useState } from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// const options = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
//   {
//     value: "angular",
//     label: "Angular",
//   },
//   {
//     value: "vue",
//     label: "Vue.js",
//   },
//   {
//     value: "react",
//     label: "React",
//   },
//   {
//     value: "ember",
//     label: "Ember.js",
//   },
//   {
//     value: "gatsby",
//     label: "Gatsby",
//   },
//   {
//     value: "eleventy",
//     label: "Eleventy",
//   },
//   {
//     value: "solid",
//     label: "SolidJS",
//   },
//   {
//     value: "preact",
//     label: "Preact",
//   },
//   {
//     value: "qwik",
//     label: "Qwik",
//   },
//   {
//     value: "alpine",
//     label: "Alpine.js",
//   },
//   {
//     value: "lit",
//     label: "Lit",
//   },
// ]

const MyComponent = (props: { value: string, options: any, label: string, name: string, _setValue: Function }) => <div />;

// Retrieves the props 'MyComponent' accepts
type MyComponentProps = React.ComponentProps<typeof MyComponent>;

export default function SelectComponent({ value, options, label, name, _setValue}: MyComponentProps) {
  const id = useId()
  const [open, setOpen] = useState<boolean>(false)
  // const [value, setValue] = useState<string>("")

  return (
    <div className="">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            name={name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background  w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value
                ? options.find((option: any) => option.value === value)
                  ?.label
                : label}
            </span>
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className=" w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search option..." />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((option: any) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      _setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {option.label}
                    {value === option.value && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
