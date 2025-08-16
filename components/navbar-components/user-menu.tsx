'use client'
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  User2,
  UserPenIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/app/context/AuthContext"
import SignIn from "@/app/componets/sign-in"
import { sign } from "crypto"

export default function UserMenu() {
  let { user, loading, signOut } = useAuth()
  return (
    <>
      {user && <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
            <Avatar>
              {/* <AvatarImage src="./avatar.jpg" alt="Profile image" className="h-6 w-6" /> */}
              <AvatarFallback>{user.firstName?.slice(0, 1) + "" + user.lastName?.slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64" align="end">
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="text-muted-foreground truncate text-xs font-normal">
              {user?.email}
            </span>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User2 size={16} className="opacity-60" aria-hidden="true" />
              <span>Profile</span>
            </DropdownMenuItem>
           
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={async () => signOut()}>
            <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>}

      {!user && !loading && <SignIn />}
    </>
  )
}
