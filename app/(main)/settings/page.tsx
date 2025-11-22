'use client'
import { BoxIcon, HouseIcon, PanelsTopLeftIcon, User, Users } from "lucide-react"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import UserManagementTab from "./components/user-management-tab"
import { useAuth } from "@/app/context/AuthContext"

export default function Component() {

  const { user } = useAuth()
  return (

    <>
      {user?.role !== 'admin' && user?.role !== 'coordinator' && <div className='flex flex-col space-y-5 mx-auto justify-center items-center h-[80vh]'>
        <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight text-center">
          ✋🏽 Unauthorized
        </h1>
      </div>}
      {(user?.role == 'admin' || user?.role == 'coordinator') &&
        <Tabs defaultValue="tab-1">
          <ScrollArea>
            <TabsList className="relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
              <TabsTrigger
                value="tab-1"
                className="overflow-hidden rounded-b-none border-x border-t bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
              >
                <Users
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Users
              </TabsTrigger>
              <TabsTrigger
                disabled
                value="tab-2"
                className="overflow-hidden rounded-b-none border-x border-t bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
              >
                <PanelsTopLeftIcon
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Other settings
              </TabsTrigger>
              {/* <TabsTrigger
            value="tab-3"
            className="overflow-hidden rounded-b-none border-x border-t bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
          >
            <BoxIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Packages
          </TabsTrigger> */}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="tab-1">
            <UserManagementTab />
          </TabsContent>
          <TabsContent value="tab-2">
            <p className="p-4 pt-1 text-center text-xs text-muted-foreground">
              Content for Tab 2
            </p>
          </TabsContent>
          <TabsContent value="tab-3">
            <p className="p-4 pt-1 text-center text-xs text-muted-foreground">
              {/* Content for Tab 3 */}
            </p>
          </TabsContent>
        </Tabs>}
    </>

  )
}
