import {
  Card,
  CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

export function PatientPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">

      {/* TOP BAR */}
      <div className="flex flex-row justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-5 w-16" />
        </div>

        <div className="flex flex-row items-center space-x-3">
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="loading">
        <ScrollArea>
          <TabsList className="text-foreground mb-3 h-auto gap-3 rounded-none border-b bg-transparent px-0 py-2 flex">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </TabsList>
        </ScrollArea>
      </Tabs>

      {/* PATIENT SNAPSHOT */}
      <Card className="w-full">
        <CardContent className="flex flex-row justify-between items-start py-5">

          <div className="grid grid-cols-4 gap-6 w-full">

            {/* Name + ID */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>

            {/* Gender + Age */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
            </div>

            {/* Program */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* More Button (hidden on header) */}
          <div className="hidden md:flex">
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* VITALS SECTION */}
      <div className="grid grid-cols-2 gap-6">

        {/* Left: Capture Form */}
        <div>
          <Skeleton className="h-7 w-72 mb-3" />

          <div className="bg-white p-5 border rounded-xl space-y-4">

            <div className="grid sm:grid-cols-2 gap-6 px-4">

              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}

            </div>

            <div className="px-4 pb-4">
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>
          </div>
        </div>

        {/* Right: Recorded Vitals */}
        <div>
          <Skeleton className="h-6 w-40 mb-3" />

          <div className="p-4 border rounded-lg bg-white h-[calc(100vh-200px)] space-y-4 overflow-scroll">

            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </Card>
            ))}

          </div>
        </div>
      </div>

    </div>
  )
}