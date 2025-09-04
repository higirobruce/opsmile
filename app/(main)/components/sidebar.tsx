'use client'
import { ArrowBigRight, Calendar, File, FileBadge, FileEdit, ForkKnife, HeartIcon, Home, HousePlus, Inbox, ScanHeart, Scissors, Search, Settings, Space, ToolCaseIcon, User2, UserCheck } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import AvatarComponent from "./avatar"
import { RiUserHeartLine } from "@remixicon/react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import UserMenu from "@/components/navbar-components/user-menu"
import Image from "next/image"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: RiUserHeartLine,
  },
  {
    title: "Programs",
    url: "/programs",
    icon: Scissors,
  },
  // {
  //   title: "Medical Assessment",
  //   url: "/medical-assessment",
  //   icon: ScanHeart,
  // },
  // {
  //   title: "Anesthesia",
  //   url: "/anesthesia",
  //   icon: HeartIcon,
  // },
  // {
  //   title: "Surgery",
  //   url: "/surgery",
  //   icon: Scissors,
  // },
  // {
  //   title: "Progress notes",
  //   url: "progress-notes",
  //   icon: FileEdit,
  // },
  // {
  //   title: "Postoperative (ward)",
  //   url: "/postoperative",
  //   icon: FileEdit,
  // },
  // {
  //   title: "Discharge",
  //   url: "/discharge",
  //   icon: ArrowBigRight,
  // },
  // {
  //   title: "Follow-up",
  //   url: "/follow-up",
  //   icon: UserCheck,
  // },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  let { user } = useAuth()
  const path = usePathname()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-5">
            <div className="flex flex-row justify-between items-center w-full">
              <Image className="mr-2" src="/smile+logo.png" alt="logo" width={120} height={120} />  
              <UserMenu />
            </div>
          </SidebarGroupLabel>
          {/* <SidebarSeparator/> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.url.slice(1) === path.split('/')[1]}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}