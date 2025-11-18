import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ChartCardSkeleton() {
  return (
    <Card className="flex flex-col animate-pulse">

      {/* Card Header */}
      <CardHeader className="items-center pb-0 space-y-2">
        <Skeleton className="h-6 w-40 rounded-md" /> {/* Title */}
        <Skeleton className="h-4 w-72 rounded-md" /> {/* Description */}
      </CardHeader>

      {/* Card Content */}
      <CardContent className="flex-1 pb-0 flex justify-center items-center">
        <Skeleton className="rounded-full w-[200px] h-[200px]" /> {/* Chart placeholder */}
      </CardContent>

      {/* Optional Footer (commented out in your original code) */}
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-52" />
      </CardFooter> */}
    </Card>
  )
}