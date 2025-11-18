import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function ProgramSkeleton() {
  return (
    <div className="p-4 space-y-6 animate-pulse">

      {/* Program Overview */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader className="rounded-t-md flex flex-col sm:flex-row sm:items-center sm:justify-between">

          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-md" /> {/* Program name */}
            <Skeleton className="h-4 w-72 rounded-md" /> {/* Description */}
          </div>

          <Badge className="bg-gray-200 text-transparent px-3 py-1 rounded-md h-6 w-20 mt-2 sm:mt-0">
            <Skeleton className="h-4 w-16" />
          </Badge>
        </CardHeader>

        <CardContent className="p-6 grid sm:grid-cols-2 gap-6 text-gray-700 text-sm">

          {/* 4 Info rows */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-md" />
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>
          ))}

        </CardContent>
      </Card>

      {/* Two-column section */}
      <div className="grid grid-cols-2 gap-6">

        {/* Coordinator Card */}
        <Card className="shadow-sm border border-gray-200 max-h-[250px] overflow-y-auto">
          <CardHeader className="rounded-t-md">
            <CardTitle className="text-lg flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded-md" />
              <Skeleton className="h-5 w-40 rounded-md" />
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-4 w-48 rounded-md" /> {/* Name */}
            <Skeleton className="h-4 w-40 rounded-md" /> {/* Email */}
            <Skeleton className="h-4 w-32 rounded-md" /> {/* Role */}
          </CardContent>
        </Card>

        {/* Patients List */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="rounded-t-md">
            <CardTitle className="text-lg flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded-md" />
              <Skeleton className="h-5 w-44 rounded-md" />
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4">

            {/* Simulate patient rows */}
            <div className="divide-y divide-gray-200">

              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3 rounded-md px-2"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40 rounded-md" /> {/* Name */}
                    <Skeleton className="h-4 w-48 rounded-md" /> {/* NID & DOB */}
                  </div>
                  <Skeleton className="h-4 w-32 mt-2 sm:mt-0 rounded-md" /> {/* Phone */}
                </div>
              ))}

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}