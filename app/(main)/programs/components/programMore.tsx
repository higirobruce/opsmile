import { BoltIcon, EllipsisIcon, EyeIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProgramEditSheet } from "./program-edit-sheet";
import { useRouter } from "next/navigation";


interface ProgramMoreProps {
  program: any;
  onProgramUpdated: () => void;
}

export default function ProgramMore({ program, onProgramUpdated }: ProgramMoreProps) {
  let router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full shadow-none"
          aria-label="Open edit menu"
        >
          <EllipsisIcon size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ProgramEditSheet program={program} onSave={onProgramUpdated}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            Edit
          </DropdownMenuItem>
        </ProgramEditSheet>
        <DropdownMenuItem onSelect={(e) => {
          e.preventDefault()
          // window.open(`/programs/${program.id}`)
          router.push(`/programs/${program._id}`)
        }}>
          <EyeIcon size={16} className="opacity-60" aria-hidden="true" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <TrashIcon size={16} className="opacity-60 text-red-500" aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
