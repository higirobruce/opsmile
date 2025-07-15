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
  // {
  //   title: "Nursing Assessment",
  //   url: "/nursing",
  //   icon: Scissors,
  // },
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
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center justify-between w-full">
                <AvatarComponent source="/avatar.jpg" height={8} width={8} /> 
                <p className="text-xs font-semibold">Bruce H.</p>
            </div>
          </SidebarGroupLabel>
          <SidebarSeparator/>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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