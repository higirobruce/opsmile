"use client"

import { SetStateAction, useId, useState } from "react"
import { Tag, TagInput } from "emblor"

import { Label } from "@/components/ui/label"

const tags = [
  {
    id: "1",
    text: "Sport",
  },
  {
    id: "2",
    text: "Coding",
  },
  {
    id: "3",
    text: "Travel",
  },
]

export default function InputTags({
  inputTags,
  setInputTags,
  label
}: {
  inputTags: Tag[]
  setInputTags: (tags: SetStateAction<Tag[]>) => void
  label: string
}) {
  const id = useId()
//   const [exampleTags, setExampleTags] = useState<Tag[]>(tags)
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <TagInput
        id={id}
        tags={inputTags}
        setTags={(newTags) => {
          setInputTags(newTags)
        }}
        placeholder="Add a tag"
        styleClasses={{
          tagList: {
            container: "gap-1",
          },
          input:
            "rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          tag: {
            body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
          },
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        inlineTags={false}
        inputFieldPosition="top"
      />
      
    </div>
  )
}
